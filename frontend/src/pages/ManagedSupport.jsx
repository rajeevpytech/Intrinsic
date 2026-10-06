import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageFaqs from "../components/PageFaqs";
import { ScrollProgress, Reveal } from "../components/common";
import { AiEyebrow, GoldBtn, NavyBtn, ExploreLink, Mosaic, MiniArt, PhotoBand, C } from "../components/ai/AiGraphics";

const SERVICES = [
  { title: "Managed IT Services", tag: "A complete outsourced IT function.", art: "grid", body: "Intrinsic takes responsibility for day-to-day technology operations, bringing together user support, infrastructure management, monitoring, Microsoft 365, endpoint management, backup, security, and vendor coordination.", to: "/services/managed-it-services" },
  { title: "vCIO & vCISO", tag: "Leadership for technology and security decisions.", art: "flow", body: "Strategic technology leadership and security program oversight. A vCIO guides planning, budget, and investment decisions; a vCISO directs the security program and cybersecurity risk.", to: "/services/vcio-vciso" },
  { title: "Co-Managed IT", tag: "Additional capability for internal IT teams.", art: "circle", body: "Intrinsic works alongside your IT team, providing engineering expertise, service desk capacity, security support, after-hours coverage, and specialized resources while your team retains ownership of the environment.", to: "/services/co-managed-it" },
  { title: "Remote Monitoring & Management", tag: "Continuous visibility across your technology infrastructure.", art: "ops", body: "Proactive monitoring and management across endpoints, servers, networks, and infrastructure helps identify issues, maintain configurations, manage updates, and support timely remediation.", to: "/services/remote-monitoring-management" },
  { title: "Networking", tag: "Infrastructure and connectivity managed across the business.", art: "flow", body: "Intrinsic designs, monitors, manages, and optimizes switching, wireless, WAN, firewalls, and network connectivity across offices, users, cloud platforms, and applications.", to: "/services/networking" },
  { title: "Microsoft 365", tag: "Manage Microsoft 365 as a connected business platform.", art: "squares", body: "Ongoing management across identity, Exchange, Teams, SharePoint, security, governance, licensing, and user support.", to: "/services/microsoft-365" },
];

const OPERATE = [
  { title: "Monitoring & Maintenance", body: "Continuous monitoring, proactive maintenance, patching, and configuration management across the environment." },
  { title: "Service & Support", body: "Responsive technical support for users, systems, applications, and infrastructure, supported by defined escalation and resolution processes." },
  { title: "Security Management", body: "Security controls incorporated into day-to-day technology management and aligned with the organization's broader security requirements." },
  { title: "Documentation & Reporting", body: "Current technical documentation, service reporting, recurring issue analysis, and visibility into the health and performance of the environment." },
  { title: "Planning & Improvement", body: "Technology recommendations, lifecycle planning, and infrastructure priorities informed by operational data and business requirements." },
];

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)] text-white" style={{ background: C.navy }} data-type-context="dark" data-testid="managed-hero">
    <div className="grid lg:grid-cols-2">
      <div className="px-5 sm:px-8 lg:pl-[max(2rem,calc((var(--vw)-1240px)/2+2rem))] lg:pr-14 py-12 lg:py-16 flex flex-col justify-center">
        <AiEyebrow light className="animate-fade-up">Managed IT Services</AiEyebrow>
        <h1 className="ai-h1 text-white mt-6 animate-fade-up" style={{ animationDelay: "80ms" }} data-testid="managed-hero-title">Managed IT Built Around Your Operating Environment</h1>
        <p className="ai-p text-white/90 mt-7 max-w-[540px] animate-fade-up" style={{ animationDelay: "160ms" }} data-testid="managed-hero-intro">Intrinsic manages the technology your business depends on—from users and endpoints to networks, cloud platforms, and applications.</p>
        <p className="ai-p text-white/90 mt-4 max-w-[540px] animate-fade-up" style={{ animationDelay: "220ms" }} data-testid="managed-hero-description">Whether you need a complete IT function or additional support for your internal team, we provide the expertise, processes, and operational oversight required to keep technology reliable, secure, and well managed.</p>
        <div className="mt-9 animate-fade-up" style={{ animationDelay: "300ms" }}><GoldBtn testId="managed-hero-cta">Talk to Our Team</GoldBtn></div>
      </div>
      <div className="relative min-h-[320px] lg:min-h-full hero-wipe" style={{ background: C.navy }} data-testid="managed-hero-visual">
        <Mosaic variant="hero" letters="IT" motionStyle="governance" className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  </section>
);

