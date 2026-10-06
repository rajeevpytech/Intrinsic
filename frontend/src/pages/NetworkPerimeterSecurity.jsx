import React from "react";
import { ArrowRight, ChevronRight, Shield, Search, Crosshair, Network, Lock, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { ImageMotion } from "../components/cyber/ImageMotion";

const NAVY = "#17398a";
const GOLD = "#f2a91c";
const EYEBROW_GOLD = "#f2a91c";
const BODY = "#4a5568";

const MANAGE = [
  { Icon: Shield, title: "Next-Generation Firewall Management", body: "Architecture, configurations, policy enforcement, firmware updates, rule reviews, and system health monitoring." },
  { Icon: Search, title: "24/7 Threat Monitoring & Response", body: "Continuous monitoring, alert analysis, and expert investigation with defined response processes." },
  { Icon: Crosshair, title: "Intrusion Prevention & Detection (IPS/IDS)", body: "Policy tuning, signature updates, and detection optimization to prevent network-based attacks." },
  { Icon: Network, title: "Secure SD-WAN Management", body: "Secure connectivity across branch offices, cloud platforms, and remote locations." },
  { Icon: Lock, title: "VPN & Remote Access Security", body: "Authentication, access controls, MFA enforcement, and ongoing monitoring for secure remote access." },
  { Icon: FileText, title: "Compliance Reporting & Audit Support", body: "Reporting, activity records, and configuration documentation to support security reviews and regulatory requirements." },
];

const STEPS = [
  { n: "01", bg: "#dbe7f8", title: "Security Assessment", body: "We evaluate firewall configurations, network architecture, security policies, firmware versions, and current exposure to identify improvement opportunities." },
  { n: "02", bg: "#d9e6e0", title: "Policy Remediation", body: "We optimize security policies, remove unnecessary access rules, apply least-privilege principles, and strengthen administrative configurations." },
  { n: "03", bg: "#dbe7f8", title: "Continuous Monitoring", body: "Our team monitors network activity, reviews security events, and investigates alerts to identify potential issues." },
  { n: "04", bg: "#fbe4d4", title: "Ongoing Management", body: "We maintain your environment through updates, configuration reviews, backups, and recurring security reporting." },
];

const INDUSTRIES = ["Financial Services", "Healthcare", "Construction", "Non-Profit", "Professional Services"];

const Eyebrow = ({ children, color = "#f2a91c", className = "" }) => (
  <p className={`flex items-center gap-3 font-sans text-[11px] font-bold tracking-[0.2em] uppercase ${className}`} style={{ color }}>
    <span className="block w-7 h-[2px]" style={{ background: "#f2a91c" }} />{children}
  </p>
);
const H2 = ({ children, className = "", color = NAVY }) => (
  <h2 className={`font-serif font-medium text-[32px] sm:text-[40px] leading-[1.12] tracking-[-0.01em] ${className}`} style={{ color }}>{children}</h2>
);
const GoldBtn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="btn-amber">
    <span>{children}</span><span className="btn-arrow"><ArrowRight size={15} strokeWidth={2.5} /></span>
  </button>
);

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)]" style={{ background: "linear-gradient(135deg, #f4f8fd 0%, #e9f1fb 45%, #dfebf9 100%)", "--type-hero-desktop": 44, "--type-hero-tablet": 40 }} data-testid="perimeter-hero">
    <div className="container-x relative z-10 pt-12 lg:pt-16 pb-12 lg:pb-16 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <div className="lg:col-span-6 max-w-[600px]">
        <p className="eyebrow animate-fade-up" style={{ color: EYEBROW_GOLD, letterSpacing: "0.2em" }} data-testid="perimeter-hero-eyebrow">Network &amp; Perimeter Security</p>
        <h1 className="font-serif font-medium leading-[1.08] tracking-[-0.01em] mt-4 animate-fade-up" style={{ color: NAVY, animationDelay: "80ms" }} data-testid="perimeter-hero-title">Managed Protection<br className="hidden lg:inline" /> for Your Network, Users,<br className="hidden lg:inline" /> and Critical Systems</h1>
        <p className="text-[15px] leading-[1.65] mt-5 animate-fade-up" style={{ color: BODY, animationDelay: "180ms" }}>Your network perimeter is constantly changing. Firewall rules evolve, remote access expands, cloud connectivity grows, and outdated configurations can create unnecessary exposure.</p>
        <p className="text-[15px] leading-[1.65] mt-4 animate-fade-up" style={{ color: BODY, animationDelay: "220ms" }}>Intrinsic manages your network security environment through firewall management, policy optimization, threat monitoring, and compliance reporting—providing the visibility and operational support needed to keep your perimeter secure and current.</p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "280ms" }}><GoldBtn testId="perimeter-hero-cta">Speak With Our Security Team</GoldBtn></div>
      </div>
      <div className="lg:col-span-6 animate-fade-in flex items-center justify-end gap-4 lg:gap-6" style={{ animationDelay: "200ms" }}>
        <ImageMotion src="/images/perimeter-hero-crop.png" alt="Traffic inspected at the network perimeter" className="w-full max-w-[483px] lg:max-w-[529px] live-float" w={1263} h={879} testId="perimeter-hero-image" pulseR={10}
          pulses={[[710, 428], [905, 435]]} paths={[{ d: "M698 436 L911 436", dur: 3.2 }, { d: "M698 436 L911 436", dur: 3.2, delay: 1.6, r: 5 }]} />
        <p className="hidden sm:block font-sans text-[12px] lg:text-[13px] font-bold tracking-[0.22em] uppercase leading-[1.9] shrink-0" style={{ color: NAVY }} data-testid="perimeter-hero-caption">A More<br />Secure<br />Business<br />Environment</p>
      </div>
    </div>
  </section>
);

