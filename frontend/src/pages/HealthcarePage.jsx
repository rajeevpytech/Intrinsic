import React from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";

const NAVY = "#0b2c8c", INK = "#2d5197", AMBER = "#f2a91c", SKY = "#d9f3fd", CREAM = "#f6f1e7", GREEN = "#2f564d", GREEN2 = "#30584e";
const SERIF = "'Playfair Display', Georgia, serif";
const type = (overrides = {}) => ({
  "--type-hero-family": SERIF, "--type-hero-desktop": 42, "--type-hero-tablet": 36, "--type-hero-mobile": 32, "--type-hero-lineHeight": 1.12, "--type-hero-letterSpacing": -0.015,
  "--type-section-family": SERIF, "--type-section-desktop": 36, "--type-section-tablet": 31, "--type-section-mobile": 26, "--type-section-lineHeight": 1.15, "--type-section-letterSpacing": -0.01,
  "--type-body-desktop": 16, "--type-body-tablet": 16, "--type-body-mobile": 15, "--type-body-lineHeight": 1.6,
  "--type-eyebrow-desktop": 10, "--type-eyebrow-tablet": 10, "--type-eyebrow-mobile": 10, "--type-eyebrow-letterSpacing": 0.22,
  "--type-eyebrow-ink": NAVY, "--type-hero-ink": NAVY, "--type-section-ink": NAVY, "--type-body-ink": INK, "--type-small-ink": INK, "--type-subheading-ink": NAVY,
  ...overrides,
});
const light = (extra = {}) => type(extra);
const dark = (extra = {}) => type({ "--type-eyebrow-ink": "#ffffff", "--type-section-ink": "#ffffff", "--type-subheading-ink": "#ffffff", "--type-body-ink": "#e2ece8", "--type-small-ink": "#e2ece8", ...extra });

const Wrap = ({ children, className = "" }) => <div className={`w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[6vw] xl:px-[88px] ${className}`}>{children}</div>;
const Kicker = ({ children, testId }) => <p className="eyebrow eyebrow-line mb-4" data-testid={testId}>{children}</p>;
const Btn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="btn-amber">
    <span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);
const Copy = ({ children, className = "" }) => <p className={className}>{children}</p>;
const Pic = ({ src, alt, testId, max, className = "" }) => <img src={src} alt={alt} className={`w-full h-auto ${className}`} style={{ maxWidth: max }} data-testid={testId} />;
const Rule = () => <span className="block w-8 h-[2px] mb-4" style={{ background: AMBER }} />;

const Hero = () => (
  <section className="pt-[var(--nav-h)]" style={{ background: SKY, ...light() }} data-testid="hc-hero">
    <div>
      <Wrap className="py-12 lg:py-14 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <div className="lg:col-span-6 max-w-[640px]">
          <Kicker testId="hc-hero-eyebrow">Healthcare</Kicker>
          <h1 className="animate-fade-up" data-testid="hc-hero-title">Technology That Supports<br className="hidden sm:block" /> the Delivery of Care</h1>
          <Copy className="mt-5 animate-fade-up">Healthcare organizations rely on secure, available technology to support clinical operations and protect patient information. Intrinsic manages IT, cybersecurity, infrastructure, and security controls for healthcare organizations—bringing operational reliability, information protection, and regulatory considerations into a coordinated technology environment.</Copy>
          <div className="mt-7 animate-fade-up"><Btn testId="hc-hero-cta">Talk to Our Team</Btn></div>
        </div>
        <div className="lg:col-span-6 flex justify-center lg:justify-end animate-fade-in">
          <Pic src="/images/hc2/hero-transparent.webp" alt="Care delivery, patient information, people and operations connected across a hospital campus" max={620} testId="hc-hero-diagram" className="hero-wipe" />
        </div>
      </Wrap>
    </div>
  </section>
);

const Environment = () => (
  <section className="py-11 lg:py-12 bg-white" style={light()} data-testid="hc-environment">
    <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-0 items-center">
      <Reveal className="lg:col-span-7 lg:pr-14 max-w-[680px]">
        <Kicker testId="hc-environment-eyebrow">Technology for Healthcare Environments</Kicker>
        <h2>Reliability and Security Across<br className="hidden sm:block" /> Critical Systems</h2>
        <Copy className="mt-5">We support the core systems healthcare organizations depend on, including EHR platforms, practice management systems, diagnostic tools, communications platforms, and the underlying infrastructure. Intrinsic helps ensure these systems are secure, available, and properly managed, with the access controls, monitoring, and continuity measures needed to support clinical and administrative operations.</Copy>
      </Reveal>
      <div className="lg:col-span-5 lg:pl-14 lg:border-l lg:border-[#c9d6e6] self-stretch flex items-center justify-center"><Pic src="/images/hc2/systems-transparent.webp" alt="EHR platforms, practice management, diagnostic tools and communications platforms" max={480} testId="hc-env-diagram" /></div>
    </Wrap>
  </section>
);

