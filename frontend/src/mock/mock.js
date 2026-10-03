// Content for Intrinsic home page — text sourced verbatim from the Home Page PDF.

export const nav = [
  { label: "AI", to: "/services/ai", items: [
    { label: "AI Assessment Readiness", to: "/services/ai-readiness-assessment", desc: "Establish the foundation for AI adoption." },
    { label: "Managed AI", to: "/services/managed-ai", desc: "AI that is managed, not just deployed." },
    { label: "AI Governance & Compliance", to: "/services/ai-governance-compliance", desc: "Establish the rules around AI." },
  ] },
  { label: "Cybersecurity", to: "/services/cybersecurity", items: [
    { label: "Threat Detection & Response", to: "/services/threat-detection-response", desc: "Continuous monitoring, investigation, and response." },
    { label: "User, Identity & Endpoint Security", to: "/services/identity-endpoint-security", desc: "Protect users, identities, endpoints, and email." },
    { label: "Network & Perimeter Security", to: "/services/network-perimeter-security", desc: "Managed firewalls, network controls, remote access." },
    { label: "Security Assessments & Vulnerability Management", to: "/services/security-assessments", desc: "Find and prioritize risk before attackers do." },
    { label: "Security Monitoring & Analytics (SIEM)", to: "/services/security-monitoring-siem", desc: "Centralized security visibility across the environment." },
  ] },
  { label: "Cloud", to: "/services/cloud", items: [
    { label: "Cloud Infrastructure & Migration", to: "/services/cloud-infrastructure-migration", desc: "Design, migrate, and manage Azure and hybrid." },
    { label: "Backup & Disaster Recovery", to: "/services/backup-disaster-recovery", desc: "Business continuity built around recovery." },
  ] },
  { label: "Managed IT", to: "/services/managed-support", items: [
    { label: "Managed IT Services", to: "/services/managed-it-services", desc: "A complete outsourced IT function." },
    { label: "Co-Managed IT", to: "/services/co-managed-it", desc: "Additional capability for internal IT teams." },
    { label: "Remote Monitoring & Management", to: "/services/remote-monitoring-management", desc: "Continuous visibility across your infrastructure." },
    { label: "Networking", to: "/services/networking", desc: "Reliable, secure connectivity everywhere." },
    { label: "Microsoft 365", to: "/services/microsoft-365", desc: "Get the most from your Microsoft stack." },
    { label: "vCIO & vCISO", to: "/services/vcio-vciso", desc: "Leadership for technology and security decisions." },
  ] },
  { label: "Governance", to: "/services/security-governance-compliance", items: [] },
  { label: "Industries", to: "/industries", items: [
    { label: "Financial Services", to: "/industries/financial-services", desc: "Security and compliance for finance." },
    { label: "Healthcare", to: "/industries/healthcare", desc: "Protect patient data and stay compliant." },
    { label: "Non-Profit", to: "/industries/non-profit", desc: "Do more with technology that just works." },
    { label: "Professional Services", to: "/industries/professional-services", desc: "Reliable IT for client-focused firms." },
    { label: "Construction", to: "/industries/construction", desc: "IT that keeps job sites connected." },
  ] },
  { label: "About", to: "/about", items: [
    { label: "Resources", to: "/resources", desc: "Guides, insights, and case studies." },
    { label: "Contact", to: "/contact", desc: "Reach our team directly." },
  ] },
];

export const capabilities = [
  {
    tag: "01",
    title: "Cybersecurity",
    body: "Integrated protection, monitoring, risk management, governance, and compliance support across users, identities, endpoints, networks, cloud platforms, and data.",
    points: ["Threat Detection", "Compliance", "24/7 Monitoring"],
  },
  {
    tag: "02",
    title: "Managed IT and Helpdesk",
    body: "Comprehensive management across users, endpoints, infrastructure, Microsoft 365, networks, support, and day-to-day technology operations.",
    points: ["Helpdesk", "Endpoint Management", "Microsoft 365"],
  },
  {
    tag: "03",
    title: "Cloud",
    body: "Cloud strategy, infrastructure, migration, management, backup, and disaster recovery designed around security, performance, resilience, and long-term operational requirements.",
    points: ["Migration", "Backup & Recovery", "Azure"],
  },
  {
    tag: "04",
    title: "AI & Automation",
    body: "Practical AI and automation capabilities designed to improve operations and support the evolving technology environment—from Microsoft Copilot and workflow automation to AI enablement, data readiness, security, and governance.",
    points: ["Microsoft Copilot", "Workflow Automation", "Data Readiness"],
  },
];

