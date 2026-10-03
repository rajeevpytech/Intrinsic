import React from "react";
import { ArrowRight, HeartPulse, BarChart3, Users, FileText, HardHat } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { GovHeroBackdrop, GovHeroPanels, PracticePanes, GovOngoingArcs } from "../components/governance/GovernanceGraphics";

/* ---------- shared eyebrow (amber tick + label) ---------- */
const Eyebrow = ({ children, tone = "royal", className = "" }) => {
  const color = tone === "white" ? "text-white/90" : "text-[#f2a91c]";
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <span className="block w-9 h-[3px] bg-[#f2a91c]" />
      <span className={`eyebrow ${color}`}>{children}</span>
    </div>
  );
};

/* ============================ HERO ============================ */
const Hero = () => (
  <section className="gc-hero relative overflow-hidden pt-[var(--nav-h)]" data-testid="gc-hero">
    <GovHeroBackdrop />
    <GovHeroPanels className="hidden lg:block absolute right-[1.5%] top-[var(--nav-h)] bottom-0 w-[24%] animate-fade-in" />
    <div className="container-x relative z-10 pt-10 lg:pt-12 pb-12 lg:pb-14">
      <div className="animate-fade-up">
        <p className="gc-hero-eyebrow" data-testid="gc-hero-eyebrow">Governance &amp; Compliance</p>
        <span className="block w-[60px] h-[2px] bg-[#f2a91c] mt-2.5" />
      </div>
      <h1 className="font-serif text-[#0f1f6e] font-normal text-[34px] sm:text-[42px] lg:text-[50px] xl:text-[54px] leading-[1.08] tracking-[-0.01em] mt-5 max-w-[760px] animate-fade-up" style={{ animationDelay: "80ms" }}>
        Bringing Structure,<br className="hidden sm:block" /> Accountability, and<br className="hidden sm:block" /> Oversight to Technology Risk
      </h1>
      <div className="lg:ml-[43%] max-w-[480px] mt-6 lg:mt-7">
        <p className="text-[#2f3d5e] text-[15px] leading-[1.45] animate-fade-up" style={{ animationDelay: "160ms" }}>
          Organizations face a growing set of responsibilities around technology, cybersecurity, information, and AI. Those responsibilities may come from regulation, clients, contracts, insurers, internal policies, or the nature of the information the organization handles.
        </p>
        <p className="text-[#2f3d5e] text-[15px] leading-[1.45] mt-4 animate-fade-up" style={{ animationDelay: "220ms" }}>
          Intrinsic helps organizations turn those requirements into a practical governance program—establishing appropriate policies and controls, assigning responsibility, maintaining documentation and evidence, and providing ongoing oversight as requirements and technology change.
        </p>
        <div className="mt-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <button type="button" data-contact-trigger className="gc-hero-btn" data-testid="gc-hero-cta">
            <span>Talk to Our Team</span><ArrowRight size={15} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  </section>
);

/* ==================== GOVERNANCE IN PRACTICE ==================== */
const STEPS = [
  { n: "01", label: "Requirements", desc: "Understand applicable regulatory, contractual, client, insurance, and internal requirements.", color: "#0a3ec8", labelColor: "#2953c2", tint: "#eef4fe", tintB: "#f7faff" },
  { n: "02", label: "Controls", desc: "Define the policies, technical safeguards, operating procedures, and responsibilities required to address them.", color: "#395c53", labelColor: "#34524b", tint: "#e9eeeb", tintB: "#f3f6f4" },
  { n: "03", label: "Evidence", desc: "Maintain the documentation, records, assessments, and other evidence needed to demonstrate how controls are being managed.", color: "#f2a91c", labelColor: "#223247", tint: "#fdf3e5", tintB: "#fff9f1" },
  { n: "04", label: "Oversight", desc: "Review changes, identify gaps, track remediation, and provide leadership with visibility into material issues.", color: "#94aaa2", labelColor: "#33454f", tint: "#eaeeee", tintB: "#f4f6f6" },
];

