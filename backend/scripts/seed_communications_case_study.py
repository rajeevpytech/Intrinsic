import asyncio

INTRO = "Following a corporate rebrand, a communications firm needed to consolidate four email domains into one unified identity within its existing Microsoft 365 tenant. The transition also required the migration of more than 50 SharePoint Online sites, shared mailboxes, permissions, and historical content without interrupting active client work."

CHALLENGE = "\n".join([
    "The organization's Microsoft 365 environment had evolved across several legacy business identities. SharePoint sites contained complex permission structures and years of version history, while shared mailboxes and user accounts remained connected to multiple domains.",
    "The migration needed to preserve content, permissions, mailbox data, and version history while addressing URL redirection and access continuity. Because active client campaigns were underway, the organization could not tolerate downtime or widespread disruption.",
])

APPROACH = "\n".join([
    "Intrinsic began by inventorying the organization's domains, SharePoint sites, shared mailboxes, permission structures, historical content, and technical dependencies. We used this assessment to design a phased consolidation plan covering Microsoft 365 identity, Exchange Online, SharePoint content, permissions, URL behavior, validation, and recovery.",
    "Intrinsic configured and managed the SharePoint migration using AvePoint Fly, including content mapping, permission mapping, and version-history preservation across more than 50 sites. A detailed permissions matrix was developed before migration to document existing access and establish a baseline for post-migration validation.",
    "For email consolidation, Intrinsic designed and automated a shared-mailbox migration process using PowerShell-based restore workflows. This preserved mailbox content associated with the legacy domains while transitioning users and shared resources to the organization's primary domain.",
    "Intrinsic also developed the migration sequence, cutover procedures, URL-redirection plan, rollback requirements, and validation criteria for each phase. Migrations were executed during off-hours with real-time monitoring, and every completed phase was compared with the pre-migration baseline before work continued.",
    "All four domains were successfully consolidated into one primary Microsoft 365 identity with no reported downtime. More than 50 SharePoint sites were migrated with their content, permissions, and version history preserved, while shared-mailbox information remained available throughout the transition.",
    "During the permissions review, Intrinsic identified and resolved more than 15 orphaned permission sets and eight overly permissive sharing configurations. This reduced unnecessary access and strengthened the organization's overall security posture.",
    "The firm now operates through one consistent Microsoft 365 identity. The consolidation simplified administration, reduced redundant configurations and related licensing costs, and provided employees with a consistent experience across email, SharePoint, and other Microsoft 365 services.",
])

RESULTS = [
    "Four legacy domains consolidated into one primary Microsoft 365 identity with no reported downtime.",
    "50+ SharePoint sites migrated with content, permissions, and version history preserved.",
    "15+ orphaned permission sets and 8 overly permissive sharing configurations identified and resolved.",
    "Shared-mailbox data kept available throughout via automated PowerShell restore workflows.",
]

UPDATE = {
    "tag": "Communications · Cloud Migration & Domain Consolidation",
    "title": "Consolidating Microsoft 365 Domains and SharePoint Without Downtime",
    "card_title": "Consolidating Microsoft 365 Domains and SharePoint Without Downtime",
    "previous_titles": ["One Brand, One Identity, Zero Downtime"],
    "content_revision": "communications-m365-v2",
    "stat": "Zero downtime",
    "summary": "Four email domains and 50+ SharePoint sites were consolidated into a single Microsoft 365 identity with no reported downtime, while permissions and version history were preserved throughout.",
    "body": INTRO,
    "challenge": CHALLENGE,
    "approach": APPROACH,
    "results": RESULTS,
    "image": "/images/cases/case-m365-comms.jpeg",
    "heroBg": "#e7f0ed",
    "about": "Intrinsic Technology Group provides managed IT services, cybersecurity, cloud services, infrastructure management, endpoint protection, managed print, help desk services, and onsite IT support to small and midsize organizations. Headquartered in New York City, Intrinsic works with businesses across healthcare, financial services, legal, construction, nonprofit, and retail sectors through a coordinated technology relationship that reduces the cost and complexity of working with multiple vendors. Supported by AI-enabled automation and a live help desk, Intrinsic delivers secure, reliable technology tailored to each organization's needs. Intrinsic Technology Group is a proud women-owned and minority-owned business.",
    "contact_phone": "212-643-4808",
    "contact_linkedin": "https://www.linkedin.com/company/intrinsic",
    "pdf": "/briefs/intrinsic-communications-m365-case-study.pdf",
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
