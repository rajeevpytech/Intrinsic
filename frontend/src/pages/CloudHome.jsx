import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { Eyebrow, H2, Paras } from "../components/industry/IndustrySections";


const CAPS = [
  { title: "Cloud Architecture & Migration", body: "Design and migrate workloads across Azure, Microsoft 365, and hybrid environments with consideration for application dependencies, connectivity, security, performance, and business continuity." },
  { title: "Managed Cloud Operations", body: "Ongoing monitoring, maintenance, configuration, performance oversight, and lifecycle management across the cloud environment." },
  { title: "Cloud Security & Governance", body: "Identity, access controls, security configurations, governance policies, and monitoring integrated into the cloud environment and aligned with broader security requirements." },
  { title: "Backup & Disaster Recovery", body: "Backup architecture, recovery objectives, documented procedures, and testing designed to protect critical cloud and hybrid workloads and support recovery when systems or services are disrupted." },
  { title: "Cloud Optimization", body: "Ongoing review of resource utilization, performance, architecture, and consumption to improve efficiency and ensure cloud resources remain aligned with operational requirements." },
  { title: "Microsoft 365 & Collaboration", body: "Deployment, management, security, and governance across Microsoft 365 to support communication, collaboration, identity, and information management.", link: { label: "Explore Microsoft 365", to: "/services/microsoft-365" } },
];

const ENV = [
  { title: "Azure", body: "Compute, storage, networking, identity, and application infrastructure.", bg: "#0b4aa2", fg: "text-white", tone: "dark" },
  { title: "Microsoft 365", body: "Productivity, collaboration, identity, information, and security capabilities.", bg: "#e7e3d6", fg: "text-royal", tone: "light" },
  { title: "Hybrid Infrastructure", body: "On-premises systems, cloud workloads, connectivity, and shared services operating as one environment.", bg: "#33564a", fg: "text-white", tone: "dark" },
];

const REQS = [
  { label: "Application criticality", color: "#0b4aa2" },
  { label: "Performance", color: "#4f7a6c" },
  { label: "Connectivity", color: "#c8d2de" },
  { label: "Recovery objectives", color: "#faaf6a" },
  { label: "Regulatory requirements", color: "#a9c3dd" },
  { label: "Access controls", color: "#4f7a6c" },
  { label: "Anticipated growth", color: "#0b4aa2" },
];

