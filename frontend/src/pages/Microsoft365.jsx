import React from "react";
import { ArrowRight, Cloud, Mail, Users, FileText, Shield, Database, BarChart3, Headphones } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { M365Mosaic, M365Orbit, M365PanelsMobile } from "../components/m365/M365Graphics";
import { GovOngoingArcs } from "../components/governance/GovernanceGraphics";

const Eyebrow = ({ children, light = false }) => (
  <p className={`m3-eyebrow ${light ? "text-white" : "text-[#f2a91c]"}`}><span className="m3-eyebrow-line bg-[#f2a91c] mr-3 ml-0" style={{ width: 32 }} /><span>{children}</span></p>
);

const Btn = ({ id }) => (
  <button type="button" data-contact-trigger className="gc-hero-btn" data-testid={id}><span>Talk to Our Team</span><ArrowRight size={15} strokeWidth={2.2} /></button>
);

/* ============================ HERO ============================ */
const Hero = () => (
  <section className="m3-hero relative overflow-hidden pt-[var(--nav-h)]" data-testid="m365-hero">
    <div className="container-x relative z-10 pt-10 lg:pt-12 pb-12 lg:pb-14 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <div className="lg:col-span-5">
        <div className="animate-fade-up"><Eyebrow>Microsoft 365</Eyebrow></div>
        <h1 className="font-serif text-[#1a44c4] font-normal text-[38px] sm:text-[46px] lg:text-[54px] leading-[1.08] tracking-[-0.01em] mt-4 animate-fade-up" style={{ animationDelay: "80ms" }}>Make More of the<br className="hidden sm:block" /> Platform You<br className="hidden sm:block" /> Already Have</h1>
        <p className="text-[#2e3745] text-[16px] leading-[1.45] mt-6 max-w-[520px] animate-fade-up" style={{ animationDelay: "160ms" }}>Microsoft 365 has become a core operating platform for communication, collaboration, information management, identity, and security.</p>
        <p className="text-[#4a5568] text-[15px] leading-[1.5] mt-4 max-w-[520px] animate-fade-up" style={{ animationDelay: "220ms" }}>Intrinsic configures, secures, and manages Microsoft 365 across the organization—bringing administration, security, governance, licensing, and user support into a coordinated management model aligned with business requirements.</p>
        <div className="mt-7 animate-fade-up" style={{ animationDelay: "300ms" }}><Btn id="m365-hero-cta" /></div>
      </div>
      <div className="lg:col-span-7"><M365Mosaic className="w-full hidden md:block" /><div className="md:hidden"><M365PanelsMobile /></div></div>
    </div>
  </section>
);

/* ==================== MANAGEMENT ACROSS THE PLATFORM ==================== */
const CARDS = [
  { Icon: Cloud, title: "Deployment & Migration", body: "Planning and execution for Microsoft 365 migrations, with attention to continuity, data integrity, configuration, and documentation throughout the transition." },
  { Icon: Mail, title: "Exchange Online", body: "Administration of Exchange Online across email, calendars, shared mailboxes, distribution lists, permissions, archiving, monitoring, and related configuration." },
  { Icon: Users, title: "Teams & Collaboration", body: "Management of Teams policies, external and guest access, meeting security, retention, and collaboration settings to support controlled communication and information sharing." },
  { Icon: FileText, title: "SharePoint & Document Management", body: "Administration of SharePoint architecture, permissions, version control, and access governance, structured around how information is organized and used across the organization." },
  { Icon: Shield, title: "Identity & Security", body: "Configuration and management of Microsoft security capabilities, including Multi-Factor Authentication, Conditional Access, and data loss prevention, integrated with the broader security environment." },
  { Icon: Database, title: "Data Governance", body: "Management of retention, archiving, eDiscovery capabilities, and Microsoft Purview configuration to support information governance and applicable organizational requirements." },
  { Icon: BarChart3, title: "Licensing & Optimization", body: "Ongoing management of licensing and user assignments to align Microsoft 365 plans and capabilities with actual organizational requirements." },
  { Icon: Headphones, title: "Help Desk & User Support", body: "Day-to-day support across Microsoft 365, including access, email, Teams, OneDrive, licensing, and platform issues, with escalation to broader technical resources when required." },
];

