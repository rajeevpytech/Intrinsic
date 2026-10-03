import React from "react";
import { ArrowRight, Eye, SlidersHorizontal, RefreshCw, FileText, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { SiemConverge, SiemInfographic, SiemInfographicMobile } from "../components/monitoring/SiemGraphics";
import { GovOngoingArcs } from "../components/governance/GovernanceGraphics";

const GoldRule = () => <span className="block w-[42px] h-[2px] bg-[#f2a91c] mt-2" />;

/* ============================ HERO ============================ */
const Hero = () => (
  <section className="sm-hero relative overflow-hidden pt-[var(--nav-h)]" data-testid="siem-hero">
    <div className="container-x relative z-10 pt-10 lg:pt-12 pb-12 lg:pb-14 grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
      <div className="lg:col-span-5">
        <p className="gp2-eyebrow animate-fade-up" style={{ color: "#f2a91c" }} data-testid="siem-hero-eyebrow">SIEM</p>
        <h1 className="font-serif text-[#12306e] font-normal text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.08] tracking-[-0.01em] mt-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
          Centralized Security Visibility Across Your Environment
        </h1>
        <p className="text-[#2b3550] text-[15.5px] leading-[1.45] mt-5 max-w-[440px] animate-fade-up" style={{ animationDelay: "160ms" }}>
          Intrinsic SIEM brings together the signals from your endpoints, networks, cloud, applications, and more — so you can detect threats early, correlate what matters, and prioritize the right actions.
        </p>
        <div className="mt-7 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <button type="button" data-contact-trigger className="gc-hero-btn" data-testid="siem-hero-cta">
            <span>Talk to Our Team</span><ArrowRight size={15} strokeWidth={2.2} />
          </button>
        </div>
      </div>
      <div className="lg:col-span-7 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <SiemConverge className="w-full lg:-mr-6" />
      </div>
    </div>
  </section>
);

/* ==================== MORE THAN LOG COLLECTION ==================== */
const Intro = () => (
  <section className="bg-[#eef4fc] py-12 lg:py-16" data-testid="siem-intro">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <Reveal className="lg:col-span-6">
        <p className="gp2-eyebrow" style={{ color: "#f2a91c" }}>More Than Log Collection</p>
        <GoldRule />
        <h2 className="font-serif text-[#12306e] font-normal text-[34px] sm:text-[40px] lg:text-[46px] leading-[1.08] mt-4">Turn Security Data<br className="hidden sm:block" /> into Meaningful Action</h2>
      </Reveal>
      <Reveal className="lg:col-span-6 relative lg:pl-12" delay={100}>
        <span className="go-rule sm-rule hidden lg:block" />
        <p className="text-[#2b3550] text-[15px] leading-[1.45]">Intrinsic SIEM does more than collect and store data. We analyze, correlate, and contextualize signals across your entire environment to uncover real threats, reduce noise, and help you take action faster.</p>
        <a href="#siem-together" className="sm-link mt-5" data-testid="siem-learn-more">Learn More&nbsp;<ArrowRight size={14} strokeWidth={2.4} className="inline-block align-[-2px]" /></a>
      </Reveal>
    </div>
  </section>
);

/* ==================== BRINGING IT ALL TOGETHER ==================== */
const Together = () => (
  <section id="siem-together" className="bg-white py-12 lg:py-16 overflow-hidden" data-testid="siem-together">
    <div className="container-x">
      <Reveal className="text-center max-w-[900px] mx-auto">
        <p className="gp2-eyebrow" style={{ color: "#f2a91c", letterSpacing: "0.2em" }}>Security Monitoring Built Around Your Environment</p>
        <h2 className="font-serif text-[#12306e] font-normal text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.08] mt-3">Bringing It All Together</h2>
        <p className="text-[#2b3550] text-[15.5px] leading-[1.45] mt-5">Intrinsic SIEM ingests data from across your environment — endpoints, servers, cloud platforms, networks, security tools, and applications — normalizes and correlates it, and provides the visibility you need to detect, respond, and stay ahead of what's next.</p>
      </Reveal>
      <Reveal className="mt-10 lg:mt-12" delay={120}>
        <SiemInfographic className="hidden md:block max-w-[1040px] mx-auto" />
        <div className="md:hidden"><SiemInfographicMobile /></div>
      </Reveal>
    </div>
  </section>
);

/* ==================== KEY CAPABILITIES ==================== */
const CAPS = [
  { Icon: Eye, title: "Centralized Security Visibility", body: "A unified view of activity across your entire IT environment." },
  { Icon: SlidersHorizontal, title: "Context-Based Analysis", body: "Correlation and enrichment to identify real threats and reduce false positives." },
  { Icon: RefreshCw, title: "Continuous Optimization", body: "Ongoing tuning and rule development to keep pace with evolving threats." },
  { Icon: FileText, title: "Security Reporting & Compliance Support", body: "Visibility and reporting to support internal requirements and regulatory frameworks." },
];

const Capabilities = () => (
  <section className="bg-[#eef4fc] py-12 lg:py-16" data-testid="siem-capabilities">
    <div className="container-x">
      <Reveal>
        <p className="gp2-eyebrow" style={{ color: "#f2a91c" }}>Key Capabilities</p>
        <GoldRule />
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-8 lg:gap-x-0 mt-8" data-testid="siem-capabilities-grid">
        {CAPS.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 110} className={`gi-item ${i > 0 ? "lg:border-l lg:border-[#c9d4e6] lg:pl-8" : ""} lg:pr-8`}>
            <span className="gi-icon text-[#1d4fd8]" style={{ "--i": i }}><Icon size={46} strokeWidth={1.4} /></span>
            <h3 className="font-sans text-[#12306e] font-bold text-[17px] leading-[1.25] mt-4 max-w-[200px]">{title}</h3>
            <p className="text-[#3a4356] text-[13px] leading-[1.5] mt-3 max-w-[230px]">{body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ==================== REGULATED ENVIRONMENTS ==================== */
const CHECKS = ["Support for regulatory requirements", "Audit-ready reporting", "Improved risk management", "Greater overall resilience"];

const Compliance = () => (
  <section className="sm-green py-12 lg:py-16" data-testid="siem-compliance">
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      <Reveal className="lg:col-span-7">
        <p className="gp3-eyebrow">Regulated Environments</p>
        <GoldRule />
        <h2 className="font-serif text-white font-normal text-[34px] sm:text-[40px] lg:text-[46px] leading-[1.08] mt-4">Built for Compliance<br className="hidden sm:block" /> and Resilience</h2>
        <p className="text-white/90 text-[15px] leading-[1.45] mt-5 max-w-[560px]">Intrinsic SIEM helps organizations in regulated industries meet compliance requirements by providing the visibility, monitoring, and reporting needed to support frameworks such as HIPAA, CMMC, SOC 2, NYDFS and more.</p>
      </Reveal>
      <Reveal className="lg:col-span-5 relative lg:pl-14" delay={120}>
        <span className="go-rule hidden lg:block" />
        <ul className="space-y-5" data-testid="siem-compliance-list">
          {CHECKS.map((c, i) => (
            <li key={c} className="sm-check flex items-center gap-4 text-white text-[14.5px]" style={{ "--i": i }}>
              <CheckCircle size={26} strokeWidth={1.6} className="text-[#cfe3d8] shrink-0" /><span>{c}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);

/* ==================== CTA ==================== */
const CTA = () => (
  <section data-type-tone="dark" className="bg-[#0b3d9e] relative overflow-hidden py-12 lg:py-16" data-testid="siem-cta">
    <GovOngoingArcs />
    <div className="container-x relative z-10">
      <Reveal className="max-w-[640px]">
        <p className="gp2-eyebrow" style={{ color: "#f2a91c" }}>Ready to Strengthen Your Security?</p>
        <h2 className="font-serif text-white font-normal text-[32px] sm:text-[38px] lg:text-[42px] leading-[1.1] mt-3">Bring Your Security Data Together.</h2>
        <p className="text-white/90 text-[15px] leading-[1.45] mt-4">Talk to our team about how Intrinsic SIEM can help you detect, respond, and stay ahead of what's next.</p>
        <div className="mt-7">
          <button type="button" data-contact-trigger className="gc-hero-btn" data-testid="siem-cta-btn">
            <span>Talk to Our Team</span><ArrowRight size={15} strokeWidth={2.2} />
          </button>
        </div>
      </Reveal>
    </div>
  </section>
);

export default function SecurityMonitoring() {
  return (
    <div className="bg-white page-in" data-testid="siem-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Together />
        <Capabilities />
        <Compliance />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
