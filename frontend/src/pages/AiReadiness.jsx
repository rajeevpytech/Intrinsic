import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, ListChecks, AlertCircle, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { motion } from "framer-motion";
import { AiEyebrow, GoldBtn, NavyBtn, ExploreLink, C } from "../components/ai/AiGraphics";
import { EnvironmentMotion } from "../components/ai/EnvironmentMotion";
import { PlanGlyph } from "../components/ai/PlanGlyph";
import { BlockMotion } from "../components/ai/GovernanceMotion";
import { StagesMotion } from "../components/ai/AiMotion";

const AREAS = [
  { title: "Business & Use Cases", body: "Business objectives, proposed and existing AI use, expected outcomes, priorities, and the organizational requirements AI is intended to support." },
  { title: "Technology Environment", body: "Infrastructure, cloud platforms, Microsoft 365, applications, integrations, third-party AI services, and the technical dependencies associated with AI adoption." },
  { title: "Data & Information", body: "Information sources, data quality, structure, accessibility, ownership, retention, and the information that may be made available to AI systems." },
  { title: "Identity, Access & Security", body: "Identity management, authentication, permissions, endpoints, application access, data protection, and the security controls surrounding AI use." },
  { title: "Governance & Risk", body: "AI policies, approved use, information handling, accountability, oversight, regulatory considerations, and processes for identifying and managing AI-related risk." },
  { title: "Organizational Readiness", body: "Leadership alignment, internal responsibility, user preparedness, training, operational processes, and the organization's ability to support and manage AI over time." },
];

const REPORT = [
  { Icon: BarChart3, title: "Overall Readiness", body: "An initial assessment of the organization's current level of preparedness." },
  { Icon: ListChecks, title: "Readiness by Area", body: "Individual results across business, technology, data and information, security, governance, and organizational readiness." },
  { Icon: AlertCircle, title: "Priority Considerations", body: "Areas identified through the assessment as requiring further attention or evaluation." },
  { Icon: FileText, title: "Recommended Actions", body: "Initial actions based on the organization's responses and identified priorities." },
];

const FINDINGS = ["Current state and areas of readiness", "Material gaps and areas of exposure", "Technical and organizational dependencies", "Governance and security requirements", "Priorities for remediation or preparation", "Recommended path for adoption"];

const PLAN = [
  { k: "Ready", g: "ready", v: "Areas that can move forward.", bg: "#3d5a4c", fg: "text-white" },
  { k: "Prepare", g: "prepare", v: "Matters to address before adoption.", bg: "#7c9484", fg: "text-white" },
  { k: "Address", g: "address", v: "Material gaps requiring attention.", bg: "#d5ddd6", fg: "text-[#1e3f36]" },
  { k: "Decide", g: "decide", v: "Items requiring further evaluation or leadership decision.", bg: "#e8e4d8", fg: "text-[#1e3f36]" },
];

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)]" style={{ background: "linear-gradient(120deg, #eef4fb 0%, #e4edf8 52%, #f3f8fd 100%)" }} data-testid="air-hero">
    <div className="grid lg:grid-cols-2 items-center">
      <div className="px-5 sm:px-8 lg:pl-[max(2rem,calc((var(--vw)-1240px)/2+2rem))] lg:pr-14 py-12 lg:py-16 flex flex-col justify-center">
        <AiEyebrow className="animate-fade-up">AI Readiness Assessment</AiEyebrow>
        <h1 className="ai-h1 mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>Establishing the Foundation for AI Adoption</h1>
        <p className="ai-p mt-7 max-w-[520px] animate-fade-up" style={{ animationDelay: "160ms" }}>AI readiness extends beyond technology. It depends on accessible information, appropriate permissions, security controls, governance, and operational preparedness.</p>
        <p className="ai-p mt-4 max-w-[520px] animate-fade-up" style={{ animationDelay: "200ms" }}>Intrinsic evaluates these areas to identify material gaps and establish priorities for responsible AI adoption.</p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <GoldBtn testId="air-hero-cta">Schedule an AI Readiness Assessment</GoldBtn>
        </div>
      </div>
      <div className="relative flex items-center justify-center px-6 pb-12 pt-4 lg:py-16 lg:pr-[max(2rem,calc((var(--vw)-1240px)/2+2rem))] animate-fade-in" style={{ animationDelay: "200ms" }} data-testid="air-hero-panel">
        <div className="live-float w-full max-w-[420px]" data-testid="air-hero-image">
          <img src="/images/ai-assessment-hero.png" loading="eager" alt="AI readiness assessment areas: business and use cases, technology environment, data and information, identity access and security, governance and risk, organizational readiness" className="air-band air-reveal w-full h-auto block" data-testid="air-hero-image-full" />
        </div>
      </div>
    </div>
  </section>
);

