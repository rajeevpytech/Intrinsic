import React from "react";
import { ArrowRight, LayoutGrid, Workflow, BookOpen, Server, Lock, Fingerprint, UserCheck, ShieldCheck, FileCheck2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { Eyebrow, H2, Paras } from "../components/industry/IndustrySections";
import { OrbitPlanet, AiFlowDiagram, AiStack, RadarArc, ScatterField } from "../components/about/AboutAiGraphics";

const APPS = [
  { title: "Microsoft 365 & Copilot", body: "Extend the capabilities of the Microsoft 365 environment your teams already use. Intrinsic supports readiness, configuration, security, licensing considerations, and adoption of Microsoft Copilot and related capabilities." },
  { title: "Business Workflows", body: "Identify repetitive or information-intensive processes where AI can reduce manual effort, accelerate completion, and improve consistency." },
  { title: "Knowledge & Information", body: "Make organizational information easier to access and use. Intrinsic evaluates how documents, knowledge bases, SharePoint environments, and other information sources should be structured for AI-enabled workflows." },
  { title: "IT Operations", body: "Apply AI-assisted capabilities to IT monitoring, service management, operational analysis, knowledge access, and defined automation—correlating activity across systems and surfacing patterns faster, so issues get caught sooner and resolved faster." },
];

const GOV = [
  { Icon: Lock, title: "Data Access", body: "Determine what information AI applications can access and how that information can be used." },
  { Icon: Fingerprint, title: "Identity & Permissions", body: "Apply appropriate access controls to users, applications, and AI-enabled services." },
  { Icon: UserCheck, title: "AI Usage", body: "Establish practical guidelines for how employees use AI tools with company information." },
  { Icon: ShieldCheck, title: "Application Security", body: "Evaluate AI applications, integrations, and vendors within the broader security environment." },
  { Icon: FileCheck2, title: "Governance", body: "Establish the policies, documentation, and accountability required to manage AI as it becomes part of the business." },
];

const ONGOING = ["Evaluate new capabilities", "Assess impact on your environment", "Adjust controls and configurations", "Support ongoing adoption", "Keep AI aligned with business priorities"];

const APP_ICONS = [LayoutGrid, Workflow, BookOpen, Server];

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)]" data-testid="ai-hero">
    <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, #eef4fb 0%, #dfeafb 45%, #f4f8fd 100%)" }} />
    <div className="container-x relative z-10 pt-14 lg:pt-16 pb-16 lg:pb-24 grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6">
        <p className="cyber-eyebrow text-[#f2a91c] inline-flex items-center gap-4 animate-fade-up">AI <span className="inline-block w-14 h-px bg-[#f2a91c]" /></p>
        <h1 className="cyber-h1 text-royal mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>AI That Works Within Your Business</h1>
        <Paras className="text-[#4a5259] mt-6 animate-fade-up" items={["AI is changing how businesses process information, serve customers, and get work done.", "Intrinsic helps organizations evaluate and introduce AI where it can improve the way people work, streamline processes, and strengthen IT operations. We bring AI into the existing technology environment with consideration for security, data, integration, and ongoing management."]} />
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "220ms" }}>
          <a href="#contact" className="btn-amber" data-testid="ai-hero-cta"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
        </div>
      </div>
      <div className="lg:col-span-6 relative hidden lg:block">
        <p className="absolute top-2 right-1 font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-royal/75 text-right leading-[1.9] z-10">Information<br />Ideas<br />People<br />Possibilities</p>
        <OrbitPlanet flip className="w-full h-auto" />
        <p className="absolute bottom-2 right-1 font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-royal/70 text-right leading-[1.9]">AI<br />In a More Connected<br />Environment.</p>
      </div>
    </div>
  </section>
);

