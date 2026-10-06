"""
Server-side rendering for public marketing pages.

Renders complete, page-specific HTML (head metadata + JSON-LD + visible body
content) at request time from the live database, so crawlers and link-preview
bots read real content without JavaScript, and admin edits are reflected
immediately (no stale static copy). The React app still loads from the same
HTML and takes over #root for interactivity.

Served via FastAPI (see /api/ssr in server.py); nginx proxies HTML page
requests to it on the VPS. Static assets and /api are served/proxied normally.
"""
from __future__ import annotations
import html as _html
import re
from pathlib import Path

PREFERRED_BASE = "https://intrinsicamerica.com"

# ---- Business facts (single source of truth, mirrors SEO settings) ----
ORG = {
    "name": "Intrinsic Technology",
    "legal": "Intrinsic Technology Group, Inc.",
    "phone": "212.643.4808",
    "tel": "+1-212-643-4808",
    "email": "consulting@intrinsicamerica.com",
    "linkedin": "https://www.linkedin.com/company/intrinsic-tech-group",
}
OFFICES = [
    ("New York (HQ)", "14 Wall Street, Suite 5C", "New York", "NY", "10005"),
    ("New Jersey", "46–48 Camden Avenue", "Paterson", "NJ", "07501"),
    ("Boston", "75 State Street, Suite 100", "Boston", "MA", "02109"),
    ("Washington, D.C.", "600 Massachusetts Ave NW, Suite 250", "Washington", "DC", "20001"),
]

esc = lambda s: _html.escape(str(s or ""), quote=True)
def titlecase(seg: str) -> str:
    return re.sub(r"\b\w", lambda m: m.group().upper(), seg.replace("-", " "))

