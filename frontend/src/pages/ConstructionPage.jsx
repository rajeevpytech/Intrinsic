import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { H2 } from "../components/industry/IndustrySections";

const BLUE = "#1e3f9e", INK = "#2f4a8f", AMBER = "#f2a91c";
const light = (extra = {}) => ({ "--type-eyebrow-ink": BLUE, "--type-hero-ink": BLUE, "--type-section-ink": BLUE, "--type-body-ink": INK, "--type-small-ink": INK, "--type-subheading-ink": BLUE, ...extra });
const dark = (extra = {}) => ({ "--type-eyebrow-ink": "#ffffff", "--type-section-ink": "#ffffff", "--type-body-ink": "#e6efe9", "--type-small-ink": "#e6efe9", "--type-subheading-ink": "#ffffff", ...extra });
const SUB = { "--type-subheading-mobile": 11, "--type-subheading-tablet": 11.5, "--type-subheading-desktop": 12, "--type-subheading-letterSpacing": 0.04, "--type-subheading-lineHeight": 1.45 };

const Kicker = ({ children, testId }) => <p className="eyebrow eyebrow-line mb-4" data-testid={testId}>{children}</p>;
const FlatBtn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="btn-amber">
    <span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);
const Copy = ({ children, className = "" }) => <p className={`text-[15px] leading-[1.6] ${className}`}>{children}</p>;

const LOCATIONS = [
  ["Site Connectivity", "Reliable internet networks, wireless, and cloud connectivity."],
  ["Changing Users & Access", "Role-based access as responsibilities change."],
  ["Field Devices & Support", "Management and support for laptops, tablets and mobile devices."],
  ["Project & Business Information", "Access, backup and support for across collaboration and construction systems."],
];
const SEC = ["Verify Access", "Secure Devices", "Protect Information", "Monitor Activity"];
const STAGES = [
  ["Plan", "Identify connectivity, equipment, application, security, access and support requirements."],
  ["Mobilize", "Coordinate internet, networks, devices, accounts, permissions and licensing."],
  ["Operate", "Monitor systems, support users and manage security as requirements change."],
  ["Close Out", "Review equipment, accounts, licenses, vendor services and continuing access."],
];
const AREAS = [["Infrastructure &", "Connectivity"], ["Security &", "Identity"], ["Devices &", "Support"], ["Cloud &", "Collaboration"], ["Backup &", "Recovery"], ["Technology", "Planning"]];

const Hero = () => (
  <section className="pt-[var(--nav-h)]" style={{ background: "#f8f5e9", ...light({ "--type-hero-desktop": 40, "--type-hero-tablet": 36 }) }} data-testid="construction-hero">
    <div className="container-x pt-12 lg:pt-16 pb-10 lg:pb-12 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
      <div className="lg:col-span-5">
        <Kicker testId="construction-hero-eyebrow">Construction</Kicker>
        <h1 className="font-serif leading-[1.12] animate-fade-up" data-testid="construction-hero-title">Technology Across<br className="hidden lg:inline" /> Every Project Environment</h1>
        <Copy className="mt-5 animate-fade-up">Construction organizations work across offices, active job sites, temporary locations, and distributed field teams. Locations change, project teams evolve, and access requirements shift throughout the work.</Copy>
        <Copy className="mt-4 animate-fade-up">Intrinsic manages the technology environment connecting these locations—supporting reliable operations, secure access, protected information, and consistent support across the organization.</Copy>
        <div className="mt-7 animate-fade-up"><FlatBtn testId="construction-hero-cta">Talk to Our Team</FlatBtn></div>
      </div>
      <div className="lg:col-span-7 flex justify-end animate-fade-in">
        <img src="/images/construction-hero-ref.png" alt="Office, job sites, field teams and project information connected — a stronger tomorrow through technology" className="w-full max-w-[578px] h-auto opacity-80 live-float hero-wipe" width="1400" height="1030" data-testid="construction-hero-image" />
      </div>
    </div>
  </section>
);

const Extends = () => (
  <section className="py-12 lg:py-16" style={{ background: "#fdfdfb", ...light({ "--type-section-desktop": 36 }) }} data-testid="construction-extends">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <Reveal className="lg:col-span-5">
        <Kicker testId="construction-extends-eyebrow">The Construction Technology Environment</Kicker>
        <H2>Every Project Extends<br className="hidden lg:inline" /> the Technology Environment</H2>
        <Copy className="mt-5">Each project introduces connectivity, devices, users, vendors, applications, and information flows.</Copy>
        <Copy className="mt-4">Project managers need access to schedules and documentation. Field teams rely on mobile devices and reliable connectivity. Office teams use financial, estimating, collaboration and project-management systems. Subcontractors may need temporary access to specific systems and information.</Copy>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7 flex justify-end">
        <img src="/images/construction-extends-ref.png" alt="Office, job site and field team connected through the cloud" className="w-full max-w-[640px] h-auto" width="1400" height="773" data-testid="construction-extends-image" />
      </Reveal>
    </div>
  </section>
);

