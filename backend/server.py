from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import asyncio
import smtplib
import logging
from email.message import EmailMessage
from datetime import datetime, timezone, timedelta
from typing import Literal

import jwt
import bcrypt
import requests
from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Header, Response, BackgroundTasks, Request
from fastapi.responses import PlainTextResponse, HTMLResponse, RedirectResponse
import ssr_render
from styled_pages import read_styled_page, read_styled_404, route_of
import styled_refresh
from upload_recovery import recover_original
from starlette.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw, ImageFont
import io
import re as _re
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from typography import (ThemeSettings, ThemeDocument, TypographyPresetCreate,
                        TypographyPresetRename, TypographyPresetPublic, TypographyPresetDocument)
import base64
from bson import ObjectId, json_util
from pymongo.errors import DuplicateKeyError
from analytics import create_analytics_router, initialize_analytics
from custom_css import CustomCssInput, CustomCssPublic, CustomCssDocument, validate_custom_css
from migration import create_migration_router
from email_service import notify_inquiry, INQUIRY_NOTIFY_EMAIL
from scripts.seed_nonprofit_case_study import UPDATE as NONPROFIT_CASE_STUDY
from scripts.seed_professional_services_case_study import UPDATE as PROFESSIONAL_SERVICES_CASE_STUDY
from scripts.seed_communications_case_study import UPDATE as COMMUNICATIONS_CASE_STUDY
from scripts.seed_manufacturing_case_study import UPDATE as MANUFACTURING_CASE_STUDY
from scripts.seed_legal_case_study import UPDATE as LEGAL_CASE_STUDY

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"
APP_NAME = "intrrinsic"

# ---- Object storage ----
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
storage_key = None

def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def _emergent_put(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key, "Content-Type": content_type}, data=data, timeout=120)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key, "Content-Type": content_type}, data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()

