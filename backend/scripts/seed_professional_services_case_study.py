import asyncio

INTRO = "A professional services organization needed to centralize client and donor relationship management while preserving the Microsoft 365 workflows its staff used every day. The new CRM had to connect securely with the existing identity, email, and calendar environment without introducing additional passwords or manual activity logging."

CHALLENGE = "\n".join([
    "Staff relied heavily on Outlook and were reluctant to move between disconnected platforms. Leadership needed a system that would automatically capture email and meeting activity, improve pipeline visibility, and support secure single sign-on.",
    "Monthly reporting was assembled manually in spreadsheets, limiting timely insight into opportunities, engagement activity, and forecast performance.",
])

APPROACH = "\n".join([
    "Intrinsic designed and implemented a Salesforce Sales Cloud environment integrated with Microsoft 365. The work included CRM architecture, SAML-based single sign-on through Microsoft Entra ID, automated email and calendar synchronization, custom opportunity stages, pipeline dashboards, and reporting aligned with the organization's revenue and engagement requirements.",
    "Einstein Activity Capture was configured to automatically synchronize Outlook emails and meetings with Salesforce, reducing manual entry while creating a more complete record of client interactions. Intrinsic also developed architecture documentation, configuration runbooks, user guidance, and training materials tailored to the organization's existing workflows.",
    "Within 30 days of launch, 95 percent of staff were actively using Salesforce as their primary CRM. Manual data entry declined by approximately 70 percent, and leadership gained real-time pipeline visibility through dashboards that replaced monthly spreadsheet reporting. Centralized authentication also reduced password-related support requests and strengthened access management.",
    "The organization's sales and development teams now operate from a shared source of information for client relationships, opportunities, and activity. Teams can follow up faster, forecast more accurately, and plan engagement using current information without disrupting the Outlook-based workflows familiar to staff.",
])

RESULTS = [
    "95 percent of staff actively using Salesforce as their primary CRM within 30 days of launch.",
    "Manual data entry reduced by approximately 70 percent through automated email and meeting capture.",
    "Real-time pipeline dashboards replaced monthly spreadsheet reporting for leadership.",
    "Single sign-on through Microsoft Entra ID cut password-related support requests and tightened access management.",
]

UPDATE = {
    "tag": "Professional Services · Salesforce & Microsoft 365",
    "title": "Improving CRM Adoption Through Salesforce and Microsoft 365",
    "card_title": "Improving CRM Adoption Through Salesforce and Microsoft 365",
    "previous_titles": ["Centralizing Relationships, Eliminating Friction"],
    "content_revision": "professional-services-crm-v2",
    "stat": "95% Adoption in 30 Days",
    "summary": "Salesforce Sales Cloud was integrated with the firm's Microsoft 365 environment, adding single sign-on and automatic activity capture without disrupting Outlook workflows.",
    "body": INTRO,
    "challenge": CHALLENGE,
    "approach": APPROACH,
    "results": RESULTS,
    "image": "/images/cases/case-crm.webp",
    "heroBg": "#f4eedb",
    "about": "Intrinsic Technology Group provides managed IT services, cybersecurity, cloud services, infrastructure management, endpoint protection, managed print, help desk services, and onsite IT support to small and midsize organizations. Headquartered in New York City, Intrinsic works with businesses across healthcare, financial services, legal, construction, nonprofit, and retail sectors through a coordinated technology relationship that reduces the cost and complexity of working with multiple vendors. Supported by AI-enabled automation and a live help desk, Intrinsic delivers secure, reliable technology tailored to each organization's needs. Intrinsic Technology Group is a proud women-owned and minority-owned business.",
    "contact_phone": "212-643-4808",
    "contact_linkedin": "https://www.linkedin.com/company/intrinsic",
    "pdf": "/briefs/intrinsic-professional-services-crm-case-study.pdf",
}


async def main():
    import server

    try:
        r = await server.db.case_studies.update_one(
            {"title": {"$in": [UPDATE["title"], *UPDATE["previous_titles"]]}},
            {"$set": UPDATE},
        )
        print("matched:", r.matched_count, "modified:", r.modified_count)
    finally:
        server.client.close()


if __name__ == "__main__":
    asyncio.run(main())