const Locations = () => (
  <section className="py-12 lg:py-16" style={{ background: "#e7e5da", ...light({ "--type-section-desktop": 36, ...SUB }) }} data-testid="construction-locations">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
      <Reveal className="lg:col-span-5">
        <Kicker testId="construction-locations-eyebrow">Supporting Work Across Every Location</Kicker>
        <H2>Connected Technology for<br className="hidden lg:inline" /> the Office and the Field</H2>
        <Copy className="mt-5">Intrinsic provides managed IT and ongoing support to keep your technology secure, reliable, and ready for what&apos;s next.</Copy>
        <Copy className="mt-4">We help you reduce disruption, keep projects moving, and get the most from the tools your teams use every day. From day-to-day support to long-term planning, we deliver practical solutions that help your people do more for your projects.</Copy>
      </Reveal>
      <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#1e3f9e]/60 lg:pl-6" data-testid="construction-location-list">
        {LOCATIONS.map(([t, s], i) => (
          <Reveal key={t} delay={i * 70} className="px-3 py-6 flex flex-col items-center text-center" data-testid={`construction-location-${i}`}>
            <h3 className="font-sans font-bold uppercase" style={{ color: BLUE }}>{t}</h3>
            <p className="text-[13px] leading-[1.55] mt-6" style={{ color: INK }}>{s}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Security = () => (
  <section className="text-white py-12 lg:py-16" style={{ background: "#2c655b", ...dark({ "--type-section-desktop": 36, ...SUB }) }} data-testid="construction-security">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <Reveal className="lg:col-span-6">
        <Kicker testId="construction-security-eyebrow">Security & Information Protection</Kicker>
        <H2 className="text-white">Protecting Access, Payments,<br className="hidden lg:inline" /> and Project Information</H2>
        <Copy className="mt-5 text-[#e6efe9]">Construction organizations handle sensitive information, financial transactions, and access for many internal teams and external partners. Our security controls help address compromised accounts, payment fraud, unauthorized access, and information moving between multiple organizations.</Copy>
        <Link to="/services/cybersecurity" className="inline-flex items-center gap-3 font-semibold text-[15px] mt-6 hover:gap-4 transition-[gap]" style={{ color: AMBER }} data-testid="construction-security-link">Explore Security &amp; Compliance <ArrowRight size={15} /></Link>
      </Reveal>
      <div className="lg:col-span-6 relative lg:pl-4" data-testid="construction-security-steps">
        <Reveal className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 relative">
          <span className="hidden sm:block absolute left-[12.5%] right-[12.5%] top-[7px] h-px bg-white draw-h" />
          <span className="hidden sm:block absolute left-[12.5%] right-[12.5%] top-[7px] h-px pointer-events-none"><span className="line-runner" /></span>
          {SEC.map((t, i) => (
            <Reveal key={t} delay={i * 80} className="flex flex-col items-center text-center relative" data-testid={`construction-sec-${i}`}>
              <span className="w-[15px] h-[15px] rounded-full" style={{ background: i === 1 ? AMBER : "#ffffff" }} />
              <h3 className="font-sans font-bold uppercase mt-5 text-white">{t.split(" ")[0]}<br />{t.split(" ").slice(1).join(" ")}</h3>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </div>
  </section>
);

const Lifecycle = () => (
  <section className="py-12 lg:py-16" style={{ background: "#f8f7f3", ...light({ "--type-section-desktop": 36, ...SUB }) }} data-testid="construction-lifecycle">
    <div className="container-x">
      <Reveal className="max-w-[900px]">
        <Kicker testId="construction-lifecycle-eyebrow">Project Lifecycle</Kicker>
        <H2>From Project Mobilization Through Closeout</H2>
        <Copy className="mt-4">Technology requirements change as a project progresses. A defined process helps maintain visibility and control through each stage.</Copy>
      </Reveal>
      <Reveal className="relative mt-10" data-testid="construction-stages">
        <span className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-[36px] h-px draw-h" style={{ background: BLUE }} />
        <span className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-[36px] h-px pointer-events-none"><span className="line-runner" /></span>
        {[1, 2, 3].map(i => <span key={i} className="hidden lg:block absolute top-[31px] w-[11px] h-[11px] rounded-full -translate-x-1/2" style={{ left: `${i * 25}%`, background: AMBER }} />)}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map(([t, s], i) => (
            <Reveal key={t} delay={i * 90} className="flex flex-col items-center text-center" data-testid={`construction-stage-${i}`}>
              <span className="relative w-[72px] h-[72px] rounded-full border-[2px] flex items-center justify-center font-sans font-bold text-[20px]" style={{ borderColor: BLUE, color: BLUE, background: "#f8f7f3" }}>0{i + 1}</span>
              <h3 className="font-sans font-bold uppercase mt-6" style={{ color: BLUE }}>{t}</h3>
              <p className="text-[13.5px] leading-[1.55] mt-3 max-w-[250px]" style={{ color: INK }}>{s}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

const Accountable = () => (
  <section className="py-12 lg:py-16" style={{ background: "#e9e4da", ...light({ "--type-section-desktop": 36 }) }} data-testid="construction-accountable">
    <div className="container-x">
      <Reveal className="max-w-[980px]">
        <Kicker testId="construction-accountable-eyebrow">One Accountable Technology Relationship</Kicker>
        <H2>Coordinating Technology Across Every Project</H2>
        <Copy className="mt-4">Intrinsic provides one accountable relationship across the technology areas that support construction organizations.</Copy>
      </Reveal>
      <Reveal className="relative mt-10" data-testid="construction-areas">
        <span className="hidden lg:block absolute left-0 right-0 top-[5px] h-px draw-h" style={{ background: BLUE }} />
        <span className="hidden lg:block absolute left-0 right-0 top-[5px] h-px pointer-events-none"><span className="line-runner" /></span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 relative">
          {AREAS.map(([a, b], i) => (
            <Reveal key={a + b} delay={i * 60} className="flex flex-col items-center text-center relative" data-testid={`construction-area-${i}`}>
              {i > 0 && <span className="hidden lg:block absolute -left-[16px] top-0 w-[11px] h-[11px] rounded-full" style={{ background: AMBER }} />}
              <p className="font-sans font-medium text-[14.5px] leading-[1.5] mt-8" style={{ color: BLUE }} data-type-role="body">{a}<br />{b}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

const Experience = () => (
  <section className="py-12 lg:py-16" style={{ background: "#e3ebe4", ...light({ "--type-section-desktop": 36 }) }} data-testid="construction-experience">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
      <Reveal className="lg:col-span-5">
        <Kicker testId="construction-experience-eyebrow">Construction Experience</Kicker>
        <H2>Your Organization Defines<br className="hidden lg:inline" /> the Requirements</H2>
        <Copy className="mt-5">Construction experience provides context, but the solution is built around each organization&apos;s systems, project structure, people, risks and priorities. Intrinsic takes the time to understand your environment, then delivers right-sized technology solutions that support your projects and set you up for long-term success.</Copy>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7 flex justify-end">
        <img src="/images/construction-experience-ref.png" alt="Office plans, projects build, field executes" className="w-full max-w-[680px] h-auto" width="1400" height="615" data-testid="construction-layers-image" />
      </Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="text-white py-12 lg:py-16" style={{ background: "#2c6559", ...dark({ "--type-section-desktop": 31, "--type-section-tablet": 28 }) }} data-testid="construction-cta">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <Reveal className="lg:col-span-7">
        <Kicker testId="construction-cta-eyebrow">Technology Aligned With Your Projects</Kicker>
        <H2 className="text-white">Strengthen the Technology Behind Every Project</H2>
        <Copy className="mt-4 text-[#e6efe9] max-w-[640px]">Let&apos;s discuss how technology supports your offices, job sites, field teams, and project operators—and where greater consistency, security, visibility, or support may be needed.</Copy>
        <div className="mt-7"><FlatBtn testId="construction-cta-btn">Schedule a Construction Technology Review</FlatBtn></div>
      </Reveal>
      <Reveal delay={120} className="hidden lg:flex lg:col-span-5 flex-col items-center">
        <img src="/images/construction-cta-ref.png" alt="" className="w-full max-w-[444px] h-auto" width="1400" height="626" data-testid="construction-cta-image" />
        <p className="font-sans text-[11.5px] font-bold tracking-[0.08em] uppercase text-white mt-2 whitespace-nowrap" data-testid="construction-cta-caption">Office · Field · Projects · One Connected Environment.</p>
      </Reveal>
    </div>
  </section>
);

export default function ConstructionPage() {
  return (
    <div className="bg-white page-in" data-testid="construction-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Extends /><Locations /><Security /><Lifecycle /><Accountable /><Experience /><CTA /></main>
      <Footer />
    </div>
  );
}
