"""Regression tests for Professional Services CRM (Salesforce & M365) case study update."""
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")

PROF_ID = "a2d968df-9c8b-4166-9aa7-1eaa788264ef"
NEW_TITLE = "Improving CRM Adoption Through Salesforce and Microsoft 365"
OLD_TITLE = "Centralizing Relationships, Eliminating Friction"
REVISION = "professional-services-crm-v2"


@pytest.fixture(scope="module")
def case_studies():
    r = requests.get(f"{BASE_URL}/api/content/case-studies", timeout=15)
    assert r.status_code == 200
    return r.json()


@pytest.fixture(scope="module")
def professional(case_studies):
    return next(c for c in case_studies if c["id"] == PROF_ID)


def test_case_studies_count(case_studies):
    assert len(case_studies) == 5


def test_professional_updated_fields(professional):
    assert professional["title"] == NEW_TITLE
    assert professional.get("card_title") == NEW_TITLE
    assert professional.get("content_revision") == REVISION
    assert professional["image"] == "/images/cases/case-crm.webp"
    assert professional.get("heroBg") == "#f4eedb"
    assert professional.get("contact_phone") == "212-643-4808"
    assert professional.get("contact_linkedin") == "https://www.linkedin.com/company/intrinsic"
    assert OLD_TITLE in professional.get("previous_titles", [])
    assert professional.get("tag", "").startswith("Professional Services")
    # order preserved
    assert professional.get("order") == 1


def test_professional_body_and_paragraphs(professional):
    body = professional["body"]
    assert "centralize client and donor relationship" in body
    assert "Microsoft 365" in body
    # Challenge: 2 paragraphs
    ch = professional["challenge"].split("\n")
    assert len(ch) == 2
    assert "Outlook" in ch[0]
    assert "spreadsheets" in ch[1]
    # Approach: 4 paragraphs
    ap = professional["approach"].split("\n")
    assert len(ap) == 4
    assert "Salesforce Sales Cloud" in ap[0]
    assert "SAML" in ap[0]
    assert "Microsoft Entra ID" in ap[0]
    assert "Einstein Activity Capture" in ap[1]
    assert "95 percent" in ap[2]
    assert "70 percent" in ap[2]


def test_professional_results(professional):
    results = professional["results"]
    assert len(results) == 4
    joined = " ".join(results)
    assert "95 percent" in joined
    assert "30 days" in joined
    assert "70 percent" in joined
    assert "Real-time pipeline dashboards" in joined
    assert "Single sign-on" in joined
    assert "Microsoft Entra ID" in joined


def test_professional_about(professional):
    about = professional.get("about", "")
    assert "AI-enabled automation" in about
    assert "women-owned and minority-owned" in about


def test_no_stale_phrasing(professional):
    blob = " ".join([
        professional.get("body", ""),
        professional.get("summary", ""),
        professional.get("challenge", ""),
        professional.get("approach", ""),
        professional.get("title", ""),
    ])
    # Old title should not appear anywhere
    assert OLD_TITLE not in blob


def test_other_studies_unchanged(case_studies):
    expected = {
        "e1aa85d2-ac28-46a5-a631-f4cd1f5dafeb": "Improving Program Reporting Across a Global Nonprofit Network",
        "9ee4415b-e7e2-41c4-8033-0053c9ec61e1": "Consolidating Microsoft 365 Domains and SharePoint Without Downtime",
        "22d02592-0a4a-4e5d-9260-cb129083793a": "Modernizing a Production Management System on Microsoft Azure",
        "349e9fd4-9bf6-4e7a-9aa7-2e5daf0fb39d": "Strengthening Endpoint Security and Patch Compliance",
    }
    for cs in case_studies:
        if cs["id"] in expected:
            assert cs["title"] == expected[cs["id"]]


def test_nonprofit_regression_still_updated(case_studies):
    """Ensure prior iteration's nonprofit update is intact."""
    np = next(c for c in case_studies if c["id"] == "e1aa85d2-ac28-46a5-a631-f4cd1f5dafeb")
    assert np.get("content_revision") == "nonprofit-pdf2"
    assert np.get("contact_phone") == "212-643-4808"
    assert "AI-enabled automation" in np.get("about", "")


def test_seed_module_import_safe():
    """Importing the seed module must not touch DB or run asyncio."""
    import importlib
    mod = importlib.import_module("scripts.seed_professional_services_case_study")
    assert mod.UPDATE["title"] == NEW_TITLE
    assert mod.UPDATE["content_revision"] == REVISION
    assert OLD_TITLE in mod.UPDATE["previous_titles"]
