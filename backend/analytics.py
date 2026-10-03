"""First-party, anonymous website analytics and admin overview."""
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, Field, field_validator
from pymongo.errors import DuplicateKeyError
from typography import BaseDocument


class PageViewInput(BaseModel):
    event_id: UUID
    visitor_id: UUID
    path: str = Field(min_length=1, max_length=300)

    @field_validator('path')
    @classmethod
    def public_path(cls, value):
        if not value.startswith('/') or value.startswith('//') or any(c in value for c in '?#\\\r\n'):
            raise ValueError('Use a local pathname without query strings or fragments')
        if value.lower().startswith(('/admin', '/api')):
            raise ValueError('Only public pages are tracked')
        return value


class PageViewDocument(BaseDocument):
    event_id: str
    visitor_id: str
    path: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TrackingDocument(BaseDocument):
    key: Literal['analytics'] = 'analytics'
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SubmissionDocument(BaseDocument):
    record_id: str = Field(validation_alias='id')
    name: str
    email: str
    type: str = 'contact'
    company: str = ''
    details: dict = Field(default_factory=dict)
    created_at: str


async def initialize_analytics(db):
    await db.page_views.create_index('event_id', unique=True)
    await db.page_views.create_index([('created_at', 1), ('visitor_id', 1)])
    await db.inquiries.create_index('created_at')
    state = TrackingDocument()
    await db.settings.update_one({'key': 'analytics'}, {'$setOnInsert': state.to_mongo()}, upsert=True)


def create_analytics_router(db, admin_dependency):
    router = APIRouter(prefix='/api/analytics', tags=['analytics'])

    @router.post('/pageview', status_code=202)
    async def pageview(body: PageViewInput, request: Request):
        # Respect browser privacy preferences; no IP, user-agent, or referrer is stored.
        if request.headers.get('dnt') == '1' or request.headers.get('sec-gpc') == '1':
            return {'tracked': False}
        doc = PageViewDocument(event_id=str(body.event_id), visitor_id=str(body.visitor_id), path=body.path)
        try:
            await db.page_views.insert_one(doc.to_mongo())
        except DuplicateKeyError:
            return {'tracked': False}
        return {'tracked': True}

    @router.get('/overview')
    async def overview(days: int = Query(default=30), admin=Depends(admin_dependency)):
        if days not in (7, 30, 90):
            raise HTTPException(status_code=422, detail='Choose 7, 30, or 90 days')
        now = datetime.now(timezone.utc)
        start = now.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=days - 1)
        previous = start - timedelta(days=days)
        end = now
        period = {'$cond': [{'$gte': ['$created_at', start]}, 'current', 'previous']}
        traffic_pipeline = [
            {'$match': {'created_at': {'$gte': previous, '$lte': end}}},
            {'$facet': {
                'totals': [
                    {'$group': {'_id': {'period': period, 'visitor': '$visitor_id'}, 'views': {'$sum': 1}}},
                    {'$group': {'_id': '$_id.period', 'visitors': {'$sum': 1}, 'pageviews': {'$sum': '$views'}}},
                ],
                'daily': [
                    {'$match': {'created_at': {'$gte': start}}},
                    {'$group': {'_id': {'date': {'$dateToString': {'format': '%Y-%m-%d', 'date': '$created_at', 'timezone': 'UTC'}}, 'visitor': '$visitor_id'}, 'views': {'$sum': 1}}},
                    {'$group': {'_id': '$_id.date', 'visitors': {'$sum': 1}, 'pageviews': {'$sum': '$views'}}},
                ],
                'pages': [
                    {'$match': {'created_at': {'$gte': start}}},
                    {'$group': {'_id': '$path', 'views': {'$sum': 1}}},
                    {'$sort': {'views': -1, '_id': 1}}, {'$limit': 5},
                ],
            }},
        ]
        kind = {'$cond': [{'$eq': ['$type', 'application']}, 'applications', 'inquiries']}
        submissions_pipeline = [
            {'$match': {'created_at': {'$gte': previous.isoformat(), '$lte': end.isoformat()}}},
            {'$facet': {
                'totals': [
                    {'$group': {'_id': {'period': {'$cond': [{'$gte': ['$created_at', start.isoformat()]}, 'current', 'previous']}, 'kind': kind}, 'count': {'$sum': 1}}},
                ],
                'daily': [
                    {'$match': {'created_at': {'$gte': start.isoformat()}}},
                    {'$group': {'_id': {'date': {'$substrBytes': ['$created_at', 0, 10]}, 'kind': kind}, 'count': {'$sum': 1}}},
                ],
                'types': [
                    {'$match': {'created_at': {'$gte': start.isoformat()}}},
                    {'$group': {'_id': '$type', 'count': {'$sum': 1}}},
                ],
            }},
        ]
        traffic, submissions, recent, state = await asyncio.gather(
            db.page_views.aggregate(traffic_pipeline).to_list(1),
            db.inquiries.aggregate(submissions_pipeline).to_list(1),
            db.inquiries.find({'created_at': {'$gte': start.isoformat(), '$lte': end.isoformat()}}).sort('created_at', -1).limit(6).to_list(6),
            db.settings.find_one({'key': 'analytics'}),
        )
        traffic, submissions = traffic[0], submissions[0]
        totals = {p: dict(visitors=0, pageviews=0, inquiries=0, applications=0) for p in ('current', 'previous')}
        for row in traffic['totals']:
            totals[row['_id']].update(visitors=row['visitors'], pageviews=row['pageviews'])
        for row in submissions['totals']:
            totals[row['_id']['period']][row['_id']['kind']] = row['count']
        daily = {(start + timedelta(days=i)).strftime('%Y-%m-%d'): dict(visitors=0, pageviews=0, inquiries=0, applications=0) for i in range(days)}
        for row in traffic['daily']:
            daily[row['_id']].update(visitors=row['visitors'], pageviews=row['pageviews'])
        for row in submissions['daily']:
            daily[row['_id']['date']][row['_id']['kind']] = row['count']
        documents = [SubmissionDocument.from_mongo(doc) for doc in recent]
        by_type: dict[str, int] = {}
        for row in submissions['types']:
            key = row['_id'] or 'contact'
            by_type[key] = by_type.get(key, 0) + row['count']
        return {
            'days': days, 'from': start.isoformat(), 'to': end.isoformat(), 'timezone': 'UTC',
            'tracking_since': TrackingDocument.from_mongo(state).started_at.isoformat() if state else None,
            'totals': totals['current'], 'previous': totals['previous'],
            'series': [dict(date=day, **values) for day, values in daily.items()],
            'top_pages': [{'path': row['_id'], 'views': row['views']} for row in traffic['pages']],
            'by_type': by_type,
            'recent': [{'id': doc.record_id, 'name': doc.name, 'email': doc.email, 'type': doc.type,
                        'context': doc.details.get('role', '') if doc.type == 'application' else doc.company,
                        'created_at': doc.created_at} for doc in documents],
        }

    return router
