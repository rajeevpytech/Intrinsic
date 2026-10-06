// Buyer FAQs shown on core service / industry / location pages.
// Mirrors backend/ssr.py FAQS so visitors and crawlers see the same content.
export const PAGE_FAQS = {
  "/services/managed-it": [
    { q: "What's included in your managed IT services?", a: "Our managed IT includes 24/7 monitoring, a responsive help desk, patch and update management, endpoint security, asset and vendor coordination, and ongoing technology planning through a vCIO." },
    { q: "How quickly do you respond to issues?", a: "Response targets are defined in your service agreement and depend on severity; critical issues are prioritized. We report on performance against those targets—contact us for current SLA details." },
    { q: "Do you support our existing tools and vendors?", a: "Yes. We coordinate with your existing software and vendors and can act as the single point of contact for technology issues." },
    { q: "How does onboarding work?", a: "We start with a discovery and documentation phase to understand your environment, then stabilize monitoring, security, and support before planning improvements." },
  ],
  "/services/cybersecurity": [
    { q: "What does your cybersecurity service cover?", a: "We coordinate security across users, devices, networks, cloud, applications, and data—combining monitoring, technical controls, identity protection, and governance." },
    { q: "Can you help us meet HIPAA, SOC 2, or NYDFS requirements?", a: "We align security controls and documentation to frameworks including HIPAA, SOC 2, NIST CSF, and NYDFS. We support your compliance program; certification itself is issued by auditors, not by us." },
    { q: "Do you provide 24/7 monitoring and response?", a: "Yes. We provide continuous monitoring with detection and response; the exact scope and response targets are defined in your agreement." },
    { q: "Who is responsible for compliance—us or you?", a: "Compliance is a shared responsibility. We implement and document controls and advise on gaps; your organization owns policies, decisions, and regulatory obligations." },
  ],
  "/services/cloud": [
    { q: "Which cloud platforms do you support?", a: "We focus on Microsoft Azure and Microsoft 365, covering infrastructure, migration, security, and ongoing management." },
    { q: "Can you migrate us without downtime?", a: "We plan migrations to minimize disruption and, where feasible, achieve cutovers with little or no downtime; actual impact depends on your environment." },
    { q: "Do you manage cloud security and cost?", a: "Yes. We apply security baselines and monitor usage to help control cost, and we review configuration against best practices." },
  ],
  "/services/ai": [
    { q: "How do we adopt AI safely?", a: "We start with a readiness assessment covering business goals, data, security, and governance, then implement managed AI with appropriate controls." },
    { q: "Will our data be protected?", a: "We design AI adoption with data protection and access controls in mind and align usage to your security and compliance requirements." },
    { q: "Do we need AI governance?", a: "For most organizations, yes—clear policy and oversight reduce risk. We help establish practical governance proportional to your use of AI." },
  ],
  "/services/vcio-vciso": [
    { q: "What does a vCIO or vCISO do?", a: "A vCIO guides technology strategy, budgeting, and roadmap; a vCISO guides security strategy, risk, and compliance—both on a fractional, as-needed basis." },
    { q: "Is this a full-time commitment?", a: "No. Our vCIO/vCISO services are fractional and scaled to your needs, giving executive-level direction without a full-time hire." },
  ],
  "/industries/healthcare": [
    { q: "Do you support HIPAA compliance for healthcare?", a: "We align managed IT and security controls and documentation to HIPAA. We support your compliance program; we do not issue certifications." },
    { q: "Can you work with our EHR and clinical systems?", a: "Yes. We coordinate with your electronic health record and clinical systems and their vendors to keep them secure and available." },
  ],
  "/industries/financial-services": [
    { q: "Can you help with SOC 2 and NYDFS?", a: "We align controls and documentation to SOC 2 and NYDFS requirements and support your audit readiness." },
    { q: "How do you protect sensitive financial data?", a: "We apply layered security—identity protection, endpoint and network controls, monitoring, and governance—tailored to financial data sensitivity." },
  ],
};

export const faqPageLd = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
