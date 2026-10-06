import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Radar, Fingerprint, Network, ScanSearch, Activity, ClipboardCheck, Cross, Landmark, HeartHandshake, Building2, Construction } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageFaqs from "../components/PageFaqs";
import { ScrollProgress, Reveal } from "../components/common";
import { ImageMotion } from "../components/cyber/ImageMotion";
import { Eyebrow, H2 } from "../components/industry/IndustrySections";
const BLUE = "#1e3f9e", INK = "#2f4a8f";
const light = { "--type-eyebrow-ink": "#d48a12", "--type-section-ink": BLUE, "--type-body-ink": INK, "--type-small-ink": INK, "--type-subheading-ink": BLUE };
const Art = ({ src, alt, testId, max, w, h }) => <img src={src} alt={alt} className="w-full h-auto" style={{ maxWidth: max }} width={w} height={h} data-testid={testId} />;

const SERVICES = [
  { Icon: Radar, slug: "threat-detection-response", title: "Managed Detection & Response (MDR)", body: "24/7 threat monitoring, investigation and response to stop attacks and reduce risk." },
  { Icon: Fingerprint, slug: "identity-endpoint-security", title: "User, Identity & Endpoint Security", body: "Protect your people and devices with strong identity controls and endpoint defenses." },
  { Icon: Network, slug: "network-perimeter-security", title: "Network, Cloud & Perimeter Security", body: "Secure your networks, cloud environments and external access points." },
  { Icon: ScanSearch, slug: "security-assessments", title: "Security Assessments & Vulnerability Management", body: "Identify and prioritize risks before they can be exploited." },
  { Icon: Activity, slug: "security-monitoring-siem", title: "Security Monitoring & Analytics (SIEM)", body: "Gain visibility through centralized logging, analytics and threat detection." },
  { Icon: ClipboardCheck, slug: "security-governance-compliance", title: "Security Governance & Compliance", body: "Build and maintain the policies, controls and documentation to meet your compliance goals." },
];

const INDUSTRIES = [
  { Icon: Cross, label: "Healthcare", to: "/industries/healthcare", testId: "cyber-industry-0" },
  { Icon: Landmark, label: "Financial Services", to: "/industries/financial-services", testId: "cyber-industry-1" },
  { Icon: HeartHandshake, label: "Non-Profit", to: "/industries/non-profit", testId: "cyber-industry-3" },
  { Icon: Building2, label: "Professional Services", to: "/industries/professional-services", testId: "cyber-industry-4" },
  { Icon: Construction, label: "Construction", to: "/industries/construction", testId: "cyber-industry-5" },
];

const AssessBtn = ({ testId }) => (
  <button type="button" data-assessment className="btn-amber cyber-cta" data-testid={testId}><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></button>
);

const Hero = () => (
  <section className="relative overflow-hidden text-white pt-[var(--nav-h)]" style={{ background: "#003e9e" }} data-testid="cyber-hero">
    <div className="container-x relative z-10 pt-12 lg:pt-14 pb-12 lg:pb-14 grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6 max-w-[580px]">
        <Eyebrow>Cybersecurity</Eyebrow>
        <h1 className="cyber-h1 text-white mt-2 animate-fade-up" style={{ animationDelay: "80ms" }}>Managing Security Across Your Business Environment</h1>
        <p className="text-white/90 text-[16px] leading-[1.7] mt-6 animate-fade-up" style={{ animationDelay: "160ms" }}>Organizations depend on connected users, devices, cloud platforms, applications and information to operate. Protecting them requires coordinated management across every layer of technology.</p>
        <p className="text-white/90 text-[16px] leading-[1.7] mt-4 animate-fade-up" style={{ animationDelay: "200ms" }}>Intrinsic brings together security operations, technical controls and governance to strengthen protection, improve visibility and support long-term resilience.</p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "260ms" }}><AssessBtn testId="cyber-hero-cta" /></div>
      </div>
      <div className="hidden lg:flex lg:col-span-6 justify-end animate-fade-in" style={{ animationDelay: "200ms" }}>
        <ImageMotion src="/images/cy-hero.png" alt="Layered security panels with connected flows" testId="cyber-hero-image" max={560} w={1371} h={1015} className="w-full hero-wipe"
          pulses={[[47, 502], [48, 568], [445, 399], [509, 392], [642, 843], [876, 246], [1146, 537], [1218, 537]]}
          paths={[442, 503, 568, 632, 695].map((y, i) => ({ d: `M1012 ${y} L1345 ${y}`, dur: 4.2, delay: i * 0.85 })).concat([{ d: "M1170 28 L1170 444", dur: 5, delay: 1.2, r: 6 }])} />
      </div>
    </div>
  </section>
);