export const securityChips = [
  "Threat Detection",
  "Security Monitoring",
  "Governance & Compliance",
];

export const industries = [
  { name: "Healthcare", color: "#108474", body: "For healthcare organizations, technology availability directly impacts patient care. Intrinsic designs and manages secure, reliable environments that support HIPAA requirements, protect patient information, and keep critical systems available when they matter most.", image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdGVjaG5vbG9neXxlbnwwfHx8Ymx1ZXwxNzg4ODk1NzgyfDA&ixlib=rb-4.1.0&q=85" },
  { name: "Legal", color: "#084c98", body: "Law firms handle privileged information every day and face rising expectations from clients, courts, and insurers. Intrinsic delivers secure, always-available technology environments that protect confidentiality, support compliance, and keep attorneys productive wherever they work.", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80" },
  { name: "Financial Services", color: "#1b61be", body: "Financial organizations operate in an environment where security, compliance, and data protection are critical. Intrinsic helps financial firms maintain secure technology environments that support regulatory requirements, protect sensitive information, and strengthen operational resilience.", image: "https://images.unsplash.com/photo-1578999509166-2ba43795234d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBzZXJ2aWNlcyUyMG9mZmljZXxlbnwwfHx8Ymx1ZXwxNzg4ODk1NzgyfDA&ixlib=rb-4.1.0&q=85" },
  { name: "Construction", color: "#faaf6a", body: "Construction moves fast and operates across multiple locations. Intrinsic keeps your office, your job sites and your field teams connected — with secure devices, reliable systems and technology that doesn't slow down the work.", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2V8ZW58MHx8fHwxNzg4ODk1Nzg4fDA&ixlib=rb-4.1.0&q=85" },
  { name: "Non-Profit", color: "#d4883a", body: "Nonprofit organizations carry significant responsibility to their donors, their beneficiaries, and their boards. Intrinsic provides secure, reliable technology that protects sensitive information, supports compliance, and lets your team focus on the mission.", image: "https://images.pexels.com/photos/7988663/pexels-photo-7988663.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { name: "Retail", color: "#6b7a78", body: "Retail runs on uptime — point-of-sale, inventory, e-commerce, and customer data all depend on reliable, secure systems. Intrinsic keeps stores and back-office connected, protects payment and customer information, and scales technology as your footprint grows.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80" },
];

export const businessChips = [
  "Healthcare", "Legal", "Financial services", "Construction", "Non-profit", "Retail",
];

// Careers — open positions
export const jobs = [
  {
    slug: "security-operations-analyst",
    title: "Security Operations Analyst",
    category: "Cybersecurity",
    type: "Full Time",
    location: "Remote (US)",
    overview: "We're looking for a Security Operations Analyst to join our SOC team. You'll monitor client environments in real time, investigate alerts, and drive incidents to resolution while keeping communication clear and calm.",
    responsibilities: [
      "Monitor SIEM and EDR tooling for threats across client environments 24/7",
      "Triage, investigate, and escalate security alerts within SLA",
      "Lead containment and remediation during active incidents",
      "Tune detection rules to reduce noise and improve signal",
      "Document findings and produce clear incident reports for clients",
      "Collaborate with engineering teams on hardening and response playbooks",
    ],
    requirements: [
      "2-3 years in a SOC, incident response, or security analyst role",
      "Hands-on experience with SIEM/EDR platforms (e.g. Sentinel, CrowdStrike)",
      "Solid understanding of MITRE ATT&CK and common attack patterns",
      "Strong written and verbal communication under pressure",
      "Ability to work rotating on-call shifts",
    ],
    preferred: ["Security certifications (Security+, GCIH, GCIA)", "Scripting with PowerShell or Python", "MSP experience"],
  },
  {
    slug: "cloud-solutions-engineer",
    title: "Cloud Solutions Engineer",
    category: "Cloud",
    type: "Full Time",
    location: "Hybrid — Boston, MA",
    overview: "Join our Cloud practice to design, migrate, and manage resilient Azure environments for clients across regulated industries.",
    responsibilities: [
      "Design and deploy secure, scalable Azure infrastructure",
      "Plan and execute cloud migrations with zero-downtime targets",
      "Build infrastructure-as-code and automation pipelines",
      "Implement backup, DR, and business-continuity solutions",
      "Advise clients on cloud strategy and cost optimization",
    ],
    requirements: [
      "3+ years designing and operating cloud infrastructure (Azure preferred)",
      "Experience with IaC (Bicep/Terraform) and CI/CD",
      "Strong networking and identity fundamentals",
      "Excellent client-facing communication",
    ],
    preferred: ["Azure certifications (AZ-104, AZ-305)", "Microsoft 365 tenant management", "Experience in finance or healthcare"],
  },
  {
    slug: "it-support-level-2",
    title: "IT Support — Level 2",
    category: "Managed IT",
    type: "Full Time",
    location: "New York, NY",
    overview: "We are seeking a Level 2 Engineer to join our Service Desk team. You'll provide escalated support to our customers while maintaining excellent communication and efficient ticket tracking.",
    responsibilities: [
      "Remotely troubleshoot hardware and software (macOS, Windows, M365, Google Workspace)",
      "Act as a point of escalation for customer interactions",
      "Hit a 10-minute SLA for initial response on each case",
      "Perform post-resolution follow-ups and maintain documentation",
      "Coordinate with cross-functional teams to resolve issues",
    ],
    requirements: [
      "2-3 years of relevant technical experience",
      "Experience with Mac and PC devices",
      "Proficient in Microsoft 365 and Google Workspace",
      "Network troubleshooting and some server administration",
      "Exceptional communication and works well under pressure",
    ],
    preferred: ["Previous MSP experience", "Okta / SSO", "Azure AD, Active Directory", "CCNA, RMM tools"],
  },
  {
    slug: "it-project-manager",
    title: "IT Project Manager",
    category: "Managed IT",
    type: "Full Time",
    location: "Hybrid — New York, NY",
    overview: "Own the delivery of IT projects end-to-end — from migrations and rollouts to security initiatives — keeping scope, timeline, and clients aligned.",
    responsibilities: [
      "Plan, schedule, and deliver client IT projects on time and budget",
      "Coordinate engineers, vendors, and client stakeholders",
      "Maintain clear project documentation and status reporting",
      "Identify and mitigate risks proactively",
      "Run kickoff, checkpoint, and closeout meetings",
    ],
    requirements: [
      "3+ years managing technical/IT projects",
      "Strong organizational and stakeholder-management skills",
      "Familiarity with MSP delivery and IT operations",
      "Excellent written and verbal communication",
    ],
    preferred: ["PMP or CAPM", "Experience with PSA tools", "Change-management background"],
  },
  {
    slug: "sales-representative",
    title: "Sales Representative",
    category: "Client Services",
    type: "Full Time",
    location: "Remote (US)",
    overview: "Help organizations discover how managed IT and security can transform their operations. You'll build relationships and guide prospects from first conversation to partnership.",
    responsibilities: [
      "Prospect and qualify new business opportunities",
      "Run discovery calls and translate needs into solutions",
      "Partner with engineering to scope proposals",
      "Manage the pipeline and hit revenue targets",
      "Represent Intrrinsic with professionalism and integrity",
    ],
    requirements: [
      "2+ years in B2B sales, ideally technology or MSP",
      "Consultative, relationship-first selling style",
      "Strong communication and negotiation skills",
      "Self-motivated and organized",
    ],
    preferred: ["Experience selling managed services or cybersecurity", "CRM proficiency", "Existing network in target industries"],
  },
];

// Used only by the /v2 alternate design
export const insights = [
  {
    category: "SECURITY",
    catColor: "#cfe8d4",
    title: "The real cost of a ransomware attack",
    excerpt: "It is not just the ransom. Downtime and lost trust hurt more.",
    author: "James O'Connell",
    date: "18 Oct 2023",
    read: "6 min read",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxjeWJlcnNlY3VyaXR5fGVufDB8fHxibHVlfDE3ODg4OTU3Mzl8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    category: "CLOUD",
    catColor: "#c8d2de",
    title: "Moving to the cloud without the chaos",
    excerpt: "A simple plan for a migration that does not break your business.",
    author: "Elena Rodriguez",
    date: "18 Oct 2023",
    read: "4 min read",
    image: "https://images.pexels.com/photos/17489163/pexels-photo-17489163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    category: "AUTOMATION",
    catColor: "#fcd1a5",
    title: "Automate the boring IT tasks first",
    excerpt: "Free up your team by letting machines handle the routine work.",
    author: "James O'Connell",
    date: "02 Nov 2023",
    read: "6 min read",
    image: "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwzfHxyb2JvdGljcyUyMGF1dG9tYXRpb258ZW58MHx8fHwxNzg4ODk1NzM5fDA&ixlib=rb-4.1.0&q=85",
  },
];

// Resources — case studies (verbatim from PDF)
export const caseStudies = [
  {
    tag: "Nonprofit · Business Intelligence & Power BI",
    title: "Turning Data into Actionable Insights",
    body: "A nonprofit organization needed a better way to measure program outcomes across multiple locations. Intrinsic replaced manual spreadsheet reporting with an interactive Power BI solution, saving 40+ staff hours monthly and cutting licensing costs by an estimated 40%.",
    stat: "40+ hrs saved / mo",
  },
  {
    tag: "Professional Services · Salesforce CRM & SSO Integration",
    title: "Centralizing Relationships, Eliminating Friction",
    body: "A professional services organization needed a CRM that worked with their existing Microsoft stack — not against it. Intrinsic implemented Salesforce Sales Cloud with single sign-on and automatic activity capture, achieving 95% adoption in 30 days.",
    stat: "95% adoption",
  },
  {
    tag: "Communications · Cloud Migration & Domain Consolidation",
    title: "One Brand, One Identity, Zero Downtime",
    body: "Following a corporate rebrand, a communications firm needed to consolidate four email domains and 50+ SharePoint sites into a single Microsoft 365 identity. Intrinsic completed the migration with zero downtime and resolved 15+ orphaned permission sets along the way.",
    stat: "Zero downtime",
  },
  {
    tag: "Manufacturing · Azure Cloud Infrastructure",
    title: "Moving to the Cloud Without Losing What Works",
    body: "A manufacturing company needed to move its production management system to the cloud while keeping the application their teams depended on. Intrinsic migrated to Azure with zero disruption, 99.9% availability from day one, and costs 30% below projection.",
    stat: "99.9% availability",
  },
  {
    tag: "Legal · Endpoint Security & Compliance",
    title: "From Vulnerable to Verified",
    body: "A law firm facing pressure from clients and insurers needed to close critical security gaps — fast. Intrinsic brought endpoint patch compliance from 62% to 98% in 30 days and gave the firm on-demand compliance reporting.",
    stat: "62% → 98%",
  },
];

export const peopleQualities = [
  "Responsive support",
  "Proactive guidance",
  "Specialized expertise",
  "Clear accountability",
];

export const testimonials = [
  {
    quote: "Intrinsic feels like an extension of our business. Their team understands our environment, responds quickly, and helps us stay ahead of problems before they impact operations.",
    role: "Executive Director, Nonprofit Organization",
    since: "ITG Client since 2019",
  },
  {
    quote: "We're a small team with big compliance requirements. Intrinsic understands that and never makes us feel like we're too small to matter. They treat our data with the same care as our clients.",
    role: "Executive Director, Social Services Nonprofit",
    since: "ITG Client since 2018",
  },
  {
    quote: "We've worked with larger MSPs before. The difference with Intrinsic is that we're never a ticket number. We have a relationship. And in financial services, relationships matter.",
    role: "Chief Operating Officer, Investment Advisory Firm",
    since: "ITG Client since 2020",
  },
  {
    quote: "We're not a technology company — we're a construction company. We need IT that works in the background and doesn't slow us down. That's exactly what Intrinsic delivers.",
    role: "President, Construction Firm",
    since: "ITG Client since 2023",
  },
];

export const footer = {
  tagline: "Managed IT, Cybersecurity, and Cloud Services",
  columns: [
    { title: "ABOUT", links: [
      { label: "About Us", to: "/about" }, { label: "Resources", to: "/resources" }, { label: "Careers", to: "/careers" }, { label: "Contact Us", to: "/contact" },
    ] },
    { title: "SERVICES", links: [
      { label: "Cybersecurity", to: "/services/cybersecurity" }, { label: "Managed IT", to: "/services/managed-it" }, { label: "Cloud", to: "/services/cloud" }, { label: "AI", to: "/services/ai" },
      { label: "Networking", to: "/services/networking" }, { label: "Microsoft 365", to: "/services/microsoft-365" }, { label: "Backup & Disaster Recovery", to: "/services/backup-disaster-recovery" },
    ] },
    { title: "INDUSTRIES", links: [
      { label: "All Industries", to: "/industries" }, { label: "Financial Services", to: "/industries/financial-services" }, { label: "Healthcare", to: "/industries/healthcare" },
      { label: "Non-Profit", to: "/industries/non-profit" }, { label: "Professional Services", to: "/industries/professional-services" }, { label: "Construction", to: "/industries/construction" },
    ] },
  ],
};
