import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { GoldBtn } from "../components/ai/AiGraphics";
import { H2 } from "../components/industry/IndustrySections";
import { BlockMotion, CycleMotion } from "../components/ai/GovernanceMotion";
import { StagesMotion, LayersMotion } from "../components/ai/AiMotion";

const NAVY = "#0c3f97", INK = "#2f3c52", AMBER = "#f2a91c";
const light = (extra = {}) => ({ "--type-eyebrow-ink": "#1f3f8f", "--type-hero-ink": NAVY, "--type-section-ink": NAVY, "--type-body-ink": INK, "--type-small-ink": INK, "--type-subheading-ink": NAVY, "--type-section-desktop": 36, ...extra });

const Kicker = ({ children, testId, rule = false, light: lt = false }) => (
  <p className="eyebrow inline-flex items-center gap-3 mb-4" style={{ letterSpacing: "0.16em", color: lt ? "#e9f0ea" : undefined }} data-testid={testId}><span className="inline-block w-[34px] h-[2px]" style={{ background: AMBER }} />{children}</p>
);
const NavyBtn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="inline-flex items-center gap-3 rounded-[4px] px-6 py-3 font-mono uppercase tracking-[0.14em] text-[12.5px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#12336e]" style={{ background: "#0c3f97" }}>
    {children} <ArrowRight size={15} strokeWidth={2.2} />
  </button>
);
const Copy = ({ children, className = "", style }) => <p className={`text-[15px] leading-[1.65] ${className}`} style={style}>{children}</p>;

const APPS = [
  ["Microsoft 365 & Copilot", "Extend the capabilities of the Microsoft 365 environment your teams already use. Intrinsic supports the preparation, configuration, deployment, and ongoing management of Microsoft Copilot and related capabilities.", "/services/managed-ai"],
  ["Business Workflows", "Identify repetitive or information-intensive processes where AI and automation can reduce manual effort, improve consistency, and support more efficient execution.", "/services/ai-automation"],
  ["Knowledge & Information", "Make organizational information easier to access and use by considering how documents, SharePoint environments, knowledge sources, permissions, and information structures support AI-enabled capabilities.", "/services/ai-readiness-assessment"],
  ["IT Operations", "Apply AI-assisted capabilities to monitoring, service management, operational analysis, knowledge access, and defined automation—helping identify patterns, surface relevant information, and support faster resolution.", "/services/managed-ai"],
];
const PATHS = [
  ["AI Readiness Assessment", "Understand the environment before moving forward.", "Explore AI Readiness", "/services/ai-readiness-assessment", "#e9f1fb"],
  ["Managed AI", "From implementation to ongoing management.", "Explore Managed AI", "/services/managed-ai", "#f4f1ea"],
  ["AI Governance & Compliance", "Establishing control around the use of AI.", "Explore AI Governance", "/services/ai-governance-compliance", "#e9f1fb"],
];
const ENV = [["Identity", "& Access"], ["Data &", "Information"], ["Applications"], ["Integrations"], ["Security"], ["Governance"]];

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)] text-white" style={{ background: "#00388e", "--type-eyebrow-ink": "#ffffff", "--type-hero-ink": "#ffffff", "--type-body-ink": "rgba(255,255,255,0.9)", "--type-hero-desktop": 46, "--type-hero-tablet": 40 }} data-testid="ai-hero">
    <div className="grid lg:grid-cols-2">
      <div className="px-5 sm:px-8 lg:pl-[max(2rem,calc((var(--vw)-1240px)/2+2rem))] lg:pr-14 py-12 lg:py-16 flex flex-col justify-center">
        <div className="animate-fade-up"><Kicker testId="ai-hero-eyebrow" rule light>AI</Kicker></div>
        <h1 className="font-serif leading-[1.08] text-white animate-fade-up" style={{ animationDelay: "80ms" }} data-testid="ai-hero-title">AI That Works<br />Within Your<br />Business</h1>
        <Copy className="mt-6 max-w-[520px] animate-fade-up" style={{ animationDelay: "160ms" }}>AI is changing how organizations work with information, applications, and business processes.</Copy>
        <Copy className="mt-4 max-w-[520px] animate-fade-up" style={{ animationDelay: "200ms" }}>Intrinsic helps organizations identify where AI can provide practical value and bring those capabilities into the existing technology environment. From Microsoft Copilot and business workflows to information access and IT operations, we consider the technology, data, security, and management required to support AI effectively.</Copy>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "300ms" }}><GoldBtn testId="ai-hero-cta">Talk to Our Team</GoldBtn></div>
      </div>
      <div className="relative min-h-[320px] lg:min-h-full" data-testid="ai-hero-visual">
        <BlockMotion className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  </section>
);

