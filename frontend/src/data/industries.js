export const nonProfit = {
  slug: "non-profit",
  name: "Non-Profit",
  color: "#d4883a",
  eyebrow: "Non-Profit Organizations",
  image: "https://images.pexels.com/photos/7988663/pexels-photo-7988663.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400",
  hero: {
    title: "Technology Management for Non-Profit Organizations",
    body: "Non-profit organizations rely on technology across program delivery, fundraising, administration, collaboration, and organizational operations. Intrinsic provides managed IT, cybersecurity, cloud, and strategic technology services aligned with the operational requirements, security responsibilities, and resource priorities of non-profit organizations.",
    cta: "Talk to Our Team",
  },
  environment: {
    eyebrow: "The Non-Profit Technology Environment",
    title: "Supporting Programs, People, and Operations",
    paragraphs: [
      "Non-profit technology environments often support a diverse combination of employees, volunteers, programs, administrative functions, and external stakeholders.",
      "Core systems may include donor platforms, program databases, financial applications, volunteer-management tools, Microsoft 365, and cloud services. These systems need to remain accessible and well managed while organizational, donor, and constituent information is appropriately protected.",
      "At the same time, technology decisions need to account for available resources, reporting requirements, changing program needs, and the ability of internal teams to manage increasingly complex systems.",
      "Intrinsic brings these requirements together through ongoing IT management, cybersecurity, cloud services, system integration, and strategic technology planning.",
    ],
    systems: ["Donor Platforms", "Program Databases", "Financial Applications", "Volunteer Management", "Microsoft 365", "Cloud Services"],
  },
  managed: {
    eyebrow: "Managed IT & Operational Support",
    title: "Supporting Day-to-Day Technology Requirements",
    paragraphs: [
      "Reliable technology is fundamental to the administrative and program functions of the organization.",
      "Intrinsic provides ongoing management across users, devices, infrastructure, Microsoft 365, cloud platforms, connectivity, and access. Help desk services provide employees and volunteers with technical support, while proactive monitoring and maintenance provide ongoing oversight of the systems supporting daily operations.",
      "User onboarding, offboarding, permissions, and access requirements are managed as roles change, helping maintain appropriate access across employees, volunteers, applications, and organizational information.",
      "For organizations without dedicated internal IT resources, Intrinsic can provide comprehensive technology management. Where internal resources are already in place, our team can provide additional capacity and technical expertise.",
    ],
  },
  security: {
    eyebrow: "Cybersecurity & Information Protection",
    title: "Protecting Organizational, Donor, and Constituent Information",
    paragraphs: [
      "Non-profit organizations may hold donor information, constituent data, financial records, employee information, and other sensitive organizational data.",
      "Intrinsic manages security controls across endpoints, email, identity, access, and infrastructure. These controls are supported by continuous security monitoring designed to identify activity requiring investigation and maintain ongoing visibility across the organization.",
      "Access management is particularly important in environments that include employees, volunteers, contractors, and changing program responsibilities. Permissions can be managed throughout the user lifecycle so that access remains appropriate as roles change.",
      "Security documentation, reporting, and governance support can also help address requirements associated with grants, contracts, and organizational policies.",
    ],
    chips: ["Endpoints", "Email", "Identity & Access", "Monitoring", "Governance"],
  },
  cloud: {
    eyebrow: "Cloud, Data & Business Systems",
    title: "Managing Technology Across the Organization",
    paragraphs: [
      "Non-profit operations may depend on multiple systems serving different functions—donor management, program administration, finance, volunteer management, reporting, and collaboration.",
      "Intrinsic helps organizations manage the technology supporting these platforms and determine where cloud adoption, system integration, data improvements, and workflow automation can improve the way information and processes move across the organization.",
    ],
    cards: [
      { title: "Cloud Infrastructure", body: "Cloud platforms can support collaboration, flexible work, scalability, and continuity while reducing dependence on aging infrastructure. Intrinsic helps organizations evaluate, migrate, and manage cloud environments based on their operating requirements." },
      { title: "System Integration", body: "Donor platforms, program databases, financial systems, and volunteer-management tools often contain information used across multiple functions. Integration can reduce disconnected processes and improve the movement of information between systems." },
      { title: "Data & Reporting", body: "Stronger data foundations can support program reporting, outcome measurement, grant requirements, and organizational decision-making. Intrinsic helps address the technology infrastructure and integration requirements underlying those capabilities." },
      { title: "Workflow Automation", body: "Selected administrative processes—including reporting, acknowledgements, onboarding, and program administration—can be streamlined through workflow automation where there is a clear operational benefit." },
    ],
  },
  continuity: {
    eyebrow: "Business Continuity",
    title: "Protecting Access to Critical Systems and Information",
    paragraphs: [
      "Non-profit organizations depend on continued access to systems and information across programs, fundraising, administration, and communications.",
      "Intrinsic manages cloud and backup capabilities designed to protect critical organizational information and support restoration when systems or data are disrupted. The existing offering specifically includes secure cloud environments and recovery capabilities as part of ongoing Managed IT services.",
      "Backup and continuity requirements are considered in the context of the systems the organization depends on, helping establish appropriate protection for critical information and operations.",
    ],
  },
  planning: {
    eyebrow: "Technology Planning & Oversight",
    title: "Priorities Defined Around the Organization",
    paragraphs: [
      "Technology investment needs to be considered alongside operational requirements, security priorities, available resources, and the organization's broader objectives.",
      "Intrinsic evaluates existing systems, processes, security, data, and operational requirements to identify areas requiring attention and opportunities for improvement.",
      "From that understanding, technology priorities can be organized into a practical roadmap. Initiatives can be phased according to organizational impact, feasibility, available resources, and implementation requirements rather than approached as disconnected technology projects.",
      "Where changes are required, Intrinsic can support the process from solution design and implementation through adoption and ongoing optimization—the progression established in the original service model.",
      "This provides leadership with greater visibility into the current state of technology, the areas requiring investment, and the priorities that should inform future decisions.",
    ],
    steps: ["Evaluate", "Roadmap", "Design & Implement", "Adopt & Optimize"],
  },
  why: {
    eyebrow: "Why Intrinsic",
    title: "One Technology Partner Across the Environment",
    paragraphs: [
      "Non-profit organizations need technology management that accounts for operational requirements, resource constraints, security responsibilities, and organizational priorities. That balance is also the central premise of the original Intrinsic offering.",
      "Intrinsic combines ongoing IT management with cybersecurity, cloud, implementation, and strategic guidance. This creates continuity between day-to-day technology operations and the longer-term decisions affecting systems, security, information, and infrastructure.",
    ],
  },
  cta: {
    eyebrow: "Technology Aligned with Your Organization",
    title: "Start With the Environment You Have Today",
    paragraphs: [
      "Intrinsic begins with an understanding of your existing technology, operational requirements, security priorities, and internal resources.",
      "From there, we can define the management, security, infrastructure, and technology priorities appropriate to your organization.",
    ],
    button: "Talk to Our Team",
  },
};

