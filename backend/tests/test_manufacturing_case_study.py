"""Regression tests for Manufacturing & Construction Azure case study update."""
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")

MFG_ID = "22d02592-0a4a-4e5d-9260-cb129083793a"
NEW_TITLE = "Modernizing a Production Management System on Microsoft Azure"
OLD_TITLE = "Moving to the Cloud Without Losing What Works"
REVISION = "manufacturing-azure-v2"


@pytest.fixture(scope="module")
def case_studies():
    r = requests.get(f"{BASE_URL}/api/content/case-studies", timeout=15)
    assert r.status_code == 200
    return r.json()


@pytest.fixture(scope="module")
def mfg(case_studies):
    return next(c for c in case_studies if c["id"] == MFG_ID)


def test_case_studies_count(case_studies):
    assert len(case_studies) == 5


def test_manufacturing_updated_fields(mfg):
    assert mfg["title"] == NEW_TITLE
    assert mfg.get("card_title") == NEW_TITLE
    assert mfg.get("content_revision") == REVISION
    assert mfg["image"] == "/images/cases/case-azure-mfg.jpeg"
    assert mfg.get("heroBg") == "#e6edf5"
    assert mfg.get("contact_phone") == "212-643-4808"
    assert mfg.get("contact_linkedin") == "https://www.linkedin.com/company/intrinsic"
    assert OLD_TITLE in mfg.get("previous_titles", [])
    assert mfg.get("tag") == "Manufacturing & Construction · Azure Cloud Infrastructure"
    assert mfg.get("order") == 3


def test_manufacturing_body_and_paragraphs(mfg):
    body = mfg["body"]
    assert "precast concrete manufacturer" in body

    ch = mfg["challenge"].split("\n")
    assert len(ch) == 2
    assert "Microsoft Access" in ch[0]
    assert "SQL Server" in ch[0]

    ap = mfg["approach"].split("\n")
    assert len(ap) == 6
    joined = " ".join(ap)
    assert "three on-premises servers" in joined
    assert "99.9 percent" in joined
    assert "first day" in joined or "day-one" in joined.lower() or "day of operation" in joined
    assert "30 percent below" in joined
    assert "disaster recovery" in joined
    # bring-your-own-license typo normalized
    assert "bring-your-own-license" in joined
    assert "bring-your-ownlicense" not in joined


def test_manufacturing_results(mfg):
    results = mfg["results"]
    assert len(results) == 4
    joined = " ".join(results)
    assert "three on-premises servers" in joined
    assert "99.9%" in joined
    assert "30%" in joined


def test_manufacturing_summary_no_zero_disruption(mfg):
    summary = mfg.get("summary", "")
    assert "zero disruption" not in summary.lower()
    assert "99.9%" in summary
    assert "precast concrete" in summary


def test_manufacturing_about(mfg):
    about = mfg.get("about", "")
    assert "AI-enabled automation" in about
    assert "women-owned and minority-owned" in about


def test_manufacturing_no_stale_title(mfg):
    blob = " ".join([
        mfg.get("body", ""),
        mfg.get("summary", ""),
        mfg.get("challenge", ""),
        mfg.get("approach", ""),
        mfg.get("title", ""),
    ])
    assert OLD_TITLE not in blob


def test_seed_module_import_safe():
    import importlib
    mod = importlib.import_module("scripts.seed_manufacturing_case_study")
    assert mod.UPDATE["title"] == NEW_TITLE
    assert mod.UPDATE["content_revision"] == REVISION
    assert OLD_TITLE in mod.UPDATE["previous_titles"]
    assert len(mod.UPDATE["approach"].split("\n")) == 6
    assert len(mod.UPDATE["challenge"].split("\n")) == 2


def test_neighbor_case_studies_still_intact(case_studies):
    expected = {
        "e1aa85d2-ac28-46a5-a631-f4cd1f5dafeb": ("Improving Program Reporting Across a Global Nonprofit Network", "nonprofit-pdf2"),
        "a2d968df-9c8b-4166-9aa7-1eaa788264ef": ("Improving CRM Adoption Through Salesforce and Microsoft 365", "professional-services-crm-v2"),
        "9ee4415b-e7e2-41c4-8033-0053c9ec61e1": ("Consolidating Microsoft 365 Domains and SharePoint Without Downtime", "communications-m365-v2"),
    }
    for cs in case_studies:
        if cs["id"] in expected:
            title, rev = expected[cs["id"]]
            assert cs["title"] == title
            assert cs.get("content_revision") == rev
