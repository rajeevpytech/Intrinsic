import React from "react";
import { ArrowRight, Server, Laptop, Network, AppWindow, RefreshCw, DatabaseBackup } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { CardGrid, SplitText } from "../components/shared/PageBlocks";
import { TelemetryPanel, ResponseTimeline } from "../components/monitoring/RmmGraphics";

const MONITOR = [
  { Icon: Server, title: "Servers & Infrastructure", body: "System availability, processor and memory utilization, disk capacity, hardware health, and event activity are monitored to identify conditions affecting infrastructure health and performance." },
  { Icon: Laptop, title: "Endpoints", body: "Managed devices are monitored for availability, performance, patch status, and agent health, maintaining visibility across the endpoint environment." },
  { Icon: Network, title: "Network & Connectivity", body: "Bandwidth utilization, latency, packet loss, and device availability are monitored across switches, routers, wireless access points, and supporting network infrastructure." },
  { Icon: AppWindow, title: "Applications", body: "Critical business applications, including Microsoft 365, line-of-business applications, and cloud platforms, are monitored for availability and response time." },
  { Icon: RefreshCw, title: "Patch & Update Status", body: "Operating system patches, third-party software updates, and firmware are tracked across managed systems so that identified gaps can be addressed through established maintenance processes." },
  { Icon: DatabaseBackup, title: "Backup Verification", body: "Backup jobs are monitored for completion and integrity, with failed or missed jobs identified for investigation and remediation." },
];

const Hero = () => (
  <section className="relative text-white overflow-hidden pt-[var(--nav-h)] hero-grain" data-testid="rmm-hero">
    <div className="absolute inset-0" style={{ background: "#00388e" }} />
    <div className="container-x relative z-10 pt-20 lg:pt-[100px] pb-20 lg:pb-[100px] grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-7 max-w-[700px]">
        <p className="cyber-eyebrow text-white/85 inline-flex items-center gap-4 animate-fade-up">Remote Monitoring &amp; Management <span className="inline-block w-14 h-px bg-[#f2a91c]" /></p>
        <h1 className="cyber-h1 text-white mt-7 animate-fade-up" style={{ animationDelay: "80ms" }}>Continuous Oversight of Your Technology Environment</h1>
        <p className="cyber-p text-white/95 mt-7 animate-fade-up" style={{ animationDelay: "160ms" }}>Intrinsic monitors the systems supporting your organization—including servers, endpoints, networks, applications, patching, and backups—to maintain visibility into performance, availability, and system health.</p>
        <p className="text-white/80 text-[16px] leading-[1.7] mt-5 animate-fade-up" style={{ animationDelay: "220ms" }}>Monitoring is supported by defined processes for identifying conditions requiring attention, determining the appropriate response, and managing technical intervention through resolution.</p>
        <div className="mt-9 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <a href="#contact" className="btn-amber cyber-cta" data-testid="rmm-hero-cta"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <TelemetryPanel className="w-full h-auto rounded-[18px] shadow-[0_40px_80px_-40px_rgba(0,20,60,0.8)]" />
      </div>
    </div>
  </section>
);

const Ownership = () => (
  <section className="relative bg-royal text-white py-12 lg:py-16 overflow-hidden hero-grain" data-testid="rmm-ownership">
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-5">Operational Ownership</p>
        <h2 className="font-serif font-semibold text-[32px] sm:text-[42px] leading-[1.14] text-white">Monitoring Managed as an IT Function</h2>
        <p className="font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-amber/90 mt-8">Continuous Visibility · Clear Responsibility</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7">
        <div className="space-y-5 text-[16px] leading-[1.72] text-white/85">
          <p>An RMM platform can identify thousands of events. Effective management requires determining which events matter, what action is required, and who is responsible for addressing them.</p>
          <p>Intrinsic operates RMM as a managed service. Alerts requiring attention are reviewed, assigned, tracked, and resolved through established service-management processes. Our engineers assume responsibility for technical intervention and maintain documentation of the work performed.</p>
          <p>Monitoring is integrated with Intrinsic's help desk, ticketing, and security operations. This allows system events to carry their technical context into the appropriate workflow and enables events with security implications to be escalated directly for security review and response.</p>
          <p>Over time, monitoring activity also provides visibility into recurring issues, system health, patching, backup performance, and other conditions that can inform maintenance and broader technology priorities.</p>
        </div>
      </Reveal>
    </div>
  </section>
);