export const industryPages = { [nonProfit.slug]: nonProfit };

export const healthcare = {
  slug: "healthcare",
  name: "Healthcare",
  color: "#108474",
  eyebrow: "Healthcare",
  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
  hero: {
    title: "Technology That Supports the Delivery of Care",
    body: "Healthcare organizations rely on secure, available technology to support clinical operations and protect patient information. Intrinsic manages IT, cybersecurity, infrastructure, and security controls for healthcare organizations—bringing operational reliability, information protection, and regulatory considerations into a coordinated technology environment.",
    cta: "Talk to Our Team",
  },
  environment: { systems: ["EHR Platforms", "Practice Management", "Diagnostic Tools", "Communications"] },
  sections: [
    { type: "text", testId: "industry-environment", eyebrow: "Technology for Healthcare Environments", title: "Reliability and Security Across Critical Systems",
      paragraphs: [
        "Healthcare organizations depend on technology across clinical and administrative operations. EHR platforms, practice management systems, diagnostic tools, communications platforms, and the infrastructure supporting them must remain available while protecting the sensitive information they process.",
        "Intrinsic manages these environments with both requirements in view.",
        "Infrastructure, access, security, monitoring, and continuity are managed as connected responsibilities—providing greater visibility across the environment and clearer accountability for the technology supporting day-to-day operations.",
      ] },
    { type: "cards", testId: "industry-security-cards", eyebrow: "Cybersecurity & Patient Information", title: "Protecting Information Across the Environment",
      paragraphs: [
        "Protected health information moves across users, devices, applications, communications platforms, and networks. Security therefore requires coordinated controls across the environment.",
        "Intrinsic manages security across identity and access, endpoints, email, vulnerabilities, and security monitoring, with defined processes for identifying and responding to security events. These capabilities reflect the cybersecurity services already established in the current healthcare offering.",
      ],
      cards: [
        { title: "Identity & Access", body: "Manage user access, permissions, authentication, and account lifecycle requirements to maintain appropriate access to systems and information." },
        { title: "Endpoint & Email Security", body: "Protect devices and communications through managed security controls appropriate for environments handling protected health information." },
        { title: "Vulnerability Management", body: "Identify and address vulnerabilities through an ongoing process of assessment, prioritization, and remediation." },
        { title: "Security Monitoring", body: "Maintain continuous visibility into security activity with defined processes for investigation, escalation, and response." },
      ],
      closing: "Together, these controls provide a consistent security framework across the systems, users, and information within the healthcare environment." },
    { type: "band", eyebrow: "HIPAA, HITECH & Security Governance", title: "Integrating Regulatory Requirements into Security Operations",
      paragraphs: [
        "Healthcare organizations operate within established requirements for protecting patient information. Intrinsic incorporates HIPAA and HITECH considerations into the security and operational practices used to manage the technology environment.",
        "Access controls, security configuration, audit visibility, documentation, and incident response processes are considered within the broader security program rather than addressed as separate compliance activities.",
        "Governance provides the structure for maintaining these practices over time—establishing responsibilities, supporting documentation, and providing visibility into how relevant security controls are being managed.",
      ],
      chips: ["HIPAA", "HITECH", "Security Governance", "Documented Controls"] },
    { type: "text", testId: "industry-continuity", bg: "bg-ice", eyebrow: "Infrastructure & Business Continuity", title: "Maintaining Access to the Systems Healthcare Depends On",
      paragraphs: [
        "Clinical and administrative applications depend on reliable infrastructure, connectivity, and supporting services.",
        "Intrinsic provides ongoing monitoring, patch management, infrastructure oversight, backup, and continuity planning to support system availability and operational resilience.",
        "Continuity requirements are established with consideration for the importance of the systems and information being supported. Critical applications, infrastructure dependencies, backup requirements, and restoration objectives inform how continuity capabilities are structured and maintained.",
        "As the environment changes, these requirements are reviewed and tested to maintain a defined approach to restoring critical technology following disruption.",
      ] },
    { type: "text", testId: "industry-connected", eyebrow: "Managing the Connected Healthcare Environment", title: "Infrastructure, Applications, Networks, and Security Working Together",
      paragraphs: [
        "Healthcare environments increasingly bring together clinical applications, administrative systems, Microsoft platforms, cloud services, endpoints, networks, and connected medical devices.",
        "Managing these technologies requires visibility across the dependencies between them.",
        "Intrinsic provides coordinated management across infrastructure, Microsoft 365, networks, security, and end-user technology. Network visibility and segmentation can also support appropriate separation between clinical devices and administrative systems—an area specifically identified in the existing healthcare offering.",
        "This integrated approach allows infrastructure, security, access, continuity, and operational requirements to be considered together rather than managed as isolated technology functions.",
        "The result is a more consistent technology environment with clear ownership across the systems supporting healthcare operations.",
      ] },
  ],
  cta: {
    eyebrow: "Technology That Supports Patient Care",
    title: "A More Resilient, Secure, and Well-Managed Environment",
    paragraphs: [
      "Intrinsic begins by understanding the systems your organization depends on, how technology supports clinical and administrative operations, and the security and regulatory requirements surrounding patient information.",
      "From there, we establish the IT, cybersecurity, infrastructure, continuity, and governance priorities required to strengthen the environment.",
    ],
    button: "Talk to Our Team",
  },
};
industryPages[healthcare.slug] = healthcare;