const Practice = () => (
  <section className="bg-white py-12 lg:py-16 overflow-hidden" data-testid="gc-practice">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-14 items-start">
      <Reveal className="lg:col-span-12 xl:col-span-5">
        <p className="gp2-eyebrow" data-testid="gc-practice-eyebrow">Governance in Practice</p>
        <span className="block w-[42px] h-[2px] bg-[#f2a91c] mt-2" />
        <h2 className="font-serif text-[#1a44c4] font-normal text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.06] tracking-[-0.01em] mt-[31px]">From Requirements<br className="hidden sm:block" /> to Evidence</h2>
        <p className="text-[#2b3550] text-[16px] leading-[1.42] mt-5">Effective governance requires more than written policies. Organizations need to understand what applies to them, determine how requirements will be addressed, implement appropriate controls, and demonstrate that those controls are being maintained.</p>
        <p className="text-[#2b3550] text-[16px] leading-[1.42] mt-4">Intrinsic supports that process across four connected areas:</p>
      </Reveal>

      <Reveal className="lg:col-span-12 xl:col-span-7 xl:pt-2" delay={120}>
        <div className="gp2-row" data-testid="gc-practice-steps">
          <span className="gp2-runner" />
          {STEPS.map((s, i) => (
            <div key={s.n} className="gp2-col" style={{ "--c": s.color, "--i": i }}>
              <div className="gp2-panel" style={{ background: `linear-gradient(160deg, ${s.tintB} 0%, ${s.tint} 55%, ${s.tint} 100%)` }}>
                <span className="gp2-num font-serif">{s.n}</span>
              </div>
              <span className={`gp2-seg ${i === STEPS.length - 1 ? "gp2-seg-last" : ""}`} />
              <span className="gp2-dot" />
              <p className="gp2-label" style={{ color: s.labelColor }}>{s.label}</p>
              <p className="gp2-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ==================== OUR GOVERNANCE PRACTICES ==================== */
const PRACTICES = [
  { v: "it", title: "IT Governance", body: "Establish greater structure around how technology is managed, including policies and standards, access and change management, vendor oversight, business continuity, technology lifecycle, documentation, and accountability.", link: "Explore IT Governance" },
  { v: "sec", title: "Security Governance & Compliance", body: "Establish and maintain the security policies, risk-management practices, controls, documentation, and evidence required to support regulatory, contractual, client, and insurance requirements.", link: "Explore Security Governance & Compliance" },
  { v: "ai", title: "AI Governance & Compliance", body: "Define how AI may be introduced and used across the organization, including approved applications, acceptable use, information access, use-case risk, third-party AI, accountability, and ongoing oversight.", link: "Explore AI Governance & Compliance" },
];

const Practices = () => (
  <section data-type-tone="dark" className="bg-[#002f77] relative overflow-hidden py-12 lg:py-16" data-testid="gc-practices">
    <div className="container-x relative z-10">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <Reveal className="lg:col-span-7">
          <p className="gp3-eyebrow" data-testid="gc-practices-eyebrow">Our Governance Practices</p>
          <span className="block w-[42px] h-[2px] bg-[#f2a91c] mt-2" />
          <h2 className="font-serif text-white font-normal text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.06] tracking-[-0.01em] mt-[31px]">Governance Across<br className="hidden sm:block" /> Technology, Security, and AI</h2>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:pt-4" delay={100}>
          <p className="text-white/90 text-[15px] leading-[1.42]">Intrinsic helps organizations establish and maintain governance practices across their broader technology environment. Our approach is designed to be practical, aligned with the organization's operations, and responsive to changing requirements.</p>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-3 gap-y-12 md:gap-0 mt-8 lg:mt-6">
        {PRACTICES.map((p, i) => (
          <Reveal key={p.title} delay={i * 140} className={`gp3-col md:pr-8 ${i > 0 ? "md:pl-10 md:border-l md:border-white/20" : ""}`}>
            <PracticePanes variant={p.v} className="w-[200px] -ml-1" />
            <h3 className="font-sans text-white font-bold text-[14px] tracking-[0.03em] uppercase mt-3 max-w-[240px]">{p.title}</h3>
            <p className="text-white/85 text-[14px] leading-[1.45] mt-4 max-w-[320px]">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ================ INDUSTRY & REGULATORY REQUIREMENTS ================ */
const INDUSTRIES = [
  { Icon: HeartPulse, title: "Healthcare", tags: "HIPAA · Information Protection · Access Controls · Risk Assessment · Business Continuity" },
  { Icon: BarChart3, title: "Financial Services", tags: "NYDFS Part 500 · Cybersecurity Risk · Incident Response · Access · Third-Party Oversight" },
  { Icon: Users, title: "Non-Profit", tags: "Sensitive Information · Access · Contractual & Funding Requirements · Business Continuity" },
  { Icon: FileText, title: "Professional Services", tags: "Client Information · Contractual Security · Privacy · Cyber Insurance · Business Continuity" },
  { Icon: HardHat, title: "Construction", tags: "Project Information · Distributed Access · Vendors · Mobile Environments · Contractual Security" },
];

const Industries = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="gc-industries">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <Reveal className="lg:col-span-6">
          <p className="gp2-eyebrow" data-testid="gc-industries-eyebrow">Industry &amp; Regulatory Requirements</p>
          <span className="block w-[42px] h-[2px] bg-[#f2a91c] mt-2" />
          <h2 className="font-serif text-[#1a44c4] font-normal text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.06] tracking-[-0.01em] mt-[31px]">Requirements Depend<br className="hidden sm:block" /> on the Business</h2>
        </Reveal>
        <Reveal className="lg:col-span-6 lg:pt-4" delay={100}>
          <p className="text-[#2b3550] text-[15px] leading-[1.42]">Governance should reflect the organization—not simply a standard checklist. Industry, information handled, contractual commitments, clients, insurers, and applicable regulation can materially change the controls an organization needs.</p>
          <p className="text-[#2b3550] text-[15px] leading-[1.42] mt-3">Intrinsic brings this context into the governance process.</p>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-9 gap-x-8 lg:gap-x-0 mt-10 lg:mt-12" data-testid="gc-industries-grid">
        {INDUSTRIES.map(({ Icon, title, tags }, i) => (
          <Reveal key={title} delay={(i % 3) * 110 + Math.floor(i / 3) * 160} className={`gi-item flex items-start gap-5 ${i % 3 !== 0 ? "lg:border-l lg:border-[#cfd6e6] lg:pl-8" : ""} ${i % 3 !== 2 ? "lg:pr-8" : ""}`}>
            <span className="gi-icon shrink-0 text-[#1a44c4]" style={{ "--i": i }}><Icon size={44} strokeWidth={1.35} /></span>
            <div>
              <h3 className="font-sans text-[#1a44c4] font-bold text-[15px] tracking-[0.04em] uppercase">{title}</h3>
              <p className="text-[#3a4356] text-[15px] leading-[1.5] mt-2.5 max-w-[280px]">{tags}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ==================== FRAMEWORKS & REQUIREMENTS ==================== */
const FRAMEWORKS = [
  { title: "NIST CSF", body: "Cybersecurity risk management and security controls." },
  { title: "HIPAA", body: "Safeguards supporting the protection of electronic protected health information." },
  { title: "NYDFS Part 500", body: "Cybersecurity requirements applicable to covered financial services organizations." },
  { title: "SOC 2", body: "Controls relevant to security and other applicable trust services criteria." },
  { title: "NIST AI RMF", body: "A framework for managing risks associated with the design, deployment, and use of AI." },
];

const Frameworks = () => (
  <section className="bg-[#dee6e0] py-12 lg:py-16 overflow-hidden" data-testid="gc-frameworks">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <Reveal className="lg:col-span-6">
          <p className="gp2-eyebrow" style={{ color: "#f2a91c" }} data-testid="gc-frameworks-eyebrow">Frameworks &amp; Requirements</p>
          <span className="block w-[42px] h-[2px] bg-[#f2a91c] mt-2" />
          <h2 className="font-serif text-[#1e3f36] font-normal text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.06] tracking-[-0.01em] mt-[31px]">Working Within<br className="hidden sm:block" /> Established Standards</h2>
        </Reveal>
        <Reveal className="lg:col-span-6 lg:pt-4" delay={100}>
          <p className="text-[#2c3a35] text-[15px] leading-[1.42]">Depending on the organization and its requirements, governance and security controls may be informed by established regulatory requirements and industry frameworks.</p>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8 mt-8 lg:mt-9" data-testid="gc-frameworks-grid">
        {FRAMEWORKS.map((f, i) => (
          <Reveal key={f.title} delay={i * 110} className={`gf-item relative ${i > 0 ? "lg:pl-7" : ""} lg:pr-6`}>
            {i > 0 && <span className="gf-rule hidden lg:block" style={{ "--i": i }} />}
            <h3 className="font-sans text-[#1e3f36] font-bold text-[15px] tracking-[0.04em] uppercase">{f.title}</h3>
            <p className="text-[#3a4a44] text-[15px] leading-[1.5] mt-2.5 max-w-[220px]">{f.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ==================== ONGOING GOVERNANCE (CTA) ==================== */
const Ongoing = () => (
  <section data-type-tone="dark" className="bg-[#1f453d] relative overflow-hidden py-12 lg:py-16" data-testid="gc-ongoing">
    <GovOngoingArcs />
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      <Reveal className="lg:col-span-7">
        <p className="gp3-eyebrow" data-testid="gc-ongoing-eyebrow">Ongoing Governance</p>
        <span className="block w-[42px] h-[2px] bg-[#f2a91c] mt-2" />
        <h2 className="font-serif text-white font-normal text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.06] tracking-[-0.01em] mt-[31px]">Maintaining the Program</h2>
        <p className="text-white text-[15px] leading-[1.45] mt-4">Requirements change. Technology changes. Controls change.</p>
        <p className="text-white/85 text-[14.5px] leading-[1.45] mt-4 max-w-[640px]">Intrinsic provides ongoing governance support to maintain policies and documentation, review control status, coordinate assessments, track remediation, evaluate changes in the environment, and identify matters requiring management attention.</p>
      </Reveal>
      <Reveal className="lg:col-span-5 relative lg:pl-14" delay={120}>
        <span className="go-rule hidden lg:block" />
        <p className="font-sans text-white font-bold text-[13px] tracking-[0.08em] uppercase leading-[1.55]">Build a Stronger<br />Governance Program.</p>
        <div className="mt-5">
          <button type="button" data-contact-trigger className="gc-hero-btn" data-testid="gc-ongoing-cta">
            <span>Talk to Our Team</span><ArrowRight size={15} strokeWidth={2.2} />
          </button>
        </div>
      </Reveal>
    </div>
    <div className="relative z-10 pt-10">
      <p className="container-x text-white/45 text-[11.5px] leading-relaxed max-w-[720px]">Intrinsic supports the implementation and management of technology and security controls associated with applicable requirements. Intrinsic does not provide legal advice, certification, or an independent determination of regulatory compliance.</p>
    </div>
  </section>
);

export default function SecurityGovernance() {
  return (
    <div className="bg-white page-in" data-testid="compliance-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Practice />
        <Practices />
        <Industries />
        <Frameworks />
        <Ongoing />
      </main>
      <Footer />
    </div>
  );
}
