import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Users, AppWindow, ShieldCheck, LifeBuoy, KeyRound, Lock, ClipboardCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { H2 } from "../components/industry/IndustrySections";

const BLUE = "#00388e", INK = "#33507e", AMBER = "#f2a91c";
const light = (extra = {}) => ({ "--type-eyebrow-ink": BLUE, "--type-hero-ink": BLUE, "--type-section-ink": BLUE, "--type-body-ink": INK, "--type-small-ink": INK, "--type-subheading-ink": BLUE, "--type-section-desktop": 34, ...extra });
const dark = (extra = {}) => ({ "--type-eyebrow-ink": "#ffffff", "--type-section-ink": "#ffffff", "--type-body-ink": "#e3efea", "--type-small-ink": "#e3efea", "--type-section-desktop": 34, ...extra });

const Kicker = ({ children, testId }) => <p className="eyebrow eyebrow-line mb-4" data-testid={testId}>{children}</p>;
const FlatBtn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="btn-amber">
    <span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);
const Copy = ({ children, className = "" }) => <p className={`text-[16px] leading-[1.7] ${className}`}>{children}</p>;
const Tags = ({ items, className = "", light: isLight }) => (
  <p className={`font-mono text-[11px] font-bold tracking-[0.2em] uppercase flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`} style={{ color: isLight ? "rgba(255,255,255,0.7)" : "#7c8aa1" }}>
    {items.map((t, i) => <span key={t} className="inline-flex items-center gap-4">{i > 0 && <span className="w-1 h-1 rounded-full" style={{ background: AMBER }} />}{t}</span>)}
  </p>
);
const Diagram = ({ src, alt, testId, max = 980 }) => (
  <img src={src} alt={alt} className="w-full h-auto mx-auto" style={{ maxWidth: max }} data-testid={testId} />
);

const SERVICES = [
  [Headphones, "Managed IT & Help Desk"],
  [Users, "Collaboration Platforms"],
  [AppWindow, "Business Applications"],
  [ShieldCheck, "Cybersecurity"],
  [LifeBuoy, "Business Continuity"],
];

const PROTECT = [
  [KeyRound, "Access & Identity", "Secure identities, least-privilege permissions and multi-factor authentication across every application."],
  [Lock, "Information Protection", "Encryption, data-loss prevention and controls that keep confidential client information contained."],
  [ClipboardCheck, "Governance & Oversight", "Policies, monitoring and reporting that keep security aligned with client and regulatory expectations."],
];

const Hero = () => (
  <section className="pt-[var(--nav-h)]" style={{ background: "linear-gradient(120deg, #eef4fb 0%, #e6eff9 50%, #f3f8fd 100%)", ...light({ "--type-hero-desktop": 40, "--type-hero-tablet": 34 }) }} data-testid="ps-hero">
    <div className="container-x pt-14 lg:pt-16 pb-14 lg:pb-16 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <div className="lg:col-span-5 max-w-[540px]">
        <Kicker testId="ps-hero-eyebrow">Professional Services</Kicker>
        <h1 className="font-serif leading-[1.1] animate-fade-up" data-testid="ps-hero-title">Technology That Supports Client Service</h1>
        <Copy className="mt-6 animate-fade-up">Intrinsic manages the technology professional services firms rely on to collaborate securely, protect client information and keep client work moving.</Copy>
        <div className="mt-8 animate-fade-up"><FlatBtn testId="ps-hero-cta">Talk With Our Team</FlatBtn></div>
        <Tags className="mt-9 animate-fade-up" items={["Clients", "Collaboration", "Continuity"]} />
      </div>
      <div className="lg:col-span-7 flex justify-center lg:justify-end animate-fade-in">
        <img src="/images/ps/ps-hero.png" alt="Client portal, project work, document flow, research, operations and remote access connected around a professional services firm" className="w-full h-auto max-w-[871px] live-float hero-wipe" data-testid="ps-hero-diagram" />
      </div>
    </div>
  </section>
);