# ---- Route registry: label/title/description + kind for every static page ----
# (kind drives schema + body template). Dynamic detail pages handled separately.
ROUTES = {
    "/": {"label": "Home", "kind": "home", "title": "Managed IT, Cybersecurity & Cloud Services", "description": "Intrinsic Technology delivers Managed IT, cybersecurity, and cloud services for NYC-area businesses—proactive monitoring, infrastructure management, and strategic guidance."},
    "/about": {"label": "About Us", "kind": "page", "title": "About Intrinsic Technology", "description": "Intrinsic Technology is a women-owned and minority-owned managed service provider in New York City delivering accountable, coordinated technology services."},
    "/resources": {"label": "Resources", "kind": "page", "title": "Resources, Insights & Case Studies", "description": "Practical insights, service briefs, and client case studies from Intrinsic Technology to help you make better technology decisions."},
    "/careers": {"label": "Careers", "kind": "careers", "title": "Careers at Intrinsic Technology", "description": "Explore current openings at Intrinsic Technology—a New York City MSP focused on security, reliability, and real client outcomes."},
    "/contact": {"label": "Contact", "kind": "contact", "title": "Talk to an Expert", "description": "Contact Intrinsic Technology to discuss managed IT, cybersecurity, cloud, and AI services. Call 212.643.4808 or email consulting@intrinsicamerica.com."},
    "/privacy-policy": {"label": "Privacy Policy", "kind": "page", "title": "Privacy Policy", "description": "How Intrinsic Technology collects, uses, and protects your information."},
    "/terms-of-service": {"label": "Terms of Service", "kind": "page", "title": "Terms of Service", "description": "The terms governing use of the Intrinsic Technology website."},
    "/security-risk-assessment": {"label": "Security Risk Assessment", "kind": "service", "title": "Security Risk Assessment", "description": "Identify gaps and prioritize remediation with a structured security risk assessment from Intrinsic Technology."},
    "/services/ai": {"label": "AI Services", "kind": "service", "title": "AI Services & Automation", "description": "Adopt AI responsibly with readiness assessments, managed AI, and governance aligned to your business."},
    "/services/ai-readiness-assessment": {"label": "AI Readiness Assessment", "kind": "service", "title": "AI Readiness Assessment", "description": "Assess your AI readiness across business, data, security, governance, and organizational preparedness."},
    "/services/managed-ai": {"label": "Managed AI", "kind": "service", "title": "Managed AI", "description": "Ongoing management of AI tools, access, and governance so your organization benefits from AI safely."},
    "/services/ai-governance-compliance": {"label": "AI Governance & Compliance", "kind": "service", "title": "AI Governance & Compliance", "description": "Establish policy, oversight, and controls for responsible AI adoption."},
    "/services/cybersecurity": {"label": "Cybersecurity", "kind": "service", "title": "Cybersecurity Services", "description": "Coordinated security management across users, devices, networks, cloud, applications, and data."},
    "/services/threat-detection-response": {"label": "Threat Detection & Response", "kind": "service", "title": "Threat Detection & Response", "description": "Continuous monitoring, detection, and rapid response to security threats."},
    "/services/identity-endpoint-security": {"label": "Identity & Endpoint Security", "kind": "service", "title": "User, Identity & Endpoint Security", "description": "Protect identities and endpoints with layered controls and patch compliance."},
    "/services/network-perimeter-security": {"label": "Network & Perimeter Security", "kind": "service", "title": "Network & Perimeter Security", "description": "Secure your network edge with firewalls, segmentation, and continuous monitoring."},
    "/services/security-monitoring-siem": {"label": "Security Monitoring & SIEM", "kind": "service", "title": "Security Monitoring & Analytics (SIEM)", "description": "Centralized logging, correlation, and analytics for faster threat insight."},
    "/services/security-assessments": {"label": "Security Assessments", "kind": "service", "title": "Security Assessments & Vulnerability Management", "description": "Regular assessments and vulnerability management to reduce risk."},
    "/services/security-governance-compliance": {"label": "Security Governance & Compliance", "kind": "service", "title": "Security Governance & Compliance", "description": "Security governance aligned to NIST CSF, HIPAA, NYDFS, and SOC 2 frameworks."},
    "/services/networking": {"label": "Networking", "kind": "service", "title": "Networking Services", "description": "Design, deployment, and management of reliable, secure business networks."},
    "/services/cloud": {"label": "Cloud", "kind": "service", "title": "Cloud Services", "description": "Cloud infrastructure, migration, and management on Microsoft Azure and Microsoft 365."},
    "/services/cloud-infrastructure-migration": {"label": "Cloud Infrastructure & Migration", "kind": "service", "title": "Cloud Infrastructure & Migration", "description": "Migrate and modernize on Microsoft Azure and Microsoft 365 without the chaos."},
    "/services/backup-disaster-recovery": {"label": "Backup & Disaster Recovery", "kind": "service", "title": "Backup & Disaster Recovery", "description": "Protect your data and operations with tested backup and disaster recovery."},
    "/services/managed-it": {"label": "Managed IT", "kind": "service", "title": "Managed IT Services", "description": "Complete oversight of your IT environment with proactive support, monitoring, and management."},
    "/services/co-managed-it": {"label": "Co-Managed IT", "kind": "service", "title": "Co-Managed IT", "description": "Extend your internal IT team with coordinated managed services."},
    "/services/remote-monitoring-management": {"label": "Remote Monitoring & Management", "kind": "service", "title": "Remote Monitoring & Management", "description": "24/7 monitoring and management of devices and systems."},
    "/services/microsoft-365": {"label": "Microsoft 365", "kind": "service", "title": "Microsoft 365 Services", "description": "Deploy, secure, and manage Microsoft 365 for productivity and compliance."},
    "/services/vcio-vciso": {"label": "vCIO & vCISO", "kind": "service", "title": "vCIO & vCISO", "description": "Strategic technology and security leadership that guides priorities and investment."},
    "/industries": {"label": "Industries", "kind": "page", "title": "Industries We Serve", "description": "Technology services tailored to healthcare, financial services, legal, construction, nonprofit, and professional services."},
    "/industries/construction": {"label": "Construction", "kind": "industry", "title": "IT for Construction", "description": "Technology that extends to the field for construction and manufacturing firms."},
    "/industries/professional-services": {"label": "Professional Services", "kind": "industry", "title": "IT for Professional Services", "description": "Secure, reliable technology for professional services firms."},
    "/industries/financial-services": {"label": "Financial Services", "kind": "industry", "title": "IT for Financial Services", "description": "Compliance-ready managed IT and security for financial services firms."},
    "/industries/non-profit": {"label": "Non-Profit", "kind": "industry", "title": "IT for Non-Profits", "description": "Affordable, dependable technology for nonprofit organizations."},
    "/industries/healthcare": {"label": "Healthcare", "kind": "industry", "title": "IT for Healthcare", "description": "HIPAA-aligned managed IT and security for healthcare providers."},
    "/service-areas/new-york": {"label": "New York IT Services", "kind": "location", "title": "Managed IT Services in New York City", "description": "On-site and remote managed IT, cybersecurity, and cloud services for New York City businesses, from our 14 Wall Street headquarters."},
    "/service-areas/new-jersey": {"label": "New Jersey IT Services", "kind": "location", "title": "Managed IT Services in New Jersey", "description": "Managed IT, cybersecurity, and cloud services for New Jersey businesses, supported from our Paterson, NJ office."},
}

