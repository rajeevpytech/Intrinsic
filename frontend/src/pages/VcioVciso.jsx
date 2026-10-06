import React from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageFaqs from "../components/PageFaqs";
import { ScrollProgress, Reveal } from "../components/common";
import { Eyebrow, H2, Paras } from "../components/industry/IndustrySections";

const CREAM = "#f7f4ee";
const MINT = "#d7e1dd";
const ICE = "#eef1f7";

const VCIO_CARDS = [
  { title: "Technology Roadmap", body: "Plan improvements, replacements, and new initiatives with recommended priorities, timing, dependencies, and the decisions that need leadership input.", bg: MINT },
  { title: "Budget & Lifecycle Planning", body: "Anticipate equipment replacements, renewals, platform changes, and project costs for a clearer view of upcoming technology spending.", bg: CREAM },
  { title: "Platform & Vendor Decisions", body: "Evaluate significant technology choices against your requirements, existing systems, cost, and the effort involved in making a change.", bg: CREAM },
  { title: "Leadership Reviews", body: "Regular meetings bring the roadmap, active initiatives, service trends, and upcoming decisions into one documented discussion.", bg: MINT },
];

const VCISO_CARDS = [
  { title: "Security Program Planning", body: "Define the policies, controls, and oversight practices appropriate to your organization's environment and risk.", bg: MINT },
  { title: "Risk & Remediation Priorities", body: "Assess security gaps, recommend actions based on potential impact, and track progress against agreed priorities.", bg: CREAM },
  { title: "Governance & Compliance Support", body: "Align security practices with applicable requirements and support assessments, audit requests, and client security questionnaires.", bg: CREAM },
  { title: "Incident Readiness", body: "Define response procedures, escalation paths, and leadership responsibilities so the organization is prepared to act during an incident.", bg: MINT },
];

const Cta = ({ testId, label = "Talk to Our Team" }) => (
  <a href="#contact" className="btn-amber" data-testid={testId}><span>{label}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
);

const Card = ({ title, body, bg, testId, delay = 0 }) => (
  <Reveal delay={delay} data-testid={testId}>
    <div className="h-full p-5 lg:p-6 transition-transform duration-500 hover:-translate-y-1" style={{ backgroundColor: bg }}>
      <h3 className="font-serif text-royal text-[18px] lg:text-[19px] font-semibold leading-snug">{title}</h3>
      <p className="text-[#2e3745] text-[14px] leading-[1.62] mt-2.5">{body}</p>
    </div>
  </Reveal>
);

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)]" style={{ backgroundColor: CREAM }} data-type-tone="light" data-testid="vcio-hero">
    <div className="container-x pt-14 lg:pt-20 pb-14 lg:pb-20 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      <div className="lg:col-span-5 max-w-[560px]">
        <p className="cyber-eyebrow text-slatesage inline-flex items-center gap-4 animate-fade-up"><span className="inline-block w-10 h-[2px] bg-[#f2a91c]" /> Strategic Leadership</p>
        <h1 className="cyber-h1 text-royal mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>vCIO &amp; vCISO</h1>
        <p className="font-serif text-royal text-[22px] lg:text-[24px] leading-[1.3] mt-5 animate-fade-up" style={{ animationDelay: "160ms" }}>Distinct leadership for technology decisions and cybersecurity risk.</p>
        <p className="text-[#2e3745] text-[16px] leading-[1.72] mt-6 animate-fade-up" style={{ animationDelay: "240ms" }}>Intrinsic helps organizations set direction, make informed decisions, and maintain oversight of the work that follows. Each service has a distinct scope and can be engaged independently.</p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "320ms" }}><Cta testId="vcio-hero-cta" /></div>
      </div>
      <div className="lg:col-span-7 flex justify-center lg:justify-end animate-fade-in lg:pr-[40px]" style={{ animationDelay: "200ms" }}>
        <img src="/images/vcio-vciso-transparent.webp" alt="vCIO technology direction timeline and vCISO security oversight diagram" className="w-full max-w-[468px] h-auto live-float" width="750" height="664" data-testid="vcio-hero-image" />
      </div>
    </div>
  </section>
);

