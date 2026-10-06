import React from "react";
import { ArrowRight, Boxes, KeyRound, SlidersHorizontal, ShieldCheck, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NetworkCoreDiagram from "../components/NetworkCoreDiagram";
import { ScrollProgress, Reveal } from "../components/common";
import { ImageMotion } from "../components/cyber/ImageMotion";
import { H2 } from "../components/industry/IndustrySections";

const NAVY = "#0f2a5e", INK = "#2f3c52", SKY = "#2a63c9";
const light = (extra = {}) => ({ "--type-eyebrow-ink": SKY, "--type-hero-ink": NAVY, "--type-section-ink": NAVY, "--type-body-ink": INK, "--type-small-ink": INK, "--type-subheading-ink": NAVY, "--type-section-desktop": 32, ...extra });

const Kicker = ({ children, testId }) => <p className="eyebrow eyebrow-line mb-4" data-testid={testId}>{children}</p>;
const NavyBtn = ({ children, testId, outline }) => (
  <button type="button" data-contact-trigger data-testid={testId} className={`inline-flex items-center gap-3 rounded-[6px] px-6 py-3 font-mono uppercase tracking-[0.14em] text-[12.5px] font-medium transition-[background-color,transform] duration-200 hover:-translate-y-px ${outline ? "bg-white text-[#0f2a5e] hover:bg-[#eef3fb]" : "text-white hover:bg-[#173a7a]"}`} style={outline ? undefined : { background: "#12336e" }}>
    {children} <ArrowRight size={15} strokeWidth={2.2} />
  </button>
);
const Copy = ({ children, className = "" }) => <p className={`text-[15px] leading-[1.65] ${className}`}>{children}</p>;
const Art = ({ src, alt, testId, max, w, h, className = "" }) => <img src={src} alt={alt} className={`w-full h-auto ${className}`} style={{ maxWidth: max }} width={w} height={h} data-testid={testId} />;

const SERVICES = [
  ["architecture", "Network Design & Architecture", "Design and architecture based on business requirements, application dependencies, user needs, security requirements, and future growth."],
  ["monitoring", "Network Monitoring & Management", "Continuous monitoring across LAN, WAN, wireless, and edge infrastructure. Device health, performance metrics, and configuration changes provide ongoing visibility."],
  ["wireless", "Wireless Networking", "Design and management of wireless infrastructure based on coverage, capacity, access, and security requirements."],
  ["cloud", "WAN & Connectivity Management", "Management of connectivity between offices, users, cloud platforms, and service providers. We monitor connectivity, investigate performance issues, and coordinate with carriers and vendors."],
  ["performance", "Network Performance Management", "Ongoing analysis of bandwidth utilization, latency, device health, and performance trends to identify constraints, investigate recurring issues, and inform capacity planning."],
  ["security", "Network Security Integration", "Segmentation, access controls, secure configurations, and traffic protection are incorporated into network architecture and ongoing management."],
];

const Hero = () => (
  <section className="pt-[var(--nav-h)]" style={{ background: "#ebf5fd", ...light({ "--type-hero-desktop": 40, "--type-hero-tablet": 36 }) }} data-testid="network-hero">
    <div className="container-x pt-10 lg:pt-12 pb-10 lg:pb-12 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
      <div className="lg:col-span-5">
        <Kicker testId="network-hero-eyebrow">Networking</Kicker>
        <h1 className="font-serif leading-[1.1] animate-fade-up" data-testid="network-hero-title">The Network<br />Underneath<br />Everything Else.</h1>
        <Copy className="mt-5 animate-fade-up">Every business application, cloud platform, communication tool, and security control depends on the network beneath it.</Copy>
        <Copy className="mt-4 animate-fade-up">Intrinsic designs, manages, and monitors network infrastructure across offices, cloud environments, and distributed operations—providing the performance, visibility, and resilience required to support the organization.</Copy>
        <div className="mt-7 animate-fade-up"><NavyBtn testId="network-hero-cta">Talk to Our Team</NavyBtn></div>
      </div>
      <div className="lg:col-span-7 flex justify-end animate-fade-in">
        <ImageMotion src="/images/nw-hero.png" alt="Endpoints, networks, cloud and identity orbiting a protected core" testId="network-hero-image" max={620} w={1331} h={1178} className="w-full" pulseR={16}
          pulses={[[516, 208], [366, 460], [516, 656], [536, 856], [720, 806]]}
          paths={[
            { d: "M860 330 a256 256 0 1 1 0 512 a256 256 0 1 1 0 -512", dur: 15, r: 10, color: "#f2a41c" },
            { d: "M860 235 a351 351 0 1 1 0 702 a351 351 0 1 1 0 -702", dur: 20, delay: 2, r: 9, color: "#8fa6c4" },
            { d: "M860 164 a422 422 0 1 1 0 844 a422 422 0 1 1 0 -844", dur: 26, delay: 4, r: 9, color: "#3f9d6b" },
            { d: "M860 76 a510 510 0 1 1 0 1020 a510 510 0 1 1 0 -1020", dur: 32, delay: 1, r: 9, color: "#1e4fd8" },
          ]} />
      </div>
    </div>
  </section>
);

const Intro = () => (
  <section className="py-12 lg:py-16 bg-white" style={light()} data-testid="network-intro">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      <Reveal className="lg:col-span-6">
        <Kicker testId="network-intro-eyebrow">Network Infrastructure Management</Kicker>
        <H2>Designed for the Requirements<br className="hidden lg:inline" /> of the Organization</H2>
        <Copy className="mt-5">Network infrastructure must support more than connectivity. It must accommodate application requirements, user access, cloud services, security controls, multiple locations, and changing demands on capacity and performance.</Copy>
        <Copy className="mt-4">As these requirements evolve, network architecture and configuration need to evolve with them.</Copy>
        <Copy className="mt-4">Intrinsic provides ongoing management across network architecture, connectivity, wireless infrastructure, performance, and security integration. We maintain visibility across the infrastructure while managing the changes required to support current operations and future requirements.</Copy>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6 flex justify-end">
        <NetworkCoreDiagram max={560} />
      </Reveal>
    </div>
  </section>
);

const Topology = () => (
  <section className="py-12 lg:py-16 bg-white border-t border-[#e6edf6]" style={light()} data-testid="network-topology">
    <div className="container-x">
      <Reveal className="max-w-[640px]">
        <Kicker testId="network-topology-eyebrow">Network Environment Example</Kicker>
        <H2>From Core to Edge</H2>
        <Copy className="mt-4">A simplified view of a typical network environment, showing how core, distribution, access, wireless, and connected devices work together across locations, cloud, and remote users.</Copy>
      </Reveal>
      <Reveal delay={120} className="mt-8 overflow-x-auto">
        <Art src="/images/nw-edge.png" alt="Core switch to distribution, access switches, wireless access points, IoT, cloud and remote devices" testId="network-topology-image" max={940} w={1556} h={781} className="min-w-[640px] mx-auto" />
      </Reveal>
    </div>
  </section>
);

const Manage = () => (
  <section className="py-12 lg:py-16 bg-white border-t border-[#e6edf6]" style={light()} data-testid="network-manage">
    <div className="container-x">
      <Reveal><Kicker testId="network-manage-eyebrow">What We Manage</Kicker><H2>Network Infrastructure &amp; Connectivity</H2></Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 mt-10" data-testid="network-services">
        {SERVICES.map(([icon, title, body], i) => (
          <Reveal key={icon} delay={i * 70} className="flex flex-col" data-testid={`network-service-${i}`}>
            <img src={`/images/nw-icon-${icon}.png`} alt="" className="w-[92px] h-[92px]" />
            <h3 className="font-sans font-semibold text-[16px] mt-5" style={{ color: NAVY }}>{title}</h3>
            <p className="text-[13.5px] leading-[1.6] mt-2.5" style={{ color: INK }}>{body}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <p className="font-mono text-[10.5px] font-bold tracking-[0.2em] uppercase mt-14 flex flex-wrap justify-center gap-x-4 gap-y-2" style={{ color: INK }} data-testid="network-strip">
          {["Architecture", "Monitoring", "Wireless", "Connectivity", "Performance", "Security"].map((t, i) => <span key={t} className="inline-flex items-center gap-4">{i > 0 && <span className="w-1 h-1 rounded-full bg-[#9fb0c8]" />}{t}</span>)}
        </p>
      </Reveal>
    </div>
  </section>
);

const Visibility = () => (
  <section className="py-12 lg:py-16" style={{ background: "#f3f7fc", ...light() }} data-testid="network-visibility">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      <Reveal className="lg:col-span-6">
        <Kicker testId="network-visibility-eyebrow">Performance &amp; Operational Visibility</Kicker>
        <H2>Managing the Network<br className="hidden lg:inline" /> with Current Information</H2>
        <Copy className="mt-5">Network management depends on an accurate understanding of how the infrastructure is configured and performing.</Copy>
        <Copy className="mt-4">Intrinsic maintains visibility across network devices, connectivity, configurations, bandwidth utilization, latency, and performance trends. This information supports day-to-day management while providing the technical context required to investigate recurring issues and identify developing constraints.</Copy>
        <Copy className="mt-4">Performance data also informs decisions around capacity, configuration, connectivity, and infrastructure changes. Rather than treating individual network events in isolation, we evaluate them in the context of the broader infrastructure and the systems it supports.</Copy>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6 flex justify-end">
        <Art src="/images/nw-dashboard.png" alt="Network performance dashboard: total devices, uptime, latency, bandwidth and inbound/outbound traffic" testId="network-dashboard-image" max={560} w={1400} h={1086} className="bc-wipe" />
      </Reveal>
    </div>
  </section>
);

const PILLARS = [
  [Boxes, "Segmentation", "Zones limit how systems communicate"],
  [KeyRound, "Access Controls", "Rules govern who and what can connect"],
  [SlidersHorizontal, "Secure Configuration", "Settings are hardened, not left at default"],
  [ShieldCheck, "Traffic Protection", "Movement across the network is inspected"],
];

const SecurityDiagram = () => (
  <div className="mt-14 lg:mt-16" data-testid="network-security-diagram">
    <p className="font-mono text-[10.5px] font-bold tracking-[0.22em] uppercase text-center mb-12" style={{ color: "#7c8aa1" }}>How Security Is Built Into the Architecture</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 items-stretch">
      {PILLARS.map(([Icon, title, desc], i) => (
        <div key={title} className="flex flex-col items-center text-center h-full" data-testid={`network-security-pillar-${i}`}>
          <div className="relative">
            <div className="w-[68px] h-[68px] rounded-full flex items-center justify-center shadow-[0_14px_30px_-14px_rgba(15,42,94,.7)]" style={{ background: NAVY }}>
              <Icon size={27} className="text-white" strokeWidth={1.7} />
            </div>
            <span className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full flex items-center justify-center ring-2 ring-white" style={{ background: "#3f9d6b" }}>
              <Check size={14} className="text-white" strokeWidth={3} />
            </span>
          </div>
          <h4 className="font-sans font-semibold text-[15px] mt-5" style={{ color: NAVY }}>{title}</h4>
          <p className="text-[12.5px] leading-[1.5] mt-2 max-w-[180px]" style={{ color: INK }}>{desc}</p>
          <div className="hidden md:block flex-1 min-h-[34px] w-px mt-5" style={{ background: "rgba(15,42,94,.45)" }} />
          <span className="hidden md:block w-2.5 h-2.5 rounded-full relative z-10 -mb-[5px]" style={{ background: "#f2a91c" }} />
        </div>
      ))}
    </div>
    <div className="rounded-[8px] py-5 text-center shadow-[0_20px_44px_-26px_rgba(15,42,94,.8)]" style={{ background: NAVY }}>
      <span className="font-sans font-semibold tracking-[0.3em] text-[13px] text-white uppercase">Network Architecture</span>
    </div>
  </div>
);

const Security = () => (
  <section className="py-12 lg:py-16 bg-white" style={light()} data-testid="network-security">
    <div className="container-x">
      <Reveal className="max-w-[720px]">
        <Kicker testId="network-security-eyebrow">Network Security Integration</Kicker>
        <H2>Security Incorporated into Network Architecture</H2>
        <Copy className="mt-5">Network architecture and cybersecurity are closely connected.</Copy>
        <Copy className="mt-4">Segmentation, access controls, secure configurations, and traffic protection influence how users, systems, locations, and applications communicate across the organization.</Copy>
        <Copy className="mt-4">Intrinsic incorporates these requirements into network design and ongoing management so that security considerations are addressed as part of the infrastructure itself rather than added independently.</Copy>
      </Reveal>
      <Reveal delay={120}><SecurityDiagram /></Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative text-white py-12 lg:py-16 overflow-hidden" style={{ background: "#002c64 url(/images/nw-cta-bg.jpg) center/cover no-repeat", "--type-eyebrow-ink": "#9cc0f5", "--type-section-ink": "#ffffff", "--type-body-ink": "#dbe6f7", "--type-small-ink": "#dbe6f7", "--type-section-desktop": 32 }} data-testid="network-cta">
    <div className="container-x relative">
      <Reveal className="max-w-[640px]">
        <Kicker testId="network-cta-eyebrow">Build a Stronger Foundation</Kicker>
        <H2 className="text-white">Let&apos;s Talk About Your Network</H2>
        <Copy className="mt-4">Design, manage, and optimize your network for what&apos;s next.</Copy>
        <div className="mt-7"><NavyBtn outline testId="network-cta-btn">Talk to Our Team</NavyBtn></div>
      </Reveal>
    </div>
  </section>
);

export default function Networking() {
  return (
    <div className="bg-white page-in" data-testid="networking-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Intro /><Topology /><Manage /><Visibility /><Security /><CTA /></main>
      <Footer />
    </div>
  );
}
