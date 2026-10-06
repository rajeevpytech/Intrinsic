"""Managed-Resend email delivery for website inquiry notifications.

Sends via Emergent's managed email proxy (no Resend account/key needed).
Recipient and body are built server-side only (never from caller markup).
"""
import os
import re
import ipaddress
import logging
import asyncio
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# Managed email proxy. CONSTANT (survives deployment) — never read from env.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Intrinsic Technology")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
# Fixed, server-side recipient for all website form submissions.
INQUIRY_NOTIFY_EMAIL = os.environ.get("INQUIRY_NOTIFY_EMAIL", "consulting@intrinsicamerica.com")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan(); scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def _send_email(*, to: str, subject: str, html: str, reply_to: str | None = None):
    _assert_safe_email(subject, html)
    if not EMAIL_KEY:
        raise RuntimeError("EMERGENT_EMAIL_KEY not configured")
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _row(label: str, value) -> str:
    return (f'<tr><td style="padding:6px 16px;font:600 13px Arial,sans-serif;color:#5c6b82;'
            f'white-space:nowrap;vertical-align:top">{escape(label)}</td>'
            f'<td style="padding:6px 16px;font:400 14px Arial,sans-serif;color:#1a1a2e">'
            f'{escape(str(value))}</td></tr>')


def _build_html(inquiry: dict) -> str:
    rows = [_row("Name", inquiry.get("name", "")), _row("Email", inquiry.get("email", ""))]
    if inquiry.get("company"):
        rows.append(_row("Company", inquiry["company"]))
    if inquiry.get("phone"):
        rows.append(_row("Phone", inquiry["phone"]))
    rows.append(_row("Type", inquiry.get("type", "contact")))
    details = inquiry.get("details") or {}
    if isinstance(details, dict):
        for k, v in details.items():
            rows.append(_row(str(k), v))
    rows.append(_row("Received", inquiry.get("created_at", "")))
    msg = escape(inquiry.get("message", "") or "").replace("\n", "<br>")
    msg_block = (f'<tr><td colspan="2" style="padding:14px 16px 0">'
                 f'<div style="font:600 13px Arial,sans-serif;color:#5c6b82;margin-bottom:6px">Message</div>'
                 f'<div style="font:400 14px/1.6 Arial,sans-serif;color:#1a1a2e">{msg}</div></td></tr>'
                 ) if inquiry.get("message") else ""
    return (
        '<table role="presentation" width="100%" style="background:#f3f7fd;padding:24px">'
        '<tr><td align="center"><table role="presentation" width="600" '
        'style="background:#ffffff;border:1px solid #d5deea;border-radius:8px;overflow:hidden">'
        '<tr><td style="background:#00388e;padding:18px 20px;font:700 16px Arial,sans-serif;color:#fff">'
        'New website inquiry</td></tr>'
        f'<tr><td style="padding:16px 4px"><table role="presentation" width="100%">{"".join(rows)}{msg_block}</table></td></tr>'
        f'<tr><td style="padding:14px 20px;border-top:1px solid #eef1f7;font:400 12px Arial,sans-serif;color:#8a94a6">'
        f'Sent by {escape(EMAIL_FROM_NAME)}. Manage this inquiry in the admin dashboard. '
        f'We never ask for your password or payment details by email.</td></tr>'
        '</table></td></tr></table>'
    )


async def notify_inquiry(inquiry: dict) -> bool:
    """Email a new inquiry to the fixed company recipient via managed Resend.
    Returns True if accepted for delivery, False otherwise (non-blocking)."""
    if not INQUIRY_NOTIFY_EMAIL:
        logger.info("No inquiry notify recipient configured; skipping")
        return False
    who = inquiry.get("name") or "website visitor"
    subject = f"New inquiry from {who}"
    try:
        email_id = await _send_email(to=INQUIRY_NOTIFY_EMAIL, subject=subject, html=_build_html(inquiry))
        logger.info(f"Inquiry notification sent to {INQUIRY_NOTIFY_EMAIL} (id={email_id})")
        return True
    except Exception as e:
        logger.error(f"Managed-email inquiry notification failed (non-blocking): {e}")
        return False
