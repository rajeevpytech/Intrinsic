import React from "react";
import { ArrowRight, ArrowDown, Search, Settings, BarChart3, AlertCircle, ArrowDownRight, ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { ConvergeHero, FindingsGrid, PriorityStack, ResolveStack, Ring, TrendChart } from "../components/monitoring/VulnGraphics";

const LIFECYCLE = [
  { Icon: Search, phase: "Assess", title: "Understand Your Exposure", color: "#4a6b5c", bg: "#e7ede8", points: ["Identify vulnerabilities across infrastructure, endpoints, cloud environments, and external assets.", "Understand affected systems and dependencies.", "Evaluate potential impact and business relevance.", "Review external exposure, including domains, applications, APIs, and unidentified assets."] },
  { Icon: Settings, phase: "Address", title: "Establish and Manage Remediation Priorities", color: "#f2a91c", bg: "#fdf1dd", points: ["Prioritize findings based on potential impact and business relevance.", "Define remediation actions through patching, configuration changes, and appropriate security controls.", "Coordinate remediation across responsible technical teams.", "Maintain accountability for priority findings through resolution."] },
  { Icon: BarChart3, phase: "Oversee", title: "Maintain Visibility Through Resolution", color: "#2f7ad6", bg: "#e6eefb", points: ["Validate remediation through rescanning.", "Track outstanding findings and manage documented exceptions.", "Report on remediation status, remaining exposure, and risk trends over time.", "Provide technical and executive visibility into security risk."] },
];

const STAGES = [
  { label: "Identify Findings", caption: "Vulnerabilities across your environment.", G: FindingsGrid },
  { label: "Analyze & Prioritize", caption: "Evaluate risk, exploitability, and business impact.", G: PriorityStack },
  { label: "Manage & Resolve", caption: "Track progress and reduce exposure over time.", G: ResolveStack },
];

const CtaBtn = ({ children, testId }) => (
  <button type="button" data-assessment className="gc-hero-btn" data-testid={testId}><span>{children}</span><ArrowRight size={14} strokeWidth={2.5} /></button>
);

const Hero = () => (
  <section className="va-cream relative overflow-hidden pt-[var(--nav-h)]" data-testid="vuln-hero">
    <div className="grid lg:grid-cols-12">
      <div className="lg:col-span-6 px-5 sm:px-8 lg:pl-[max(2rem,calc((var(--vw)-1240px)/2+2rem))] lg:pr-10 py-12 lg:py-16 flex flex-col justify-center">
        <p className="va-eyebrow animate-fade-up" data-testid="vuln-hero-eyebrow">Security Assessments &amp; Vulnerability Management</p>
        <h1 className="va-h1 mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>Security Exposure. <br />Assessed, Prioritized, <br />and Managed.</h1>
        <p className="va-p mt-7 max-w-[560px] animate-fade-up" style={{ animationDelay: "160ms" }}>Intrinsic provides security assessments, vulnerability management, penetration testing, and remediation planning to identify security exposure and establish clear priorities for risk reduction.</p>
        <p className="va-p mt-4 max-w-[560px] animate-fade-up" style={{ animationDelay: "220ms" }}>Findings are evaluated in the context of affected systems, potential impact, business relevance, and the broader technology environment—providing technical teams and leadership with a structured view of security risk.</p>
        <div className="mt-9 animate-fade-up" style={{ animationDelay: "300ms" }}><CtaBtn testId="vuln-hero-cta">Talk to Our Team</CtaBtn></div>
      </div>
      <div className="lg:col-span-6 relative min-h-[300px] animate-fade-in" style={{ animationDelay: "200ms" }}>
        <ConvergeHero className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  </section>
);

const Exposure = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="vuln-exposure">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-0">
      <Reveal className="lg:col-span-5 lg:pr-14 lg:border-r lg:border-[#c9d2dc]">
        <p className="va-eyebrow">Security Risk Assessment</p>
        <h2 className="va-h2 mt-6">Establishing a Clear <br />View of Exposure.</h2>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7 lg:pl-14">
        <p className="va-p">Security assessments provide visibility into vulnerabilities across infrastructure, endpoints, cloud environments, applications, and externally exposed assets.</p>
        <p className="va-p mt-5">Intrinsic evaluates findings beyond technical severity alone. Exploitability, affected systems, business relevance, and potential impact are considered together to establish a more meaningful view of exposure and determine remediation priorities.</p>
        <p className="va-p mt-5">This provides a defined basis for allocating technical resources, addressing material findings, and managing security improvement over time.</p>
      </Reveal>
    </div>
  </section>
);