# Extra intro paragraphs + "what it does / who it's for" for substantive pages.
INTRO = {
    "/services/managed-it": ["Managed IT gives your organization a single, accountable partner for the day-to-day operation of your technology. We monitor your systems around the clock, resolve issues through a responsive help desk, keep devices patched and secure, and plan improvements so technology supports your goals.", "It's for small and midsize organizations that want dependable IT without building a large internal team—especially those in regulated industries that need coordinated security and documentation."],
    "/services/cybersecurity": ["Our cybersecurity services coordinate protection across users, devices, networks, cloud, applications, and data, rather than bolting on disconnected tools. We combine monitoring, technical controls, and governance to reduce risk and improve visibility.", "It's for organizations that need to strengthen their security posture and meet frameworks such as HIPAA, SOC 2, NIST CSF, and NYDFS."],
    "/services/cloud": ["Our cloud services cover infrastructure, migration, and ongoing management on Microsoft Azure and Microsoft 365, built for resilience and security. We help you move workloads, modernize, and control cost without disrupting operations.", "It's for teams that want the benefits of the cloud with a partner handling architecture, security, and management."],
    "/services/ai": ["We help you adopt AI responsibly with readiness assessments, managed AI, and governance aligned to your business and compliance obligations. We focus on practical, safe adoption rather than hype.", "It's for organizations exploring AI that want measurable value with appropriate oversight and data protection."],
    "/services/vcio-vciso": ["Our vCIO and vCISO services provide strategic technology and security leadership on a fractional basis—setting priorities, planning budgets, and guiding investment and risk decisions.", "It's for organizations that need executive-level technology and security direction without a full-time hire."],
    "/services/networking": ["We design, deploy, and manage reliable, secure business networks—wired, wireless, and SD-WAN—so your sites and people stay connected.", "It's for multi-site and growing organizations that depend on dependable connectivity."],
    "/services/backup-disaster-recovery": ["We protect your data and operations with tested backup and disaster recovery, so you can recover quickly from hardware failure, ransomware, or human error.", "It's for any organization that cannot afford prolonged downtime or data loss."],
    "/industries/healthcare": ["We provide HIPAA-aligned managed IT and security for healthcare providers—supporting electronic health record systems, secure messaging, and audit-ready documentation.", "We support medical practices, clinics, and health organizations that must protect patient data while keeping clinical systems available."],
    "/industries/financial-services": ["We provide compliance-ready managed IT and security for financial services firms, aligned to frameworks such as SOC 2 and NYDFS.", "We support advisors, funds, and finance teams that handle sensitive data and face regulatory scrutiny."],
    "/industries/professional-services": ["We deliver secure, reliable technology for legal and professional services firms—protecting confidential client information and keeping billable teams productive.", "We support law firms, accounting practices, and consultancies."],
    "/industries/construction": ["We extend dependable technology to the field for construction and manufacturing—connecting job sites, mobile crews, and the back office.", "We support construction, manufacturing, and field-based organizations."],
    "/industries/non-profit": ["We provide affordable, dependable technology for nonprofit organizations, helping mission-driven teams do more with limited budgets.", "We support nonprofits that need secure, grant-ready, and cost-effective IT."],
    "/service-areas/new-york": ["Intrinsic Technology is headquartered at 14 Wall Street in Lower Manhattan and provides on-site and remote managed IT, cybersecurity, and cloud services across the five boroughs and the greater New York City metro.", "Our local presence means fast on-site response in Manhattan and the surrounding area, combined with 24/7 remote monitoring and a responsive help desk for New York businesses in healthcare, financial services, legal, and nonprofit sectors."],
    "/service-areas/new-jersey": ["From our office at 46–48 Camden Avenue in Paterson, Intrinsic Technology supports New Jersey businesses with managed IT, cybersecurity, and cloud services—on site where needed and remotely for day-to-day support.", "We serve organizations across northern New Jersey that want a responsive, security-focused technology partner close to home."],
    "/about": ["Intrinsic is a managed technology and cybersecurity partner providing ongoing management across IT infrastructure, cloud, security, users, and business continuity. We bring technical expertise, operational responsibility, and strategic direction together within one accountable technology relationship.", "Intrinsic Technology Group, Inc. is a proud women-owned and minority-owned business headquartered in New York City, serving healthcare, financial services, legal, construction, and nonprofit organizations."],
}