const Card = ({ Icon, title, body, i, divider }) => (
  <Reveal delay={(i % 5) * 90} className={`gi-item m3-card ${divider ? "lg:border-l lg:border-[#d5dce8] lg:pl-6" : ""} lg:pr-6`}>
    <span className="gi-icon text-[#12306e]" style={{ "--i": i }}><Icon size={30} strokeWidth={1.6} /></span>
    <h3 className="font-sans text-[#1a44c4] font-bold text-[13px] tracking-[0.05em] uppercase leading-[1.35] mt-4">{title}</h3>
    <p className="text-[#4a5568] text-[13px] leading-[1.5] mt-3">{body}</p>
  </Reveal>
);

const Management = () => (
  <section className="bg-white py-12 lg:py-16 overflow-hidden" data-testid="m365-management">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <Reveal className="lg:col-span-7">
          <Eyebrow>Microsoft 365 Management</Eyebrow>
          <h2 className="font-serif text-[#1a44c4] font-normal text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.06] mt-4">Management Across<br className="hidden sm:block" /> the Platform</h2>
          <p className="text-[#4a5568] text-[15px] leading-[1.5] mt-6 max-w-[560px]">Effective management of Microsoft 365 extends across the services people use every day, and the underlying controls that govern access, information, security, and administration. Intrinsic manages these capabilities as part of one Microsoft environment, maintaining appropriate configuration and oversight as users, business requirements, and the platform itself continue to change.</p>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:justify-self-end lg:pt-1" delay={100}>
          <p className="m3-caption"><span className="m3-caption-bar" />A Unified Approach Across Microsoft 365</p>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-y-8 gap-x-8 lg:gap-x-0 mt-12 pb-8 lg:border-b lg:border-[#d5dce8]" data-testid="m365-cards-row1">
        {CARDS.slice(0, 5).map((c, i) => <Card key={c.title} {...c} i={i} divider={i > 0} />)}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-y-8 gap-x-8 lg:gap-x-0 mt-8" data-testid="m365-cards-row2">
        {CARDS.slice(5).map((c, i) => <Card key={c.title} {...c} i={i + 5} divider={i > 0} />)}
        <Reveal delay={300} className="sm:col-span-2 lg:col-span-2 lg:ml-4">
          <div className="m3-quote h-full flex flex-col justify-center">
            <p className="font-serif italic text-[#12306e] text-[26px] lg:text-[30px] leading-[1.25]">One platform.<br />A more productive organization.</p>
            <span className="block w-[32px] h-[2px] bg-[#f2a91c] mt-5" />
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ==================== SECURITY & INFORMATION GOVERNANCE ==================== */
const CHIPS = ["Identity & Access", "Information Protection", "Collaboration", "Governance", "Retention", "Security"];
const SEC_PARAS = [
  "Microsoft 365 holds and provides access to significant amounts of organizational information. How that information is accessed, shared, retained, and protected requires appropriate technical controls and ongoing governance.",
  "Intrinsic incorporates security and information governance into the management of the platform.",
  "Identity and access policies establish how users authenticate and under what conditions access is permitted. Security controls help protect accounts, communications, and information. Collaboration policies govern external access and sharing. Retention and information-governance controls establish how organizational data is maintained and managed.",
  "These controls are administered as part of the Microsoft 365 environment and integrated with the broader cybersecurity posture rather than treated as independent configuration tasks.",
];

const Security = () => (
  <section className="m3-blue relative overflow-hidden py-12 lg:py-16" data-testid="m365-security">
    <GovOngoingArcs />
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      <Reveal className="lg:col-span-5">
        <p className="m3-eyebrow text-[#f2a91c]"><span className="m3-eyebrow-line bg-[#f2a91c] mr-3 ml-0" style={{ width: 32 }} /><span>Security &amp; Information Governance</span></p>
        <h2 className="font-serif text-white font-normal text-[36px] sm:text-[42px] lg:text-[46px] leading-[1.08] mt-4">Managing Access,<br className="hidden sm:block" /> Information, and<br className="hidden sm:block" /> Control</h2>
        <ul className="mt-6 space-y-3" data-testid="m365-security-list">
          {CHIPS.map((c, i) => (
            <li key={c} className="sm-check flex items-center gap-4 text-white text-[13.5px] font-bold tracking-[0.12em] uppercase" style={{ "--i": i }}>
              <span className="w-3.5 h-3.5 bg-[#f2a91c] shrink-0 m3-square" style={{ animationDelay: `${i * 0.4}s` }} /><span>{c}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal className="lg:col-span-7 lg:pl-6" delay={120}>
        {SEC_PARAS.map((p, i) => <p key={i} className={`text-white/90 text-[15px] leading-[1.5] ${i > 0 ? "mt-4" : ""}`}>{p}</p>)}
      </Reveal>
    </div>
  </section>
);

/* ==================== ONGOING MANAGEMENT ==================== */
const Ongoing = () => (
  <section className="bg-[#f3f6fb] py-12 lg:py-16 overflow-hidden" data-testid="m365-ongoing">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow>Ongoing Management &amp; Oversight</Eyebrow>
        <h2 className="font-serif text-[#1a44c4] font-normal text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.06] mt-4">Maintaining the Platform<br className="hidden sm:block" /> as Requirements Change</h2>
        <p className="text-[#4a5568] text-[14.5px] leading-[1.5] mt-6">Microsoft 365 requires continued management beyond initial configuration or migration. Users, permissions, licensing, applications, and collaboration requirements change over time. Microsoft introduces new capabilities and modifies existing services. Security configurations and governance policies must continue to reflect the organization and the way the platform is being used.</p>
        <p className="text-[#4a5568] text-[14.5px] leading-[1.5] mt-4">Intrinsic maintains ongoing oversight across these areas.</p>
        <p className="text-[#4a5568] text-[14.5px] leading-[1.5] mt-4">We manage user and licensing changes, review security configurations, maintain access and governance settings, evaluate relevant platform changes, and provide day-to-day support across the Microsoft environment.</p>
        <p className="text-[#4a5568] text-[14.5px] leading-[1.5] mt-4">This ongoing management helps maintain a Microsoft 365 environment that remains controlled, current, and aligned with organizational requirements.</p>
        <div className="mt-7"><Btn id="m365-ongoing-cta" /></div>
      </Reveal>
      <Reveal className="lg:col-span-6" delay={120}>
        <M365Orbit className="max-w-[520px] mx-auto" />
      </Reveal>
    </div>
  </section>
);

/* ==================== INTEGRATED ==================== */
const Integrated = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="m365-integrated">
    <div className="container-x grid lg:grid-cols-12 gap-10 items-start">
      <Reveal className="lg:col-span-9">
        <Eyebrow>Integrated with the Broader IT Environment</Eyebrow>
        <h2 className="font-serif text-[#1a44c4] font-normal text-[32px] sm:text-[38px] lg:text-[42px] leading-[1.1] mt-4">Microsoft 365 as Part of a Stronger IT Environment</h2>
        <div className="grid md:grid-cols-2 gap-8 mt-7">
          <p className="text-[#4a5568] text-[14.5px] leading-[1.5]">Microsoft 365 does not operate in isolation. It relies on and integrates with the broader IT environment, including identity, devices, applications, data, and security services.</p>
          <p className="text-[#4a5568] text-[14.5px] leading-[1.5] md:border-l md:border-[#d5dce8] md:pl-8">Intrinsic manages Microsoft 365 in the context of this larger environment—helping to maintain alignment across systems, improve overall security and resilience, and support a more consistent and effective IT operation.</p>
        </div>
      </Reveal>
      <Reveal className="lg:col-span-3" delay={140}>
        <div className="m3-quote m3-quote-grey">
          <p className="font-serif italic text-[#12306e] text-[24px] lg:text-[26px] leading-[1.25]">Connected systems.<br />Greater value.</p>
          <span className="block w-[32px] h-[2px] bg-[#f2a91c] mt-5" />
        </div>
      </Reveal>
    </div>
  </section>
);

export default function Microsoft365() {
  return (
    <div className="bg-white page-in" data-testid="m365-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Management />
        <Security />
        <Ongoing />
        <Integrated />
      </main>
      <Footer />
    </div>
  );
}