const Lifecycle = () => (
  <section className="bg-[#f7f9fb] py-12 lg:py-16 overflow-hidden" data-testid="vuln-capabilities">
    <div className="container-x">
      <Reveal>
        <p className="va-eyebrow">Assessment &amp; Vulnerability Management</p>
        <h2 className="va-h2 mt-6">Comprehensive Management Across the Vulnerability Lifecycle</h2>
        <p className="va-p mt-5 max-w-[900px]">Intrinsic manages security findings from identification and analysis through remediation, validation, and reporting. Automated assessment is supported by technical analysis and ongoing oversight, providing visibility into both current exposure and remediation progress.</p>
      </Reveal>
      <div className="mt-14 grid lg:grid-cols-[1fr_40px_1fr_40px_1fr] gap-y-10 items-start" data-testid="vuln-lifecycle-graphic">
        {STAGES.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="flex items-center justify-center lg:pt-[120px] text-[#0f2f7a] va-arrow" style={{ "--i": i }}><ArrowRight size={26} className="hidden lg:block" /><ArrowDown size={26} className="lg:hidden" /></div>}
            <Reveal delay={i * 140} data-testid={`vuln-cap-${i}`}>
              <p className="va-stage-label">{s.label}</p>
              <div className="mt-5 bg-white/70 p-3 rounded-sm min-h-[212px] flex flex-col justify-center"><s.G /></div>
              <p className="text-center text-[#2b3550] text-[16px] leading-[1.45] mt-5 max-w-[300px] mx-auto">{s.caption}</p>
            </Reveal>
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

const Resolution = () => (
  <section className="va-cream py-12 lg:py-16" data-testid="vuln-lifecycle">
    <div className="container-x">
      <Reveal>
        <p className="va-eyebrow">Vulnerability Management</p>
        <h2 className="va-h2 mt-6">From Identification to Resolution</h2>
        <p className="va-p mt-5 max-w-[760px]">Intrinsic manages security findings from assessment through remediation and validation, providing visibility into both current exposure and progress toward resolution.</p>
      </Reveal>
      <div className="grid md:grid-cols-3 mt-14 va-phases">
        {LIFECYCLE.map(({ Icon, phase, title, points, color, bg }, i) => (
          <Reveal key={phase} delay={i * 130} className="va-phase" data-testid={`vuln-phase-${i}`}>
            <div className="flex items-start gap-5">
              <span className="va-phase-icon" style={{ background: bg, color }}><Icon size={26} strokeWidth={1.8} /></span>
              <div>
                <p className="text-[#5c6b82] text-[12px] tracking-[0.1em]">0{i + 1}</p>
                <p className="font-sans font-bold text-[#0f2f7a] text-[17px] tracking-[0.06em] uppercase mt-0.5">{phase}</p>
                <p className="text-[#0f2f7a] text-[14.5px] font-semibold leading-[1.35] mt-1">{title}</p>
              </div>
            </div>
            <ul className="mt-7 space-y-3">
              {points.map((p) => <li key={p} className="flex gap-3 text-[#2e3745] text-[14px] leading-[1.5]"><span className="mt-[7px] w-2 h-2 rounded-full shrink-0" style={{ background: color }} />{p}</li>)}
            </ul>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <div className="va-rail" data-testid="vuln-rail">
          <span className="va-rail-line" />
          <span className="va-rail-dot" style={{ left: 0, background: "#4a6b5c" }} /><span className="va-rail-dot" style={{ left: "50%", background: "#f2a91c" }} /><span className="va-rail-dot" style={{ left: "100%", background: "#2f7ad6" }} />
        </div>
        <p className="text-right text-[#0f2f7a] text-[11px] font-semibold tracking-[0.18em] uppercase mt-4">Exposure → Priority → Resolution → Visibility</p>
      </Reveal>
    </div>
  </section>
);

const Stat = ({ children, testId }) => <div className="va-stat" data-testid={testId}>{children}</div>;

const Reporting = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="vuln-reporting">
    <div className="container-x">
      <Reveal>
        <p className="va-eyebrow">Risk Visibility &amp; Reporting</p>
        <h2 className="va-h2 mt-6">Translating Technical Findings into Security Priorities</h2>
        <p className="va-p mt-5 max-w-[1000px]">Security findings require context to support effective decision-making. Intrinsic consolidates vulnerability data, remediation status, and risk trends into reporting designed for technical and executive stakeholders. This provides visibility into current exposure, priority findings, remediation progress, and areas of remaining risk.</p>
        <p className="va-p mt-4 max-w-[1000px]">Recurring reporting helps leadership understand whether exposure is being reduced and where additional attention or investment may be required.</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr] gap-4 mt-12">
        <Reveal><Stat testId="vuln-stat-0">
          <span className="va-stat-icon" style={{ background: "#f2a91c", color: "#fff" }}><AlertCircle size={22} /></span>
          <div><p className="va-stat-num">12</p><p className="va-stat-label">Current High-Priority Findings</p><p className="va-stat-delta text-[#2f7ad6]"><ArrowDownRight size={14} /> 40% <span>vs. last assessment</span></p></div>
        </Stat></Reveal>
        <Reveal delay={90}><Stat testId="vuln-stat-1">
          <Ring pct={75} />
          <div><p className="va-stat-label mt-1">Remediation Completion</p><p className="va-stat-delta text-[#4a6b5c]"><ArrowUpRight size={14} /> 25% <span>since last quarter</span></p></div>
        </Stat></Reveal>
        <Reveal delay={180}><Stat testId="vuln-stat-2">
          <span className="va-stat-icon" style={{ background: "#e7ede8", color: "#4a6b5c" }}><BarChart3 size={22} /></span>
          <div><p className="va-stat-num">28</p><p className="va-stat-label">Remaining Open Findings</p><p className="va-stat-delta text-[#2f7ad6]"><ArrowDownRight size={14} /> 50% <span>vs. last assessment</span></p></div>
        </Stat></Reveal>
        <Reveal delay={270}><div className="va-stat block" data-testid="vuln-stat-3"><TrendChart /></div></Reveal>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="bg-[#4d6d5c] text-white py-12 lg:py-16" data-testid="vuln-cta">
    <div className="container-x flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <Reveal>
        <p className="font-serif text-[26px] sm:text-[30px] leading-[1.2]">Reduce Risk. Strengthen Your Security Posture.</p>
        <p className="text-white/85 text-[14.5px] mt-2">Schedule a security assessment to identify exposure and establish clear priorities.</p>
      </Reveal>
      <Reveal delay={100} className="shrink-0"><CtaBtn testId="vuln-cta-btn">Talk to Our Team</CtaBtn></Reveal>
    </div>
  </section>
);

export default function SecurityAssessments() {
  return (
    <div className="bg-white page-in" data-testid="vuln-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Exposure /><Lifecycle /><Resolution /><Reporting /><CTA /></main>
      <Footer />
    </div>
  );
}
