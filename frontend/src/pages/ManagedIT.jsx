import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { ImageMotion } from "../components/cyber/ImageMotion";
import { H2 } from "../components/industry/IndustrySections";

const BLUE = "#1e3f9e", INK = "#2f4a8f";
const light = (extra = {}) => ({ "--type-eyebrow-ink": BLUE, "--type-hero-ink": BLUE, "--type-section-ink": BLUE, "--type-body-ink": INK, "--type-small-ink": INK, "--type-subheading-ink": BLUE, "--type-section-desktop": 34, ...extra });
const dark = (extra = {}) => ({ "--type-eyebrow-ink": "#ffffff", "--type-section-ink": "#ffffff", "--type-body-ink": "#e3efea", "--type-small-ink": "#e3efea", "--type-section-desktop": 34, ...extra });

const SCOPE = [
  { icon: "helpdesk-user-support", title: "Help Desk & User Support", body: "Responsive support that keeps your people productive.", to: "/contact" },
  { icon: "infrastructure", title: "Infrastructure", body: "Reliable, scalable systems that power your organization.", to: "/services/cloud-infrastructure-migration" },
  { icon: "networks", title: "Networks", body: "Secure, high-performing networks that keep you connected.", to: "/services/networking" },
  { icon: "monitoring-maintenance", title: "Monitoring & Maintenance", body: "Proactive oversight that prevents problems and maximizes uptime.", to: "/services/remote-monitoring-management" },
  { icon: "microsoft-365-cloud", title: "Microsoft 365 & Cloud", body: "Modern tools, managed and optimized for your business.", to: "/services/microsoft-365" },
  { icon: "security", title: "Security", body: "Layered protection across people, technology and data.", to: "/services/cybersecurity" },
  { icon: "backup-business-continuity", title: "Backup & Business Continuity", body: "Prepared for disruption. Focused on what comes next.", to: "/services/backup-disaster-recovery" },
];

const Kicker = ({ children, testId }) => <p className="eyebrow eyebrow-line mb-4" data-testid={testId}>{children}</p>;
const FlatBtn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="btn-amber">
    <span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);
const GoldLink = ({ children, to, href, testId }) => {
  const cls = "inline-flex items-center gap-2 font-sans font-medium text-[14px] hover:gap-3 transition-[gap]";
  const st = { color: "#d48a12" };
  return href ? <a href={href} className={cls} style={st} data-testid={testId}>{children} <ArrowRight size={14} /></a> : <Link to={to} className={cls} style={st} data-testid={testId}>{children} <ArrowRight size={14} /></Link>;
};
const Copy = ({ children, className = "" }) => <p className={`text-[15px] leading-[1.6] ${className}`}>{children}</p>;
const Art = ({ src, alt, testId, max, w, h, className = "" }) => <img src={src} alt={alt} className={`w-full h-auto ${className}`} style={{ maxWidth: max }} width={w} height={h} data-testid={testId} />;

const Hero = () => (
  <section className="pt-[var(--nav-h)]" style={{ background: "#e5f5fe", ...light({ "--type-hero-desktop": 40, "--type-hero-tablet": 36 }) }} data-testid="managed-hero">
    <div className="container-x pt-12 lg:pt-14 pb-10 lg:pb-12 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
      <div className="lg:col-span-5">
        <Kicker testId="managed-hero-eyebrow">Managed IT Services</Kicker>
        <h1 className="font-serif leading-[1.12] animate-fade-up" data-testid="managed-hero-title">Every Part of IT.<br />One Accountable Team.</h1>
        <Copy className="mt-5 animate-fade-up">A complete, coordinated approach to managed IT services for professional organizations.</Copy>
        <Copy className="mt-4 animate-fade-up">We manage the people, processes and technology that keep your organization secure, productive and ready for what's next.</Copy>
        <div className="mt-7 animate-fade-up"><FlatBtn testId="managed-hero-cta">Talk to Our Team</FlatBtn></div>
      </div>
      <div className="lg:col-span-7 flex justify-end animate-fade-in">
        <ImageMotion className="w-full" pulses={[[252, 735], [384, 330], [798, 330], [867, 428], [903, 735]]}
          paths={[
            { d: "M300 331 L470 331", dur: 3.2 },
            { d: "M890 330 L700 330", dur: 3.4, delay: 0.5 },
            { d: "M975 428 L770 428", dur: 3.6, delay: 1 },
            { d: "M150 735 L375 735", dur: 3.4, delay: 0.8 },
            { d: "M1010 735 L790 735", dur: 3.6, delay: 1.3 },
          ]}
          src="/images/mit-hero.png" alt="Users, support, infrastructure, networks, cloud, security and backup connected to your organization — one team, a stronger tomorrow" testId="managed-hero-diagram" max={680} w={1400} h={1009} />
      </div>
    </div>
  </section>
);

