import React from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BcHeroMotion from "../components/BcHeroMotion";
import { ScrollProgress, Reveal } from "../components/common";
import { Eyebrow, H2, Paras } from "../components/industry/IndustrySections";

const SERVICES = [
  { title: "Backup Architecture & Data Protection", body: "Design and implement backup solutions that protect your data and systems across on-premises, cloud, and hybrid environments." },
  { title: "Monitoring & Verification", body: "Continuously monitor backup processes and verify that data is being protected as expected." },
  { title: "Recovery Objectives", body: "Define RTO and RPO based on your business needs, system dependencies, and operational requirements." },
  { title: "Disaster Recovery Planning", body: "Develop documented plans and procedures for restoring systems and maintaining business operations." },
  { title: "Failover & Restoration", body: "Execute controlled failover and restoration processes to resume operations when needed." },
  { title: "Testing & Validation", body: "Regularly test backup and recovery processes to verify effectiveness and make improvements as your environment evolves." },
];

const Cta = ({ testId }) => (
  <a href="#contact" className="btn-amber" data-testid={testId}><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
);

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)] bc-hero" data-type-tone="light" data-testid="bdr-hero">
    <div className="container-x pt-14 lg:pt-20 pb-14 lg:pb-20 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <div className="lg:col-span-5 max-w-[560px]">
        <p className="cyber-eyebrow text-royal inline-flex items-center gap-4 animate-fade-up">Backup &amp; Disaster Recovery <span className="inline-block w-14 h-px bg-[#f2a91c]" /></p>
        <h1 className="cyber-h1 text-royal mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>Business Continuity Built Around Recovery</h1>
        <p className="text-[#2e3745] text-[16px] leading-[1.7] mt-7 animate-fade-up" style={{ animationDelay: "200ms" }}>Protecting data is only part of business continuity. Organizations also need a reliable way to restore critical systems and resume operations.</p>
        <p className="text-[#2e3745] text-[16px] leading-[1.7] mt-4 animate-fade-up" style={{ animationDelay: "280ms" }}>Intrinsic designs, manages, and tests backup and disaster recovery around your recovery objectives, infrastructure, and business priorities.</p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "360ms" }}><Cta testId="bdr-hero-cta" /></div>
      </div>
      <div className="lg:col-span-7 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "200ms" }}>
        <BcHeroMotion />
      </div>
    </div>
  </section>
);

