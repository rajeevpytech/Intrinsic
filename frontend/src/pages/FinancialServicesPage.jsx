import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";

const NAVY = "#0b2c8c", INK = "#2d5197", AMBER = "#f2a91c", SKY = "#d6f2fc";
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
const dark = (extra = {}) => type({ "--type-eyebrow-ink": "#ffffff", "--type-section-ink": "#ffffff", "--type-subheading-ink": "#ffffff", "--type-body-ink": "#dfe7f5", "--type-small-ink": "#dfe7f5", ...extra });

const Wrap = ({ children, className = "" }) => <div className={`w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[6vw] xl:px-[88px] ${className}`}>{children}</div>;
const Kicker = ({ children, testId }) => <p className="eyebrow eyebrow-line mb-4" data-testid={testId}>{children}</p>;
const Btn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="btn-amber">
    <span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);
const Copy = ({ children, className = "" }) => <p className={className}>{children}</p>;
const Pic = ({ src, alt, testId, max, className = "" }) => <img src={src} alt={alt} className={`w-full h-auto ${className}`} style={{ maxWidth: max }} data-testid={testId} />;
const Rule = ({ color = AMBER }) => <span className="block w-8 h-[2px] mb-4" style={{ background: color }} />;

const Hero = () => (
  <section className="pt-[calc(var(--nav-h)+14px)] px-3 sm:px-4 lg:px-5" style={{ background: SKY, ...light() }} data-testid="fin-hero">
    <div className="rounded-[26px] lg:rounded-[32px]" data-testid="fin-hero-panel">
      <Wrap className="py-12 lg:py-14 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <div className="lg:col-span-6 max-w-[660px]">
          <Kicker testId="fin-hero-eyebrow">Financial Services</Kicker>
          <h1 className="animate-fade-up" data-testid="fin-hero-title">Technology Management<br className="hidden sm:block" /> for a Regulated Environment</h1>
          <Copy className="mt-5 animate-fade-up">Financial services organizations depend on technology to protect sensitive information, support critical business operations, and maintain the controls required within a regulated environment.</Copy>
          <Copy className="mt-4 animate-fade-up">Intrinsic manages IT, cybersecurity, cloud infrastructure, and security governance for financial services organizations – with an approach shaped by the operational, security, and regulatory requirements of the sector.</Copy>
          <div className="mt-7 animate-fade-up"><Btn testId="fin-hero-cta">Talk to Our Team</Btn></div>
        </div>
        <div className="lg:col-span-6 flex justify-center lg:justify-end animate-fade-in">
          <img src="/images/fin/hero-transparent.webp" alt="Cybersecurity, transaction systems, identity and access, business continuity and cloud infrastructure for financial services" className="w-full h-auto live-float hero-wipe" style={{ maxWidth: 620 }} data-testid="fin-hero-diagram" />
        </div>
      </Wrap>
    </div>
  </section>
);

const Environment = () => (
  <section className="py-11 lg:py-12 bg-white" style={light()} data-testid="fin-environment">
    <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-7 max-w-[680px]">
        <Kicker testId="fin-env-eyebrow">The Financial Services Environment</Kicker>
        <h2>Technology Requirements<br className="hidden sm:block" /> Extend Beyond Day-to-Day IT</h2>
        <Copy className="mt-5">Financial services firms operate in a complex environment with heightened expectations for security, resilience, and regulatory compliance. Technology must support critical business operations, protect sensitive client and firm information, and maintain the controls required by regulators and other stakeholders.</Copy>
        <Copy className="mt-4">Intrinsic helps financial services organizations manage these requirements through a connected approach to IT, security, infrastructure, and governance so your team can operate with confidence and focus on what's next.</Copy>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-5 flex justify-center lg:justify-end">
        <Pic src="/images/fin/dashboard-trim.png" alt="Client information, operations, regulatory oversight and critical systems" max={440} testId="fin-env-diagram" />
      </Reveal>
    </Wrap>
  </section>
);

const Split = ({ testId, eyebrow, eyebrowId, title, paras, quote, quoteId, bg, tone = light, divider, link }) => (
  <section className="py-11 lg:py-12" style={{ background: bg, ...tone() }} data-testid={testId}>
    <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-0 items-center">
      <Reveal className="lg:col-span-7 lg:pr-14 max-w-[700px]">
        <Kicker testId={eyebrowId}>{eyebrow}</Kicker>
        <h2>{title}</h2>
        {paras.map((p, i) => <Copy key={i} className={i === 0 ? "mt-5" : "mt-4"}>{p}</Copy>)}
        {link}
      </Reveal>
      <Reveal delay={120} className={`lg:col-span-5 lg:pl-14 lg:border-l self-stretch flex items-center ${divider}`} data-testid={quoteId}>
        <div><Rule />{quote}</div>
      </Reveal>
    </Wrap>
  </section>
);

const Cyber = () => (
  <Split testId="fin-cyber" bg={SKY} eyebrow="Cybersecurity for Financial Services" eyebrowId="fin-cyber-eyebrow" title={<>Protecting Information, Access,<br className="hidden sm:block" /> and Critical Systems</>}
    paras={["Financial services organizations face a range of evolving threats that can impact operations, client information, and regulatory compliance.", "Intrinsic provides layered security solutions that help reduce risk, protect sensitive data, and keep your systems secure and resilient.", "We work as a strategic partner to strengthen your security posture and stay ahead of emerging threats."]}
    divider="lg:border-[#8fb3d3]" quoteId="fin-cyber-quote"
    quote={<p className="text-[30px] lg:text-[34px] leading-[1.25]" style={{ fontFamily: SERIF, color: NAVY, fontWeight: 400 }} data-type-role="none">Security should be<br />visible, managed,<br />and continuously<br />reviewed.</p>} />
);