const ByDesign = () => (
  <section className="py-12 lg:py-16 border-b border-[#c9d6ea]" style={{ background: "#fefefe", ...light }} data-testid="cyber-by-design">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <Reveal className="lg:col-span-6">
          <Eyebrow>Security by Design</Eyebrow>
          <H2>Security Integrated into<br className="hidden lg:inline" /> Technology Management</H2>
          <p className="text-[15px] leading-[1.6] mt-5">Security is most effective when it is built into the way technology is planned, deployed and managed. We take a holistic approach that aligns people, processes and technology to reduce risk and improve operational resilience.</p>
          <p className="text-[15px] leading-[1.6] mt-4">By integrating security into every layer of your environment, we help you stay ahead of evolving threats while supporting your business goals.</p>
        </Reveal>
        <Reveal delay={140} dir="right" className="lg:col-span-6 flex justify-end"><ImageMotion paths={[{ d: "M619 243 L619 741", dur: 5, r: 6 }, { d: "M619 741 L619 243", dur: 5, delay: 2.5, r: 5 }]} className="w-full" src="/images/cy-weave-amber-recolor.png" alt="Applications, data, identity, infrastructure and physical layers woven together — security integrated throughout" testId="cyber-weave" max={620} w={1386} h={770} /></Reveal>
      </div>
      <Reveal delay={200}>
        <p className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-royal mt-12 flex flex-wrap gap-x-4 gap-y-2" data-testid="cyber-principles">
          {["Secure Architecture", "Identity Protection", "Continuous Oversight", "Operational Alignment"].map((t, i) => (
            <span key={t} className="inline-flex items-center gap-4">{i > 0 && <span className="w-1 h-1 rounded-full bg-royal/50" />}{t}</span>
          ))}
        </p>
      </Reveal>
    </div>
  </section>
);