const Services = () => (
  <section className="ai-cream py-12 lg:py-16" data-testid="managed-services">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-end">
        <Reveal className="lg:col-span-6"><AiEyebrow>Our Managed Services</AiEyebrow><h2 className="ai-h2 mt-6">One Environment. <br />Five Areas of Management.</h2></Reveal>
        <Reveal delay={100} className="lg:col-span-6 lg:pb-2">
          <p className="ai-p">Technology environments are interconnected. User support, infrastructure, monitoring, networking, and cloud platforms must work together to support reliable day-to-day operations.</p>
          <p className="ai-p mt-4">Intrinsic manages these areas through defined processes, clear ownership, and continuous oversight.</p>
        </Reveal>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-12 ai-divided">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 70} className="ai-divided-cell flex flex-col" data-testid={`managed-service-${i}`}>
            <div className="flex items-start justify-between gap-4"><span className="ai-num">0{i + 1}</span><MiniArt kind={s.art} className="w-[92px] h-auto" /></div>
            <h3 className="ai-h3 mt-4">{s.title}</h3>
            <p className="text-[#1f3f8f] text-[14px] font-semibold mt-1.5">{s.tag}</p>
            <p className="ai-p-sm mt-3 flex-1">{s.body}</p>
            {s.to && <div className="mt-5"><ExploreLink to={s.to} testId={`managed-service-link-${i}`}>Explore</ExploreLink></div>}
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Operate = () => (
  <section className="text-white py-12 lg:py-16" style={{ background: C.navy }} data-testid="managed-operate">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-6">
        <AiEyebrow light>How We Operate</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">Defined Processes. Clear Ownership. Continuous Oversight.</h2>
        <p className="ai-p text-white/90 mt-6">Effective IT management extends beyond resolving individual issues. Intrinsic provides ongoing oversight across the technology environment, with defined responsibilities, established processes, and continuous visibility into its operation and health.</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6">
        <ol className="cm-olist" data-testid="managed-operate-list">
          {OPERATE.map((o, i) => (
            <li key={o.title} className="ai-olist-row cm-olist-row" style={{ "--i": i }} data-testid={`managed-operate-${i}`}>
              <span className="ai-num text-[30px]">0{i + 1}</span>
              <div><p className="font-sans font-bold text-[16px] text-white">{o.title}</p><p className="text-white/80 text-[14.5px] leading-[1.55] mt-1">{o.body}</p></div>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  </section>
);

const Integrated = () => (
  <section className="bg-[#dbe7f5] py-12 lg:py-16" data-testid="managed-integrated">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-14">
      <Reveal className="lg:col-span-6"><AiEyebrow>Integrated Management Across the Environment</AiEyebrow><h2 className="ai-h2 mt-6">Technology Issues Rarely Exist in Isolation</h2></Reveal>
      <Reveal delay={100} className="lg:col-span-6">
        <p className="ai-p">A technology issue in one area can have implications across others. Identity affects application access. Network performance affects cloud services. Infrastructure changes can affect security, backup, and business continuity.</p>
        <p className="ai-p mt-4">Intrinsic manages these dependencies within a common operating framework. Support, infrastructure, networking, Microsoft 365, security, and strategic resources work from a shared understanding of the environment rather than operating as separate functions.</p>
        <p className="ai-p mt-4">This provides clearer accountability across technical disciplines, greater continuity from issue identification through resolution, and better visibility into how individual technology decisions affect the broader environment.</p>
      </Reveal>
    </div>
  </section>
);

const Ongoing = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="managed-ongoing">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-6">
        <AiEyebrow>Built for Ongoing Management</AiEyebrow>
        <h2 className="ai-h2 mt-6">Maintaining the Environment. Identifying What Comes Next.</h2>
        <p className="ai-p mt-6">Day-to-day support is one component of effective IT management. The broader responsibility is maintaining the health of the environment and understanding where attention or investment is required.</p>
        <p className="ai-p mt-4">Intrinsic reviews service activity, infrastructure health, recurring issues, technology risk, lifecycle requirements, and changes across the environment to identify areas requiring action.</p>
        <p className="ai-p mt-4">These findings inform operational priorities, technology recommendations, and longer-term planning—connecting the management of today's environment with the decisions required for what comes next.</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6"><PhotoBand className="h-[300px] lg:h-[440px]" /></Reveal>
    </div>
  </section>
);

const Model = () => (
  <section className="ai-sage text-white py-12 lg:py-16" data-testid="managed-model">
    <div className="container-x">
      <Reveal>
        <AiEyebrow light>A Service Model That Fits Your Organization</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">Complete IT Management or Additional Support for Your Team</h2>
        <p className="ai-p mt-6 max-w-[760px]">Not every organization requires the same level of external IT support. Intrinsic structures the relationship around the responsibilities you need us to own and the capabilities already available within your organization.</p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Reveal>
          <div className="h-full p-9 lg:p-12 flex flex-col" style={{ background: C.navy }} data-testid="managed-model-0">
            <p className="ai-eyebrow ai-eyebrow--light">Need a Complete IT Function?<span className="ai-eyebrow-rule" /></p>
            <h3 className="font-serif text-white text-[30px] lg:text-[36px] leading-[1.1] mt-5">Managed IT</h3>
            <p className="text-white/85 text-[15.5px] leading-[1.65] mt-5 flex-1">Intrinsic takes responsibility for day-to-day technology operations, providing the people, processes, tools, and oversight required to manage your IT environment.</p>
            <div className="mt-8"><GoldBtn testId="managed-model-0-cta">Talk to Our Team</GoldBtn></div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="h-full p-9 lg:p-12 flex flex-col bg-[#e8e4d8]" style={{ "--type-eyebrow-ink": C.navy, "--type-subheading-ink": "#1f3f8f", "--type-body-ink": "#2e3745" }} data-type-context="light" data-testid="managed-model-1">
            <p className="ai-eyebrow" data-testid="managed-model-1-eyebrow">Have an Internal IT Team?<span className="ai-eyebrow-rule" /></p>
            <h3 className="font-serif text-[#1f3f8f] text-[30px] lg:text-[36px] leading-[1.1] mt-5" data-testid="managed-model-1-title">Co-Managed IT</h3>
            <p className="text-[#2e3745] text-[15.5px] leading-[1.65] mt-5 flex-1" data-testid="managed-model-1-copy">Intrinsic works alongside your team, providing additional capacity, specialized expertise, tools, and operational support while your internal team retains ownership of the environment.</p>
            <div className="mt-8"><GoldBtn to="/services/co-managed-it" testId="managed-model-1-cta">Explore Co-Managed IT</GoldBtn></div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="ai-cream py-12 lg:py-16" data-testid="managed-cta">
    <div className="container-x grid lg:grid-cols-12 gap-10 items-center">
      <Reveal className="lg:col-span-6"><AiEyebrow>Let's Talk About Your IT Environment</AiEyebrow><h2 className="ai-h2 mt-6">Start With the Environment You Have Today</h2></Reveal>
      <Reveal delay={100} className="lg:col-span-6">
        <p className="ai-p">We'll begin by understanding your current technology environment, how IT responsibilities are managed today, and where additional ownership, capacity, or expertise is required.</p>
        <p className="ai-p mt-4">From there, we can define the service model and capabilities that best align with your organization.</p>
        <div className="mt-8"><GoldBtn testId="managed-cta-btn">Talk to Our Team</GoldBtn></div>
      </Reveal>
    </div>
  </section>
);

export default function ManagedSupport() {
  return (
    <div className="bg-white page-in" data-testid="managed-support-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Services /><Operate /><Integrated /><Ongoing /><Model /><CTA /></main>
      <PageFaqs path="/services/managed-it" />
      <Footer />
    </div>
  );
}