const Security = () => (
  <section className="py-11 lg:py-12" style={{ background: CREAM, ...light() }} data-testid="hc-security">
    <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-0 items-center">
      <Reveal className="lg:col-span-7 lg:pr-14 max-w-[680px]">
        <Kicker testId="hc-security-eyebrow">Cybersecurity & Patient Information</Kicker>
        <h2>Protecting Information<br className="hidden sm:block" /> Across the Environment</h2>
        <Copy className="mt-5">Healthcare organizations face evolving threats that can impact patient care, operational continuity, and regulatory compliance.</Copy>
        <Copy className="mt-4">Intrinsic provides layered security solutions to help reduce risk, protect patient information, and keep your systems secure and resilient.</Copy>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-5 lg:pl-14 lg:border-l lg:border-[#cfc6b4] self-stretch flex items-center" data-testid="hc-security-quote">
        <div><Rule /><p className="text-[30px] lg:text-[34px] leading-[1.25]" style={{ fontFamily: SERIF, color: NAVY, fontWeight: 400 }} data-type-role="none">Protection across<br />identity, endpoints,<br />information, and<br />activity.</p></div>
      </Reveal>
    </Wrap>
  </section>
);

const TAGS = ["HIPAA", "HITECH", "Security Governance", "Documented Controls"];
const CELLS = [["Access Controls", "Manage and restrict access"], ["Security Configuration", "Apply and maintain secure configurations"], ["Audit Visibility", "Track activity and support audits"], ["Incident Response", "Prepare for and respond to incidents"]];
const Governance = () => (
  <section className="py-11 lg:py-12" style={{ background: GREEN, ...dark({ "--type-section-desktop": 32, "--type-section-tablet": 29 }) }} data-testid="hc-governance">
    <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-6 max-w-[680px]">
        <Kicker testId="hc-governance-eyebrow">HIPAA, HITECH & Security Governance</Kicker>
        <h2 className="text-white">Integrating Regulatory Requirements into Security Operations</h2>
        <Copy className="mt-5">We help healthcare organizations maintain compliance through practical security governance, clear policies and procedures, and operational controls. Our approach aligns security operations with HIPAA, HITECH, and industry best practices—helping you protect patient information and maintain audit readiness.</Copy>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6 w-full max-w-[560px] lg:ml-auto" data-testid="hc-gov-panel">
        <div className="grid grid-cols-2 border-b border-white/30">
          {CELLS.map(([t, d], i) => (
            <div key={t} className={`py-5 ${i % 2 === 0 ? "pr-6 border-r border-white/30" : "pl-6"} ${i < 2 ? "border-b border-white/30" : ""}`} data-type-tone="dark">
              <p className="font-sans font-semibold text-white text-[15px] tracking-[0.02em] uppercase leading-[1.3]" data-type-role="none">{t}</p>
              <p className="font-sans text-[15px] leading-[1.5] mt-2" style={{ color: "#dbe7e2" }} data-type-role="none">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white flex flex-wrap gap-x-3 gap-y-1" data-type-role="none" data-testid="hc-gov-tags">
          {TAGS.map((t, i) => <span key={t}>{i > 0 && <span className="mr-3" style={{ color: AMBER }}>•</span>}{t}</span>)}
        </p>
      </Reveal>
    </Wrap>
  </section>
);

const Continuity = () => (
  <section className="py-11 lg:py-12 bg-white" style={light()} data-testid="hc-continuity">
    <Wrap>
      <Reveal>
        <Kicker testId="hc-continuity-eyebrow">Infrastructure & Security Continuity</Kicker>
        <h2>Maintaining Access to the Systems Healthcare Depends On</h2>
        <Copy className="mt-5 max-w-[1000px]">We monitor, patch, and manage your infrastructure to help ensure high availability and performance. Intrinsic helps you design and maintain backup and recovery capabilities with defined restoration objectives and regular testing so your critical systems remain available when care depends on them.</Copy>
      </Reveal>
      <div className="mt-8 lg:mt-9 flex justify-center"><Pic src="/images/hc2/continuity-transparent.webp" alt="Infrastructure oversight, protected backup, restoration and testing" max={1040} testId="hc-continuity-cards" /></div>
    </Wrap>
  </section>
);

const Connected = () => (
  <section className="py-11 lg:py-12" style={{ background: "#d8f3fd", ...light() }} data-testid="hc-connected">
    <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-6 max-w-[640px]">
        <Kicker testId="hc-connected-eyebrow">Managing the Connected Healthcare Environment</Kicker>
        <h2>Infrastructure, Applications, Networks, and Security Working Together</h2>
        <Copy className="mt-5">Modern healthcare environments include clinical applications, administrative systems, Microsoft platforms, cloud services, endpoints, networks, and connected medical devices. Intrinsic helps you manage these components as a unified environment, with appropriate segmentation between clinical devices and administrative systems to reduce risk and support safe, reliable operations.</Copy>
      </Reveal>
      <div className="lg:col-span-6 flex justify-center lg:justify-end"><Pic src="/images/hc2/connected-transparent.webp" alt="Clinical environment and administrative environment connected through a secure network layer" max={620} testId="hc-connected-diagram" /></div>
    </Wrap>
  </section>
);

const CTA = () => (
  <section style={{ background: GREEN2, ...dark() }} data-testid="hc-cta">
    <div className="py-11 lg:py-12">
      <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <Reveal className="lg:col-span-6 max-w-[600px]">
          <Kicker testId="hc-cta-eyebrow">Technology That Supports Patient Care</Kicker>
          <h2 className="text-white">A More Resilient, Secure, and<br className="hidden sm:block" /> Well-Managed Environment</h2>
          <Copy className="mt-5 max-w-[540px]">Intrinsic begins by understanding the systems your organization depends on, how technology supports clinical and administrative operations, and the security and regulatory requirements surrounding patient information.</Copy>
          <div className="mt-7"><Btn testId="hc-cta-btn">Talk to Our Team</Btn></div>
        </Reveal>
        <div className="lg:col-span-6 flex justify-center lg:justify-end"><Pic src="/images/hc2/hospital-transparent.webp" alt="A hospital campus with connected facilities" max={460} testId="hc-cta-diagram" /></div>
      </Wrap>
    </div>
  </section>
);

export default function HealthcarePage() {
  return (
    <div className="page-in min-h-screen bg-white" data-testid="industry-page-healthcare">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Environment /><Security /><Governance /><Continuity /><Connected /><CTA /></main>
      <Footer />
    </div>
  );
}
