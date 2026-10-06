import asyncio

INTRO = "A global nonprofit network serving children with serious illnesses needed a modern analytics solution to measure the effectiveness of its Social Emotional Learning and Program Quality Assessment initiatives across multiple program locations. Leadership needed information that could be reviewed at both the site and network levels, with the ability to examine specific programs, reporting periods, and demographic groups."

CHALLENGE = "\n".join([
    "Reporting depended on manually consolidating spreadsheets containing survey results, attendance records, assessment scores, and program information. The process was time-consuming, created opportunities for error, and made it difficult to identify trends or prepare timely information for program teams, leadership, board members, and funders.",
    "The organization also required appropriate data separation. Each location needed access to its own information, while network leadership required a consolidated view across the entire program environment.",
])

APPROACH = "\n".join([
    "Intrinsic began by reviewing the organization's reporting processes, data sources, user requirements, and access needs. Working with program and leadership teams, we defined the measures, reporting views, and comparisons required at both the individual-site and network levels.",
    "We then designed and implemented a Power BI reporting environment that consolidated survey results, attendance records, assessment scores, and program information into a unified data model. Interactive dashboards allowed users to examine performance by year, location, program, reporting period, and demographic group without manually rebuilding reports.",
    "Role-based security was incorporated into the architecture, so each location could access its own information while network leadership retained organization-wide visibility.",
    "Intrinsic also evaluated Power BI Pro, Premium Per User, and Microsoft Fabric to establish a practical deployment and licensing model aligned with the organization's requirements and anticipated use.",
    "The engagement included data architecture, dashboard development, identity and access configuration, testing, phased implementation, technical documentation, and knowledge-transfer sessions. This gave the internal team the ability to manage the reporting environment and extend it as program requirements evolved.",
    "Program teams can now compare year-over-year performance, identify effective interventions, and prepare funder-ready reporting in minutes rather than days. By replacing manual consolidation with a unified reporting environment, the organization has improved data accuracy, accelerated decision-making, and recovered an estimated 480 staff hours annually.",
    "The licensing review also reduced projected costs by approximately 40 percent.",
    "Leadership now uses the dashboards in board and funder discussions to demonstrate program outcomes and support future investment.",
])

RESULTS = [
    "An estimated 480 staff hours recovered annually by replacing manual spreadsheet consolidation.",
    "Projected licensing costs reduced by approximately 40 percent after a Power BI and Microsoft Fabric review.",
    "Funder-ready reporting prepared in minutes rather than days, with year-over-year comparisons.",
    "Role-based access giving each location its own view while leadership retains network-wide visibility.",
]

UPDATE = {
    "tag": "Nonprofit · Business Intelligence",
    "title": "Improving Program Reporting Across a Global Nonprofit Network",
    "card_title": "Improving Program Reporting Across a Global Nonprofit Network",
    "previous_titles": ["Turning Data into Actionable Insights"],
    "content_revision": "nonprofit-pdf2",
    "stat": "A Clearer View of Program Impact",
    "summary": "A secure Power BI environment brought information from multiple locations into one reporting view—giving leadership clearer insight into program outcomes.",
    "body": INTRO,
    "challenge": CHALLENGE,
    "approach": APPROACH,
    "results": RESULTS,
    "image": "/images/cases/case-bi.webp",
    "heroBg": "#e9eef6",
    "about": "Intrinsic Technology Group provides managed IT services, cybersecurity, cloud services, infrastructure management, endpoint protection, managed print, help desk services, and onsite IT support to small and midsize organizations. Headquartered in New York City, Intrinsic works with businesses across healthcare, financial services, legal, construction, nonprofit, and retail sectors through a coordinated technology relationship that reduces the cost and complexity of working with multiple vendors. Supported by AI-enabled automation and a live help desk, Intrinsic delivers secure, reliable technology tailored to each organization's needs. Intrinsic Technology Group is a proud women-owned and minority-owned business.",
    "contact_phone": "212-643-4808",
    "contact_linkedin": "https://www.linkedin.com/company/intrinsic",
    "pdf": "https://customer-assets-0z36b82j.emergentagent.net/job_deploy-now-160/artifacts/8iwvg631_CASE%20STUDY%20%C2%B7%20NONPROFIT2.pdf",
}


async def main():
    import server

    try:
        r = await server.db.case_studies.update_one(
            {"tag": {"$regex": "^Nonprofit"}}, {"$set": UPDATE}
        )
        print("matched:", r.matched_count, "modified:", r.modified_count)
    finally:
        server.client.close()


if __name__ == "__main__":
    asyncio.run(main())