def _emergent_get(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# STORAGE_BACKEND=local keeps uploads on this server's disk (for self-hosting on a VPS).
STORAGE_BACKEND = (os.environ.get("STORAGE_BACKEND") or "emergent").strip().lower()
LOCAL_STORAGE_DIR = Path(os.environ.get("LOCAL_STORAGE_DIR") or (ROOT_DIR / "uploads")).resolve()

def _local_file(path: str) -> Path:
    target = (LOCAL_STORAGE_DIR / path).resolve()
    if not str(target).startswith(str(LOCAL_STORAGE_DIR) + os.sep):
        raise ValueError("Invalid file path")
    return target

def _local_put(path: str, data: bytes) -> dict:
    target = _local_file(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return {"path": path}

def put_object(path: str, data: bytes, content_type: str) -> dict:
    return _local_put(path, data) if STORAGE_BACKEND == "local" else _emergent_put(path, data, content_type)

def get_object(path: str):
    if STORAGE_BACKEND == "local":
        target = _local_file(path)
        if not target.is_file():
            raise FileNotFoundError(path)
        return target.read_bytes(), "application/octet-stream"
    return _emergent_get(path)

# ---- Auth helpers ----
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode(), hashed.encode())

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "role": "admin", "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

async def get_current_admin(authorization: str = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

app = FastAPI()
api_router = APIRouter(prefix="/api")

class LoginInput(BaseModel):
    email: str
    password: str

class ChangePasswordInput(BaseModel):
    current_password: str
    new_password: str

class InquiryInput(BaseModel):
    name: str
    email: str
    company: str = ""
    phone: str = ""
    message: str = ""
    type: str = "contact"
    details: dict = {}

@api_router.get("/")
async def root():
    return {"message": "Intrinsic API"}

@api_router.get("/health")
async def health():
    return {"status": "ok"}

@api_router.post("/auth/login")
async def login(body: LoginInput):
    user = await db.users.find_one({"email": body.email.lower().strip()})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    return {"access_token": token, "token_type": "bearer",
            "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": "admin"}}

@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin

@api_router.post("/auth/change-password")
async def change_password(body: ChangePasswordInput, admin: dict = Depends(get_current_admin)):
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    user = await db.users.find_one({"id": admin["id"]})
    if not user or not verify_password(body.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if verify_password(body.new_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="New password must be different from current password")
    await db.users.update_one({"id": admin["id"]}, {"$set": {"password_hash": hash_password(body.new_password)}})
    return {"success": True, "message": "Password updated successfully"}

# ---- Email settings + confirmation sender ----
DEFAULT_EMAIL_SETTINGS = {
    "enabled": False,
    "gmail_address": "",
    "from_name": "Intrinsic Team",
    "notify_enabled": True,
    "notify_email": "consulting@intrinsicamerica.com",
    "subject": "Thanks for reaching out to Intrinsic",
    "body": ("Hi {{name}},\n\n"
             "Thank you for contacting Intrinsic. We've received your message and one of our "
             "experts will get back to you within one business day.\n\n"
             "In the meantime, feel free to reply to this email with anything else on your mind.\n\n"
             "Warm regards,\nThe Intrinsic Team"),
}

async def get_email_settings() -> dict:
    doc = await db.settings.find_one({"key": "email"}, {"_id": 0, "key": 0})
    # Env-provided Gmail sender acts as the base (survives deploy as a secret);
    # any values saved via the admin Email Settings UI override it.
    env_base = {}
    if os.environ.get("SMTP_GMAIL_ADDRESS"):
        env_base["gmail_address"] = os.environ["SMTP_GMAIL_ADDRESS"]
    if os.environ.get("SMTP_GMAIL_APP_PASSWORD"):
        env_base["smtp_password"] = os.environ["SMTP_GMAIL_APP_PASSWORD"]
    if os.environ.get("INQUIRY_NOTIFY_EMAIL"):
        env_base["notify_email"] = os.environ["INQUIRY_NOTIFY_EMAIL"]
        env_base["notify_enabled"] = True
    return {**DEFAULT_EMAIL_SETTINGS, **env_base, **(doc or {})}

def _render(template: str, ctx: dict) -> str:
    out = template or ""
    for k, v in ctx.items():
        out = out.replace("{{" + k + "}}", str(v or ""))
    return out

def _smtp_send(settings: dict, to_email: str, subject: str, body_text: str):
    """Blocking SMTP send via Gmail. Raises on failure."""
    gmail = (settings.get("gmail_address") or "").strip()
    pw = (settings.get("smtp_password") or "").strip()
    if not gmail or not pw:
        raise RuntimeError("Gmail address / app password not configured")
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f'{settings.get("from_name", "Intrinsic")} <{gmail}>'
    msg["To"] = to_email
    msg.set_content(body_text)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=20) as smtp:
        smtp.login(gmail, pw.replace(" ", ""))
        smtp.send_message(msg)

def _send_gmail(settings: dict, to_email: str, ctx: dict):
    _smtp_send(settings, to_email, _render(settings.get("subject", ""), ctx), _render(settings.get("body", ""), ctx))
    logger.info(f"Confirmation email sent to {to_email}")

def _build_inquiry_body(inquiry: dict) -> str:
    lines = ["You've received a new inquiry from the website.\n",
             f"Name: {inquiry.get('name', '')}",
             f"Email: {inquiry.get('email', '')}"]
    if inquiry.get("company"):
        lines.append(f"Company: {inquiry['company']}")
    if inquiry.get("phone"):
        lines.append(f"Phone: {inquiry['phone']}")
    lines.append(f"Type: {inquiry.get('type', 'contact')}")
    if inquiry.get("message"):
        lines.append(f"\nMessage:\n{inquiry['message']}")
    details = inquiry.get("details") or {}
    if isinstance(details, dict) and details:
        lines.append("\nAdditional details:")
        for k, v in details.items():
            lines.append(f"  {k}: {v}")
    lines.append(f"\nReceived: {inquiry.get('created_at', '')}")
    lines.append("\nView and manage this inquiry in the admin dashboard.")
    return "\n".join(lines)

async def send_inquiry_notification(inquiry: dict):
    # Primary: managed Resend to the fixed company recipient.
    if await notify_inquiry(inquiry):
        return
    # Fallback: the app's own Gmail SMTP (admin Email Settings), which can deliver
    # to recipients the managed provider refuses (e.g. role mailboxes).
    settings = await get_email_settings()
    to_email = (settings.get("notify_email") or INQUIRY_NOTIFY_EMAIL or "").strip()
    if not to_email or not (settings.get("gmail_address") and (settings.get("smtp_password") or "").strip()):
        logger.info("SMTP fallback not configured; inquiry saved to dashboard only")
        return
    subject = f"New inquiry from {inquiry.get('name', 'website visitor')}"
    try:
        await asyncio.to_thread(_smtp_send, settings, to_email, subject, _build_inquiry_body(inquiry))
        logger.info(f"Inquiry notification sent via SMTP fallback to {to_email}")
    except Exception as e:
        logger.error(f"SMTP fallback inquiry notification failed (non-blocking): {e}")

async def send_confirmation_email(to_email: str, ctx: dict):
    settings = await get_email_settings()
    if not settings.get("enabled"):
        logger.info("Email disabled in admin settings; not sending")
        return
    try:
        await asyncio.to_thread(_send_gmail, settings, to_email, ctx)
    except Exception as e:
        logger.error(f"Confirmation email failed (non-blocking): {e}")

@api_router.get("/email-settings")
async def get_email_settings_admin(admin: dict = Depends(get_current_admin)):
    s = await get_email_settings()
    raw = await db.settings.find_one({"key": "email"}, {"_id": 0})
    s.pop("smtp_password", None)
    s["has_password"] = bool(raw and (raw.get("smtp_password") or "").strip())
    return s

class EmailSettingsInput(BaseModel):
    enabled: bool = False
    gmail_address: str = ""
    from_name: str = "Intrinsic Team"
    notify_enabled: bool = False
    notify_email: str = ""
    subject: str = ""
    body: str = ""
    smtp_password: str = ""  # only updated when a non-empty value is sent

@api_router.put("/email-settings")
async def update_email_settings(body: EmailSettingsInput, admin: dict = Depends(get_current_admin)):
    update = {
        "enabled": body.enabled,
        "gmail_address": body.gmail_address.strip(),
        "from_name": body.from_name.strip() or "Intrinsic Team",
        "notify_enabled": body.notify_enabled,
        "notify_email": body.notify_email.strip(),
        "subject": body.subject.strip() or DEFAULT_EMAIL_SETTINGS["subject"],
        "body": body.body or DEFAULT_EMAIL_SETTINGS["body"],
    }
    if body.smtp_password.strip():
        update["smtp_password"] = body.smtp_password.strip()
    await db.settings.update_one({"key": "email"}, {"$set": update}, upsert=True)
    return await get_email_settings_admin(admin)

class TestEmailInput(BaseModel):
    to_email: str

@api_router.post("/email-settings/test")
async def send_test_email(body: TestEmailInput, admin: dict = Depends(get_current_admin)):
    settings = await get_email_settings()
    if not (settings.get("gmail_address") and (settings.get("smtp_password") or "").strip()):
        raise HTTPException(status_code=400, detail="Set the Gmail address and app password first")
    try:
        await asyncio.to_thread(_send_gmail, settings, body.to_email.strip(), {"name": "there", "company": ""})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Send failed: {e}")
    return {"success": True, "message": f"Test email sent to {body.to_email}"}

# ---- Inquiries (public contact form) ----
@api_router.post("/inquiries")
async def create_inquiry(body: InquiryInput, background_tasks: BackgroundTasks):
    if not body.name.strip() or not body.email.strip():
        raise HTTPException(status_code=400, detail="Name and email are required")
    doc = {
        "id": str(uuid.uuid4()),
        "name": body.name.strip(),
        "email": body.email.strip(),
        "company": body.company.strip(),
        "phone": body.phone.strip(),
        "message": body.message.strip(),
        "type": (body.type or "contact").strip(),
        "details": body.details or {},
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.inquiries.insert_one(dict(doc))
    doc.pop("_id", None)
    background_tasks.add_task(
        send_confirmation_email,
        doc["email"],
        {"name": doc["name"], "company": doc["company"]},
    )
    background_tasks.add_task(send_inquiry_notification, dict(doc))
    return {"success": True, "id": doc["id"]}

@api_router.get("/inquiries")
async def list_inquiries(kind: Literal['inquiries', 'applications'] | None = None, admin: dict = Depends(get_current_admin)):
    query = {'type': 'application'} if kind == 'applications' else {'type': {'$ne': 'application'}} if kind == 'inquiries' else {}
    return await db.inquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api_router.delete("/inquiries/{item_id}")
async def delete_inquiry(item_id: str, admin: dict = Depends(get_current_admin)):
    await db.inquiries.delete_one({"id": item_id})
    return {"deleted": True}

# ---- Job applications (public; optional resume upload) ----
RESUME_MIME = {"pdf": "application/pdf", "doc": "application/msword",
               "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}

@api_router.post("/applications")
async def create_application(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    role: str = Form(""),
    cover_letter: str = Form(""),
    resume: UploadFile = File(None),
):
    if not name.strip() or not email.strip():
        raise HTTPException(status_code=400, detail="Name and email are required")
    resume_path = ""
    if resume is not None and resume.filename:
        ext = (resume.filename.rsplit(".", 1)[-1] if "." in resume.filename else "").lower()
        if ext not in RESUME_MIME:
            raise HTTPException(status_code=400, detail="Resume must be a .pdf, .doc, or .docx file")
        data = await resume.read()
        if len(data) > 8 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Resume must be under 8MB")
        path = f"{APP_NAME}/resumes/{uuid.uuid4()}.{ext}"
        ctype = resume.content_type or RESUME_MIME[ext]
        result = put_object(path, data, ctype)
        resume_path = result["path"]
        await db.files.insert_one({"id": str(uuid.uuid4()), "storage_path": resume_path,
                                   "content_type": ctype, "is_deleted": False,
                                   "created_at": datetime.now(timezone.utc).isoformat()})
    doc = {
        "id": str(uuid.uuid4()),
        "name": name.strip(), "email": email.strip(), "phone": phone.strip(),
        "company": "", "message": cover_letter.strip(),
        "type": "application",
        "details": {"role": role.strip(), "resume": resume_path},
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.inquiries.insert_one(dict(doc))
    return {"success": True, "id": doc["id"]}

# ---- Service brief downloads (email-gated) ----
class BriefLeadInput(BaseModel):
    brief_id: str
    name: str
    email: EmailStr
    company: str
    phone: str = ""
    message: str

@api_router.post("/brief-download")
async def brief_download(body: BriefLeadInput, background_tasks: BackgroundTasks):
    if not all(value.strip() for value in (body.name, body.company, body.message)):
        raise HTTPException(status_code=400, detail="Name, company, email, and message are required")
    brief = await db.service_briefs.find_one({"id": body.brief_id}, {"_id": 0})
    if not brief:
        raise HTTPException(status_code=404, detail="Service brief not found")
    if brief.get("available") is False or not brief.get("file"):
        raise HTTPException(status_code=400, detail="This service brief is not available yet")
    doc = {
        "id": str(uuid.uuid4()),
        "name": body.name.strip(),
        "email": body.email.strip(),
        "company": body.company.strip(),
        "phone": body.phone.strip(),
        "message": body.message.strip(),
        "type": "brief_download",
        "details": {"brief_id": brief["id"], "brief_title": brief.get("title", ""), "service": brief.get("service", "")},
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.inquiries.insert_one(dict(doc))
    doc.pop("_id", None)
    background_tasks.add_task(send_inquiry_notification, dict(doc))
    return {"success": True, "file": brief["file"], "title": brief.get("title", "")}

# ---- Generic content CRUD ----
COLLECTIONS = {"blogs": db.blogs, "testimonials": db.testimonials, "case-studies": db.case_studies,
               "jobs": db.jobs, "service-briefs": db.service_briefs}

def coll(name: str):
    c = COLLECTIONS.get(name)
    if c is None:
        raise HTTPException(status_code=404, detail="Unknown collection")
    return c

@api_router.get("/content/{name}")
async def list_content(name: str):
    query = {"published": True} if name == "blogs" else {}
    items = await coll(name).find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    if name == "service-briefs":
        for item in items:
            item["has_file"] = bool(item.pop("file", ""))
    return items

@api_router.get("/admin/content/{name}")
async def list_admin_content(name: str, admin: dict = Depends(get_current_admin)):
    return await coll(name).find({}, {"_id": 0}).sort("order", 1).to_list(1000)

@api_router.post("/content/{name}")
async def create_content(name: str, body: dict, admin: dict = Depends(get_current_admin)):
    c = coll(name)
    if name == "blogs":
        body.setdefault("published", False)
    last = await c.find_one({}, {"_id": 0, "order": 1}, sort=[("order", -1)])
    body["id"] = str(uuid.uuid4())
    body["order"] = (last["order"] + 1) if last and "order" in last else 0
    body["created_at"] = datetime.now(timezone.utc).isoformat()
    body.pop("_id", None)
    await c.insert_one(dict(body))
    return {k: v for k, v in body.items() if k != "_id"}

@api_router.put("/content/{name}/{item_id}")
async def update_content(name: str, item_id: str, body: dict, admin: dict = Depends(get_current_admin)):
    body.pop("_id", None)
    body.pop("id", None)
    res = await coll(name).update_one({"id": item_id}, {"$set": body})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    item = await coll(name).find_one({"id": item_id}, {"_id": 0})
    return item

@api_router.delete("/content/{name}/{item_id}")
async def delete_content(name: str, item_id: str, admin: dict = Depends(get_current_admin)):
    await coll(name).delete_one({"id": item_id})
    return {"deleted": True}

# ---- Site content (hero + section headings) ----
DEFAULT_SITE = {
    "hero_h1": "Managed IT, Cybersecurity, and Cloud Services",
    "hero_h2": "Engineered, Monitored, and Secured for Business",
    "hero_paragraph": "Intrinsic provides complete oversight of your technology environment, combining proactive monitoring, infrastructure management, and strategic guidance to keep your operations secure and resilient.",
    "hero_cta": "Talk to an Expert",
    "resources_heading": "Practical Insights for Better Technology Decisions",
    "resources_sub": "Whether you're planning your next IT investment, navigating compliance requirements, or strengthening your cybersecurity strategy, you'll find resources designed to turn complexity into clarity.",
}

@api_router.get("/content-site")
async def get_site():
    doc = await db.site.find_one({"key": "content"}, {"_id": 0, "key": 0})
    return doc or DEFAULT_SITE

@api_router.put("/content-site")
async def update_site(body: dict, admin: dict = Depends(get_current_admin)):
    body.pop("_id", None)
    body.pop("key", None)
    await db.site.update_one({"key": "content"}, {"$set": body}, upsert=True)
    doc = await db.site.find_one({"key": "content"}, {"_id": 0, "key": 0})
    return doc

# ---- SEO & GEO settings (fully admin-managed) ----
SEO_STATIC_ROUTES = [
    "/", "/about", "/resources", "/careers", "/contact",
    "/privacy-policy", "/terms-of-service", "/security-risk-assessment",
    "/services/ai", "/services/ai-readiness-assessment", "/services/managed-ai", "/services/ai-governance-compliance",
    "/services/cybersecurity", "/services/threat-detection-response", "/services/identity-endpoint-security",
    "/services/network-perimeter-security", "/services/security-monitoring-siem", "/services/security-assessments",
    "/services/security-governance-compliance", "/services/networking",
    "/services/cloud", "/services/cloud-infrastructure-migration", "/services/backup-disaster-recovery",
    "/services/managed-it", "/services/co-managed-it", "/services/remote-monitoring-management",
    "/services/microsoft-365", "/services/vcio-vciso",
    "/industries", "/industries/construction", "/industries/professional-services",
    "/industries/financial-services", "/industries/non-profit", "/industries/healthcare",
    "/service-areas/new-york", "/service-areas/new-jersey",
]

DEFAULT_SEO = {
    "site_name": "Intrinsic Technology",
    "title_template": "{title} | Intrinsic Technology",
    "default_title": "Intrinsic Technology | Managed IT, Cybersecurity & Cloud Services",
    "default_description": "Intrinsic Technology delivers Managed IT, Cybersecurity, and Cloud services—engineered, monitored, and secured for business. 24/7 monitoring, complete accountability, and one trusted technology partner.",
    "default_keywords": "Managed IT, Cybersecurity, Cloud Services, Microsoft 365, AI Automation, IT Support, Threat Detection, Cloud Migration, Compliance",
    "canonical_base": "https://intrinsicamerica.com",
    "default_og_image": "/api/og/default.png",
    "twitter_handle": "",
    "google_site_verification": "",
    "robots_default": "index, follow",
    "organization": {
        "name": "Intrinsic Technology",
        "legal_name": "Intrinsic Technology Group, Inc.",
        "logo": "/favicon-512.png",
        "url": "https://intrinsicamerica.com",
        "same_as": ["https://www.linkedin.com/company/intrinsic-tech-group"],
        "email": "consulting@intrinsicamerica.com",
        "telephone": "+1-212-643-4808",
        "street": "14 Wall Street, Suite 5C", "city": "New York", "region": "NY", "postal_code": "10005", "country": "US",
    },
    "geo": {
        "enabled": True,
        "site_summary": "Intrinsic Technology Group is a women-owned and minority-owned managed service provider headquartered in New York City, offering managed IT, cybersecurity, cloud, and AI services to small and midsize organizations across healthcare, financial services, legal, construction, nonprofit, and retail sectors.",
        "llms_txt": "",
        "faqs": [
            {"q": "What services does Intrinsic Technology provide?", "a": "Intrinsic Technology provides Managed IT and help desk, Cybersecurity, Cloud (Microsoft Azure and Microsoft 365), AI and automation, vCIO/vCISO advisory, and Backup & Disaster Recovery—delivered as one coordinated, fully accountable service."},
            {"q": "Where is Intrinsic Technology located?", "a": "Intrinsic Technology is headquartered at 14 Wall Street, Suite 5C, New York, NY 10005, with additional offices in Paterson, New Jersey; Boston, Massachusetts; and Washington, D.C."},
            {"q": "Does Intrinsic Technology support HIPAA and SOC 2 compliance?", "a": "Yes. Intrinsic aligns security governance to frameworks including HIPAA, SOC 2, NIST CSF, and NYDFS, and supports healthcare and financial services organizations with compliance-ready managed IT and security."},
            {"q": "Is Intrinsic Technology a minority- or women-owned business?", "a": "Yes. Intrinsic Technology is a women-owned and minority-owned managed service provider based in New York City."},
            {"q": "How can I contact Intrinsic Technology?", "a": "Call 212.643.4808 or email consulting@intrinsicamerica.com. You can also request a consultation from the Contact page."}
        ],
    },
    "pages": {},
}

def _slugify_py(s: str) -> str:
    s = (s or "").lower().replace("&", "and")
    s = _re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

async def get_seo_settings() -> dict:
    doc = await db.settings.find_one({"key": "seo"}, {"_id": 0, "key": 0}) or {}
    merged = {**DEFAULT_SEO, **doc}
    merged["organization"] = {**DEFAULT_SEO["organization"], **(doc.get("organization") or {})}
    merged["geo"] = {**DEFAULT_SEO["geo"], **(doc.get("geo") or {})}
    merged["pages"] = doc.get("pages") or {}
    return merged

def _seo_base_url(request: Request, seo: dict) -> str:
    base = (seo.get("canonical_base") or "").strip().rstrip("/")
    if base:
        return base
    return str(request.base_url).rstrip("/")

@api_router.get("/seo")
async def seo_public():
    return await get_seo_settings()

@api_router.put("/seo")
async def seo_update(body: dict, admin: dict = Depends(get_current_admin)):
    body.pop("_id", None)
    body.pop("key", None)
    await db.settings.update_one({"key": "seo"}, {"$set": body}, upsert=True)
    return await get_seo_settings()

@api_router.api_route("/sitemap.xml", methods=["GET", "HEAD"])
async def sitemap_xml(request: Request):
    seo = await get_seo_settings()
    base = _seo_base_url(request, seo)
    urls, seen, items = list(SEO_STATIC_ROUTES), set(), []
    async for c in db.case_studies.find({}, {"title": 1}):
        slug = _slugify_py(c.get("title", ""))
        if slug:
            urls.append(f"/case-studies/{slug}")
    async for b in db.blogs.find({"published": True}, {"title": 1}):
        slug = _slugify_py(b.get("title", ""))
        if slug:
            urls.append(f"/blog/{slug}")
    async for j in db.jobs.find({"published": True}, {"slug": 1}):
        if j.get("slug"):
            urls.append(f"/careers/{j['slug']}")
    for u in urls:
        if u in seen:
            continue
        seen.add(u)
        items.append(f"  <url><loc>{base}{u}</loc><changefreq>weekly</changefreq></url>")
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(items) + "\n</urlset>")
    return Response(content=xml, media_type="application/xml")

@api_router.api_route("/robots.txt", methods=["GET", "HEAD"])
async def robots_txt(request: Request):
    seo = await get_seo_settings()
    base = _seo_base_url(request, seo)
    body = (
        "User-agent: *\nAllow: /\nDisallow: /admin\n\n"
        "# AI / answer-engine crawlers welcome (GEO)\n"
        "User-agent: GPTBot\nAllow: /\n\n"
        "User-agent: OAI-SearchBot\nAllow: /\n\n"
        "User-agent: ChatGPT-User\nAllow: /\n\n"
        "User-agent: ClaudeBot\nAllow: /\n\n"
        "User-agent: PerplexityBot\nAllow: /\n\n"
        "User-agent: Google-Extended\nAllow: /\n\n"
        "User-agent: Bingbot\nAllow: /\n\n"
        f"Sitemap: {base}/api/sitemap.xml\n"
    )
    return PlainTextResponse(body)

@api_router.api_route("/llms.txt", methods=["GET", "HEAD"])
async def llms_txt(request: Request):
    seo = await get_seo_settings()
    geo = seo.get("geo") or {}
    if (geo.get("llms_txt") or "").strip():
        return PlainTextResponse(geo["llms_txt"])
    base = _seo_base_url(request, seo)
    out = [f"# {seo.get('site_name', 'Intrinsic Technology')}", ""]
    if geo.get("site_summary"):
        out += [f"> {geo['site_summary']}", ""]
    out.append("## Pages")
    for u in SEO_STATIC_ROUTES:
        out.append(f"- {base}{u}")
    faqs = geo.get("faqs") or []
    if faqs:
        out += ["", "## FAQ"]
        for f in faqs:
            if f.get("q"):
                out += [f"### {f['q']}", (f.get("a") or ""), ""]
    return PlainTextResponse("\n".join(out))

# ---- Server-side rendering for public pages (SSR; always fresh from DB) ----
_SSR_TEMPLATE_CACHE = {"mtime": 0, "html": None}

def _frontend_index_path() -> Path:
    override = os.environ.get("FRONTEND_BUILD_DIR")
    candidates = [Path(override) / "index.html"] if override else []
    candidates += [ROOT_DIR.parent / "frontend" / "build" / ".prerender-template.html",
                   ROOT_DIR.parent / "frontend" / "build" / "index.html",
                   Path("/var/www/intrinsic/current/frontend/build/.prerender-template.html"),
                   Path("/var/www/intrinsic/current/frontend/build/index.html"),
                   # Fallback when no production build is present (dev/preview, or a
                   # deployment that serves the SPA without a local build): the committed
                   # source template still carries every meta tag + Organization JSON-LD
                   # the SSR layer rewrites, so crawlers always get real per-page HTML.
                   ROOT_DIR.parent / "frontend" / "public" / "index.html"]
    for c in candidates:
        if c.exists():
            return c
    return candidates[-1]

def _load_ssr_template() -> str | None:
    path = _frontend_index_path()
    try:
        mtime = path.stat().st_mtime
        if _SSR_TEMPLATE_CACHE["html"] is None or mtime != _SSR_TEMPLATE_CACHE["mtime"]:
            html = path.read_text(encoding="utf-8")
            # CRA leaves %PUBLIC_URL% placeholders in the source template; strip them so
            # the fallback render has valid root-relative asset URLs.
            html = html.replace("%PUBLIC_URL%", "")
            _SSR_TEMPLATE_CACHE["html"] = html
            _SSR_TEMPLATE_CACHE["mtime"] = mtime
        return _SSR_TEMPLATE_CACHE["html"]
    except Exception as e:
        logger.error(f"SSR template load failed ({path}): {e}")
        return None

@api_router.api_route("/ssr", methods=["GET", "HEAD"])
async def ssr_page(request: Request):
    """Render a public page's full HTML. nginx proxies HTML requests here on the
    VPS (X-Original-URI); ?path= is accepted for direct testing."""
    path = request.headers.get("x-original-uri") or request.query_params.get("path") or "/"
    host = request.headers.get("x-forwarded-host") or request.headers.get("host") or ""
    build_dir = _styled_build_dir()
    # Preserve host canonicalization and private routes in the existing renderer.
    if not host.lower().startswith("www."):
        styled = read_styled_page(build_dir, path)
        if styled is not None:
            return HTMLResponse(styled, headers={"Cache-Control": "public, max-age=60"})
    template = _load_ssr_template()
    if not template:
        raise HTTPException(status_code=503, detail="Frontend build not available for SSR")
    seo = await get_seo_settings()
    result = await ssr_render.render(path, host, db, seo, template)
    if result["status"] in (301, 302, 308):
        return RedirectResponse(result["location"], status_code=result["status"])
    headers = {"Cache-Control": "public, max-age=60", "Content-Type": result["content_type"]}
    # Per-result overrides (e.g. X-Robots-Tag: noindex + no-store for admin / error pages)
    headers.update(result.get("headers") or {})
    html = result["html"]
    if result["status"] == 404:
        html = read_styled_404(build_dir) or html
    elif result["status"] == 200 and not route_of(path).startswith("/admin"):
        # Public page without a styled snapshot yet (e.g. just published): real React shell now,
        # styled snapshot generated in the background.
        headers["Cache-Control"] = "no-store"
        styled_refresh.schedule(build_dir, _styled_api_origin())
    return HTMLResponse(content=html, status_code=result["status"], headers=headers)


def _styled_build_dir() -> Path:
    return Path(os.environ.get("FRONTEND_BUILD_DIR") or ROOT_DIR.parent / "frontend" / "build")


def _styled_api_origin() -> str:
    return os.environ.get("STYLED_REFRESH_API_ORIGIN") or "http://127.0.0.1:8000"

@api_router.get("/og/page.png")
async def og_page(title: str = "Intrinsic Technology", label: str = "Intrinsic Technology"):
    data = await asyncio.to_thread(_render_og, title[:160], label[:70])
    return Response(content=data, media_type="image/png", headers={"Cache-Control": "public, max-age=86400"})

@api_router.get("/og/default.png")
async def og_default():
    data = await asyncio.to_thread(_render_og, "Managed IT, Cybersecurity & Cloud Services", "Intrinsic Technology")
    return Response(content=data, media_type="image/png", headers={"Cache-Control": "public, max-age=86400"})


# ---- Branded Open Graph / social share image generation ----
_OG_W, _OG_H = 1200, 630
_FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
_FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

def _og_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def _og_wrap(draw, text, font, max_w):
    lines, cur = [], ""
    for word in (text or "").split():
        trial = (cur + " " + word).strip()
        if draw.textlength(trial, font=font) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines

def _render_og(title: str, label: str) -> bytes:
    DARK = (8, 23, 56)
    GOLD = (242, 169, 28)
    WHITE = (255, 255, 255)
    MUTE = (150, 176, 220)
    img = Image.new("RGB", (_OG_W, _OG_H), DARK)
    d = ImageDraw.Draw(img)
    # decorative diagonal band
    d.polygon([(_OG_W, 0), (_OG_W, _OG_H), (_OG_W - 360, _OG_H)], fill=(13, 48, 112))
    d.rectangle([0, 0, _OG_W, 12], fill=GOLD)
    pad = 90
    # label
    if label:
        lf = _og_font(_FONT_BOLD, 28)
        d.text((pad, 96), label.upper()[:70], font=lf, fill=GOLD)
    d.rectangle([pad, 150, pad + 70, 156], fill=GOLD)
    # title (auto-size down if long)
    size = 70
    tf = _og_font(_FONT_BOLD, size)
    lines = _og_wrap(d, title, tf, _OG_W - pad * 2 - 180)
    while len(lines) > 5 and size > 40:
        size -= 6
        tf = _og_font(_FONT_BOLD, size)
        lines = _og_wrap(d, title, tf, _OG_W - pad * 2 - 180)
    y = 190
    for ln in lines[:6]:
        d.text((pad, y), ln, font=tf, fill=WHITE)
        y += int(size * 1.22)
    # wordmark footer
    wf = _og_font(_FONT_BOLD, 32)
    d.text((pad, _OG_H - 86), "INTRINSIC", font=wf, fill=WHITE)
    tw = d.textlength("INTRINSIC", font=wf)
    d.text((pad + tw + 12, _OG_H - 86), "TECHNOLOGY", font=_og_font(_FONT_REG, 32), fill=MUTE)
    buf = io.BytesIO()
    img.save(buf, "PNG", optimize=True)
    return buf.getvalue()

@api_router.get("/og/{coll}/{slug}.png")
async def og_image(coll: str, slug: str):
    mapping = {"blogs": "blogs", "case-studies": "case_studies", "case_studies": "case_studies"}
    cname = mapping.get(coll)
    if not cname:
        raise HTTPException(status_code=404, detail="Unknown collection")
    items = await db[cname].find({}, {"_id": 0}).to_list(1000)
    item = next((x for x in items if _slugify_py(x.get("title", "")) == slug or x.get("id") == slug), None)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    title = item.get("seo_title") or item.get("title") or "Intrinsic Technology"
    label = item.get("category") or item.get("tag") or ("Article" if cname == "blogs" else "Case Study")
    data = await asyncio.to_thread(_render_og, title, label)
    return Response(content=data, media_type="image/png", headers={"Cache-Control": "public, max-age=3600"})

# ---- Image upload / serve ----
MIME = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "gif": "image/gif", "webp": "image/webp"}

@api_router.post("/upload")
async def upload(file: UploadFile = File(...), admin: dict = Depends(get_current_admin)):
    ext = (file.filename.rsplit(".", 1)[-1] if "." in file.filename else "bin").lower()
    path = f"{APP_NAME}/uploads/{uuid.uuid4()}.{ext}"
    data = await file.read()
    ctype = file.content_type or MIME.get(ext, "application/octet-stream")
    result = put_object(path, data, ctype)
    await db.files.insert_one({"id": str(uuid.uuid4()), "storage_path": result["path"],
                               "content_type": ctype, "is_deleted": False,
                               "created_at": datetime.now(timezone.utc).isoformat()})
    return {"path": result["path"]}

@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    ctype = record.get("content_type") if record else "application/octet-stream"
    try:
        data, ct = get_object(path)
    except Exception as error:
        recovered = recover_original(ROOT_DIR / "seed_data" / "site_export.json", path)
        if recovered is None:
            # Unrecoverable brand-logo upload: serve the approved project logo for that slot.
            for selector, asset in ((r'site-header.*img$', "logo-navy.png"), (r'footer-logo.*img$', "logo-white.png")):
                edit = await db.live_edits.find_one({"props.src": {"$in": [path, "/api/files/" + path]},
                                                     "selector": {"$regex": selector}})
                logo = ROOT_DIR.parent / "frontend" / "src" / "assets" / asset
                if edit and logo.is_file():
                    logger.warning("Upload %s missing; serving approved %s", path, asset)
                    recovered = (logo.read_bytes(), "image/png")
                    break
        if recovered is None:
            logger.warning("Upload unavailable: %s (%s)", path, type(error).__name__)
            raise HTTPException(status_code=404, detail="File not found")
        data, ct = recovered
        ctype = ct
    return Response(content=data, media_type=ctype or ct)

@api_router.get("/admin/storage/status")
async def storage_status(admin: dict = Depends(get_current_admin)):
    paths = [r["storage_path"] async for r in db.files.find({"is_deleted": {"$ne": True}}, {"storage_path": 1})]
    local = sum(1 for p in paths if _local_file(p).is_file())
    return {"backend": STORAGE_BACKEND, "local_dir": str(LOCAL_STORAGE_DIR), "total_files": len(paths), "on_this_server": local}

@api_router.post("/admin/storage/copy-to-local")
async def storage_copy_to_local(admin: dict = Depends(get_current_admin)):
    copied = skipped = failed = 0
    async for r in db.files.find({"is_deleted": {"$ne": True}}, {"storage_path": 1}):
        path = r["storage_path"]
        if _local_file(path).is_file():
            skipped += 1
            continue
        try:
            data, _ = await asyncio.to_thread(_emergent_get, path)
            await asyncio.to_thread(_local_put, path, data)
            copied += 1
        except Exception as e:
            failed += 1
            logger.error(f"Storage copy failed for {path}: {e}")
    return {"copied": copied, "already_here": skipped, "failed": failed, "local_dir": str(LOCAL_STORAGE_DIR)}

# ---- Review feedback (client comment pins) ----
class FeedbackInput(BaseModel):
    page: str
    author: str
    text: str
    selector: str = ""
    label: str = ""
    rel_x: float = 0.5
    rel_y: float = 0.5
    doc_x: float = 0
    doc_y: float = 0

class ReplyInput(BaseModel):
    author: str
    text: str

class FeedbackStatusInput(BaseModel):
    status: str

@api_router.get("/feedback")
async def list_feedback(page: str = None):
    q = {"page": page} if page else {}
    return await db.feedback.find(q, {"_id": 0}).sort("created_at", 1).to_list(2000)

@api_router.post("/feedback")
async def create_feedback(body: FeedbackInput):
    if not body.text.strip() or not body.author.strip():
        raise HTTPException(status_code=400, detail="Name and comment are required")
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()), "page": body.page or "/", "author": body.author.strip(),
        "text": body.text.strip(), "selector": body.selector, "label": body.label[:80],
        "rel_x": body.rel_x, "rel_y": body.rel_y, "doc_x": body.doc_x, "doc_y": body.doc_y,
        "status": "open", "replies": [], "created_at": now,
    }
    await db.feedback.insert_one(dict(doc))
    return doc

@api_router.post("/feedback/{item_id}/replies")
async def reply_feedback(item_id: str, body: ReplyInput):
    if not body.text.strip() or not body.author.strip():
        raise HTTPException(status_code=400, detail="Name and reply are required")
    reply = {"id": str(uuid.uuid4()), "author": body.author.strip(), "text": body.text.strip(),
             "created_at": datetime.now(timezone.utc).isoformat()}
    res = await db.feedback.update_one({"id": item_id}, {"$push": {"replies": reply}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return await db.feedback.find_one({"id": item_id}, {"_id": 0})

@api_router.patch("/feedback/{item_id}")
async def set_feedback_status(item_id: str, body: FeedbackStatusInput):
    if body.status not in ("open", "resolved"):
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.feedback.update_one({"id": item_id}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return await db.feedback.find_one({"id": item_id}, {"_id": 0})

@api_router.delete("/feedback/{item_id}")
async def delete_feedback(item_id: str, admin: dict = Depends(get_current_admin)):
    await db.feedback.delete_one({"id": item_id})
    return {"deleted": True}

# ---- Live editor (visual overrides per page + global theme) ----
class LiveEditInput(BaseModel):
    path: str
    selector: str
    label: str = ""
    props: dict = {}

@api_router.get("/live-edits")
async def list_live_edits(path: str = None):
    q = {"path": path} if path else {}
    return await db.live_edits.find(q, {"_id": 0}).to_list(5000)

@api_router.put("/live-edits")
async def save_live_edit(body: LiveEditInput, admin: dict = Depends(get_current_admin)):
    if not body.selector.strip():
        raise HTTPException(status_code=400, detail="selector is required")
    path = body.path or "/"
    props = {k: v for k, v in (body.props or {}).items() if v not in (None, "")}
    if not props:
        await db.live_edits.delete_one({"path": path, "selector": body.selector})
        return {"deleted": True}
    doc = {"path": path, "selector": body.selector, "label": body.label[:120], "props": props,
           "updated_at": datetime.now(timezone.utc).isoformat()}
    await db.live_edits.update_one({"path": path, "selector": body.selector},
                                   {"$set": doc, "$setOnInsert": {"id": str(uuid.uuid4())}}, upsert=True)
    return await db.live_edits.find_one({"path": path, "selector": body.selector}, {"_id": 0})

@api_router.delete("/live-edits")
async def delete_live_edits(path: str = None, selector: str = None, admin: dict = Depends(get_current_admin)):
    q = {}
    if path and path != "*":
        q["path"] = path
    if selector:
        q["selector"] = selector
    res = await db.live_edits.delete_many(q)
    return {"deleted": res.deleted_count}

# ---- Duplicated sections (live editor) ----
class BlockInput(BaseModel):
    path: str
    source_selector: str
    anchor_selector: str
    position: str = "after"

class BlockPatch(BaseModel):
    anchor_selector: str
    position: str = "after"

@api_router.get("/live-blocks")
async def list_live_blocks(path: str = None):
    q = {"path": path} if path else {}
    return await db.live_blocks.find(q, {"_id": 0}).sort("created_at", 1).to_list(500)

@api_router.post("/live-blocks")
async def create_live_block(body: BlockInput, admin: dict = Depends(get_current_admin)):
    if not body.source_selector.strip() or not body.anchor_selector.strip():
        raise HTTPException(status_code=400, detail="source and anchor selectors are required")
    doc = {"id": str(uuid.uuid4()), "path": body.path or "/", "source_selector": body.source_selector,
           "anchor_selector": body.anchor_selector, "position": body.position if body.position in ("after", "before") else "after",
           "created_at": datetime.now(timezone.utc).isoformat()}
    await db.live_blocks.insert_one(dict(doc))
    doc.pop("_id", None)
    return doc

@api_router.patch("/live-blocks/{block_id}")
async def update_live_block(block_id: str, body: BlockPatch, admin: dict = Depends(get_current_admin)):
    res = await db.live_blocks.update_one({"id": block_id}, {"$set": {
        "anchor_selector": body.anchor_selector,
        "position": body.position if body.position in ("after", "before") else "after"}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return await db.live_blocks.find_one({"id": block_id}, {"_id": 0})

@api_router.delete("/live-blocks/{block_id}")
async def delete_live_block(block_id: str, admin: dict = Depends(get_current_admin)):
    await db.live_blocks.delete_one({"id": block_id})
    await db.live_edits.delete_many({"selector": {"$regex": f'le-block\\[data-le-block="{block_id}"\\]'}})
    return {"deleted": True}


@api_router.get("/custom-css", response_model=CustomCssPublic)
async def get_custom_css():
    raw = await db.site.find_one({"key": "custom_css"})
    document = CustomCssDocument.from_mongo(raw) if raw else CustomCssDocument()
    return CustomCssPublic.model_validate(document.model_dump())

@api_router.post("/custom-css/validate")
async def preview_custom_css(body: CustomCssInput, admin: dict = Depends(get_current_admin)):
    validate_custom_css(body.css)
    return {"valid": True}

@api_router.put("/custom-css", response_model=CustomCssPublic)
async def save_custom_css(body: CustomCssInput, admin: dict = Depends(get_current_admin)):
    validate_custom_css(body.css)
    document = CustomCssDocument(css=body.css, updated_at=datetime.now(timezone.utc))
    await db.site.update_one({"key": "custom_css"}, {"$set": document.to_mongo()}, upsert=True)
    return CustomCssPublic.model_validate(document.model_dump())

@api_router.get("/theme", response_model=ThemeSettings)
async def get_theme():
    raw = await db.site.find_one({"key": "theme"})
    document = ThemeDocument.from_mongo(raw) if raw else ThemeDocument()
    if raw and "typographyPublished" not in raw:
        document.typographyPublished = document.typography != ThemeSettings().typography
    return ThemeSettings.model_validate(document.model_dump())

@api_router.put("/theme", response_model=ThemeSettings)
async def update_theme(body: ThemeSettings, admin: dict = Depends(get_current_admin)):
    patch = body.model_dump(exclude_unset=True)
    updates = {}
    for key, value in patch.items():
        if key == "typography":
            for role, settings in value.items():
                for field, setting in settings.items():
                    updates[f"typography.{role}.{field}"] = setting
        else:
            updates[key] = value
    if patch.get("typography") and "typographyPublished" not in patch:
        updates["typographyPublished"] = True
    if updates:
        await db.site.update_one({"key": "theme"}, {"$set": updates}, upsert=True)
    return await get_theme()

# ---- Named typography snapshots (saving a preset never publishes a theme) ----
@api_router.get('/typography-presets', response_model=list[TypographyPresetPublic])
async def list_typography_presets(admin: dict = Depends(get_current_admin)):
    return [TypographyPresetDocument.from_mongo(doc) async for doc in db.typography_presets.find().sort('created_at', -1)]

@api_router.post('/typography-presets', response_model=TypographyPresetPublic, status_code=201)
async def create_typography_preset(body: TypographyPresetCreate, admin: dict = Depends(get_current_admin)):
    document = TypographyPresetDocument(**body.model_dump(), name_key=body.name.casefold())
    try:
        result = await db.typography_presets.insert_one(document.to_mongo())
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail='A preset with this name already exists.')
    document.id = str(result.inserted_id)
    return document

@api_router.patch('/typography-presets/{preset_id}', response_model=TypographyPresetPublic)
async def rename_typography_preset(preset_id: str, body: TypographyPresetRename, admin: dict = Depends(get_current_admin)):
    raw = await db.typography_presets.find_one({'_id': ObjectId(preset_id)}) if ObjectId.is_valid(preset_id) else None
    if not raw:
        raise HTTPException(status_code=404, detail='Preset not found.')
    document = TypographyPresetDocument.from_mongo(raw)
    document.name = body.name
    document.name_key = body.name.casefold()
    try:
        await db.typography_presets.replace_one({'_id': ObjectId(preset_id)}, document.to_mongo())
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail='A preset with this name already exists.')
    return document

@api_router.delete('/typography-presets/{preset_id}')
async def delete_typography_preset(preset_id: str, admin: dict = Depends(get_current_admin)):
    if not ObjectId.is_valid(preset_id):
        raise HTTPException(status_code=404, detail='Preset not found.')
    result = await db.typography_presets.delete_one({'_id': ObjectId(preset_id)})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail='Preset not found.')
    return {'deleted': True}

# ---- Admin mode switches (live editor / review mode) + bulk cleanup ----
DEFAULT_MODES = {"editor_enabled": True, "review_enabled": True}

@api_router.get("/modes")
async def get_modes():
    doc = await db.settings.find_one({"key": "modes"}, {"_id": 0, "key": 0})
    return {**DEFAULT_MODES, **(doc or {})}

@api_router.put("/modes")
async def update_modes(body: dict, admin: dict = Depends(get_current_admin)):
    update = {k: bool(body[k]) for k in DEFAULT_MODES if k in body}
    if update:
        await db.settings.update_one({"key": "modes"}, {"$set": update}, upsert=True)
    return await get_modes()

@api_router.delete("/feedback")
async def delete_all_feedback(page: str = None, admin: dict = Depends(get_current_admin)):
    res = await db.feedback.delete_many({"page": page} if page else {})
    return {"deleted": res.deleted_count}

@api_router.delete("/live-blocks")
async def delete_all_live_blocks(admin: dict = Depends(get_current_admin)):
    res = await db.live_blocks.delete_many({})
    await db.live_edits.delete_many({"selector": {"$regex": "le-block\\["}})
    return {"deleted": res.deleted_count}

@api_router.get("/modes/stats")
async def modes_stats(admin: dict = Depends(get_current_admin)):
    return {
        "live_edits": await db.live_edits.count_documents({}),
        "live_blocks": await db.live_blocks.count_documents({}),
        "feedback": await db.feedback.count_documents({}),
    }

app.include_router(api_router)
app.include_router(create_analytics_router(db, get_current_admin))
app.include_router(create_migration_router(db, get_current_admin, put_object, get_object))

@app.middleware("http")
async def refresh_styled_html_on_publish(request: Request, call_next):
    response = await call_next(request)
    if response.status_code < 400 and styled_refresh.is_publish(request.method, request.url.path):
        styled_refresh.schedule(_styled_build_dir(), _styled_api_origin())
    return response


app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=[o.strip().rstrip('/') for o in os.environ['CORS_ORIGINS'].split(',') if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Seeding ----
SEED_BLOGS = [
    {"published": False, "draft_state_revision": "placeholder-draft-v1", "category": "SECURITY", "catColor": "#cfe8d4", "title": "The real cost of a ransomware attack", "excerpt": "It is not just the ransom. Downtime and lost trust hurt more.", "author": "James O'Connell", "date": "18 Oct 2023", "read": "6 min read", "image": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxjeWJlcnNlY3VyaXR5fGVufDB8fHxibHVlfDE3ODg4OTU3Mzl8MA&ixlib=rb-4.1.0&q=85"},
    {"published": False, "draft_state_revision": "placeholder-draft-v1", "category": "CLOUD", "catColor": "#c8d2de", "title": "Moving to the cloud without the chaos", "excerpt": "A simple plan for a migration that does not break your business.", "author": "Elena Rodriguez", "date": "18 Oct 2023", "read": "4 min read", "image": "https://images.pexels.com/photos/17489163/pexels-photo-17489163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    {"published": False, "draft_state_revision": "placeholder-draft-v1", "category": "AUTOMATION", "catColor": "#fcd1a5", "title": "Automate the boring IT tasks first", "excerpt": "Free up your team by letting machines handle the routine work.", "author": "James O'Connell", "date": "02 Nov 2023", "read": "6 min read", "image": "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwzfHxyb2JvdGljcyUyMGF1dG9tYXRpb258ZW58MHx8fHwxNzg4ODk1NzM5fDA&ixlib=rb-4.1.0&q=85"},
]
SEED_TESTIMONIALS = [
    {"quote": "Intrinsic feels like an extension of our business. Their team understands our environment, responds quickly, and helps us stay ahead of problems before they impact operations.", "role": "Executive Director, Nonprofit Organization", "since": "ITG Client since 2019"},
    {"quote": "We're a small team with big compliance requirements. Intrinsic understands that and never makes us feel like we're too small to matter. They treat our data with the same care as our clients.", "role": "Executive Director, Social Services Nonprofit", "since": "ITG Client since 2018"},
    {"quote": "We've worked with larger MSPs before. The difference with Intrinsic is that we're never a ticket number. We have a relationship. And in financial services, relationships matter.", "role": "Chief Operating Officer, Investment Advisory Firm", "since": "ITG Client since 2020"},
    {"quote": "We're not a technology company — we're a construction company. We need IT that works in the background and doesn't slow us down. That's exactly what Intrinsic delivers.", "role": "President, Construction Firm", "since": "ITG Client since 2023"},
]
SEED_CASE_STUDIES = [
    NONPROFIT_CASE_STUDY,
    PROFESSIONAL_SERVICES_CASE_STUDY,
    COMMUNICATIONS_CASE_STUDY,
    MANUFACTURING_CASE_STUDY,
    LEGAL_CASE_STUDY,
]

SEED_JOBS = [
    {
        "slug": "security-operations-analyst",
        "title": "Security Operations Analyst",
        "category": "Cybersecurity",
        "type": "Full Time",
        "location": "Remote (US)",
        "overview": "We're looking for a Security Operations Analyst to join our SOC team. You'll monitor client environments in real time, investigate alerts, and drive incidents to resolution while keeping communication clear and calm.",
        "responsibilities": [
            "Monitor SIEM and EDR tooling for threats across client environments 24/7",
            "Triage, investigate, and escalate security alerts within SLA",
            "Lead containment and remediation during active incidents",
            "Tune detection rules to reduce noise and improve signal",
            "Document findings and produce clear incident reports for clients",
            "Collaborate with engineering teams on hardening and response playbooks"
        ],
        "requirements": [
            "2-3 years in a SOC, incident response, or security analyst role",
            "Hands-on experience with SIEM/EDR platforms (e.g. Sentinel, CrowdStrike)",
            "Solid understanding of MITRE ATT&CK and common attack patterns",
            "Strong written and verbal communication under pressure",
            "Ability to work rotating on-call shifts"
        ],
        "preferred": [
            "Security certifications (Security+, GCIH, GCIA)",
            "Scripting with PowerShell or Python",
            "MSP experience"
        ],
        "published": True
    },
    {
        "slug": "cloud-solutions-engineer",
        "title": "Cloud Solutions Engineer",
        "category": "Cloud",
        "type": "Full Time",
        "location": "Hybrid — Boston, MA",
        "overview": "Join our Cloud practice to design, migrate, and manage resilient Azure environments for clients across regulated industries.",
        "responsibilities": [
            "Design and deploy secure, scalable Azure infrastructure",
            "Plan and execute cloud migrations with zero-downtime targets",
            "Build infrastructure-as-code and automation pipelines",
            "Implement backup, DR, and business-continuity solutions",
            "Advise clients on cloud strategy and cost optimization"
        ],
        "requirements": [
            "3+ years designing and operating cloud infrastructure (Azure preferred)",
            "Experience with IaC (Bicep/Terraform) and CI/CD",
            "Strong networking and identity fundamentals",
            "Excellent client-facing communication"
        ],
        "preferred": [
            "Azure certifications (AZ-104, AZ-305)",
            "Microsoft 365 tenant management",
            "Experience in finance or healthcare"
        ],
        "published": True
    },
    {
        "slug": "it-support-level-2",
        "title": "IT Support — Level 2",
        "category": "Managed IT",
        "type": "Full Time",
        "location": "New York, NY",
        "overview": "We are seeking a Level 2 Engineer to join our Service Desk team. You'll provide escalated support to our customers while maintaining excellent communication and efficient ticket tracking.",
        "responsibilities": [
            "Remotely troubleshoot hardware and software (macOS, Windows, M365, Google Workspace)",
            "Act as a point of escalation for customer interactions",
            "Hit a 10-minute SLA for initial response on each case",
            "Perform post-resolution follow-ups and maintain documentation",
            "Coordinate with cross-functional teams to resolve issues"
        ],
        "requirements": [
            "2-3 years of relevant technical experience",
            "Experience with Mac and PC devices",
            "Proficient in Microsoft 365 and Google Workspace",
            "Network troubleshooting and some server administration",
            "Exceptional communication and works well under pressure"
        ],
        "preferred": [
            "Previous MSP experience",
            "Okta / SSO",
            "Azure AD, Active Directory",
            "CCNA, RMM tools"
        ],
        "published": True
    },
    {
        "slug": "it-project-manager",
        "title": "IT Project Manager",
        "category": "Managed IT",
        "type": "Full Time",
        "location": "Hybrid — New York, NY",
        "overview": "Own the delivery of IT projects end-to-end — from migrations and rollouts to security initiatives — keeping scope, timeline, and clients aligned.",
        "responsibilities": [
            "Plan, schedule, and deliver client IT projects on time and budget",
            "Coordinate engineers, vendors, and client stakeholders",
            "Maintain clear project documentation and status reporting",
            "Identify and mitigate risks proactively",
            "Run kickoff, checkpoint, and closeout meetings"
        ],
        "requirements": [
            "3+ years managing technical/IT projects",
            "Strong organizational and stakeholder-management skills",
            "Familiarity with MSP delivery and IT operations",
            "Excellent written and verbal communication"
        ],
        "preferred": [
            "PMP or CAPM",
            "Experience with PSA tools",
            "Change-management background"
        ],
        "published": True
    },
    {
        "slug": "sales-representative",
        "title": "Sales Representative",
        "category": "Client Services",
        "type": "Full Time",
        "location": "Remote (US)",
        "overview": "Help organizations discover how managed IT and security can transform their operations. You'll build relationships and guide prospects from first conversation to partnership.",
        "responsibilities": [
            "Prospect and qualify new business opportunities",
            "Run discovery calls and translate needs into solutions",
            "Partner with engineering to scope proposals",
            "Manage the pipeline and hit revenue targets",
            "Represent Intrinsic with professionalism and integrity"
        ],
        "requirements": [
            "2+ years in B2B sales, ideally technology or MSP",
            "Consultative, relationship-first selling style",
            "Strong communication and negotiation skills",
            "Self-motivated and organized"
        ],
        "preferred": [
            "Experience selling managed services or cybersecurity",
            "CRM proficiency",
            "Existing network in target industries"
        ],
        "published": True
    }
]

SEED_BRIEFS = [
    {
        "title": "Managed IT Services",
        "service": "Managed IT",
        "subtitle": "A structured approach to managing business technology.",
        "summary": "How Intrinsic operates, maintains, secures, and plans the interconnected systems your business runs on — from day-to-day support through long-term technology planning.",
        "points": [
            "Service & user support, NOC, and infrastructure management",
            "Cybersecurity, Microsoft 365, backup and continuity coverage",
            "Managed IT vs Co-Managed IT engagement models",
        ],
        "pages": "2 pages",
        "cover": "/images/brief-managed-it-cover.webp",
        "file": "/briefs/intrinsic-managed-it-services-service-brief.pdf",
        "available": True,
    },
    {
        "title": "Microsoft 365",
        "service": "Microsoft 365",
        "subtitle": "Make more of the platform you already have.",
        "summary": "Administration, identity, security, governance, licensing, and user support brought together into one managed Microsoft 365 service.",
        "points": [
            "Tenant administration, licensing, and platform changes",
            "Entra ID identity, authentication, and access policies",
            "Security policies, data protection, retention, and oversight",
        ],
        "pages": "2 pages",
        "cover": "/images/brief-m365-cover.webp",
        "file": "/briefs/intrinsic-microsoft-365-service-brief.pdf",
        "available": True,
    },
    {
        "title": "vCIO — Strategic IT Leadership",
        "service": "Strategic IT",
        "subtitle": "Technology leadership for the decisions ahead.",
        "summary": "Ongoing strategic leadership that establishes priorities, plans investment, and guides informed technology decisions in business context.",
        "points": [
            "A broader view of each technology decision",
            "Turning operational information into priorities",
            "Roadmaps, budgets, and leadership reviews",
        ],
        "pages": "2 pages",
        "cover": "/images/brief-vcio-cover.webp",
        "file": "/briefs/intrinsic-vcio-service-brief.pdf",
        "available": True,
    },
    {
        "title": "Cybersecurity",
        "service": "Cybersecurity",
        "subtitle": "Coordinated security management across your environment.",
        "summary": "Protection, monitoring, response, and governance brought together across users, devices, networks, cloud platforms, applications, and data.",
        "points": [
            "Six interconnected areas of security management",
            "From security activity to managed risk",
            "Governance aligned to NIST CSF, HIPAA, NYDFS, and SOC 2",
        ],
        "pages": "Coming soon",
        "cover": "",
        "file": "",
        "available": False,
    },
]

BAKED_HIDDEN_EDIT_IDS = ["5ba08ca5-3724-45e7-92da-e07a72059986", "fd7d4105-510c-483a-b987-00ca8909bf08", "1a00e3cb-b988-49a1-8ee4-5ac86c145abb", "55df5c1e-6762-44f0-9856-93043af12c1b", "23cd4146-f2a8-4123-aa19-7a708a94d89a", "5314ee25-3f1b-4780-a6cd-9d27048765c9", "b557dca9-a363-495f-b21b-d200653e3b0a", "e18b5d62-f2b4-4c61-ae5c-63fdbb40faff", "6c76e6df-bb1f-4f38-80fd-55b3b3cc8e54", "5473fc82-39f5-45fc-907f-6ba5fda6eb52", "bcdd2ada-2f67-412b-81d4-f2d58600d06f", "45e9dc6b-2957-4f8e-9be5-dd4dda64746f", "3904aa97-7d03-4849-9cd1-e52a4a106c12", "e1ce9503-8859-4a44-a7cb-32d44c94ca0b", "a684d1d6-df5b-4701-ac86-7cd018cffa67", "6396d3ad-ef7a-45bc-b7dc-7089ffa14069", "b7ad91de-2c34-4de1-b9aa-a3a231b07899", "d7e9a84d-1f0d-4c7f-ad7e-d2e27a8af708", "0781afef-5a7c-44b1-9d2e-e474cc154d8e", "1904e597-ee7a-4457-8358-2428f9df4f9b", "7c1ad5d6-2778-4aea-a347-f4a8e6e7c680", "85aea1c6-a234-45a1-a02e-cddf7d9f664b", "6c3c4009-6910-4dc8-9a65-1f3a1d09f42d", "1e32ca50-3054-4839-8cf0-ff29523d65a0", "0ebc3d74-12e2-4847-8389-1f15163921b2", "93961b85-a521-41c7-bf85-654dfb763829", "0c59164e-7bd2-4b98-afd8-9b57740d035a", "91de3513-1814-4711-acb3-9d3fd4ef0c81"]

SEED_EXPORT_PATH = ROOT_DIR / "seed_data" / "site_export.json"
# Collections NOT shipped with the code: admin users come from env; analytics/leads start fresh.
SEED_EXPORT_SKIP = {"users", "page_views", "inquiries", "typography_presets"}


async def seed_from_export() -> bool:
    """On a fresh DB, restore the owner's real content (and uploaded file binaries)
    from the baked-in export bundle so it ships with the code and survives deploys."""
    if not SEED_EXPORT_PATH.exists():
        return False
    try:
        bundle = json_util.loads(SEED_EXPORT_PATH.read_text(encoding="utf-8"))
    except Exception as e:
        logger.error(f"seed_from_export: could not parse bundle: {e}")
        return False
    collections = bundle.get("collections") or {}
    inserted = False
    for name, docs in collections.items():
        if name.startswith("system.") or name in SEED_EXPORT_SKIP or not docs:
            continue
        if await db[name].count_documents({}) == 0:
            await db[name].insert_many([dict(d) for d in docs])
            inserted = True
    for path, info in (bundle.get("files") or {}).items():
        try:
            data = base64.b64decode(info["data"])
            await asyncio.to_thread(put_object, path, data, info.get("content_type") or "application/octet-stream")
        except Exception as e:
            logger.error(f"seed_from_export: file {path} restore failed: {e}")
    return inserted


async def seed():
    admin_email = os.environ['ADMIN_EMAIL'].lower()
    admin_pw = os.environ['ADMIN_PASSWORD']
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({"id": str(uuid.uuid4()), "email": admin_email, "password_hash": hash_password(admin_pw), "name": "Admin", "role": "admin", "created_at": datetime.now(timezone.utc).isoformat()})
    # Note: password is NOT reset on restart so admin-initiated password changes persist.

    # Fresh-DB only: ship the owner's real content + uploaded files from the baked-in
    # export so a new deploy restores everything automatically (no manual re-import).
    # On any DB that already has content (admin edits, prior deploy, today's import) we
    # do nothing further here — protecting real data from the demo-seed overwrites below.
    is_fresh = (await db.blogs.count_documents({}) == 0) and (await db.case_studies.count_documents({}) == 0)
    if not is_fresh:
        return
    if await seed_from_export():
        logger.info("Seeded content from baked-in site export")
        return

    async def seed_coll(c, items):
        if await c.count_documents({}) == 0:
            for i, it in enumerate(items):
                doc = dict(it); doc["id"] = str(uuid.uuid4()); doc["order"] = i
                doc["created_at"] = datetime.now(timezone.utc).isoformat()
                await c.insert_one(doc)
    await seed_coll(db.blogs, SEED_BLOGS)
    await db.blogs.update_many(
        {"title": {"$in": [article["title"] for article in SEED_BLOGS]}, "draft_state_revision": {"$ne": "placeholder-draft-v1"}},
        {"$set": {"published": False, "draft_state_revision": "placeholder-draft-v1"}},
    )
    await seed_coll(db.testimonials, SEED_TESTIMONIALS)
    await seed_coll(db.case_studies, SEED_CASE_STUDIES)
    # Apply this content revision once without overwriting later admin edits.
    await db.case_studies.update_one(
        {"tag": {"$regex": "^Nonprofit"}, "content_revision": {"$ne": NONPROFIT_CASE_STUDY["content_revision"]}},
        {"$set": NONPROFIT_CASE_STUDY},
    )
    await db.case_studies.update_one(
        {
            "title": {"$in": [PROFESSIONAL_SERVICES_CASE_STUDY["title"], *PROFESSIONAL_SERVICES_CASE_STUDY["previous_titles"]]},
            "content_revision": {"$ne": PROFESSIONAL_SERVICES_CASE_STUDY["content_revision"]},
        },
        {"$set": PROFESSIONAL_SERVICES_CASE_STUDY},
    )
    for case_study in (COMMUNICATIONS_CASE_STUDY, MANUFACTURING_CASE_STUDY, LEGAL_CASE_STUDY):
        await db.case_studies.update_one(
            {
                "title": {"$in": [case_study["title"], *case_study["previous_titles"]]},
                "content_revision": {"$ne": case_study["content_revision"]},
            },
            {"$set": case_study},
        )
    # One-time cleanup: hide-edits whose elements were removed from the page code.
    await db.live_edits.delete_many({"id": {"$in": BAKED_HIDDEN_EDIT_IDS}})
    await seed_coll(db.jobs, SEED_JOBS)
    await seed_coll(db.service_briefs, SEED_BRIEFS)
    if not await db.site.find_one({"key": "content"}):
        await db.site.insert_one({"key": "content", **DEFAULT_SITE})

@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.typography_presets.create_index('name_key', unique=True)
    await initialize_analytics(db)
    await seed()
    if STORAGE_BACKEND == "local":
        LOCAL_STORAGE_DIR.mkdir(parents=True, exist_ok=True)
        logger.info(f"Storage: local disk at {LOCAL_STORAGE_DIR}")
        return
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