export const financialServices = {
  slug: "financial-services",
  name: "Financial Services",
  color: "#1b61be",
  eyebrow: "Financial Services",
  image: "https://images.unsplash.com/photo-1578999509166-2ba43795234d?auto=format&fit=crop&w=1400&q=80",
  hero: {
    title: "Technology Management for a Regulated Environment",
    body: "Financial services organizations depend on technology to protect sensitive information, support critical business operations, and maintain the controls required within a regulated environment. Intrinsic manages IT, cybersecurity, cloud infrastructure, and security governance for financial services organizations—with an approach shaped by the operational, security, and regulatory requirements of the sector.",
    cta: "Talk to Our Team",
    tags: ["Wealth Management", "Family Offices", "Private Equity", "Broker-Dealers"],
  },
  environment: { systems: ["Wealth Management", "Family Offices", "Private Equity", "Broker-Dealers"] },
  sections: [
    { type: "text", testId: "industry-environment", eyebrow: "The Financial Services Environment", title: "Technology Requirements Extend Beyond Day-to-Day IT",
      paragraphs: [
        "Financial services organizations operate at the intersection of sensitive information, high-value transactions, regulatory scrutiny, and client expectations. Technology failures or security incidents can affect more than productivity—they can create implications for business continuity, client relationships, and regulatory obligations.",
        "The technology environment therefore requires a higher degree of control and oversight.",
        "Systems must remain reliable. Access to sensitive information must be appropriately governed. Security controls must be implemented and monitored. Technology changes need to consider their impact on risk and compliance. Backup and continuity capabilities need to reflect the importance of the systems being supported.",
        "Intrinsic brings these requirements together within a coordinated approach to IT management and cybersecurity.",
      ] },
    { type: "cards", testId: "industry-security-cards", eyebrow: "Cybersecurity for Financial Services", title: "Protecting Information, Access, and Critical Systems",
      paragraphs: [
        "Financial services organizations face security threats that target users, credentials, communications, sensitive information, and critical systems.",
        "Intrinsic manages security across multiple layers of the technology environment, providing the controls and operational oversight required to reduce exposure and maintain visibility into security activity.",
      ],
      cards: [
        { title: "Identity & Access", body: "Manage identity and access controls, including Active Directory, role-based access, multi-factor authentication, and user lifecycle management, to maintain appropriate access to systems and information." },
        { title: "Endpoint & Email Security", body: "Protect endpoints and business communications through managed endpoint detection and response, email security, and related controls designed to identify and contain security threats." },
        { title: "Vulnerability Management", body: "Identify and address vulnerabilities across the environment through structured assessment and remediation processes." },
        { title: "Monitoring & Detection", body: "Maintain ongoing security visibility through managed detection, security monitoring, and documented processes for investigating and responding to security events." },
      ],
      closing: "Security controls are managed as part of the broader technology environment rather than as independent products or isolated security measures." },
    { type: "band", eyebrow: "Security Governance & Regulatory Requirements", title: "Connecting Security Requirements with Operating Controls",
      paragraphs: [
        "Regulated organizations need to demonstrate not only that security policies and controls exist, but that they are implemented, maintained, and supported by appropriate documentation and operating processes.",
        "Intrinsic incorporates governance and compliance considerations into the management of the technology environment.",
        "This includes evaluating security controls, maintaining appropriate policies and documentation, managing access, addressing vulnerabilities, supporting security monitoring, and maintaining the operational evidence required to demonstrate how relevant controls are being managed.",
        "Where applicable, these practices can support alignment with regulatory requirements and recognized security frameworks relevant to financial services.",
        "The objective is to integrate security governance into ongoing technology operations rather than address compliance as a separate or periodic exercise.",
      ],
      chips: ["Policies & Documentation", "Access Management", "Vulnerability Remediation", "Security Monitoring", "Operational Evidence"] },
    { type: "cards", testId: "industry-infrastructure", bg: "bg-ice", eyebrow: "Infrastructure, Cloud & Business Continuity", title: "Maintaining the Systems the Business Depends On",
      paragraphs: [
        "Reliability and continuity are fundamental requirements within financial services.",
        "Intrinsic manages infrastructure and cloud environments with consideration for availability, performance, security, data protection, and the operational importance of the systems being supported.",
      ],
      cards: [
        { title: "Infrastructure Management", body: "Proactive monitoring, patch management, maintenance, and infrastructure oversight provide greater visibility into system health and help address issues before they result in broader operational disruption." },
        { title: "Cloud & Microsoft Environments", body: "Cloud infrastructure and Microsoft 365 environments are configured and managed with appropriate consideration for identity, security, access, retention, governance, and business requirements." },
        { title: "Backup & Business Continuity", body: "Backup and disaster recovery capabilities are structured around critical systems, data, recovery objectives, and operational dependencies. Continuity planning and testing provide greater confidence that critical technology can be restored in a defined and controlled manner when disruption occurs." },
      ] },
    { type: "text", testId: "industry-together", eyebrow: "Technology Management for Financial Services", title: "Bringing IT, Security, and Governance Together",
      paragraphs: [
        "The technology requirements of a financial services organization extend across infrastructure, users, applications, security, cloud platforms, and regulatory obligations.",
        "Managing these areas separately can create gaps in visibility and accountability.",
        "Intrinsic provides coordinated management across the environment—connecting day-to-day IT operations with cybersecurity, infrastructure management, cloud, business continuity, and security governance.",
        "Operational activity and changes across the environment can then be evaluated in context. Infrastructure decisions consider security implications. Access changes remain connected to identity controls. Security findings inform operational priorities. Continuity requirements reflect the systems most important to the business.",
        "This provides clearer ownership across the technology environment and a more consistent approach to managing the operational and security requirements of a regulated organization.",
      ] },
  ],
  cta: {
    eyebrow: "Technology Aligned with Your Operating Requirements",
    title: "Start With Your Financial Services Environment",
    paragraphs: [
      "Intrinsic begins by understanding your technology environment, business operations, security requirements, and the systems and information most critical to the organization.",
      "From there, we can identify the IT, cybersecurity, cloud, continuity, and governance requirements that should be prioritized and establish an appropriate management approach.",
    ],
    button: "Talk to Our Team",
  },
};
industryPages[financialServices.slug] = financialServices;