const OneLayer = () => (
  <section className="py-12 lg:py-16" style={{ background: "#f3f7fc" }} data-testid="perimeter-one-layer">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow>Complete Perimeter Security Management</Eyebrow>
        <H2 className="mt-4 max-w-[520px]">Your firewall is only one layer of defense.</H2>
      </Reveal>
      <Reveal delay={100} className="lg:col-span-6 lg:border-l lg:border-[#c9d6ea] lg:pl-12">
        <p className="text-[15.5px] leading-[1.75]" style={{ color: BODY }}>A secure network requires continuous management, monitoring, and optimization. Intrinsic manages every layer of your perimeter security environment — from firewall architecture and policy enforcement to threat detection and compliance reporting. Your security perimeter is managed as a single, accountable service.</p>
      </Reveal>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="perimeter-flow">
    <div className="container-x"><Reveal>
      <div className="text-center max-w-[720px] mx-auto">
        <Eyebrow>How It Works</Eyebrow>
        <H2 className="mt-3 !text-[36px] sm:!text-[46px]">Network &amp; Perimeter Security</H2>
        <p className="text-[15.5px] leading-[1.7] mt-4" style={{ color: BODY }}>From external access to internal resources, we manage and secure your network environment so you can operate with confidence.</p>
      </div>
      <div className="mt-6 lg:mt-8 overflow-x-auto"><img src="/images/perimeter-how-it-works.png" alt="How network and perimeter security works" className="w-4/5 h-auto min-w-[760px] max-w-[992px] mx-auto" data-testid="perimeter-flow-image" /></div>
    </Reveal></div>
  </section>
);