const Delivery = () => (
  <section className="py-12 lg:py-16 bg-[#f4f7fb]" style={light()} data-testid="ps-delivery">
    <div className="container-x">
      <Reveal className="max-w-[760px]">
        <Kicker testId="ps-delivery-eyebrow">The Foundation Beneath the Work</Kicker>
        <H2>Technology Behind Client Delivery</H2>
        <Copy className="mt-5">Project teams, client communication, business applications, document sharing and time-sensitive work all rely on a technology foundation that just works.</Copy>
      </Reveal>
      <Reveal delay={120} className="mt-12"><Diagram src="/images/ps/client-delivery.svg" alt="Project teams, business applications, documents, client communication and continuity connected to client delivery" testId="ps-delivery-diagram" max={1040} /></Reveal>
      <Reveal delay={160} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-14">
        {SERVICES.map(([Icon, label], i) => (
          <div key={label} className="gi-item flex flex-col items-center text-center gap-4 bg-white rounded-[6px] px-4 py-7 border border-[#e2e9f2] hover:border-[#c4d3e8] transition-colors" data-testid={`ps-service-${i}`}>
            <span className="gi-icon" style={{ "--i": i, color: BLUE }}><Icon size={30} strokeWidth={1.6} /></span>
            <span className="font-sans font-semibold text-[13.5px] leading-[1.35]" style={{ color: BLUE }}>{label}</span>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
);

const Connected = () => (
  <section className="py-12 lg:py-16 bg-white" style={light()} data-testid="ps-connected">
    <div className="container-x">
      <Reveal className="max-w-[760px]">
        <Kicker testId="ps-connected-eyebrow">Connected Teams. Consistent Access.</Kicker>
        <H2>Secure Access Across Every Location</H2>
        <Copy className="mt-5">We help professional services firms get more from Microsoft 365, Google Workspace and other tools through secure identities, the right permissions, well-managed devices and reliable collaboration.</Copy>
      </Reveal>
      <Reveal delay={120} className="mt-12"><Diagram src="/images/ps/connected-teams.svg" alt="Office, remote teams and client locations connected through secure access" testId="ps-connected-diagram" max={1040} /></Reveal>
      <Reveal delay={160} className="mt-10 flex justify-center"><Tags items={["Office", "Remote Teams", "Client Locations", "Secure Access Everywhere"]} /></Reveal>
    </div>
  </section>
);

const Security = () => (
  <section className="py-12 lg:py-16" style={{ background: "#1f4a3f", ...dark() }} data-testid="ps-security">
    <div className="container-x">
      <Reveal className="max-w-[760px]">
        <Kicker testId="ps-security-eyebrow">Information Security & Governance</Kicker>
        <H2 className="text-white">Protecting Confidential Client Information</H2>
        <Copy className="mt-5">We design and manage security around the way professional services firms work — helping you protect sensitive client information without slowing down your teams.</Copy>
      </Reveal>
      <Reveal delay={120} className="mt-12"><Diagram src="/images/ps/security-boundary.svg" alt="Email, shared files, client portals, applications and devices inside a managed security boundary" testId="ps-security-diagram" max={1040} /></Reveal>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mt-14">
        {PROTECT.map(([Icon, title, body], i) => (
          <Reveal key={title} delay={i * 90} className="gi-item" data-testid={`ps-protect-${i}`}>
            <span className="gi-icon" style={{ "--i": i, color: AMBER }}><Icon size={30} strokeWidth={1.6} /></span>
            <h3 className="font-serif text-white font-semibold text-[19px] mt-5">{title}</h3>
            <p className="text-white/75 text-[14px] leading-[1.65] mt-3">{body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Continuity = () => (
  <section className="py-12 lg:py-16 bg-[#eef1f5]" style={light()} data-testid="ps-continuity">
    <div className="container-x">
      <Reveal className="max-w-[760px]">
        <Kicker testId="ps-continuity-eyebrow">Business Continuity</Kicker>
        <H2>Continuity for Time-Sensitive Work</H2>
        <Copy className="mt-5">We monitor your environment, provide responsive support and help you prepare for the unexpected with backup, recovery and planned technology change. Our goal is simple: keep your teams productive and your client work on track.</Copy>
      </Reveal>
      <Reveal delay={120} className="mt-12"><Diagram src="/images/ps/continuity-timeline.svg" alt="Monitor, respond, recover and continue — a continuity timeline for time-sensitive work" testId="ps-continuity-diagram" max={1040} /></Reveal>
      <Reveal delay={160} className="mt-10 flex justify-center"><Tags items={["Prepared Systems", "Informed Response", "Continuing Client Service"]} /></Reveal>
    </div>
  </section>
);

const Accountable = () => (
  <section className="py-12 lg:py-16" style={{ background: "#0e2f6b", ...dark({ "--type-body-ink": "#dbe4ff", "--type-small-ink": "#dbe4ff" }) }} data-testid="ps-accountable">
    <div className="container-x">
      <Reveal className="max-w-[760px]">
        <Kicker testId="ps-accountable-eyebrow">A True Partnership</Kicker>
        <H2 className="text-white">One Accountable Technology Relationship</H2>
        <Copy className="mt-5">Industry experience provides context, but the technology approach is built around your firm's priorities, risk profile and plans for growth.</Copy>
      </Reveal>
      <div className="grid lg:grid-cols-12 gap-10 items-center mt-12">
        <Reveal className="lg:col-span-8"><Diagram src="/images/ps/accountable.svg" alt="Continuity, expertise and accountability overlapping in one technology relationship" testId="ps-accountable-diagram" max={720} /></Reveal>
        <Reveal delay={120} className="lg:col-span-4">
          <ul className="space-y-4">
            {["Responsive support", "Proactive guidance", "Specialized expertise", "Clear accountability"].map((t) => (
              <li key={t} className="flex items-center gap-4 font-serif text-white text-[19px]"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: AMBER }} />{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-12 lg:py-16" style={{ background: "#003bbb", ...dark({ "--type-body-ink": "#dbe4ff" }) }} data-testid="ps-cta">
    <div className="container-x grid lg:grid-cols-12 gap-8 items-center">
      <Reveal className="lg:col-span-8">
        <h2 className="font-serif text-white font-semibold text-[28px] sm:text-[36px] leading-[1.15]">A more secure, connected and resilient technology foundation helps your firm serve clients with confidence.</h2>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-4 lg:justify-self-end">
        <FlatBtn testId="ps-cta-btn">Talk With Our Team</FlatBtn>
      </Reveal>
    </div>
  </section>
);

export default function ProfessionalServicesPage() {
  return (
    <div className="page-in min-h-screen bg-white" data-testid="ps-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Delivery /><Connected /><Security /><Continuity /><Accountable /><CTA /></main>
      <Footer />
    </div>
  );
}