const StructuredApproach = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="bdr-approach">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-royal">A Structured Approach to Business Continuity</Eyebrow>
        <H2>Protecting Data Is the Beginning. Restoring Operations Is the Objective.</H2>
        <Paras className="text-[#2e3745] mt-6" items={[
          "Backup and disaster recovery serve different but complementary purposes. Backup creates copies of data and systems, while disaster recovery focuses on restoring operations when an unexpected event occurs.",
          "Every organization relies on interdependent systems, applications, and infrastructure. When these elements are disrupted, downtime can impact productivity, revenue, and customer service. Data loss can also have lasting consequences.",
          "Defining recovery time objectives (RTO) and recovery point objectives (RPO) helps establish clear expectations for how quickly systems need to be restored and how much data loss is acceptable. Restoration procedures and coordinated continuity efforts are essential to meet these objectives and maintain business operations.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6 flex justify-center lg:justify-end">
        <img src="/images/bc-framework.png" alt="Recovery framework: understand business requirements, define recovery objectives, plan and document, implement and maintain" className="w-full max-w-[640px] h-auto" width="1600" height="1173" data-testid="bdr-approach-image" />
      </Reveal>
    </div>
  </section>
);

const Services = () => (
  <section className="py-12 lg:py-16 bc-mint" data-type-tone="light" data-testid="bdr-services">
    <div className="container-x">
      <Reveal className="max-w-[900px] mb-10 lg:mb-12">
        <Eyebrow color="text-royal">Backup &amp; Disaster Recovery Services</Eyebrow>
        <H2>From Data Protection Through Restoration</H2>
        <p className="text-[#2e3745] text-[16px] leading-[1.72] mt-5">Intrinsic provides end-to-end backup and disaster recovery services designed around your environment, business requirements, and recovery objectives.</p>
      </Reveal>
      <div className="bc-services-grid">
        {SERVICES.map(({ title, body }, i) => (
          <Reveal key={title} delay={(i % 3) * 90} className="bc-service" data-testid={`bdr-service-${i}`}>
            <h3 className="font-serif text-royal text-[19px] font-semibold leading-snug">{title}</h3>
            <p className="text-[#2e3745] text-[14.5px] leading-[1.62] mt-2.5">{body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Resilience = () => (
  <section className="py-12 lg:py-16 bc-green text-white" data-type-tone="dark" data-testid="bdr-resilience">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
      <Reveal className="lg:col-span-5">
        <Eyebrow color="text-[#f2a91c]">Continuity Planning Based on Business Impact</Eyebrow>
        <H2 className="text-white">Different Systems Require Different Levels of Resilience</H2>
        <Paras className="text-white/85 mt-6" items={[
          "Not all systems have the same impact on business operations. Critical systems may require the shortest recovery windows, while other systems can tolerate longer downtime.",
          "Intrinsic helps you define recovery priorities based on business impact, system dependencies, and operational requirements, so your resources are focused where they matter most.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-7">
        <div className="bc-card" data-type-tone="light">
          <img src="/images/bc-resilience.png" alt="Increasing business impact and resilience requirements: standard, important and business-critical systems" className="w-full h-auto bc-wipe" width="1600" height="574" data-testid="bdr-tiers-image" />
        </div>
      </Reveal>
    </div>
  </section>
);

const Maintain = () => (
  <section className="py-12 lg:py-16 bc-cream" data-type-tone="light" data-testid="bdr-maintain">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-royal">Managed for the Environment You Operate</Eyebrow>
        <H2>Maintaining Continuity as Technology Changes</H2>
        <Paras className="text-[#2e3745] mt-6" items={[
          "Technology environments evolve, and so do business requirements. Intrinsic provides ongoing management, monitoring, and support to keep your backup and disaster recovery solutions effective as your systems, data, and infrastructure change.",
          "We work with your team to review performance, incorporate changes, test regularly, and update documentation, so your organization maintains a reliable recovery capability over time.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6">
        <img src="/images/bc-review.png" alt="Ongoing cycle: review, monitor, test, update" className="w-full h-auto" width="1600" height="388" data-testid="bdr-cycle-image" />
      </Reveal>
    </div>
  </section>
);

const Assess = () => (
  <section className="relative overflow-hidden py-12 lg:py-16 bc-royal text-white" data-type-tone="dark" data-testid="bdr-plan">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
      <Reveal className="lg:col-span-6 max-w-[620px]">
        <Eyebrow color="text-[#f2a91c]">Strengthen Your Business Continuity Strategy</Eyebrow>
        <H2 className="text-white">Understand Your Current Backup and Recovery Capabilities</H2>
        <p className="text-white/85 text-[16px] leading-[1.72] mt-6">Intrinsic can assess your existing backup architecture, data protection, recovery objectives, documentation, testing, and continuity requirements to identify gaps and establish priorities. From there, we can define an approach aligned with your technology environment, operational requirements, and business priorities.</p>
        <div className="mt-8"><Cta testId="bdr-plan-cta" /></div>
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6">
        <img src="/images/bc-continue.png" alt="Prepare, protect, recover, continue" className="w-full h-auto bc-feather" width="1600" height="533" data-testid="bdr-plan-image" />
      </Reveal>
    </div>
  </section>
);

export default function BackupRecovery() {
  return (
    <div className="bg-white page-in" data-testid="bdr-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <StructuredApproach />
        <Services />
        <Resilience />
        <Maintain />
        <Assess />
      </main>
      <Footer />
    </div>
  );
}