const Services = () => (
  <section className="py-12 lg:py-16" style={{ background: "#fefeff", ...light }} data-testid="cyber-services">
    <div className="container-x">
      <Reveal className="max-w-[1000px]">
        <Eyebrow>Our Cybersecurity Services</Eyebrow>
        <H2>Coordinated Protection Across Every Security Layer</H2>
        <p className="text-[15px] leading-[1.6] mt-5">Our cybersecurity services work together to prevent, detect and respond to threats, while helping you meet compliance requirements and build a more resilient organization.</p>
      </Reveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 mt-10 border-t border-[#c9d6ea]">
        {SERVICES.map(({ Icon, slug, title, body }, i) => (
          <Reveal key={slug} delay={(i % 3) * 80} className={`gi-item border-b border-[#c9d6ea] ${i % 3 !== 2 ? "lg:border-r" : ""} ${i % 2 === 0 ? "md:border-r lg:border-r" : ""} ${i % 3 === 2 ? "lg:!border-r-0" : ""}`}>
            <Link to={`/services/${slug}`} className="group flex gap-5 py-8 px-2 lg:px-6 h-full hover:bg-ice/60 transition-colors" data-testid={`cyber-service-${slug}`}>
              <span className="gi-icon shrink-0 mt-1" style={{ "--i": i, color: BLUE }}><Icon size={40} strokeWidth={1.5} /></span>
              <div className="min-w-0">
                <h3 className="font-serif font-medium text-[19px] leading-[1.25]" style={{ color: BLUE }}>{title}</h3>
                <p className="text-[13.5px] leading-[1.6] mt-2.5" style={{ color: INK }}>{body}</p>
                <span className="inline-flex flex-col mt-4 text-royal text-[13px] font-bold">
                  <span className="inline-flex items-center gap-2">Learn More <ArrowRight size={13} className="text-amber transition-transform duration-200 group-hover:translate-x-1" /></span>
                  <span className="h-[2px] w-16 bg-amber mt-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Governance = () => (
  <section className="text-white py-12 lg:py-16" style={{ background: "#30685b", "--type-eyebrow-ink": "#f2a91c", "--type-section-ink": "#ffffff", "--type-section-desktop": 30, "--type-section-tablet": 28, "--type-body-ink": "#e3efea", "--type-small-ink": "#e3efea" }} data-testid="cyber-governance">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      <Reveal className="lg:col-span-5">
        <Eyebrow>Security Governance</Eyebrow>
        <H2 className="text-white">Establishing the Framework<br className="hidden lg:inline" /> for Managing Cybersecurity Risk</H2>
        <p className="text-[15px] leading-[1.6] mt-5">Effective security governance brings structure, accountability and clarity to your cybersecurity program. We help you define the right policies, controls and oversight to manage risk and support long-term business resilience.</p>
        <p className="text-[15px] leading-[1.6] mt-4">By aligning governance with your operational and compliance needs, you can make informed decisions and build greater confidence in your security posture.</p>
        <Link to="/services/security-governance-compliance" className="btn-amber cyber-cta mt-8" data-testid="cyber-governance-link"><span>Explore Security Governance</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></Link>
      </Reveal>
      <Reveal delay={140} dir="right" className="lg:col-span-7 flex justify-end" data-testid="cyber-gov-steps">
        <ImageMotion src="/images/cy-governance.png" alt="Governance & policy, risk & controls, compliance & resilience, executive oversight" testId="cyber-governance-image" max={680} w={1340} h={573} className="w-full"
          pulses={[[140, 177], [487, 177], [825, 177], [1175, 177]]} pulseR={22}
          paths={[{ d: "M140 177 L1175 177", dur: 3.6, r: 18 }]} />
      </Reveal>
    </div>
  </section>
);

const Industry = () => (
  <section className="py-12 lg:py-16" style={{ background: "#dbf1ef", ...light }} data-testid="cyber-industry">
    <div className="container-x">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <Reveal className="max-w-[720px]">
          <Eyebrow>Industry Context</Eyebrow>
          <H2>Security Priorities Informed by the Way You Operate</H2>
          <p className="text-[15px] leading-[1.6] mt-4">Every industry faces unique risks, regulations and operational demands.<br className="hidden lg:inline" /> We tailor our cybersecurity services to support your specific environment and objectives.</p>
        </Reveal>
        <Reveal delay={100}>
          <Link to="/industries" className="inline-flex items-center gap-3 border-[1.5px] border-[#f2a91c] text-[#d48a12] font-semibold text-[14px] px-6 py-3 hover:bg-[#f2a91c] hover:text-midnight transition-colors" data-testid="cyber-industries-link">Explore Industries <ArrowRight size={15} /></Link>
        </Reveal>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mt-12 divide-x divide-[#b8cfc4]" data-testid="cyber-industry-list">
        {INDUSTRIES.map(({ Icon, label, to, testId }, i) => (
          <Reveal key={label} delay={i * 60} className="gi-item">
            <Link to={to} className="group flex flex-col items-center text-center gap-4 py-3 px-2 hover:-translate-y-1 transition-transform" data-testid={testId}>
              <span className="gi-icon" style={{ "--i": i, color: BLUE }}><Icon size={44} strokeWidth={1.4} /></span>
              <span className="text-[14px] font-medium" style={{ color: BLUE }}>{label}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="text-white pt-[60px] pb-16 lg:pt-[76px] lg:pb-20 overflow-hidden" style={{ background: "#003f97", "--type-eyebrow-ink": "#f2a91c" }} data-testid="cyber-cta">
    <div className="container-x grid lg:grid-cols-12 gap-10 items-center">
      <Reveal className="lg:col-span-7 max-w-[620px]">
        <Eyebrow>Let&apos;s Build a More Secure Tomorrow</Eyebrow>
        <h2 className="font-serif text-white text-[32px] sm:text-[40px] leading-[1.12]">Strengthen Your Security Program</h2>
        <p className="text-white/90 text-[15px] leading-[1.6] mt-5">Intrinsic evaluates your technology environment, existing controls and areas of risk—then establishes practical priorities, defined responsibility and an ongoing plan for strengthening security.</p>
        <div className="mt-8"><AssessBtn testId="cyber-cta-btn" /></div>
      </Reveal>
      <Reveal delay={120} className="hidden lg:flex lg:col-span-5 justify-end">
        <ImageMotion paths={[{ d: "M981 460 L1112 460", dur: 2.6, r: 6 }]} pulses={[[981, 460], [1112, 460]]} pulseR={9} className="w-full" src="/images/cy-cta.png" alt="Rising panels — people, ideas, secure progress" testId="cyber-cta-image" max={420} w={1395} h={989} />
      </Reveal>
    </div>
  </section>
);

export default function Cybersecurity() {
  return (
    <div className="bg-white page-in" data-testid="cybersecurity-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <ByDesign />
        <Services />
        <Governance />
        <Industry />
        <CTA />
      </main>
      <PageFaqs path="/services/cybersecurity" />
      <Footer />
    </div>
  );
}