const Applications = () => (
  <section className="py-12 lg:py-16" style={{ background: "#f6f4ef", ...light() }} data-testid="ai-applications">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-14 items-start">
        <Reveal className="lg:col-span-6"><Kicker testId="ai-applications-eyebrow">AI Applications</Kicker><H2>Applying AI Where It Can<br className="hidden lg:inline" /> Make a Difference</H2></Reveal>
        <Reveal delay={100} className="lg:col-span-6 lg:pt-10">
          <p className="text-[13.5px] leading-[1.65]">AI can support different areas of the business. The opportunity is determining where it has a useful role and how it should work within the systems and processes already in place.</p>
          <p className="text-[13.5px] leading-[1.65] mt-4">Intrinsic helps organizations evaluate and apply AI across four key areas.</p>
        </Reveal>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-10" data-testid="ai-app-cards">
        {APPS.map(([title, body], i) => (
          <Reveal key={title} delay={i * 80}>
            <div className="grid grid-cols-[1fr_120px] sm:grid-cols-[1fr_150px] bg-white h-full" data-testid={`ai-app-${i}`}>
              <div className="p-7 lg:p-8 flex flex-col">
                <span className="font-serif text-[30px] leading-none" style={{ color: AMBER }}>0{i + 1}</span>
                <h3 className="font-sans font-semibold text-[19px] mt-3" style={{ color: NAVY }}>{title}</h3>
                <p className="text-[12.5px] leading-[1.6] mt-3 flex-1" style={{ color: INK }}>{body}</p>
              </div>
              <img src={`/images/ai-app-${i + 1}.jpg`} alt="" className="w-full h-full object-cover object-left" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Approach = () => (
  <section className="pt-14 lg:pt-16 bg-white" style={light()} data-testid="ai-approach">
    <div className="container-x grid lg:grid-cols-12 gap-6 lg:gap-14 items-start pb-12">
      <Reveal className="lg:col-span-6"><Kicker testId="ai-approach-eyebrow" rule>A Structured Approach to AI</Kicker><H2>Different Starting Points.<br className="hidden lg:inline" /> A Connected Approach.</H2></Reveal>
      <Reveal delay={100} className="lg:col-span-6 lg:pt-12">
        <p className="text-[13.5px] leading-[1.65]">Organizations are at different stages of AI adoption. Some are determining where to begin. Others are preparing for Microsoft Copilot, introducing AI into business workflows, or addressing governance around AI already in use.</p>
        <p className="text-[13.5px] leading-[1.65] mt-4">Intrinsic provides support across the AI lifecycle—from understanding the current environment and preparing for adoption to implementation, ongoing management, and governance.</p>
      </Reveal>
    </div>
    <div className="container-x pb-10"><Reveal><StagesMotion stages={["Assess", "Prepare", "Implement", "Manage", "Govern"]} className="w-full max-w-[880px] mx-auto h-auto" /></Reveal></div>
    <div className="container-x pb-14 lg:pb-16">
      <div className="grid md:grid-cols-3" data-testid="ai-paths">
        {PATHS.map(([title, body, cta, to, bg], i) => (
          <Reveal key={title} delay={i * 90} className="p-8 lg:p-10 flex flex-col" style={{ background: bg }} data-testid={`ai-path-${i}`}>
            <span className="font-serif text-[30px] leading-none" style={{ color: AMBER }}>0{i + 1}</span>
            <h3 className="font-sans font-semibold text-[19px] mt-5 leading-[1.25]" style={{ color: NAVY }}>{title}</h3>
            <p className="text-[13px] leading-[1.6] mt-3 flex-1" style={{ color: INK }}>{body}</p>
            <Link to={to} className="inline-flex items-center gap-2 mt-6 text-[13px] font-semibold underline underline-offset-4 hover:gap-3 transition-[gap]" style={{ color: NAVY }} data-testid={`ai-path-link-${i}`}>{cta} <ArrowRight size={13} /></Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Environment = () => (
  <section className="py-12 lg:py-16 text-white" style={{ background: "#5c7a63", "--type-eyebrow-ink": "#e9f0ea", "--type-section-ink": "#ffffff", "--type-body-ink": "#eef3ef", "--type-small-ink": "#eef3ef", "--type-section-desktop": 36 }} data-testid="ai-environment">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-14 items-start">
        <Reveal className="lg:col-span-6"><Kicker testId="ai-environment-eyebrow" rule light>AI Within Your Technology Environment</Kicker><H2 className="text-white">The Environment<br className="hidden lg:inline" /> Behind AI Matters</H2></Reveal>
        <Reveal delay={100} className="lg:col-span-6 lg:pt-12">
          <p className="text-[13.5px] leading-[1.65]">AI capabilities depend on the systems, information, and controls surrounding them.</p>
          <p className="text-[13.5px] leading-[1.65] mt-4">Intrinsic considers these dependencies as part of the broader technology environment so AI can be introduced with the appropriate foundation around it.</p>
        </Reveal>
      </div>
      <Reveal delay={140} className="mt-10 flex justify-center"><LayersMotion className="w-full max-w-[520px] h-auto" /></Reveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-12 lg:divide-x lg:divide-white/40 gap-y-6" data-testid="ai-env-chips">
        {ENV.map((lines, i) => (
          <Reveal key={lines.join()} delay={i * 60} className="px-4 text-center">
            <p className="font-sans text-[11px] font-bold tracking-[0.16em] uppercase leading-[1.6] text-white">{lines.map((l) => <span key={l} className="block">{l}</span>)}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Strategy = () => (
  <section className="py-12 lg:py-16 bg-white" style={light()} data-testid="ai-strategy">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <Reveal className="lg:col-span-5">
        <Kicker testId="ai-strategy-eyebrow" rule>From Opportunity to Ongoing Management</Kicker>
        <H2>AI as Part of the Broader<br className="hidden lg:inline" /> Technology Strategy</H2>
        <div className="mt-8"><NavyBtn testId="ai-cta-btn">Talk to Our Team</NavyBtn></div>
      </Reveal>
      <Reveal delay={100} className="lg:col-span-4 lg:pt-10">
        <p className="text-[13.5px] leading-[1.65]">AI will continue to develop across Microsoft 365, business applications, security platforms, and operational systems.</p>
        <p className="text-[13.5px] leading-[1.65] mt-4">Intrinsic helps organizations evaluate these changes in the context of their business requirements and existing environment—identifying where new capabilities may provide value, what preparation or controls may be required, and how they can be managed over time.</p>
      </Reveal>
      <Reveal delay={160} className="hidden lg:flex lg:col-span-3 justify-center">
        <CycleMotion words={["EVALUATE", "PREPARE", "IMPLEMENT", "MANAGE"]} center="AI" sub="STRATEGY" ink="#0c3f97" className="w-[300px] h-auto" />
      </Reveal>
    </div>
  </section>
);

export default function AiHome() {
  return (
    <div className="bg-white page-in" data-testid="ai-home-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Applications /><Approach /><Environment /><Strategy /></main>
      <Footer />
    </div>
  );
}