# Visible buyer FAQs for core service / industry / location pages (SSR + schema).
FAQS = {
    "/services/managed-it": [
        ("What's included in your managed IT services?", "Our managed IT includes 24/7 monitoring, a responsive help desk, patch and update management, endpoint security, asset and vendor coordination, and ongoing technology planning through a vCIO."),
        ("How quickly do you respond to issues?", "Response targets are defined in your service agreement and depend on severity; critical issues are prioritized. We report on performance against those targets—contact us for current SLA details."),
        ("Do you support our existing tools and vendors?", "Yes. We coordinate with your existing software and vendors and can act as the single point of contact for technology issues."),
        ("How does onboarding work?", "We start with a discovery and documentation phase to understand your environment, then stabilize monitoring, security, and support before planning improvements."),
    ],
    "/services/cybersecurity": [
        ("What does your cybersecurity service cover?", "We coordinate security across users, devices, networks, cloud, applications, and data—combining monitoring, technical controls, identity protection, and governance."),
        ("Can you help us meet HIPAA, SOC 2, or NYDFS requirements?", "We align security controls and documentation to frameworks including HIPAA, SOC 2, NIST CSF, and NYDFS. We support your compliance program; certification itself is issued by auditors, not by us."),
        ("Do you provide 24/7 monitoring and response?", "Yes. We provide continuous monitoring with detection and response; the exact scope and response targets are defined in your agreement."),
        ("Who is responsible for compliance—us or you?", "Compliance is a shared responsibility. We implement and document controls and advise on gaps; your organization owns policies, decisions, and regulatory obligations."),
    ],
    "/services/cloud": [
        ("Which cloud platforms do you support?", "We focus on Microsoft Azure and Microsoft 365, covering infrastructure, migration, security, and ongoing management."),
        ("Can you migrate us without downtime?", "We plan migrations to minimize disruption and, where feasible, achieve cutovers with little or no downtime; actual impact depends on your environment."),
        ("Do you manage cloud security and cost?", "Yes. We apply security baselines and monitor usage to help control cost, and we review configuration against best practices."),
    ],
    "/services/ai": [
        ("How do we adopt AI safely?", "We start with a readiness assessment covering business goals, data, security, and governance, then implement managed AI with appropriate controls."),
        ("Will our data be protected?", "We design AI adoption with data protection and access controls in mind and align usage to your security and compliance requirements."),
        ("Do we need AI governance?", "For most organizations, yes—clear policy and oversight reduce risk. We help establish practical governance proportional to your use of AI."),
    ],
    "/services/vcio-vciso": [
        ("What does a vCIO or vCISO do?", "A vCIO guides technology strategy, budgeting, and roadmap; a vCISO guides security strategy, risk, and compliance—both on a fractional, as-needed basis."),
        ("Is this a full-time commitment?", "No. Our vCIO/vCISO services are fractional and scaled to your needs, giving executive-level direction without a full-time hire."),
    ],
    "/industries/healthcare": [
        ("Do you support HIPAA compliance for healthcare?", "We align managed IT and security controls and documentation to HIPAA. We support your compliance program; we do not issue certifications."),
        ("Can you work with our EHR and clinical systems?", "Yes. We coordinate with your electronic health record and clinical systems and their vendors to keep them secure and available."),
    ],
    "/industries/financial-services": [
        ("Can you help with SOC 2 and NYDFS?", "We align controls and documentation to SOC 2 and NYDFS requirements and support your audit readiness."),
        ("How do you protect sensitive financial data?", "We apply layered security—identity protection, endpoint and network controls, monitoring, and governance—tailored to financial data sensitivity."),
    ],
    "/service-areas/new-york": [
        ("Do you provide on-site IT support in New York City?", "Yes. From our 14 Wall Street headquarters we provide on-site support across Manhattan and the greater NYC metro, alongside 24/7 remote support."),
        ("Which New York industries do you serve?", "We support healthcare, financial services, legal and professional services, construction, and nonprofit organizations across New York City."),
    ],
    "/service-areas/new-jersey": [
        ("Do you support businesses in New Jersey?", "Yes. From our Paterson, NJ office we support New Jersey organizations with on-site and remote managed IT, cybersecurity, and cloud services."),
        ("Can you provide on-site visits in NJ?", "Yes, on-site visits are available across northern New Jersey, complemented by remote monitoring and help desk support."),
    ],
}