const Distinct = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="vcio-distinct">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-slatesage">Two Distinct Services</Eyebrow>
        <H2>Leadership with a defined purpose.</H2>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6">
        <Paras className="text-[#2e3745]" items={[
          "A vCIO guides technology planning, investment, and change. A vCISO directs the security program and oversees cybersecurity risk.",
          "Each service has its own responsibilities and can be engaged independently or together.",
        ]} />
      </Reveal>
    </div>
  </section>
);

const Vcio = () => (
  <section className="py-12 lg:py-16" style={{ backgroundColor: ICE }} data-type-tone="light" data-testid="vcio-section">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <Reveal className="lg:col-span-5">
        <Eyebrow color="text-slatesage">01 / vCIO</Eyebrow>
        <H2>Strategic technology leadership</H2>
        <p className="font-serif text-royal text-[20px] leading-[1.35] mt-4">Aligned with organizational priorities.</p>
        <p className="text-[#2e3745] text-[16px] leading-[1.72] mt-5">Intrinsic connects technology planning to your operations, goals, and budget. We develop an understanding of your current environment and upcoming needs, then work with leadership to establish priorities and guide investment decisions.</p>
        <img src="/images/vcio-progress.png" alt="From priority to progress: priorities, decisions, delivery, review" className="w-full max-w-[420px] h-auto mt-9" width="1545" height="400" data-testid="vcio-progress-image" />
      </Reveal>
      <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
        {VCIO_CARDS.map((c, i) => <Card key={c.title} {...c} delay={i * 80} testId={`vcio-card-${i}`} />)}
      </div>
    </div>
  </section>
);

const Vciso = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="vciso-section">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <Reveal className="lg:col-span-5">
        <Eyebrow color="text-slatesage">02 / vCISO</Eyebrow>
        <H2>Direction for your security program</H2>
        <p className="font-serif text-royal text-[20px] leading-[1.35] mt-4">Grounded in your risks and requirements.</p>
        <p className="text-[#2e3745] text-[16px] leading-[1.72] mt-5">Intrinsic reviews existing practices and relevant requirements, then develops a security plan with prioritized actions and clear responsibilities. Ongoing reviews help leadership monitor progress and respond to changing risks.</p>
        <div className="mt-8 border-l-[3px] border-[#f2a91c] pl-5 py-1" style={{ backgroundColor: CREAM }} data-testid="vciso-callout">
          <p className="text-[#2e3745] text-[15px] leading-[1.65] py-3 pr-4">A documented plan that gives leadership a clear view of open risks, actions underway, and decisions needed.</p>
        </div>
      </Reveal>
      <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
        {VCISO_CARDS.map((c, i) => <Card key={c.title} {...c} delay={i * 80} testId={`vciso-card-${i}`} />)}
        <Card title="Security Reporting & Reviews" body="Give decision makers a clear account of open risks, planned actions, changing requirements, and the issues that need executive input." bg={ICE} delay={320} testId="vciso-card-4" />
      </div>
    </div>
  </section>
);

const Action = () => (
  <section className="py-12 lg:py-16 bc-green text-white" data-type-tone="dark" data-testid="vcio-action">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-[#f2a91c]">From Direction to Action</Eyebrow>
        <H2 className="text-white">Plans that stay connected to the work</H2>
        <div className="mt-8"><Cta testId="vcio-action-cta" label="Schedule a Conversation" /></div>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6">
        <Paras className="text-white/85" items={[
          "Intrinsic meets regularly with your leadership team to review decisions, track agreed actions, and adjust priorities as your organization changes.",
          "The vCIO keeps the technology roadmap current; the vCISO maintains oversight of the security plan. The teams responsible for implementation have clear direction on what comes next.",
        ]} />
      </Reveal>
    </div>
  </section>
);

export default function VcioVciso() {
  return (
    <div className="bg-white page-in" data-testid="vcio-vciso-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Distinct />
        <Vcio />
        <Vciso />
        <Action />
      </main>
      <PageFaqs path="/services/vcio-vciso" />
      <Footer />
    </div>
  );
}
