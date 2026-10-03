import React from "react";
import { ArrowRight, User, Laptop, Mail, LayoutGrid, GraduationCap, Globe, FileText, Settings, BarChart3, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { ImageMotion } from "../components/cyber/ImageMotion";
import { Eyebrow, H2 } from "../components/industry/IndustrySections";
import { ConnectedView, UES_GREEN } from "../components/cyber/UesGraphics";

const CONTROLS = [
  { Icon: User, title: "Identity & Access Security", body: "Strengthen authentication, establish appropriate permissions and maintain visibility into employee, privileged and third-party access across business systems and information.", tags: ["Multi-Factor Authentication", "Conditional Access", "Microsoft Entra ID", "Privileged Access", "Third-Party Access Controls", "Identity Monitoring", "Account Lifecycle Management"] },
  { Icon: Laptop, title: "Endpoint Security", body: "Protect workstations, laptops, servers and mobile devices through managed endpoint detection, security policies and response capabilities.", tags: ["Managed EDR", "Endpoint Monitoring", "Mobile Device Security", "Device Security Policies", "Threat Isolation", "Security Configuration Management"] },
  { Icon: Mail, title: "Email Security", body: "Reduce exposure to phishing, business email compromise, malware and account-based threats across Microsoft 365 and Google Workspace.", tags: ["Anti-Phishing", "Malware Filtering", "Link Protection", "Attachment Scanning", "Email Authentication"] },
  { Icon: LayoutGrid, title: "Collaboration & Application Security", body: "Manage access, external sharing and information exposure across Microsoft 365, Google Workspace and other cloud applications used for communication and collaboration.", tags: ["Collaboration Security", "External Sharing Controls", "Cloud Application Security", "Information Protection", "Data Access Management"] },
  { Icon: GraduationCap, title: "Security Awareness", body: "Help employees recognize phishing, social engineering and other common attack methods through ongoing education and practical testing.", tags: ["Phishing Simulations", "Role-Based Training", "Social Engineering Awareness", "Suspicious Activity Reporting"] },
  { Icon: Globe, title: "DNS & Web Protection", body: "Prevent users and devices from connecting to known malicious, fraudulent or unsafe online destinations.", tags: ["DNS Filtering", "Web Protection", "Domain Reputation Controls", "Remote User Protection"] },
];

const STEPS = [
  { Icon: FileText, title: "Policy", body: "Define the right controls for your business." },
  { Icon: Settings, title: "Configuration", body: "Implement and optimize across all environments." },
  { Icon: BarChart3, title: "Monitoring", body: "Detect and respond to emerging threats." },
  { Icon: RefreshCw, title: "Review", body: "Adapt as your people, technology and risks evolve." },
];

const CtaBtn = ({ testId, className = "" }) => (
  <button type="button" data-assessment className={`btn-amber cyber-cta ${className}`} data-testid={testId}><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></button>
);

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)]" data-testid="ues-hero">
    <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, #eef4fb 0%, #e3edf9 45%, #eaf1fc 100%)" }} />
    <div className="hidden lg:block absolute top-[62%] right-[4%] -translate-y-1/2 w-[42%] max-w-[520px]"><ImageMotion src="/images/ues-hero-shield.png" alt="User identity connecting laptop, phone and web applications, protected by a security shield" className="w-full" w={1329} h={928} testId="ues-hero-image" pulseR={14}
      pulses={[[421, 550], [637, 408], [845, 551]]}
      writes={[{ x1: 1042, x2: 1185, y: 520, w: 13, dur: 4.2, delay: 0 }, { x1: 1042, x2: 1185, y: 542, w: 13, dur: 4.2, delay: 0.7 }, { x1: 1042, x2: 1150, y: 572, w: 13, dur: 4.2, delay: 1.4 }]}
      paths={[{ d: "M421 550 L845 551", dur: 4.4 }, { d: "M845 551 L421 550", dur: 4.4, delay: 2.2, r: 5 }, { d: "M637 408 L637 470", dur: 2.4, delay: 0.6, r: 5 }]} /></div>
    <div className="container-x relative z-10 pt-16 lg:pt-[88px] pb-16 lg:pb-[88px] grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6 max-w-[560px]">
        <Eyebrow color="text-[#f2a91c]" className="animate-fade-up">User, Identity &amp; Endpoint Security</Eyebrow>
        <h1 className="cyber-h1 text-royal mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>Securing Users, Access and Devices Across the Business</h1>
        <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-6 animate-fade-up" style={{ animationDelay: "160ms" }}>Employees access business systems and information through identities, devices, email, applications, collaboration platforms and the web.</p>
        <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-4 animate-fade-up" style={{ animationDelay: "200ms" }}>Intrinsic manages the controls protecting these points of access—providing consistent oversight across the technologies employees use to conduct business.</p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "260ms" }}><CtaBtn testId="ues-hero-cta" /></div>
      </div>
    </div>
  </section>
);

