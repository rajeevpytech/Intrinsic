"""Regression tests for nonprofit case study PDF2 update."""
import os
import re
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")

NONPROFIT_ID = "e1aa85d2-ac28-46a5-a631-f4cd1f5dafeb"
NEW_TITLE = "Improving Program Reporting Across a Global Nonprofit Network"


@pytest.fixture(scope="module")
def case_studies():
    r = requests.get(f"{BASE_URL}/api/content/case-studies", timeout=15)
    assert r.status_code == 200
    return r.json()


def test_case_studies_count(case_studies):
    assert len(case_studies) == 5


def test_nonprofit_first_and_updated(case_studies):
    cs = case_studies[0]
    assert cs["id"] == NONPROFIT_ID
    assert cs["title"] == NEW_TITLE
    assert cs.get("content_revision") == "nonprofit-pdf2"
    assert cs["image"] == "/images/cases/case-bi.webp"
    assert cs.get("contact_phone") == "212-643-4808"
    assert cs.get("contact_linkedin") == "https://www.linkedin.com/company/intrinsic"


def test_nonprofit_content_bodies(case_studies):
    cs = case_studies[0]
    # Challenge has 2 paragraphs
    assert len(cs["challenge"].split("\n")) == 2
    # Approach has 8 paragraphs
    assert len(cs["approach"].split("\n")) == 8
    # Results 4 entries
    assert len(cs["results"]) == 4
    # Key phrases
    assert "480" in " ".join(cs["results"])
    assert "40 percent" in " ".join(cs["results"])
    assert "minutes rather than days" in " ".join(cs["results"])
    assert "Role-based access" in " ".join(cs["results"])
    # About PDF sentence
    assert "AI-enabled automation" in cs["about"]
    assert "women-owned and minority-owned" in cs["about"]


def test_no_stale_phrasing(case_studies):
    cs = case_studies[0]
    blob = " ".join([cs.get("body", ""), cs.get("summary", ""), cs.get("challenge", ""), cs.get("approach", "")])
    # No stale "40+ monthly" phrasing
    assert not re.search(r"40\+\s*(?:monthly|staff hours monthly)", blob, re.I)


def test_other_studies_unchanged_ids(case_studies):
    expected_ids = {
        "a2d968df-9c8b-4166-9aa7-1eaa788264ef",
        "9ee4415b-e7e2-41c4-8033-0053c9ec61e1",
        "22d02592-0a4a-4e5d-9260-cb129083793a",
        "349e9fd4-9bf6-4e7a-9aa7-2e5daf0fb39d",
    }
    actual = {c["id"] for c in case_studies[1:]}
    assert actual == expected_ids


def test_communications_case_intact(case_studies):
    comm = next(c for c in case_studies if c["id"] == "9ee4415b-e7e2-41c4-8033-0053c9ec61e1")
    assert comm["title"] == "Consolidating Microsoft 365 Domains and SharePoint Without Downtime"
    assert comm.get("contact_phone") == "212-643-4808"
    assert comm.get("content_revision") == "communications-m365-v2"