const WhatWeManage = () => (
  <section className="py-12 lg:py-16" style={{ background: "#eef4fb" }} data-testid="perimeter-manage">
    <div className="container-x">
      <Reveal><Eyebrow>What We Manage</Eyebrow></Reveal>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3">
        {MANAGE.map((m, i) => (
          <Reveal key={m.title} delay={i * 60} className={`gi-item flex gap-5 px-2 py-8 lg:px-8 lg:py-9 border-[#cfdbec] ${i % 3 !== 0 ? "lg:border-l" : ""} ${i >= 3 ? "lg:border-t" : ""} ${i % 2 !== 0 ? "sm:border-l lg:border-l" : ""} ${i >= 2 ? "sm:border-t" : ""}`} data-testid={`manage-item-${i}`}>
            <span className="gi-icon shrink-0 mt-1" style={{ "--i": i, color: NAVY }}><m.Icon size={44} strokeWidth={1.4} /></span>
            <div>
              <h3 className="font-sans font-semibold text-[17px] leading-[1.3]" style={{ color: NAVY }}>{m.title}</h3>
              <p className="text-[14px] leading-[1.65] mt-3" style={{ color: BODY }}>{m.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Steps = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="perimeter-steps">
    <div className="container-x">
      <Reveal><Eyebrow>From Assessment to Continuous Protection</Eyebrow></Reveal>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-x-6">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 90} className="relative text-center lg:text-left" data-testid={`step-${i}`}>
            <div className="flex items-center justify-center lg:justify-start">
              <span className="w-[56px] h-[56px] rounded-full inline-flex items-center justify-center font-sans font-semibold text-[18px] lg:ml-14" style={{ background: s.bg, color: NAVY }}>{s.n}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={22} className="hidden lg:block absolute right-[-14px] top-[16px]" style={{ color: "#8fb3e6" }} />}
            <h3 className="font-sans font-semibold text-[17px] mt-5" style={{ color: NAVY }}>{s.title}</h3>
            <p className="text-[14px] leading-[1.65] mt-3 max-w-[300px] mx-auto lg:mx-0" style={{ color: BODY }}>{s.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Compliance = () => (
  <section className="relative overflow-hidden py-12 lg:py-16" style={{ background: "#e4e9e6" }} data-testid="perimeter-compliance">
    <svg className="absolute right-0 top-0 h-full w-[46%] pointer-events-none" viewBox="0 0 600 400" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <circle cx="520" cy="80" r="260" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" className="pm-breathe" />
      <circle cx="560" cy="120" r="360" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="600" cy="420" r="180" fill="#ffffff" fillOpacity="0.22" />
    </svg>
    <div className="container-x relative grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <Reveal className="lg:col-span-5">
        <Eyebrow>Designed for Security-Conscious Organizations</Eyebrow>
        <H2 className="mt-4">Built for Compliance and Resilience</H2>
      </Reveal>
      <Reveal delay={100} className="lg:col-span-4">
        <p className="text-[15px] leading-[1.7]" style={{ color: BODY }}>Intrinsic supports organizations where network availability, data protection, and regulatory expectations are critical.</p>
      </Reveal>
      <Reveal delay={160} className="lg:col-span-3">
        <Eyebrow className="!text-[11px]">Industries Served</Eyebrow>
        <ul className="mt-3 space-y-1.5" data-testid="perimeter-industries">
          {INDUSTRIES.map((x) => <li key={x} className="flex items-center gap-3 text-[14.5px]" style={{ color: "#2b3a55" }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: NAVY }} />{x}</li>)}
        </ul>
      </Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative overflow-hidden text-white py-12 lg:py-16" style={{ background: "#00388e" }} data-testid="perimeter-cta">
    <svg className="absolute right-0 top-0 h-full w-[60%] pointer-events-none" viewBox="0 0 800 500" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <circle cx="560" cy="330" r="300" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.5" />
      <circle cx="560" cy="330" r="420" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.5" className="pm-breathe" />
      <circle cx="560" cy="330" r="200" fill="#ffffff" fillOpacity="0.04" />
      <g><animateTransform attributeName="transform" type="rotate" from="0 560 330" to="360 560 330" dur="40s" repeatCount="indefinite" /><circle cx="560" cy="30" r="7" fill={GOLD} /></g>
    </svg>
    <div className="container-x relative grid lg:grid-cols-12 gap-10 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="rgba(255,255,255,0.9)">Improve Security. Simplify Management.</Eyebrow>
        <H2 color="#ffffff" className="mt-5">Your Network Security Should Work Harder for You.</H2>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
        <p className="text-[15.5px] leading-[1.7] text-white/90">Intrinsic provides the expertise, monitoring, and operational support needed to maintain a secure and resilient network environment.</p>
        <div className="mt-7"><GoldBtn testId="perimeter-cta-btn">Speak With a Security Specialist</GoldBtn></div>
      </Reveal>
    </div>
  </section>
);

export default function NetworkPerimeterSecurity() {
  return (
    <div className="bg-white page-in" data-testid="perimeter-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><OneLayer /><HowItWorks /><WhatWeManage /><Steps /><Compliance /><CTA /></main>
      <Footer />
    </div>
  );
}