const ResponseProcess = () => (
  <section className="rp-section py-12 lg:py-16 overflow-hidden" data-testid="rmm-response-section">
    <div className="container-x">
      <Reveal>
        <p className="rp-eyebrow" data-testid="rmm-response-eyebrow">A Defined Response Process <span className="rp-eyebrow-rule" /></p>
        <h2 className="rp-h2 mt-4" data-testid="rmm-response-title">From Detection Through Resolution</h2>
        <p className="rp-intro mt-5">The effectiveness of monitoring depends on the process that follows identification. Intrinsic combines automated monitoring with engineering oversight and defined escalation procedures so that conditions requiring attention move through a consistent operational process.</p>
      </Reveal>
      <Reveal className="mt-6 lg:mt-8"><ResponseTimeline /></Reveal>
    </div>
  </section>
);

const Statement = () => (
  <section className="rp-band relative overflow-hidden" data-testid="rmm-statement">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1600 260" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      {[520, 600, 690].map((r, i) => <circle key={r} cx="1620" cy="360" r={r} fill="none" stroke="#ffffff" strokeOpacity={0.12 - i * 0.03} strokeWidth="1.4" />)}
      <circle cx="1620" cy="360" r="600" fill="none" stroke="#f0a94e" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="60 3200" className="rp-comet" />
    </svg>
    <div className="container-x relative z-10 py-12 lg:py-16 flex items-start gap-8 lg:gap-14">
      <Reveal dir="left" className="hidden sm:block shrink-0 pt-6"><span className="rp-band-rule" /></Reveal>
      <Reveal delay={120}>
        <p className="rp-band-text">Proactive oversight. Fewer disruptions.<br className="hidden md:block" /> A more reliable environment.</p>
      </Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="bg-ice py-12 lg:py-16 lg:py-32" data-testid="rmm-cta">
    <div className="container-x"><Reveal>
      <div className="relative bg-white border border-powder p-8 sm:p-12 lg:p-16 grid lg:grid-cols-12 gap-8 items-center overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-[9px] bg-royal" />
        <div className="lg:col-span-8">
          <p className="eyebrow text-[#f2a91c] mb-4">Continuous Visibility. Clear Responsibility.</p>
          <h2 className="font-serif text-royal font-semibold text-[30px] sm:text-[38px] leading-[1.14]">Understand the Condition of Your Managed Systems</h2>
          <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-5 max-w-[62ch]">Remote Monitoring &amp; Management provides the operational visibility required to understand the condition of managed systems and the processes required to act when attention is needed.</p>
          <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-3 max-w-[62ch]">Intrinsic combines monitoring technology, engineering oversight, remediation, and documentation within one managed process.</p>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end"><a href="#contact" className="btn-amber" data-testid="rmm-cta-btn"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a></div>
      </div>
    </Reveal></div>
  </section>
);

export default function RemoteMonitoring() {
  return (
    <div className="bg-white page-in" data-testid="rmm-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <SplitText eyebrow="Proactive System Management" title="Identifying Issues Before They Affect Operations" testId="rmm-proactive"
          paragraphs={["Technology environments continuously generate information about performance, capacity, availability, configuration, and system health. Without structured monitoring, conditions requiring attention may remain unidentified until they affect users or operations.", "Intrinsic continuously monitors managed systems against established thresholds and operating conditions. Performance degradation, failed services, hardware warnings, connectivity issues, missed updates, and backup failures can be identified as they occur and directed into the appropriate management process.", "This provides ongoing operational visibility across the environment and enables technical issues to be addressed based on their significance and required response."]} />
        <CardGrid eyebrow="What We Monitor" title="Monitoring Across Critical Systems" cards={MONITOR} testId="rmm-monitor" />
        <ResponseProcess />
        <Statement />
        <Ownership />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