const Governance = () => (
  <Split testId="fin-governance" bg="#0037a0" tone={dark} eyebrow="Security Governance & Regulatory Requirements" eyebrowId="fin-gov-eyebrow" title="Connecting Security Requirements with Operating Controls"
    paras={["Financial services organizations must maintain effective security governance and demonstrate compliance with regulatory requirements.", "Intrinsic helps align your security program with operational controls, providing the policies, processes, and evidence needed to meet regulatory expectations and support your overall risk management program."]}
    link={<Link to="/services/security-governance-compliance" className="inline-flex items-center gap-3 mt-5 font-sans font-medium text-[16px]" style={{ color: AMBER }} data-testid="fin-gov-link">Explore Governance & Compliance <ArrowRight size={17} strokeWidth={2.2} /></Link>}
    divider="lg:border-white/35" quoteId="fin-gov-quote"
    quote={<p className="text-white text-[26px] lg:text-[30px] leading-[1.35] tracking-[0.18em] uppercase" style={{ fontFamily: SERIF, fontWeight: 400 }} data-type-role="none">Policy Into<br />Practice</p>} />
);

const Infrastructure = () => (
  <section className="py-11 lg:py-12 bg-white" style={light()} data-testid="fin-infra">
    <Wrap>
      <Reveal>
        <Kicker testId="fin-infra-eyebrow">Infrastructure, Cloud & Business Continuity</Kicker>
        <h2>Maintaining the Systems the Business Depends On</h2>
        <Copy className="mt-5 max-w-[1000px]">A reliable and secure technology infrastructure is essential for financial services organizations. Intrinsic manages your on-premises, cloud, and hybrid environments, helping to ensure high availability, performance, and business continuity.</Copy>
      </Reveal>
      <Reveal delay={120} className="mt-8 lg:mt-9">
        <div className="hidden sm:flex justify-center"><Pic src="/images/fin/infrastructure-transparent.webp" alt="Infrastructure management, cloud and Microsoft environments, and backup and business continuity" max={1000} testId="fin-infra-diagram" /></div>
        <div className="sm:hidden grid gap-6 max-w-[300px] mx-auto" data-testid="fin-infra-diagram-mobile">
          {["Infrastructure management", "Cloud and Microsoft environments", "Backup and business continuity"].map((alt, i) => <img key={i} src={`/images/fin/infra-m${i + 1}-transparent.webp`} alt={alt} className="w-full h-auto" data-testid={`fin-infra-mobile-image-${i + 1}`} />)}
        </div>
      </Reveal>
    </Wrap>
  </section>
);

const Together = () => (
  <section className="py-11 lg:py-12" style={{ background: "#fdf1dc", ...light() }} data-testid="fin-together">
    <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-6 max-w-[560px]">
        <Kicker testId="fin-together-eyebrow">Technology Management for Financial Services</Kicker>
        <h2>Bringing IT, Security, and Governance Together</h2>
        <Copy className="mt-5">Financial services organizations need a partner who understands how technology, security, and regulatory requirements fit together.</Copy>
        <Copy className="mt-4">Intrinsic provides a unified approach to IT, operations, cybersecurity, cloud infrastructure, and governance – helping you operate more efficiently, reduce risk, and maintain the controls your business requires.</Copy>
        <div className="mt-7"><Btn testId="fin-together-cta">Talk to Our Team</Btn></div>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6 flex justify-center lg:justify-end">
        <Pic src="/images/fin/it-management-trim.png" alt="Governance, identity and access, cloud and continuity managed together" max={640} testId="fin-together-diagram" />
      </Reveal>
    </Wrap>
  </section>
);

const Start = () => (
  <section className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5" style={{ background: "#364d41", ...dark({ "--type-body-ink": "#e4ece6" }) }} data-testid="fin-start">
    <div className="rounded-[26px] lg:rounded-[32px] py-11 lg:py-12" data-testid="fin-start-panel">
      <Wrap className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <Reveal className="lg:col-span-6 max-w-[600px]">
          <Kicker testId="fin-start-eyebrow">Technology Aligned With Your Operating Requirements</Kicker>
          <h2 className="text-white">Start With Your Financial Services Environment</h2>
          <Copy className="mt-5 max-w-[520px]">Intrinsic begins by understanding your technology environment, business operations, security requirements, and the systems and information most critical to the organization.</Copy>
          <div className="mt-7"><Btn testId="fin-start-cta">Talk to Our Team</Btn></div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6 flex justify-center lg:justify-end">
          <Pic src="/images/fin/workstation-trim.png" alt="A financial services technology specialist monitoring systems and dashboards" max={620} testId="fin-start-diagram" />
        </Reveal>
      </Wrap>
    </div>
  </section>
);

export default function FinancialServicesPage() {
  return (
    <div className="page-in min-h-screen bg-white" data-testid="fin-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Environment /><Cyber /><Governance /><Infrastructure /><Together /><Start /></main>
      <Footer />
    </div>
  );
}