# Legacy URL -> current path (301). Trailing-slash variants handled in normalize().
REDIRECTS = {
    "/about-us": "/about",
    "/help-desk-support": "/services/managed-it",
    "/healthcare": "/industries/healthcare",
    "/terms-conditions": "/terms-of-service",
    "/contact-us": "/contact",
    "/jobs": "/careers",
    "/job-openings": "/careers",
    # Alias consolidation (choose canonical destinations)
    "/services/managed-support": "/services/managed-it",
    "/services/managed-it-services": "/services/managed-it",
    "/services/ai-automation": "/services/ai",
}
# Old individual job URLs: redirect to Careers only where a relevant role exists,
# otherwise return 410 (gone). Checked against live jobs at request time.
OLD_JOB_PATHS = [
    "/jobs/sales-representative", "/jobs/accounting-specialist",
    "/jobs/accounting-and-administrative-assistant", "/jobs/it-support-level-2",
    "/jobs/it-project-manager",
]

def normalize(path: str) -> str:
    path = (path or "/").split("?")[0].split("#")[0]
    if len(path) > 1 and path.endswith("/"):
        path = path.rstrip("/")
    return path or "/"

# ---- Head builders ---------------------------------------------------------
def _ld(obj) -> str:
    import json
    # data-ssr="1" marks injected nodes so a re-render can strip+replace them (idempotent).
    return f'<script type="application/ld+json" data-ssr="1">{json.dumps(obj, ensure_ascii=False)}</script>'

def breadcrumb_ld(path: str, base: str):
    parts = [p for p in path.split("/") if p]
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": base + "/"}]
    acc = ""
    for i, seg in enumerate(parts):
        acc += "/" + seg
        r = ROUTES.get(acc)
        items.append({"@type": "ListItem", "position": i + 2, "name": (r["label"] if r else titlecase(seg)), "item": base + acc})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}

def faq_ld(faqs):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}

# ---- Body builders ---------------------------------------------------------
def _nav_and_contact(base: str) -> str:
    links = [("/services/managed-it", "Managed IT"), ("/services/cybersecurity", "Cybersecurity"),
             ("/services/cloud", "Cloud"), ("/services/ai", "AI & Automation"),
             ("/services/vcio-vciso", "vCIO & vCISO"), ("/industries", "Industries"),
             ("/about", "About"), ("/resources", "Resources"), ("/contact", "Contact")]
    nav = "".join(f'<li><a href="{h}">{esc(t)}</a></li>' for h, t in links)
    offices = "".join(f"<li>{esc(label)}: {esc(street)}, {esc(city)}, {esc(region)} {esc(zc)}</li>" for label, street, city, region, zc in OFFICES)
    return (f'<nav aria-label="Primary"><ul>{nav}</ul></nav>'
            f'<section aria-label="Contact"><h2>Contact Intrinsic Technology</h2>'
            f'<p>Phone: <a href="tel:+12126434808">{esc(ORG["phone"])}</a> · '
            f'Email: <a href="mailto:{ORG["email"]}">{esc(ORG["email"])}</a></p>'
            f'<ul>{offices}</ul></section>')

def _faq_html(faqs) -> str:
    if not faqs:
        return ""
    items = "".join(f"<div><h3>{esc(q)}</h3><p>{esc(a)}</p></div>" for q, a in faqs)
    return f'<section aria-label="Frequently Asked Questions"><h2>Frequently Asked Questions</h2>{items}</section>'

def _crumbs_html(path: str) -> str:
    if path == "/":
        return ""
    parts = [p for p in path.split("/") if p]
    acc = ""
    out = ['<a href="/">Home</a>']
    for seg in parts:
        acc += "/" + seg
        r = ROUTES.get(acc)
        out.append(f'<a href="{acc}">{esc(r["label"] if r else titlecase(seg))}</a>')
    return f'<nav aria-label="Breadcrumb">{" / ".join(out)}</nav>'
