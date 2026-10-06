import React from "react";
import { ArrowRight, Clock, FileSearch, Crosshair, ShieldCheck, Zap, ClipboardList, ScanEye, Lock, DatabaseZap, SlidersHorizontal } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { Eyebrow, H2, Paras } from "../components/industry/IndustrySections";
import { ThreatHeroMotion } from "../components/threat/ThreatHeroMotion";
import { SocDashboardLive } from "../components/threat/SocDashboardLive";
import { ConnectedMotion } from "../components/threat/ConnectedMotion";

const OPS = [
  { Icon: Clock, title: "24/7/365 Monitoring", body: "Continuous monitoring across endpoints, networks, cloud platforms, and identity systems provides visibility into security activity as it occurs." },
  { Icon: FileSearch, title: "Security Analysis & Investigation", body: "Security analysts evaluate identified activity to establish context, determine scope, and assess the appropriate course of action." },
  { Icon: Crosshair, title: "Threat Investigation & Hunting", body: "Analysts conduct targeted investigation and threat hunting where additional analysis is required to understand potential compromise or related activity." },
  { Icon: ShieldCheck, title: "Containment & Response", body: "Validated threats are addressed through defined containment and response actions rather than notification alone." },
  { Icon: Zap, title: "Response Automation", body: "Established response playbooks can initiate automated actions where appropriate, supporting consistent intervention and reducing response time." },
  { Icon: ClipboardList, title: "Incident Management", body: "Security incidents are managed from initial detection through investigation, containment, remediation, and closure." },
];

const EDR = [
  { Icon: ScanEye, title: "Behavioral Threat Detection", body: "Detection of file-based and fileless malware, including advanced persistent threats." },
  { Icon: Lock, title: "Ransomware Protection", body: "Automated capabilities designed to identify and prevent ransomware encryption activity." },
  { Icon: DatabaseZap, title: "Data Exfiltration Detection", body: "Identification of activity associated with unauthorized movement of information." },
  { Icon: SlidersHorizontal, title: "Alert & Exclusion Management", body: "Ongoing management and tuning of alerts and exclusions to maintain detection effectiveness." },
  { Icon: ShieldCheck, title: "Managed Microsoft Defender", body: "Managed EDR for Microsoft Defender is available for organizations seeking to extend the security capabilities of their existing Microsoft 365 investment." },
];

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)]" style={{ background: "radial-gradient(120% 120% at 80% 18%, #ffffff 0%, #eef4fb 55%, #e3edf8 100%)" }} data-testid="threat-hero">
    <div className="container-x relative z-10 pt-20 lg:pt-[100px] pb-20 lg:pb-[100px] grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6 max-w-[620px]">
        <p className="cyber-eyebrow text-[#f2a91c] inline-flex items-center gap-4 animate-fade-up">Threat Detection &amp; Response <span className="inline-block w-14 h-px bg-[#f2a91c]" /></p>
        <h1 className="cyber-h1 text-royal mt-7 animate-fade-up" style={{ animationDelay: "80ms" }}>Continuous Security Operations Across Your Environment</h1>
        <p className="cyber-p text-[#33414f] mt-7 animate-fade-up" style={{ animationDelay: "160ms" }}>Effective threat detection requires continuous visibility across the technology environment, experienced analysis of security activity, and the ability to respond when a threat is confirmed.</p>
        <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-5 animate-fade-up" style={{ animationDelay: "200ms" }}>Intrinsic combines advanced detection technology, behavioral analysis, and security expertise to monitor activity across endpoints, networks, cloud platforms, and identity systems—providing continuous investigation and coordinated response.</p>
        <div className="mt-9 animate-fade-up" style={{ animationDelay: "260ms" }}>
          <button type="button" data-contact-trigger className="btn-amber cyber-cta" data-testid="threat-hero-cta"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></button>
        </div>
      </div>
      <div className="lg:col-span-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <ThreatHeroMotion className="w-full h-auto max-h-[540px] lg:scale-[1.12] origin-center" />
      </div>
    </div>
  </section>
);

const MDR = () => (
  <section className="bg-ice py-12 lg:py-16" data-testid="threat-mdr">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <Eyebrow>Managed Detection &amp; Response</Eyebrow>
          <H2>A Managed Security Operations Function</H2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-8">
          <Paras className="text-[#4a5259]" items={["Intrinsic provides 24/7/365 managed detection and response across endpoint, network, cloud, and identity environments—providing organizations with continuous security operations without the cost and complexity of maintaining an internal SOC.", "Security analysts evaluate identified threats, establish their nature and scope, and determine the appropriate response. When a threat is validated, containment actions can be initiated directly, supported by established response playbooks and defined incident procedures.", "Responsibility extends across the incident lifecycle—from detection and investigation through containment, remediation, and documentation."]} />
        </Reveal>
      </div>
      <Reveal delay={150}>
        <SocDashboardLive className="mt-12 lg:mt-16" />
      </Reveal>
    </div>
  </section>
);