const Scope = () => (
  <section className="py-12 lg:py-16" style={{ background: "#ddedea", ...light() }} data-testid="managed-scope">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-14 items-end">
        <Reveal className="lg:col-span-6"><Kicker testId="managed-scope-eyebrow">The Scope We Manage</Kicker><H2>Management Across<br className="hidden lg:inline" /> the Technology Environment.</H2></Reveal>
        <Reveal delay={100} className="lg:col-span-6"><Copy>Seven essential service areas. One coordinated experience.<br className="hidden lg:inline" /> Each area is managed as part of a unified environment, so you get more than individual services — you get a partner accountable for it all.</Copy></Reveal>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 mt-10 gap-y-8 lg:gap-y-0 lg:divide-x lg:divide-[#b8cfc4]" data-testid="managed-scope-list">
        {SCOPE.map(({ icon, title, body, to }, i) => (
          <Reveal key={title} delay={i * 60} className="pt-2 px-3 lg:first:pl-0 lg:last:pr-0 flex flex-col" data-testid={`managed-scope-${i}`}>
            <span className="h-[52px] flex items-end"><img src={`/images/mit-icon-${icon}.png`} alt="" className="h-[46px] w-auto" data-testid={`managed-scope-icon-${i}`} /></span>
            <h3 className="font-sans font-bold text-[13.5px] leading-[1.3] mt-4 min-h-[36px]" style={{ color: BLUE }}>{title}</h3>
            <p className="text-[12.5px] leading-[1.55] mt-2 flex-1" style={{ color: INK }}>{body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Coordinated = () => (
  <section className="text-white py-12 lg:py-16" style={{ background: "#416b5a", ...dark() }} data-testid="managed-coordinated-section">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-5">
        <Kicker testId="managed-coordinated-eyebrow">Managed as One Environment</Kicker>
        <H2 className="text-white">Coordinated Management<br className="hidden lg:inline" /> Across IT.</H2>
        <Copy className="mt-5">People, technology and vendors working as one.<br />We bring together every part of your IT environment — internal resources, third-party vendors and critical systems — and manage them through a single, accountable operating model.</Copy>
        <div className="mt-6"><GoldLink href="#managed-operate" testId="managed-coordinated-link">A more connected approach</GoldLink></div>
      </Reveal>
      <Reveal delay={140} dir="right" className="lg:col-span-7 flex justify-end">
        <Art src="/images/mit-coordinated.png" alt="Your team, our experts, third-party vendors and technology platforms flowing into one coordinated environment" testId="managed-coordinated-flow" max={720} w={1381} h={355} />
      </Reveal>
    </div>
  </section>
);

const Operate = () => (
  <section id="managed-operate" className="py-12 lg:py-16" style={{ background: "#ddecf9", ...light() }} data-testid="managed-operate">
    <div className="container-x">
      <Reveal className="max-w-[900px]">
        <Kicker testId="managed-operate-eyebrow">How We Operate</Kicker>
        <H2>Defined Processes. Clear Ownership, Continuous Oversight.</H2>
        <Copy className="mt-5">Intrinsic follows a structured operating model from the beginning of the relationship through ongoing service delivery.</Copy>
      </Reveal>
      <Reveal delay={120} className="mt-10 flex justify-center">
        <ImageMotion src="/images/mit-operate.png" alt="01 Assess, 02 Transition, 03 Manage, 04 Review" testId="managed-steps" max={1176} className="w-full mx-auto" imgClassName="bc-wipe" w={1383} h={160} paths={[{ d: "M120 36 L1263 36", dur: 7, r: 3 }]} />
      </Reveal>
    </div>
  </section>
);

const Visibility = () => (
  <section className="py-12 lg:py-16" style={{ background: "#fefeff", ...light() }} data-testid="managed-visibility">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-5">
        <Kicker testId="managed-visibility-eyebrow">Visibility That Leads to Action</Kicker>
        <H2>Looking Beyond<br className="hidden lg:inline" /> Individual Issues.</H2>
        <Copy className="mt-5">We don't just respond to problems — we look for what they mean. By connecting signals across your environment, we identify trends, reduce risk and take action before small issues become bigger ones.</Copy>
        <div className="mt-6"><GoldLink href="#contact" testId="managed-visibility-link">Turn insight into action</GoldLink></div>
      </Reveal>
      <Reveal delay={140} dir="right" className="lg:col-span-7 flex justify-end">
        <Art src="/images/mit-visibility.png" alt="Support tickets, system alerts, security events, performance data, vendor input and user feedback converging into prioritized action" testId="managed-signals" max={700} w={1386} h={436} />
      </Reveal>
    </div>
  </section>
);

const Strategy = () => (
  <section className="py-12 lg:py-16" style={{ background: "#d8e8f9", ...light() }} data-testid="managed-strategy">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-5">
        <Kicker testId="managed-strategy-eyebrow">From Operations to Strategy</Kicker>
        <H2>Connecting Today&apos;s Environment<br className="hidden lg:inline" /> with What Comes Next.</H2>
        <Copy className="mt-5">Day-to-day management creates the insight for what's ahead. We help you translate operational realities into strategic decisions — from technology roadmaps and budgeting to lifecycle planning and executive reporting.</Copy>
      </Reveal>
      <Reveal delay={140} dir="right" className="lg:col-span-7 flex justify-end">
        <Art src="/images/mit-strategy.png" alt="Operational understanding, roadmaps, budgeting, lifecycle planning and executive reporting rising toward strategy" testId="managed-strategy-steps" max={680} w={1374} h={636} className="bc-wipe" />
      </Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="text-white py-12 lg:py-16" style={{ background: "#0044b5", ...dark({ "--type-body-ink": "#dbe4ff", "--type-small-ink": "#dbe4ff", "--type-section-desktop": 32 }) }} data-testid="managed-cta">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
      <Reveal className="lg:col-span-4">
        <Kicker testId="managed-cta-eyebrow">Start With Your Current Environment</Kicker>
        <H2 className="text-white">Understand What You Have.<br />Define What It Requires.</H2>
      </Reveal>
      <Reveal delay={100} className="lg:col-span-4">
        <Copy>A better-managed environment starts with a conversation. We'll take the time to understand your needs and show you what's possible.</Copy>
        <div className="mt-6"><FlatBtn testId="managed-cta-btn">Talk to Our Team</FlatBtn></div>
      </Reveal>
      <Reveal delay={160} className="hidden lg:flex lg:col-span-4 justify-end">
        <Art src="/images/mit-cta.png" alt="Skyline — stable, secure, prepared for what's next" testId="managed-cta-skyline" max={420} w={1378} h={456} />
      </Reveal>
    </div>
  </section>
);

export default function ManagedIT() {
  return (
    <div className="bg-white page-in" data-testid="managed-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Scope /><Coordinated /><Operate /><Visibility /><Strategy /><CTA /></main>
      <Footer />
    </div>
  );
}