const Applications = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="ai-applications">
    <div className="container-x">
      <Reveal className="mb-14 max-w-[760px]">
        <Eyebrow>AI Applications</Eyebrow>
        <H2>Supporting the Work That Matters</H2>
        <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-5">AI can support a wide range of business and technology functions. Intrinsic helps identify where these capabilities can be applied effectively within the existing environment.</p>
      </Reveal>
      <div className="relative">
        <svg viewBox="0 0 1200 60" className="w-full h-[46px] mb-2" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,40 C150,10 300,10 450,34 S750,58 900,30 1050,10 1200,32" fill="none" stroke="#c8d2de" strokeWidth="1.4" />
          <path d="M0,40 C150,10 300,10 450,34 S750,58 900,30 1050,10 1200,32" fill="none" stroke="#1b61be" strokeWidth="2" strokeDasharray="3 10" pathLength="100" className="topo-packet" />
        </svg>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-powder border border-powder">
          {APPS.map(({ title, body }, i) => {
            const Icon = APP_ICONS[i];
            return (
              <Reveal key={title} delay={i * 80} className="bg-white">
                <div className="h-full p-7 relative" data-testid={`ai-app-${i}`}>
                  <span className="w-3 h-3 rounded-full bg-amber block -mt-[34px] mb-6 ring-4 ring-white" />
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-powder text-[30px] font-semibold leading-none">0{i + 1}</span>
                    <Icon size={20} className="text-royal" />
                  </div>
                  <h3 className="font-serif text-royal font-semibold text-[19px] leading-tight mt-3">{title}</h3>
                  <p className="text-slatesage text-[13.5px] leading-[1.6] mt-3">{body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

const Implementation = () => (
  <section className="bg-ice py-12 lg:py-16" data-testid="ai-implementation">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-5">
        <Eyebrow>AI Planning & Implementation</Eyebrow>
        <H2>From Opportunity to Implementation</H2>
        <Paras className="text-[#4a5259] mt-6" items={["Introducing AI begins with identifying where it can deliver meaningful operational value and establishing a clear approach to implementation.", "Intrinsic works with organizations to evaluate potential use cases against business objectives, existing workflows, technology priorities, implementation requirements, and expected outcomes.", "Once an initiative is defined, we establish the technical requirements, dependencies, controls, and implementation approach required to introduce the capability into the organization."]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-7">
        <div className="bg-white border border-powder p-6"><AiFlowDiagram className="w-full h-auto" /></div>
      </Reveal>
    </div>
  </section>
);

const Environment = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="ai-environment">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-5">
        <Eyebrow>AI Within Your Technology Environment</Eyebrow>
        <H2>The Technology Behind AI Matters</H2>
        <Paras className="text-[#4a5259] mt-6" items={["AI capabilities depend on the technology and information environment surrounding them.", "Identity and permissions determine what users and applications can access. Information structure and data quality influence the results AI can produce. Applications and integrations determine where AI can operate. Infrastructure, security controls, and governance determine how those capabilities can be introduced and managed.", "Intrinsic considers these dependencies as part of the broader technology environment—so AI capabilities are implemented with appropriate access, integration, security, and operational oversight."]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-7 relative">
        <AiStack labels={["Identity & Access", "Data", "Applications", "Integrations", "Infrastructure", "Security"]} className="w-full h-auto max-h-[460px]" />
        <p className="lg:absolute lg:bottom-8 lg:right-2 font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-royal/70 text-right leading-[1.9] mt-4 lg:mt-0">AI<br />Operates Through<br />Your Entire Environment.</p>
      </Reveal>
    </div>
  </section>
);

const Governance = () => (
  <section className="relative text-white py-12 lg:py-16 overflow-hidden hero-grain" data-testid="ai-governance">
    <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, #24413b 0%, #2f5149 55%, #3c665b 100%)" }} />
    <RadarArc className="absolute top-6 right-6 w-[220px] h-[220px] opacity-80" />
    <div className="container-x relative z-10">
      <div className="grid lg:grid-cols-12 gap-10 items-start mb-14">
        <Reveal className="lg:col-span-8">
          <Eyebrow color="text-amber">Security & Governance</Eyebrow>
          <H2 className="text-white">Protecting Information as AI Expands</H2>
          <Paras className="text-white/85 mt-6" items={["AI introduces new ways for employees and applications to access and process business information. Security and governance therefore need to be considered as part of implementation.", "Intrinsic helps organizations establish appropriate controls around:"]} />
        </Reveal>
        <Reveal delay={120} className="lg:col-span-4 lg:text-right">
          <p className="font-mono text-[12px] font-bold tracking-[0.18em] uppercase text-amber/90 leading-[2]">Trusted Use.<br />Real Value.</p>
        </Reveal>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
        {GOV.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 70}>
            <div className="relative pt-6" data-testid={`ai-gov-${i}`}>
              <span className="absolute top-0 left-0 w-8 h-px bg-amber" />
              <Icon size={22} className="text-amber" strokeWidth={1.7} />
              <h3 className="font-serif text-white font-semibold text-[18px] leading-tight mt-4">{title}</h3>
              <p className="text-white/75 text-[13.5px] leading-[1.6] mt-3">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Ongoing = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="ai-ongoing">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow>Ongoing AI Management</Eyebrow>
        <H2>Keeping AI Aligned with Your Environment</H2>
        <Paras className="text-[#4a5259] mt-6" items={["AI capabilities, business applications, and security requirements continue to change. As they do, the way AI is used within your organization needs to be evaluated alongside the rest of your technology environment.", "Intrinsic reviews new AI capabilities in the context of your existing systems, data, users, security controls, and business processes—identifying where they can be introduced effectively and where additional controls or preparation are required.", "This keeps AI adoption connected to the technology environment we manage for you, rather than treating it as a separate initiative."]} />
        <div className="mt-8"><ScatterField className="w-full max-w-[380px] h-auto" /></div>
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6">
        <ul className="space-y-4">
          {ONGOING.map((t, i) => (
            <li key={t} className="flex items-center gap-4 bg-ice border border-powder p-5" data-testid={`ai-ongoing-${i}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-amber shrink-0" />
              <span className="font-serif text-royal text-[18px] font-semibold">{t}</span>
            </li>
          ))}
        </ul>
        <p className="font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-slatesage mt-6 text-right">A More Resilient Tomorrow.</p>
      </Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative text-white py-12 lg:py-16 overflow-hidden hero-grain" data-testid="ai-cta">
    <div className="absolute inset-0" style={{ background: "#00388e" }} />
    <div className="absolute -top-16 right-10 w-[420px] h-[420px] rounded-full bg-amber/12 blur-3xl float-b" />
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-8 items-center">
      <Reveal className="lg:col-span-8">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-4">Let's Talk</p>
        <h2 className="font-serif text-white font-semibold text-[30px] sm:text-[40px] leading-[1.12]">Explore What AI Can Do for Your Organization</h2>
        <p className="text-white/85 text-[17px] leading-relaxed mt-5">Discuss your objectives, environment, and potential use cases with our team.</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-4 lg:justify-self-end">
        <a href="#contact" className="btn-amber" data-testid="ai-cta-btn"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
      </Reveal>
    </div>
  </section>
);

export default function AIPage() {
  return (
    <div className="bg-white page-in" data-testid="ai-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Applications />
        <Implementation />
        <Environment />
        <Governance />
        <Ongoing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
