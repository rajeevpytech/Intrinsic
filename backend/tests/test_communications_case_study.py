"""Regression tests for Communications M365 Domain Consolidation case study update."""
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")

COMM_ID = "9ee4415b-e7e2-41c4-8033-0053c9ec61e1"
NEW_TITLE = "Consolidating Microsoft 365 Domains and SharePoint Without Downtime"
OLD_TITLE = "One Brand, One Identity, Zero Downtime"
REVISION = "communications-m365-v2"


@pytest.fixture(scope="module")
def case_studies():
    r = requests.get(f"{BASE_URL}/api/content/case-studies", timeout=15)
    assert r.status_code == 200
    return r.json()


@pytest.fixture(scope="module")
def comm(case_studies):
    return next(c for c in case_studies if c["id"] == COMM_ID)


def test_case_studies_count(case_studies):
    assert len(case_studies) == 5


def test_communications_updated_fields(comm):
    assert comm["title"] == NEW_TITLE
    assert comm.get("card_title") == NEW_TITLE
    assert comm.get("content_revision") == REVISION
    assert comm["image"] == "/images/cases/case-m365-comms.jpeg"
    assert comm.get("heroBg") == "#e7f0ed"
    assert comm.get("contact_phone") == "212-643-4808"
    assert comm.get("contact_linkedin") == "https://www.linkedin.com/company/intrinsic"
    assert OLD_TITLE in comm.get("previous_titles", [])
    assert comm.get("tag", "").startswith("Communications")
    assert comm.get("order") == 2


def test_communications_body_and_paragraphs(comm):
    body = comm["body"]
    assert "four email domains" in body.lower() or "four email domains" in body
    assert "Microsoft 365" in body
    assert "50 SharePoint" in body or "more than 50 SharePoint" in body

    ch = comm["challenge"].split("\n")
    assert len(ch) == 2

    ap = comm["approach"].split("\n")
    assert len(ap) == 7
    joined_ap = " ".join(ap)
    assert "AvePoint Fly" in joined_ap
    assert "migration sequence" in joined_ap
    assert "cutover" in joined_ap.lower()
    assert "URL-redirection" in joined_ap or "URL redirection" in joined_ap
    assert "rollback" in joined_ap
    assert "validation" in joined_ap.lower()
    assert "four domains" in joined_ap.lower() or "All four domains" in joined_ap
    assert "no reported downtime" in joined_ap
    assert "50 SharePoint" in joined_ap or "more than 50 SharePoint" in joined_ap
    assert "15 orphaned" in joined_ap or "more than 15 orphaned" in joined_ap
    assert "eight overly permissive sharing" in joined_ap or "eight" in joined_ap


def test_communications_results(comm):
    results = comm["results"]
    joined = " ".join(results)
    assert "Four legacy domains" in joined or "four" in joined.lower()
    assert "50+" in joined
    assert "15+" in joined
    assert len(results) == 4
    assert "8 overly permissive sharing configurations" in joined
    assert "Shared-mailbox data kept available throughout" in joined


def test_communications_about_has_comma_after_administration(comm):
    """Ensure the missing-comma typo was corrected."""
    about = comm.get("about", "")
    assert "AI-enabled automation" in about
    assert "women-owned and minority-owned" in about
    # comma after administration - check via approach text (which mentioned simplified administration)
    approach = comm.get("approach", "")
    # "simplified administration, reduced" should have comma
    assert "simplified administration, reduced" in approach


def test_communications_no_stale_title(comm):
    blob = " ".join([
        comm.get("body", ""),
        comm.get("summary", ""),
        comm.get("challenge", ""),
        comm.get("approach", ""),
        comm.get("title", ""),
    ])
    assert OLD_TITLE not in blob


def test_communications_previous_title_preserved(comm):
    assert OLD_TITLE in comm["previous_titles"]
    assert comm["title"] != OLD_TITLE


def test_seed_module_import_safe():
    import importlib
    mod = importlib.import_module("scripts.seed_communications_case_study")
    assert mod.UPDATE["title"] == NEW_TITLE
    assert mod.UPDATE["content_revision"] == REVISION
    assert OLD_TITLE in mod.UPDATE["previous_titles"]
    assert len(mod.UPDATE["approach"].split("\n")) == 7
    assert len(mod.UPDATE["challenge"].split("\n")) == 2
