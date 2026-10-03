"""Backend regression tests for the admin analytics overview and pageview endpoints.

Iteration 21 updates:
- No hardcoded URL / credentials. URL is read via dotenv_values(frontend/.env);
  credentials are read from backend/.env (no defaults so config-missing fails fast).
- All page_view / inquiry events created by tests are tracked in a module-level
  registry and deleted in teardown to avoid leakage into real analytics.
- Exact-delta assertions on totals, series sums, and boundary handling for
  submissions (contact / assessment / application) at days=7,30,90.
"""
import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import requests
from dotenv import dotenv_values
from motor.motor_asyncio import AsyncIOMotorClient

# ---- Environment (no defaults) ----
_frontend_env = dotenv_values('/app/frontend/.env')
BASE_URL = (_frontend_env.get('REACT_APP_BACKEND_URL') or '').rstrip('/')
if not BASE_URL:
    raise RuntimeError('REACT_APP_BACKEND_URL must be set in /app/frontend/.env')
API = f"{BASE_URL}/api"

_backend_env = dotenv_values('/app/backend/.env')
ADMIN_EMAIL = (_backend_env.get('ADMIN_EMAIL') or '').strip('"').strip("'")
ADMIN_PASSWORD = (_backend_env.get('ADMIN_PASSWORD') or '').strip('"').strip("'")
MONGO_URL = (_backend_env.get('MONGO_URL') or '').strip('"').strip("'")
DB_NAME = (_backend_env.get('DB_NAME') or '').strip('"').strip("'")
if not (ADMIN_EMAIL and ADMIN_PASSWORD and MONGO_URL and DB_NAME):
    raise RuntimeError('ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URL, DB_NAME must be set in /app/backend/.env')

# ---- Registry so we clean up every event we create ----
CREATED_EVENT_IDS: set[str] = set()
CREATED_INQUIRY_IDS: set[str] = set()