const MGMT = [
  ["Architecture", "Defined, documented, and reviewed as requirements change."],
  ["Security", "Access, configurations, and security controls reviewed and maintained."],
  ["Performance", "Capacity and performance monitored against operational requirements."],
  ["Consumption", "Resource utilization and expenditure evaluated on an ongoing basis."],
  ["Resilience", "Backup and recovery capabilities maintained and tested against defined objectives."],
  ["Change", "Infrastructure and configuration changes controlled and documented."],
];

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)]" style={{ background: "#eaf3fd" }} data-testid="cloud-hero">
    <img src="/images/cloud-hero-transparent.webp" alt="Cloud infrastructure across Azure, Microsoft 365, and hybrid environments" className="absolute inset-0 w-full h-full object-contain hero-wipe" style={{ objectPosition: "right center", transform: "scale(0.75)", transformOrigin: "right center" }} data-testid="cloud-hero-image" />
    <svg viewBox="0 0 1922 818" preserveAspectRatio="xMaxYMid meet" className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: "scale(0.75)", transformOrigin: "right center" }} aria-hidden="true" data-testid="cloud-hero-image-overlay">
      {[[898, 312], [1327, 138], [1327, 706], [1765, 310]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="13" fill="none" stroke="#f2a41c" strokeWidth="2.5" className="im-pulse" style={{ animationDelay: `${i * 0.6}s` }} />)}
      {[
        { d: "M1327 138 L1327 706", dur: 5, r: 9 },
        { d: "M1327 706 L1327 138", dur: 5, delay: 2.5, r: 6 },
        { d: "M898 312 L1765 310", dur: 6, delay: 1, r: 9 },
        { d: "M1765 310 L898 312", dur: 6, delay: 4, r: 6 },
        { d: "M898 312 C 930 200 1130 138 1327 138 C 1560 138 1765 190 1765 310 C 1765 490 1560 706 1327 706 C 1110 706 898 480 898 312", dur: 11, r: 9 },
        { d: "M898 312 C 1110 480 1327 706 1327 706 C 1560 706 1765 490 1765 310 C 1765 190 1560 138 1327 138 C 1130 138 930 200 898 312", dur: 11, delay: 5.5, r: 6 },
      ].map(({ d, dur, delay = 0, r = 7 }, i) => (
        <circle key={`p${i}`} r={r} fill="#f2a41c" opacity="0" className="im-packet"><animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} /><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.94;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" /></circle>
      ))}
    </svg>
    <div className="absolute inset-0 lg:hidden" style={{ background: "inherit", maskImage: "linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.2) 100%)" }} data-testid="cloud-hero-mobile-fade" />
    <div className="absolute inset-0 hidden lg:block xl:hidden" style={{ background: "inherit", maskImage: "linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.88) 45%, rgba(0,0,0,0) 68%)" }} data-testid="cloud-hero-tablet-fade" />
    <div className="absolute inset-0 hidden xl:block" style={{ background: "inherit", maskImage: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0) 48%)" }} data-testid="cloud-hero-desktop-fade" />
    <div className="container-x relative z-10 py-12 lg:py-16 min-h-[560px] lg:min-h-[640px] flex items-center">
      <div className="max-w-[540px]">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-6 animate-fade-up">Cloud</p>
        <h1 className="font-serif font-semibold text-royal text-[38px] sm:text-[44px] leading-[1.06] animate-fade-up" style={{ animationDelay: "80ms" }}>Cloud Infrastructure Built Around Your Business.</h1>
        <p className="text-[#3b4453] text-[16px] leading-[1.72] mt-6 max-w-[46ch] animate-fade-up" style={{ animationDelay: "160ms" }}>Intrinsic designs and manages cloud environments across Azure, Microsoft 365, and hybrid infrastructure, bringing together architecture, security, performance, resilience, and ongoing management around the requirements of your organization.</p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <a href="#contact" className="btn-amber" data-testid="cloud-hero-cta"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
        </div>
      </div>
    </div>
  </section>
);

