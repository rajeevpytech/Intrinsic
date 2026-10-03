"""Regression tests for Legal Services Endpoint Security case study update."""
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")

LEGAL_ID = "349e9fd4-9bf6-4e7a-9aa7-2e5daf0fb39d"
NEW_TITLE = "Strengthening Endpoint Security and Patch Compliance"
OLD_TITLE = "From Vulnerable to Verified"
REVISION = "legal-endpoint-v2"


@pytest.fixture(scope="module")
def case_studies():
    r = requests.get(f"{BASE_URL}/api/content/case-studies", timeout=15)
    assert r.status_code == 200
    return r.json()


@pytest.fixture(scope="module")
def legal(case_studies):
    return next(c for c in case_studies if c["id"] == LEGAL_ID)


def test_case_studies_count(case_studies):
    assert len(case_studies) == 5


def test_legal_updated_fields(legal):
    assert legal["title"] == NEW_TITLE
    assert legal.get("card_title") == NEW_TITLE
    assert legal.get("content_revision") == REVISION
    assert legal["image"] == "/images/cases/case-legal-endpoint.png"
    assert legal.get("heroBg") == "#f8f1e9"
    assert legal.get("contact_phone") == "212-643-4808"
    assert legal.get("contact_linkedin") == "https://www.linkedin.com/company/intrinsic"
    assert OLD_TITLE in legal.get("previous_titles", [])
    assert legal.get("tag") == "Legal Services · Endpoint Security & Compliance"
    # legal is order 4 (last)
    assert legal.get("order") == 4


def test_legal_body_and_paragraphs(legal):
    body = legal["body"]
    assert "law firm" in body.lower()
    assert "patch compliance" in body.lower()

    ch = legal["challenge"].split("\n")
    assert len(ch) == 3
    assert "62 percent" in ch[0]
    assert "repeatable process" in ch[1]
    assert "time-consuming" in ch[2]

    ap = legal["approach"].split("\n")
    assert len(ap) == 7
    joined = " ".join(ap)
    assert "ConnectWise Automate" in joined
    assert "SentinelOne" in joined
    assert "Microsoft Defender" in joined
    assert "Intune" in joined
    assert "WSUS" in joined
    assert "62 percent to 98 percent" in joined
    assert "30 days" in joined
    assert "47 critical vulnerabilities" in joined
    assert "24 hours" in joined
    assert "cybersecurity practices guide" in joined or "cybersecurity practices" in joined


def test_legal_results(legal):
    results = legal["results"]
    assert len(results) == 4
    joined = " ".join(results)
    assert "62% to 98%" in joined
    assert "30 days" in joined
    assert "47 critical vulnerabilities" in joined
    assert "24 hours" in joined
    assert "Real-time endpoint monitoring" in joined


def test_legal_about_and_contact(legal):
    about = legal.get("about", "")
    assert "AI-enabled automation" in about
    assert "women-owned and minority-owned" in about
    assert "live help desk" in about


def test_legal_no_stale_title(legal):
    blob = " ".join([
        legal.get("body", ""),
        legal.get("summary", ""),
        legal.get("challenge", ""),
        legal.get("approach", ""),
        legal.get("title", ""),
        legal.get("card_title", ""),
    ])
    assert OLD_TITLE not in blob


def test_other_studies_unchanged(case_studies):
    """Ensure prior four case study updates are still intact."""
    expected = {
        "e1aa85d2-ac28-46a5-a631-f4cd1f5dafeb": (
            "Improving Program Reporting Across a Global Nonprofit Network",
            "nonprofit-pdf2",
        ),
        "a2d968df-9c8b-4166-9aa7-1eaa788264ef": (
            "Improving CRM Adoption Through Salesforce and Microsoft 365",
            "professional-services-crm-v2",
        ),
        "9ee4415b-e7e2-41c4-8033-0053c9ec61e1": (
            "Consolidating Microsoft 365 Domains and SharePoint Without Downtime",
            "communications-m365-v2",
        ),
        "22d02592-0a4a-4e5d-9260-cb129083793a": (
            "Modernizing a Production Management System on Microsoft Azure",
            "manufacturing-azure-v2",
        ),
    }
    by_id = {c["id"]: c for c in case_studies}
    for cid, (title, rev) in expected.items():
        assert by_id[cid]["title"] == title
        assert by_id[cid].get("content_revision") == rev


def test_seed_module_import_safe():
    import importlib
    mod = importlib.import_module("scripts.seed_legal_case_study")
    assert mod.UPDATE["title"] == NEW_TITLE
    assert mod.UPDATE["content_revision"] == REVISION
    assert OLD_TITLE in mod.UPDATE["previous_titles"]
    assert len(mod.UPDATE["approach"].split("\n")) == 7
    assert len(mod.UPDATE["challenge"].split("\n")) == 3
    assert len(mod.UPDATE["results"]) == 4