const Operations = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="threat-operations">
    <div className="container-x">
      <Reveal className="max-w-[760px]">
        <Eyebrow>Security Operations</Eyebrow>
        <H2>Detection, Investigation, and Response Across Critical Systems</H2>
        <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-6">Intrinsic brings security monitoring, human analysis, and response together within a coordinated operating model.</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-powder border border-powder mt-12">
        {OPS.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 60} className="bg-white">
            <div className="group h-full p-7 lg:p-8 relative overflow-hidden hover:bg-ice transition-colors duration-300" data-testid={`threat-op-${i}`}>
              <span className="absolute top-0 left-0 h-[3px] w-0 bg-amber transition-all duration-500 group-hover:w-full" />
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-royal/8 text-royal group-hover:bg-royal group-hover:text-white transition-colors duration-300"><Icon size={20} /></span>
              <h3 className="font-serif text-royal font-semibold text-[19px] leading-tight mt-5">{title}</h3>
              <p className="text-slatesage text-[14px] leading-[1.6] mt-2.5">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Connected = () => (
  <section className="relative text-white py-12 lg:py-16 overflow-hidden hero-grain" data-testid="threat-connected">
    <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, #2f4a49 0%, #3a5857 55%, #446665 100%)" }} />
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-amber">Connected Detection &amp; Response</Eyebrow>
        <H2 className="text-white">Security Events Do Not Occur in Isolation</H2>
        <Paras className="text-white/85 mt-6" items={["Activity identified on an endpoint may be connected to an identity, network connection, cloud service, or other system within the environment.", "Intrinsic evaluates security activity across endpoint, network, cloud, and identity systems, allowing related events to be investigated together and response actions to be coordinated across affected systems.", "This broader visibility provides analysts with greater context during an investigation and supports a more coordinated response when multiple parts of the environment are involved."]} />
      </Reveal>
      <Reveal delay={140} dir="right" className="lg:col-span-6">
        <ConnectedMotion className="w-full h-auto max-w-[440px] mx-auto" />
        <p className="text-center font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-white/60 mt-5">Endpoint · Network · Cloud · Identity</p>
      </Reveal>
    </div>
  </section>
);

const Endpoint = () => (
  <section className="bg-ice py-12 lg:py-16" data-testid="threat-endpoint">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <Reveal className="lg:col-span-5">
        <Eyebrow>Endpoint Detection &amp; Response</Eyebrow>
        <H2>Advanced Detection Across the Endpoint Environment</H2>
        <Paras className="text-[#4a5259] mt-6" items={["Modern endpoint threats extend beyond known malware. Fileless techniques, ransomware, data exfiltration, and the misuse of legitimate system tools require continuous behavioral visibility across endpoint activity.", "EDR continuously monitors workstations, servers, laptops, and remote devices to establish normal patterns of activity and identify deviations requiring investigation.", "Intrinsic deploys, configures, tunes, and manages EDR, supported by 24/7 SOC investigation of identified security activity."]} />
      </Reveal>
      <div className="lg:col-span-7 divide-y divide-powder border-t border-powder">
        {EDR.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 70}>
            <div className="group flex gap-5 py-6 items-start hover:bg-white transition-colors px-2 -mx-2" data-testid={`threat-edr-${i}`}>
              <span className="inline-flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-white border border-powder text-royal group-hover:bg-royal group-hover:text-white transition-colors"><Icon size={19} /></span>
              <div><h3 className="font-serif text-royal font-semibold text-[19px]">{title}</h3><p className="text-slatesage text-[14.5px] leading-[1.6] mt-1.5">{body}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative text-white py-12 lg:py-16 overflow-hidden hero-grain" data-testid="threat-cta">
    <div className="absolute inset-0" style={{ background: "#00388e" }} />
    <div className="hidden sm:block absolute -bottom-24 right-0 w-[420px] h-[420px] rounded-full bg-amber/15 blur-3xl float-a" />
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-8 items-center">
      <Reveal className="lg:col-span-7">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-4">Ready to Strengthen Your Security?</p>
        <h2 className="font-serif text-white font-semibold text-[34px] sm:text-[48px] leading-[1.08]">Let's Talk About Your Security</h2>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-5 lg:justify-self-end">
        <button type="button" data-assessment className="btn-amber cyber-cta" data-testid="threat-cta-btn"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></button>
      </Reveal>
    </div>
  </section>
);

export default function ThreatDetection() {
  return (
    <div className="bg-white page-in" data-testid="threat-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <MDR />
        <Operations />
        <Connected />
        <Endpoint />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