const Capabilities = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="cloud-capabilities">
    <div className="container-x">
      <Reveal className="max-w-[860px] mb-14">
        <Eyebrow color="text-deepamber">Cloud Capabilities</Eyebrow>
        <H2>From Architecture Through Ongoing Management</H2>
        <p className="text-[#4a5259] text-[16px] leading-[1.72] mt-6">Intrinsic supports the cloud lifecycle from initial planning and migration through security, optimization, resilience, and day-to-day operations.</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-powder/60">
        {CAPS.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 80} className={`border-b border-powder/60 ${i % 2 !== 0 ? "sm:border-l lg:border-l-0" : ""} ${i % 3 !== 0 ? "lg:border-l" : ""}`}>
            <div className="p-7 lg:p-8 h-full" data-testid={`cloud-cap-${i}`}>
              <span className="cld-tick" />
              <h3 className="font-serif text-royal text-[20px] font-semibold leading-tight">{c.title}</h3>
              <p className="text-slatesage text-[14px] leading-[1.62] mt-3">{c.body}</p>
              {c.link && <Link to={c.link.to} className="inline-flex items-center gap-2 mt-5 text-[13px] font-bold text-royal hover:gap-3 transition-all">{c.link.label} <ArrowRight size={14} /></Link>}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Connected = () => (
  <section className="ab-lightblue py-12 lg:py-16" data-testid="cloud-connected">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-deepamber">Cloud Across the Technology Environment</Eyebrow>
        <H2>Connected Infrastructure. Managed as One Environment.</H2>
        <Paras className="text-[#3b4453] mt-6" items={[
          "Cloud does not operate separately from the technology around it. Azure workloads may depend on on-premises infrastructure. Microsoft 365 relies on identity and access controls. Remote users depend on secure connectivity. Applications may span platforms and locations.",
          "Intrinsic manages these relationships as part of the broader technology environment—connecting cloud infrastructure with the systems, security, identity, and connectivity it depends on.",
        ]} />
      </Reveal>
      <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
        {ENV.map(({ title, body, bg, fg, tone }, i) => (
          <Reveal key={title} delay={i * 90}>
            <div className="cld-float h-full p-6 min-h-[220px] lg:min-h-0 xl:min-h-[220px] flex flex-col" style={{ backgroundColor: bg }} data-type-tone={tone} data-testid={`cloud-env-${i}`}>
              <span className="cld-tick" />
              <h3 className={`font-serif text-[18px] font-semibold ${fg}`}>{title}</h3>
              <p className="text-[13.5px] leading-[1.6] mt-3">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Requirements = () => (
  <section className="ab-cream py-12 lg:py-16" data-testid="cloud-requirements">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-7">
        <Eyebrow color="text-deepamber">Cloud Requirements</Eyebrow>
        <H2>Architecture Defined by Business and Operational Requirements.</H2>
        <Paras className="text-[#3b4453] mt-6" items={[
          "Cloud architecture should reflect the systems the organization depends on, the availability those systems require, the information they manage, and the security and governance obligations surrounding them.",
          "Intrinsic considers application criticality, performance, connectivity, recovery objectives, regulatory requirements, access controls, and anticipated growth when designing or reviewing a cloud environment.",
          "The result is an architecture aligned with how the organization operates—not a standard cloud configuration applied across every environment.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-5">
        <ul className="relative pl-1">
          <span className="absolute left-[9px] top-3 bottom-3 w-px bg-royal/20" />
          {REQS.map(({ label, color }, i) => (
            <li key={label} className="relative flex items-center gap-5 py-3" data-testid={`cloud-req-${i}`}>
              <span className="relative z-10 w-[18px] h-[18px] rounded-full ring-4 ring-[#f7f3ea]" style={{ backgroundColor: color }} />
              <span className="font-serif text-royal text-[18px]">{label}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);

export const MgmtTable = ({ rows, testid }) => (
  <div className="divide-y divide-white/15 border-t border-white/15" data-testid={testid}>
    {rows.map(([label, desc]) => (
      <div key={label} className="grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-1 sm:gap-8 py-5">
        <p className="font-mono text-[11.5px] font-bold tracking-[0.14em] uppercase text-white">{label}</p>
        <p className="text-white/70 text-[14px] leading-[1.6]">{desc}</p>
      </div>
    ))}
  </div>
);

const Ongoing = () => (
  <section className="ab-green text-white py-12 lg:py-16" data-testid="cloud-ongoing">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <Eyebrow color="text-amber">Cloud Is an Operating Environment</Eyebrow>
        <H2 className="text-white">It Requires Ongoing Management.</H2>
        <Paras className="text-white/80 mt-6" items={[
          "Cloud infrastructure continues to change after deployment. Workloads evolve, resources scale, applications are introduced, permissions change, and security, performance, and consumption requirements shift.",
          "Intrinsic provides ongoing management to keep the environment documented, monitored, secure, resilient, and aligned with current business requirements.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-7 lg:pt-2">
        <MgmtTable rows={MGMT} testid="cloud-mgmt" />
      </Reveal>
    </div>
  </section>
);

export const PlanNext = ({ eyebrow, heading, body, cta, testid }) => (
  <section className="bg-white py-12 lg:py-16" data-testid={testid}>
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-[#f2a91c]">{eyebrow}</Eyebrow>
        <H2>{heading}</H2>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6 lg:border-l lg:border-royal/15 lg:pl-16">
        <p className="text-[#3b4453] text-[16px] leading-[1.72]">{body}</p>
        <div className="mt-8">
          <a href="#contact" className="btn-amber" data-testid={`${testid}-cta`}><span>{cta}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
        </div>
      </Reveal>
    </div>
  </section>
);

export default function CloudHome() {
  return (
    <div className="bg-white page-in" data-testid="cloud-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
        <Connected />
        <Requirements />
        <Ongoing />
        <PlanNext
          eyebrow="Plan What Comes Next"
          heading="Know Where Your Cloud Environment Stands."
          body="Whether you're evaluating a migration, modernizing an existing environment, or looking for ongoing cloud management, Intrinsic can assess your current infrastructure and identify priorities across architecture, security, performance, resilience, and cost."
          cta="Talk to Our Team"
          testid="cloud-plan"
        />
      </main>
      <Footer />
    </div>
  );
}