const Controls = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="ues-controls">
    <div className="container-x">
      <Reveal className="max-w-[900px]">
        <Eyebrow>Our User, Identity &amp; Endpoint Security Services</Eyebrow>
        <H2>Protection Across Identity, Devices, Communications and Access</H2>
        <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-5">A compromised identity can expose business systems. A malicious email can lead to endpoint activity. Inappropriate sharing can place sensitive information outside the organization. Effective protection requires these risks to be managed across the complete user environment.</p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-x-12 mt-10">
        {CONTROLS.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 90} dir="scale" className="border-b border-[#c9d6ea]">
            <div className="group flex gap-6 py-7" data-testid={`ues-control-${i}`}>
              <span className="shrink-0 mt-1 transition-transform duration-300 group-hover:-translate-y-1" style={{ color: UES_GREEN }}><Icon size={40} strokeWidth={1.4} /></span>
              <div className="min-w-0">
                <h3 className="font-serif text-royal font-semibold text-[21px] leading-tight">{title}</h3>
                <p className="text-[#4a5259] text-[14.5px] leading-[1.65] mt-2">{body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Integrated = () => (
  <section className="relative text-white py-12 lg:py-16 overflow-hidden hero-grain" data-testid="ues-integrated">
    <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, #285c4b 0%, ${UES_GREEN} 55%, #37765f 100%)` }} />
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-5">
        <Eyebrow color="text-amber">Integrated Security Management</Eyebrow>
        <H2 className="text-white">One Connected View of the User Environment</H2>
        <p className="text-white/85 text-[15.5px] leading-[1.7] mt-6">Intrinsic manages identity, endpoint, email, collaboration and web-security controls as one connected environment.</p>
        <p className="text-white/85 text-[15.5px] leading-[1.7] mt-4">Shared oversight helps identify related activity across technologies, maintain consistent policies and support coordinated investigation, containment and response when an issue occurs.</p>
        <div className="mt-8 flex items-start gap-4">
          <span className="mt-2 w-10 h-px bg-amber shrink-0" />
          <p className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-white/85 leading-[2]">Greater Visibility<br />Stronger Control<br />Simpler Management</p>
        </div>
      </Reveal>
      <Reveal delay={140} dir="right" className="lg:col-span-7">
        <ConnectedView className="w-full lg:w-[120%] lg:-ml-[10%] h-auto" />
      </Reveal>
    </div>
  </section>
);

const Maintain = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="ues-maintain">
    <div className="container-x">
      <Reveal className="max-w-[880px]">
        <Eyebrow>Ongoing Security Management</Eyebrow>
        <H2>Maintaining Effective Protection as Requirements Change</H2>
        <p className="text-royal text-[18px] lg:text-[20px] leading-[1.55] mt-6">Intrinsic continuously administers and reviews the controls protecting users and their access. Policies and configurations are adjusted as employees, devices, applications, risks and business requirements change.</p>
        <p className="text-royal text-[18px] lg:text-[20px] leading-[1.55] mt-4">For organizations handling sensitive information, these controls can also be aligned with operational, insurance and compliance requirements relating to identity, access, endpoint protection, monitoring and security oversight.</p>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 mt-14" data-testid="ues-steps">
        {STEPS.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 130} dir="scale" className="relative text-center px-4">
            {i < STEPS.length - 1 && (
              <span className="hidden lg:block absolute top-[22px] left-[calc(50%+34px)] right-[calc(-50%+34px)] h-px bg-[#c9d6ea]">
                <span className="line-runner" style={{ animationDelay: `${i * 0.9}s` }} />
              </span>
            )}
            <span className="inline-flex" style={{ color: UES_GREEN }}><Icon size={44} strokeWidth={1.4} /></span>
            <h3 className="font-serif text-royal font-semibold text-[20px] mt-4">{title}</h3>
            <p className="text-[#4a5259] text-[14px] leading-[1.6] mt-1.5 max-w-[220px] mx-auto">{body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative text-white py-12 lg:py-16 overflow-hidden hero-grain" data-testid="ues-cta">
    <div className="absolute inset-0" style={{ background: "#0a4fd6" }} />
    <div className="container-x relative z-10">
      <Reveal>
        <p className="eyebrow eyebrow-line text-[#ffc857] mb-3">Strengthen Security Across Your User Environment</p>
        <h2 className="font-serif text-white font-semibold text-[30px] sm:text-[40px] leading-[1.12]">Security Across the User Environment. Managed as One.</h2>
        <p className="text-white/90 text-[16px] mt-3 max-w-[620px]">Bring identity, endpoint, email, collaboration, awareness and web protection together within one managed security program.</p>
        <div className="mt-7"><CtaBtn testId="ues-cta-btn" /></div>
      </Reveal>
      <p className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-white/85 mt-10 flex flex-wrap gap-x-5 gap-y-2">
        <span>People</span><span className="text-white/40">|</span><span>Technology</span><span className="text-white/40">|</span><span>Expertise</span><span className="text-white/40">|</span><span>A More Secure Tomorrow</span>
      </p>
    </div>
  </section>
);

export default function UserEndpointSecurity() {
  return (
    <div className="bg-white page-in" data-testid="ues-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Controls />
        <Integrated />
        <Maintain />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