# ---------- Fixtures ----------
@pytest.fixture(scope='module')
def admin_token():
    r = requests.post(f"{API}/auth/login", json={'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()['access_token']


@pytest.fixture(scope='module')
def admin_headers(admin_token):
    return {'Authorization': f'Bearer {admin_token}'}


@pytest.fixture(scope='session', autouse=True)
def _teardown_created_records():
    """Delete every event_id / inquiry we inserted, no matter how the test ended."""
    yield
    import pymongo
    client = pymongo.MongoClient(MONGO_URL)
    try:
        db = client[DB_NAME]
        if CREATED_EVENT_IDS:
            db.page_views.delete_many({'event_id': {'$in': list(CREATED_EVENT_IDS)}})
        if CREATED_INQUIRY_IDS:
            db.inquiries.delete_many({'id': {'$in': list(CREATED_INQUIRY_IDS)}})
    finally:
        client.close()


# ---------- Auth ----------
class TestAuth:
    def test_overview_requires_auth(self):
        r = requests.get(f"{API}/analytics/overview", timeout=15)
        assert r.status_code == 401


# ---------- Days validation ----------
class TestOverviewDays:
    @pytest.mark.parametrize('days', [7, 30, 90])
    def test_valid_days(self, admin_headers, days):
        r = requests.get(f"{API}/analytics/overview", params={'days': days}, headers=admin_headers, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data['days'] == days
        assert len(data['series']) == days
        assert data['timezone'] == 'UTC'
        for k in ('visitors', 'inquiries', 'applications', 'pageviews'):
            assert k in data['totals']
            assert k in data['previous']
            assert isinstance(data['totals'][k], int)

    @pytest.mark.parametrize('days', [1, 14, 60, 365])
    def test_invalid_days(self, admin_headers, days):
        r = requests.get(f"{API}/analytics/overview", params={'days': days}, headers=admin_headers, timeout=20)
        assert r.status_code == 422

    def test_series_contiguous_utc_dates(self, admin_headers):
        r = requests.get(f"{API}/analytics/overview", params={'days': 7}, headers=admin_headers, timeout=20)
        data = r.json()
        dates = [row['date'] for row in data['series']]
        assert dates == sorted(dates)
        parsed = [datetime.strptime(d, '%Y-%m-%d') for d in dates]
        for i in range(1, len(parsed)):
            assert (parsed[i] - parsed[i - 1]).days == 1
        today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        assert dates[-1] == today

    def test_recent_limit_six(self, admin_headers):
        r = requests.get(f"{API}/analytics/overview", params={'days': 90}, headers=admin_headers, timeout=20)
        data = r.json()
        assert isinstance(data['recent'], list)
        assert len(data['recent']) <= 6

    def test_top_pages_desc(self, admin_headers):
        r = requests.get(f"{API}/analytics/overview", params={'days': 30}, headers=admin_headers, timeout=20)
        data = r.json()
        views = [p['views'] for p in data['top_pages']]
        assert views == sorted(views, reverse=True)
        assert len(data['top_pages']) <= 5


# ---------- Pageview endpoint ----------
class TestPageview:
    def test_valid_pageview(self):
        eid = str(uuid.uuid4())
        CREATED_EVENT_IDS.add(eid)  # register BEFORE the call so cleanup catches it even on failure
        payload = {'event_id': eid, 'visitor_id': str(uuid.uuid4()), 'path': '/test-analytics-pytest'}
        r = requests.post(f"{API}/analytics/pageview", json=payload, timeout=10)
        assert r.status_code == 202, r.text
        assert r.json() == {'tracked': True}

    def test_duplicate_event_id_ignored(self):
        eid = str(uuid.uuid4())
        CREATED_EVENT_IDS.add(eid)
        vid = str(uuid.uuid4())
        payload = {'event_id': eid, 'visitor_id': vid, 'path': '/dup'}
        r1 = requests.post(f"{API}/analytics/pageview", json=payload, timeout=10)
        r2 = requests.post(f"{API}/analytics/pageview", json=payload, timeout=10)
        assert r1.status_code == 202 and r1.json()['tracked'] is True
        assert r2.status_code == 202 and r2.json()['tracked'] is False

    def test_dnt_honored(self):
        # DNT is refused pre-insert, no id created, but track just in case
        eid = str(uuid.uuid4())
        payload = {'event_id': eid, 'visitor_id': str(uuid.uuid4()), 'path': '/dnt-test'}
        r = requests.post(f"{API}/analytics/pageview", json=payload, headers={'DNT': '1'}, timeout=10)
        assert r.status_code == 202
        assert r.json() == {'tracked': False}

    def test_gpc_honored(self):
        eid = str(uuid.uuid4())
        payload = {'event_id': eid, 'visitor_id': str(uuid.uuid4()), 'path': '/gpc-test'}
        r = requests.post(f"{API}/analytics/pageview", json=payload, headers={'Sec-GPC': '1'}, timeout=10)
        assert r.status_code == 202
        assert r.json() == {'tracked': False}

    @pytest.mark.parametrize('path', [
        '/admin', '/admin/', '/admin/settings', '/api/foo',
        '/with?query=1', '/with#hash', '//protocol', 'no-slash', '', '/a' * 200 + 'x' * 200,
    ])
    def test_invalid_paths_rejected(self, path):
        payload = {'event_id': str(uuid.uuid4()), 'visitor_id': str(uuid.uuid4()), 'path': path}
        r = requests.post(f"{API}/analytics/pageview", json=payload, timeout=10)
        assert r.status_code == 422, f'Path {path!r} should be rejected, got {r.status_code}'

    def test_invalid_uuid_rejected(self):
        payload = {'event_id': 'not-a-uuid', 'visitor_id': str(uuid.uuid4()), 'path': '/x'}
        r = requests.post(f"{API}/analytics/pageview", json=payload, timeout=10)
        assert r.status_code == 422


# ---------- Inquiries kind filter ----------
class TestInquiriesKind:
    def test_kind_inquiries_excludes_applications(self, admin_headers):
        r = requests.get(f"{API}/inquiries", params={'kind': 'inquiries'}, headers=admin_headers, timeout=15)
        assert r.status_code == 200
        for item in r.json():
            assert item.get('type') != 'application'

    def test_kind_applications_only(self, admin_headers):
        r = requests.get(f"{API}/inquiries", params={'kind': 'applications'}, headers=admin_headers, timeout=15)
        assert r.status_code == 200
        for item in r.json():
            assert item.get('type') == 'application'

    def test_no_kind_returns_all(self, admin_headers):
        r = requests.get(f"{API}/inquiries", headers=admin_headers, timeout=15)
        assert r.status_code == 200


# ---------- Aggregation with exact deltas (traffic + submissions) ----------
def _fetch_overview(admin_headers, days):
    r = requests.get(f"{API}/analytics/overview", params={'days': days}, headers=admin_headers, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()


def _series_sum(series, key):
    return sum(row[key] for row in series)


@pytest.mark.asyncio
class TestExactAggregation:
    async def _db(self):
        client = AsyncIOMotorClient(MONGO_URL)
        return client, client[DB_NAME]

    async def test_exact_deltas_at_7_30_90(self, admin_headers):
        """Insert controlled fixtures at explicit UTC boundaries and assert exact deltas."""
        client, db = await self._db()
        # Initialise IDs BEFORE try so 'finally' can always clean them up.
        seed_event_ids = []
        seed_inquiry_ids = []
        try:
            now = datetime.now(timezone.utc)
            # boundaries: start_of_today (day 0 of window), start_of_7d, previous_7d_start, outside_7d, outside_90d
            start_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
            in_now = now - timedelta(minutes=1)                       # inside 7/30/90 windows
            in_7_edge = start_today - timedelta(days=6)               # inclusive start of 7d
            prev_7_edge = start_today - timedelta(days=7)             # first day of previous 7d
            outside_7_in_30 = start_today - timedelta(days=20)        # inside 30 & 90, outside 7
            outside_30_in_90 = start_today - timedelta(days=60)       # inside 90 only
            outside_90 = start_today - timedelta(days=120)            # outside all windows

            # ---- Baselines ----
            base7 = _fetch_overview(admin_headers, 7)
            base30 = _fetch_overview(admin_headers, 30)
            base90 = _fetch_overview(admin_headers, 90)

            # ---- Traffic seed ----
            visitor_a = str(uuid.uuid4())
            visitor_b = str(uuid.uuid4())
            pv_seed = [
                # current 7d
                (visitor_a, in_now, '/pytest-a1'),
                (visitor_a, in_now, '/pytest-a2'),
                (visitor_b, in_7_edge, '/pytest-a1'),  # inclusive boundary
                # previous 7d
                (visitor_a, prev_7_edge, '/pytest-prev'),
                # outside 7 but inside 30
                (visitor_b, outside_7_in_30, '/pytest-30'),
                # inside 90 only
                (visitor_a, outside_30_in_90, '/pytest-90'),
                # outside all
                (visitor_b, outside_90, '/pytest-old'),
            ]
            for vid, ts, path in pv_seed:
                eid = str(uuid.uuid4())
                seed_event_ids.append(eid)
                CREATED_EVENT_IDS.add(eid)
                await db.page_views.insert_one({'id': str(uuid.uuid4()), 'event_id': eid,
                                                'visitor_id': vid, 'path': path, 'created_at': ts})

            # ---- Submissions seed (inquiries collection): contact, assessment, application ----
            def _mk(kind, ts, name, email, company='', role=''):
                iid = str(uuid.uuid4())
                seed_inquiry_ids.append(iid)
                CREATED_INQUIRY_IDS.add(iid)
                doc = {
                    'id': iid, 'name': name, 'email': email, 'company': company,
                    'phone': '', 'message': 'TEST_pytest', 'type': kind,
                    'details': {'role': role} if role else {}, 'status': 'new',
                    'created_at': ts.isoformat(),
                }
                return doc

            sub_seed = [
                # current 7d - 2 inquiries, 1 assessment, 2 applications
                _mk('contact', in_now, 'TEST_Alice', 'alice@test.local', 'Acme'),
                _mk('contact', in_7_edge, 'TEST_Bob', 'bob@test.local', 'Beta'),
                _mk('assessment', in_now, 'TEST_Carol', 'carol@test.local', 'Gamma'),
                _mk('application', in_now, 'TEST_Dan', 'dan@test.local', role='Backend Engineer'),
                _mk('application', in_7_edge, 'TEST_Eve', 'eve@test.local', role='SRE'),
                # previous 7d - 1 inquiry, 1 application
                _mk('contact', prev_7_edge, 'TEST_Fred', 'fred@test.local', 'Delta'),
                _mk('application', prev_7_edge, 'TEST_Gina', 'gina@test.local', role='PM'),
                # inside 30d only
                _mk('assessment', outside_7_in_30, 'TEST_Hank', 'hank@test.local', 'Epsilon'),
                _mk('application', outside_7_in_30, 'TEST_Iris', 'iris@test.local', role='Designer'),
                # inside 90d only
                _mk('contact', outside_30_in_90, 'TEST_Jane', 'jane@test.local', 'Zeta'),
                # outside all
                _mk('contact', outside_90, 'TEST_Kim', 'kim@test.local', 'Omega'),
            ]
            for doc in sub_seed:
                await db.inquiries.insert_one(dict(doc))

            # ---- Refetch ----
            after7 = _fetch_overview(admin_headers, 7)
            after30 = _fetch_overview(admin_headers, 30)
            after90 = _fetch_overview(admin_headers, 90)

            # ==== EXACT TRAFFIC DELTAS ====
            # 7d current: 3 pageviews (a1,a2 by visitor_a + a1 by visitor_b @ edge), 2 unique visitors
            # 7d previous: 1 pageview (prev_7_edge by visitor_a), 1 visitor
            assert after7['totals']['pageviews'] - base7['totals']['pageviews'] == 3
            assert after7['totals']['visitors'] - base7['totals']['visitors'] == 2
            assert after7['previous']['pageviews'] - base7['previous']['pageviews'] == 1
            assert after7['previous']['visitors'] - base7['previous']['visitors'] == 1

            # 30d current: 7d current(3) + prev_7_edge(1) + outside_7_in_30(1) = 5
            # 30d previous: 0 (outside_30_in_90 = 60d ago sits on the far edge, outside previous 30d)
            assert after30['totals']['pageviews'] - base30['totals']['pageviews'] == 5
            assert after30['totals']['visitors'] - base30['totals']['visitors'] == 2
            assert after30['previous']['pageviews'] - base30['previous']['pageviews'] == 0

            # 90d current: 30d current(5) + outside_30_in_90(1) = 6
            # 90d previous: outside_90 (120 days ago) sits inside previous 90 window (90-180d ago)
            assert after90['totals']['pageviews'] - base90['totals']['pageviews'] == 6
            assert after90['totals']['visitors'] - base90['totals']['visitors'] == 2
            assert after90['previous']['pageviews'] - base90['previous']['pageviews'] == 1

            # ==== EXACT SUBMISSION DELTAS ====
            # 7d current: contact(2)+assessment(1)=3 inquiries; applications=2
            assert after7['totals']['inquiries'] - base7['totals']['inquiries'] == 3
            assert after7['totals']['applications'] - base7['totals']['applications'] == 2
            # 7d previous: contact(1)=1 inquiry, application(1)=1
            assert after7['previous']['inquiries'] - base7['previous']['inquiries'] == 1
            assert after7['previous']['applications'] - base7['previous']['applications'] == 1

            # 30d current: 7d(3 inq/2 app) + prev_7_edge (contact + application) + outside_7_in_30 (assessment + application)
            # inquiries += 3+1+1=5, applications += 2+1+1=4
            assert after30['totals']['inquiries'] - base30['totals']['inquiries'] == 5
            assert after30['totals']['applications'] - base30['totals']['applications'] == 4
            assert after30['previous']['inquiries'] - base30['previous']['inquiries'] == 0
            assert after30['previous']['applications'] - base30['previous']['applications'] == 0

            # 90d current: 30d + outside_30_in_90 (contact) = 6 inquiries, 4 applications
            assert after90['totals']['inquiries'] - base90['totals']['inquiries'] == 6
            assert after90['totals']['applications'] - base90['totals']['applications'] == 4
            # 90d previous (90-180d ago): outside_90 (120d ago) is a contact
            assert after90['previous']['inquiries'] - base90['previous']['inquiries'] == 1
            assert after90['previous']['applications'] - base90['previous']['applications'] == 0

            # ==== Series sums must equal totals deltas ====
            for after, base, days in ((after7, base7, 7), (after30, base30, 30), (after90, base90, 90)):
                for k in ('inquiries', 'applications', 'pageviews'):
                    delta_totals = after['totals'][k] - base['totals'][k]
                    delta_series = _series_sum(after['series'], k) - _series_sum(base['series'], k)
                    assert delta_totals == delta_series, f'{days}d {k}: totals delta {delta_totals} != series delta {delta_series}'

            # ==== Recent should surface our test names & carry no ObjectId ====
            recent = after7['recent']
            recent_names = {r['name'] for r in recent}
            # at least one of our fresh TEST_ records should appear in top 6 (sorted desc)
            assert any(n.startswith('TEST_') for n in recent_names)
            for r in recent:
                assert '_id' not in r
                assert set(r.keys()) >= {'id', 'name', 'email', 'type', 'context', 'created_at'}
                # id must be UUID string, not ObjectId
                uuid.UUID(r['id'])
                assert r['type'] in ('contact', 'assessment', 'application')

            # ==== Applications must never leak into "inquiries" kind list ====
            r = requests.get(f"{API}/inquiries", params={'kind': 'inquiries'}, headers=admin_headers, timeout=15)
            assert r.status_code == 200
            ids_in_kind = {item['id'] for item in r.json()}
            # our contact/assessment IDs must be here, application IDs must not
            for doc in sub_seed:
                if doc['type'] in ('contact', 'assessment') and doc['created_at'] >= (now - timedelta(days=90)).isoformat():
                    assert doc['id'] in ids_in_kind
                if doc['type'] == 'application':
                    assert doc['id'] not in ids_in_kind

            r = requests.get(f"{API}/inquiries", params={'kind': 'applications'}, headers=admin_headers, timeout=15)
            assert r.status_code == 200
            app_ids = {item['id'] for item in r.json()}
            for doc in sub_seed:
                if doc['type'] == 'application' and doc['created_at'] >= (now - timedelta(days=90)).isoformat():
                    assert doc['id'] in app_ids

        finally:
            for eid in seed_event_ids:
                await db.page_views.delete_one({'event_id': eid})
                CREATED_EVENT_IDS.discard(eid)
            for iid in seed_inquiry_ids:
                await db.inquiries.delete_one({'id': iid})
                CREATED_INQUIRY_IDS.discard(iid)
            client.close()
