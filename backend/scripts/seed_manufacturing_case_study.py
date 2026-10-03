import asyncio

INTRO = "A precast concrete manufacturer relied on a legacy, server-based production management system to coordinate scheduling, inventory, order tracking, and activity across its plant and job sites. With the supporting infrastructure approaching end of life, the organization needed to modernize the environment without replacing the Microsoft Access application central to its daily operations."

CHALLENGE = "\n".join([
    "The production management system used a Microsoft Access front end connected to an on-premises SQL Server database. Aging infrastructure, unreliable remote connectivity, and the absence of a documented disaster recovery capability created increasing operational risk.",
    "Leadership wanted to move the system to the cloud while preserving existing application functionality and supporting hundreds of daily transactions. The new environment needed to balance performance, security, licensing, cost, remote access, monitoring, backup, and recovery requirements.",
])

APPROACH = "\n".join([
    "Intrinsic began by assessing the existing application, database, server infrastructure, remote-access requirements, and operational dependencies. We compared Remote Desktop Services, Azure VPN Gateway, and Azure Bastion architectures before recommending a hybrid approach aligned with the organization's security, performance, and budget requirements.",
    "Intrinsic designed and deployed a purpose-built Microsoft Azure environment for the production management system. The SQL Server database was migrated to an appropriately sized Azure virtual machine, and the existing Microsoft Access front end was redirected to the cloud-hosted database with minimal application changes.",
    "The engagement included SQL Server licensing analysis comparing bring-your-own-license and consumption-based options, secure remote-access configuration, automated backups, geo-redundant storage, system monitoring, and operational alerting. Intrinsic also developed the infrastructure architecture, implementation runbook, and disaster recovery plan required to manage and recover the environment.",
    "The organization retired three on-premises servers and achieved 99.9 percent system availability following the Azure deployment. Field teams gained secure remote access from the first day of operation, enabling real-time order tracking and scheduling updates from job sites.",
    "Automated backup, monitoring, and recovery processes substantially reduced the risk of data loss and prolonged service interruption. Right-sizing and licensing recommendations also brought monthly Azure costs approximately 30 percent below the initial projection.",
    "Production managers and field supervisors can now access current operational information from the plant or the field, improving coordination between production and job-site teams. The Azure environment provides a scalable infrastructure foundation and a documented recovery capability that did not exist in the legacy environment.",
])

RESULTS = [
    "Retired three on-premises servers and achieved 99.9% system availability after the Azure deployment.",
    "Field teams gained secure remote access from day one, enabling real-time order tracking and scheduling from job sites.",
    "Automated backup, monitoring, and recovery substantially reduced the risk of data loss and prolonged outages.",
    "Right-sizing and licensing recommendations brought monthly Azure costs approximately 30% below projection.",
]

UPDATE = {
    "tag": "Manufacturing & Construction · Azure Cloud Infrastructure",
    "title": "Modernizing a Production Management System on Microsoft Azure",
    "card_title": "Modernizing a Production Management System on Microsoft Azure",
    "previous_titles": ["Moving to the Cloud Without Losing What Works"],
    "content_revision": "manufacturing-azure-v2",
    "stat": "99.9% availability",
    "summary": "A precast concrete manufacturer modernized its production management system on Microsoft Azure while retaining Microsoft Access, achieving 99.9% availability and monthly costs approximately 30% below projection.",
    "body": INTRO,
    "challenge": CHALLENGE,
    "approach": APPROACH,
    "results": RESULTS,
    "image": "/images/cases/case-azure-mfg.jpeg",
    "heroBg": "#e6edf5",
    "about": "Intrinsic Technology Group provides managed IT services, cybersecurity, cloud services, infrastructure management, endpoint protection, managed print, help desk services, and onsite IT support to small and midsize organizations. Headquartered in New York City, Intrinsic works with businesses across healthcare, financial services, legal, construction, nonprofit, and retail sectors through a coordinated technology relationship that reduces the cost and complexity of working with multiple vendors. Supported by AI-enabled automation and a live help desk, Intrinsic delivers secure, reliable technology tailored to each organization's needs. Intrinsic Technology Group is a proud women-owned and minority-owned business.",
    "contact_phone": "212-643-4808",
    "contact_linkedin": "https://www.linkedin.com/company/intrinsic",
    "pdf": "/briefs/intrinsic-manufacturing-azure-case-study.pdf",
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
