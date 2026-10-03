import asyncio

INTRO = "A law firm needed to strengthen endpoint security and demonstrate its cybersecurity practices to clients and insurance providers. An internal review identified material gaps in patch compliance across workstations and servers, leaving parts of the environment exposed to known operating system and application vulnerabilities."

CHALLENGE = "\n".join([
    "Endpoint patch compliance stood at 62 percent, with inconsistent updating across devices and limited visibility into outstanding vulnerabilities.",
    "The firm needed to remediate critical issues quickly while establishing a repeatable process for patching, endpoint monitoring, and security reporting.",
    "Leadership also needed the ability to produce current, verifiable compliance information for client security questionnaires and cyber insurance renewals without relying on time-consuming manual reviews.",
])

APPROACH = "\n".join([
    "Intrinsic conducted a comprehensive patch and vulnerability assessment across the firm's workstations and servers. We developed a prioritized remediation plan categorizing findings as critical, high, medium, or low, with defined corrective actions, ownership, and completion timelines.",
    "Intrinsic configured automated patch management through ConnectWise Automate, with custom compliance policies aligned to the firm's risk tolerance, application requirements, and approved maintenance windows. Patch deployment, exception management, and remediation progress were incorporated into an ongoing monitoring and reporting process.",
    "SentinelOne endpoint detection and response was deployed and configured across the environment to provide real-time endpoint visibility, threat detection, and automated response capabilities. Intrinsic also coordinated the endpoint security configuration with the firm's existing Microsoft Defender, Intune, and WSUS environment.",
    "A recurring compliance-reporting process was established to provide current patch status, outstanding risks, remediation progress, and supporting documentation in PDF and Excel formats. Intrinsic also developed a cybersecurity practices guide covering password security, phishing awareness, and device protection for employees working in the office or remotely.",
    "Within 30 days, endpoint patch compliance increased from 62 percent to 98 percent. Intrinsic identified and remediated 47 critical vulnerabilities, including vulnerabilities associated with known active exploitation.",
    "The firm can now produce supporting compliance documentation within 24 hours of a client or insurer request. Real-time endpoint monitoring has also improved visibility into device health and reduced the time required to identify and respond to potential threats.",
    "The firm now approaches client security reviews and cyber insurance applications with current, verifiable compliance information. The improved security environment supports client confidence, reduces operational risk, and provides leadership with greater visibility into the organization's cybersecurity posture.",
])

RESULTS = [
    "Endpoint patch compliance increased from 62% to 98% within 30 days.",
    "47 critical vulnerabilities identified and remediated, including some tied to known active exploitation.",
    "Supporting compliance documentation can now be produced within 24 hours of a client or insurer request.",
    "Real-time endpoint monitoring improved device-health visibility and reduced threat response time.",
]

UPDATE = {
    "tag": "Legal Services · Endpoint Security & Compliance",
    "title": "Strengthening Endpoint Security and Patch Compliance",
    "card_title": "Strengthening Endpoint Security and Patch Compliance",
    "previous_titles": ["From Vulnerable to Verified"],
    "content_revision": "legal-endpoint-v2",
    "stat": "62% → 98%",
    "summary": "A law firm's endpoint patch compliance rose from 62% to 98% in 30 days, with 47 critical vulnerabilities remediated and on-demand compliance reporting for clients and insurers.",
    "body": INTRO,
    "challenge": CHALLENGE,
    "approach": APPROACH,
    "results": RESULTS,
    "image": "/images/cases/case-legal-endpoint.png",
    "heroBg": "#f8f1e9",
    "about": "Intrinsic Technology Group provides managed IT services, cybersecurity, cloud services, infrastructure management, endpoint protection, managed print, help desk services, and onsite IT support to small and midsize organizations. Headquartered in New York City, Intrinsic works with businesses across healthcare, financial services, legal, construction, nonprofit, and retail sectors through a coordinated technology relationship that reduces the cost and complexity of working with multiple vendors. Supported by AI-enabled automation and a live help desk, Intrinsic delivers secure, reliable technology tailored to each organization's needs. Intrinsic Technology Group is a proud women-owned and minority-owned business.",
    "contact_phone": "212-643-4808",
    "contact_linkedin": "https://www.linkedin.com/company/intrinsic",
    "pdf": "/briefs/intrinsic-legal-endpoint-security-case-study.pdf",
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