const Context = () => (
  <section className="ai-cream py-12 lg:py-16" data-testid="air-context">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-6">
        <AiEyebrow>AI Readiness in Context</AiEyebrow>
        <h2 className="ai-h2 mt-6">Evaluating the Environment Behind AI</h2>
        <p className="ai-p mt-6">AI does not operate independently of the technology and information environment around it.</p>
        <p className="ai-p mt-4">Its effectiveness and risk are influenced by how information is organized, where it resides, who has access to it, how identities and applications are controlled, and what governance is in place.</p>
        <p className="ai-p mt-4">These considerations become particularly important as AI capabilities are integrated with platforms such as Microsoft 365 and other business applications, where existing access rights and information structures can directly influence what AI can retrieve and present.</p>
        <p className="ai-p mt-4">Intrinsic evaluates readiness across these interconnected areas to establish whether the appropriate foundations are in place and identify matters requiring attention before or alongside adoption.</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6"><EnvironmentMotion className="h-[300px] lg:h-[460px]" /></Reveal>
    </div>
  </section>
);

const Areas = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="air-areas">
    <div className="container-x">
      <Reveal><AiEyebrow>Areas of Assessment</AiEyebrow><h2 className="ai-h2 mt-6">A Comprehensive View of AI Readiness</h2></Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-12 ai-divided">
        {AREAS.map((a, i) => (
          <Reveal key={a.title} delay={i * 70} className="ai-divided-cell">
            <span className="ai-num">0{i + 1}</span>
            <h3 className="ai-h3 mt-3">{a.title}</h3>
            <p className="ai-p-sm mt-3">{a.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Online = () => (
  <section className="text-white py-12 lg:py-16 overflow-hidden" style={{ background: C.navy }} data-testid="air-online">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-6">
        <AiEyebrow light>Online AI Readiness Assessment</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">An Initial Assessment of Your Current Position</h2>
        <p className="ai-p text-white/90 mt-6">Intrinsic's online assessment provides organizations with an initial evaluation of AI readiness across the six areas above.</p>
        <p className="ai-p text-white/90 mt-4">The assessment takes approximately 5–7 minutes to complete. Responses are evaluated across each readiness area and presented in an immediate report.</p>
        <div className="mt-8"><button type="button" data-contact-trigger className="ai-outline-btn" data-testid="air-online-cta">Begin Assessment <span aria-hidden="true">→</span></button></div>
      </Reveal>
      <Reveal delay={150} className="lg:col-span-6 lg:pl-10">
        <img src="/images/ai-assessment-report.png" alt="AI Readiness Assessment report" className="w-full h-auto lg:scale-[1.15] lg:origin-right" data-testid="air-report-image" />
      </Reveal>
    </div>
  </section>
);

const Report = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="air-report">
    <div className="container-x">
      <Reveal><AiEyebrow>Your Report Includes</AiEyebrow></Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 mt-10 ai-divided">
        {REPORT.map((r, i) => (
          <Reveal key={r.title} delay={i * 80} className="ai-divided-cell">
            <r.Icon size={30} strokeWidth={1.6} className="text-[#00388e]" />
            <h3 className="ai-h3 text-[16px] mt-5">{r.title}</h3>
            <p className="ai-p-sm mt-3">{r.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Comprehensive = () => (
  <section className="ai-cream py-12 lg:py-16" data-testid="air-comprehensive">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-6">
        <AiEyebrow>Comprehensive Readiness Assessment</AiEyebrow>
        <h2 className="ai-h2 mt-6">Moving Beyond <br />Self-Assessment</h2>
        <p className="ai-p mt-6">The online assessment provides an initial indication of readiness based on the organization's responses. Where AI adoption is being actively considered or expanded, a more detailed evaluation of the underlying environment may be appropriate.</p>
        <p className="ai-p mt-4">Intrinsic's comprehensive assessment can examine Microsoft 365 and cloud configuration, identity and access, information repositories and permissions, security controls, data practices, governance requirements, existing AI use, proposed use cases, third-party AI applications, and relevant technology dependencies.</p>
        <div className="mt-8"><GoldBtn testId="air-comp-cta">Learn More</GoldBtn></div>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6">
        <div className="bg-[#dbe7f5] p-8 sm:p-12" data-testid="air-findings">
          <p className="text-[#1f3f8f] font-semibold text-[15px]">The findings are evaluated collectively to establish:</p>
          <ul className="mt-6 space-y-4">
            {FINDINGS.map((f, i) => (
              <motion.li key={f} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="flex items-center gap-4 text-[#2b3550] text-[15px]">
                <motion.span className="ai-square" animate={{ backgroundColor: [C.royal, C.navy, C.royal] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }} />{f}
              </motion.li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);

const Plan = () => (
  <section className="ai-sage-light py-12 lg:py-16" data-testid="air-plan">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-5">
        <AiEyebrow>Defined Readiness Plan</AiEyebrow>
        <h2 className="ai-h2 text-[#1e3f36] mt-6">A Defined Readiness Plan</h2>
        <p className="ai-p mt-6">The assessment findings are translated into a prioritized readiness plan that identifies recommended actions, dependencies, areas requiring remediation, and considerations for AI adoption.</p>
        <p className="ai-p mt-4">This provides leadership and IT teams with a structured basis for determining what can move forward, what requires further preparation, and where responsibility should be established.</p>
        <p className="ai-p mt-4">The result is a defined view of the current environment together with the priorities required to support informed AI adoption.</p>
      </Reveal>
      <div className="lg:col-span-7 grid grid-cols-2 xl:grid-cols-4">
        {PLAN.map((p, i) => (
          <Reveal key={p.k} delay={i * 100} className="h-full">
            <div className={`h-full min-h-[240px] p-6 flex flex-col ${p.fg}`} style={{ background: p.bg }} data-testid={`air-plan-${i}`}>
              <p className="font-sans font-bold text-[13px] tracking-[0.14em] uppercase">{p.k}</p>
              <span className="block w-[34px] h-[2px] bg-[#f2a91c] mt-3" />
              <PlanGlyph kind={p.g} className="mt-6 opacity-90" />
              <p className="text-[14px] leading-[1.5] mt-auto pt-8 opacity-90">{p.v}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Next = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="air-next">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14">
      <Reveal className="lg:col-span-5"><AiEyebrow>From Assessment to Ongoing Management</AiEyebrow><h2 className="ai-h2 mt-6">Establishing the Appropriate Next Steps</h2></Reveal>
      <Reveal delay={100} className="lg:col-span-7">
        <p className="ai-p">AI readiness requirements will differ by organization.</p>
        <p className="ai-p mt-4">The assessment may identify a need to strengthen identity and permissions, improve information governance, establish policies and approved-use standards, address security controls, prepare Microsoft 365 for Copilot, refine proposed use cases, evaluate third-party AI applications, or establish responsibility for ongoing AI management.</p>
        <p className="ai-p mt-4">Where additional support is required, Intrinsic can carry these priorities forward through <Link to="/services/ai-governance-compliance" className="ai-inline-link" data-testid="air-link-gov">AI Governance &amp; Compliance</Link> and <Link to="/services/managed-ai" className="ai-inline-link" data-testid="air-link-managed">Managed AI</Link>—providing continuity from readiness and preparation through governance and ongoing management.</p>
        <div className="flex flex-wrap gap-x-10 gap-y-3 mt-8">
          <ExploreLink to="/services/ai-governance-compliance" testId="air-explore-gov">Explore AI Governance &amp; Compliance</ExploreLink>
          <ExploreLink to="/services/managed-ai" testId="air-explore-managed">Explore Managed AI</ExploreLink>
        </div>
      </Reveal>
    </div>
    <div className="container-x mt-10"><Reveal><StagesMotion stages={["Assess", "Prioritize", "Remediate", "Govern", "Manage"]} className="w-full max-w-[880px] mx-auto h-auto" /></Reveal></div>
  </section>
);

const CTA = () => (
  <section className="relative overflow-hidden text-white py-12 lg:py-16" style={{ background: C.navy }} data-testid="air-cta">
    <div className="absolute right-0 top-0 h-full w-[36%] hidden lg:block"><BlockMotion className="w-full h-full" /></div>
    <div className="container-x relative z-10 max-w-[800px] lg:mr-auto">
      <Reveal>
        <AiEyebrow light>AI Readiness Assessment</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">A Clearer Basis for AI Decisions</h2>
        <p className="ai-p text-white/90 mt-6">Understand the current environment, identify the requirements that matter, and establish a structured basis for AI adoption.</p>
        <div className="flex flex-wrap gap-4 mt-8">
          <GoldBtn testId="air-cta-begin">Begin the AI Readiness Assessment</GoldBtn>
          <button type="button" data-contact-trigger className="ai-outline-btn" data-testid="air-cta-talk">Talk to Our Team <span aria-hidden="true">→</span></button>
        </div>
      </Reveal>
    </div>
  </section>
);

export default function AiReadiness() {
  return (
    <div className="bg-white page-in" data-testid="ai-readiness-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Context /><Areas /><Online /><Report /><Comprehensive /><Plan /><Next /><CTA /></main>
      <Footer />
    </div>
  );
}
