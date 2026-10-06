import React from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { Eyebrow, H2, Paras } from "../components/industry/IndustrySections";
import { MgmtTable, PlanNext } from "./CloudHome";

const STRATEGY = [
  { title: "Business Requirements", body: "Operational goals, constraints, and priorities.", color: "#0b4aa2" },
  { title: "Environment Assessment", body: "Applications, dependencies, security, and infrastructure.", color: "#4f7a6c" },
  { title: "Target Architecture", body: "Defined, practical, and aligned with the organization.", color: "#faaf6a" },
];

const STEPS = [
  { n: "01", title: "Assess Dependencies", body: "Understand relationships across applications, data, identity, and infrastructure.", color: "#0b4aa2", fill: true },
  { n: "02", title: "Plan Transition", body: "Define sequencing, technical preparation, and cutover approach.", color: "#33564a", fill: true },
  { n: "03", title: "Migrate Workloads", body: "Execute a coordinated implementation process.", color: "#faaf6a", fill: true },
  { n: "04", title: "Validate Environment", body: "Confirm systems are operating as intended.", color: "#c8d2de", fill: false },
];

const FRAMEWORK = [
  { n: "01", title: "Assess & Plan", body: "Evaluate existing infrastructure, applications, dependencies, security requirements, and operational priorities. Define the target environment, scope, migration requirements, and implementation approach." },
  { n: "02", title: "Design & Govern", body: "Establish the cloud or hybrid architecture, including connectivity, identity, access, security controls, governance requirements, resilience, and operational management." },
  { n: "03", title: "Implement & Transition", body: "Prepare and migrate workloads through a coordinated implementation process that includes technical validation, sequencing, testing, and planned cutovers." },
  { n: "04", title: "Manage & Optimize", body: "Following implementation, monitor and manage the environment, review performance and resource utilization, maintain security and configurations, and address changing infrastructure requirements." },
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
  <section className="pt-[var(--nav-h)] overflow-hidden" style={{ background: "#e9f2fc" }} data-testid="cim-hero">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center py-12 lg:py-16">
      <Reveal dir="left" className="lg:col-span-6 order-2 lg:order-1">
        <img src="/images/cloud-migration-hero.png" alt="Migration from current environment to target environment" className="w-full h-auto live-float" style={{ maskImage: "radial-gradient(ellipse 78% 70% at 50% 50%, #000 62%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 78% 70% at 50% 50%, #000 62%, transparent 100%)" }} data-testid="cim-hero-image" />
      </Reveal>
      <div className="lg:col-span-6 order-1 lg:order-2">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-6 animate-fade-up">Cloud Infrastructure & Migration</p>
        <h1 className="font-serif font-semibold text-royal text-[36px] sm:text-[46px] leading-[1.08] animate-fade-up" style={{ animationDelay: "80ms" }}>Modern Infrastructure. Thoughtfully Designed and Managed.</h1>
        <Paras className="text-[#3b4453] mt-6 animate-fade-up" items={[
          "Cloud decisions should begin with the requirements of the business and the technology environment—not with the assumption that every workload belongs in the cloud.",
          "Intrinsic helps organizations evaluate, design, migrate, and manage cloud infrastructure across Azure, Microsoft 365, and hybrid environments. We consider applications, dependencies, security, connectivity, performance, and business continuity to establish an infrastructure model aligned with how the organization operates.",
        ]} />
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "260ms" }}>
          <a href="#contact" className="btn-amber" data-testid="cim-hero-cta"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
        </div>
      </div>
    </div>
  </section>
);

const Strategy = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="cim-strategy">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 lg:items-start">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-deepamber">Cloud Strategy & Architecture</Eyebrow>
        <H2>Determine the Right Environment for Each Workload</H2>
        <Paras className="text-[#3b4453] mt-6" items={[
          "Cloud strategy begins with understanding the current environment and determining what needs to change.",
          "Intrinsic evaluates existing infrastructure, applications, dependencies, security requirements, operational priorities, and business objectives to determine the appropriate architecture for the organization.",
          "This includes assessing where workloads should operate, how cloud and existing infrastructure need to interact, what connectivity and identity requirements must be addressed, and where security, governance, resilience, or performance considerations influence the design.",
          "The result is a defined infrastructure strategy that establishes the technical foundation for modernization, migration, and ongoing management.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6 lg:pt-[150px]">
        <ul className="relative pl-1">
          <span className="absolute left-[8px] top-4 bottom-4 w-[3px] rounded-full bg-royal" />
          {STRATEGY.map(({ title, body, color }, i) => (
            <li key={title} className="relative flex items-start gap-5 py-5" data-testid={`cim-strategy-${i}`}>
              <span className="relative z-10 mt-1 w-[18px] h-[18px] rounded-full ring-4 ring-white" style={{ backgroundColor: color }} />
              <div>
                <p className="font-mono text-[12px] font-bold tracking-[0.12em] uppercase text-royal">{title}</p>
                <p className="text-slatesage text-[14px] leading-[1.6] mt-1.5">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);

const Migration = () => (
  <section className="ab-lightblue py-12 lg:py-16" data-testid="cim-migration">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-deepamber">Cloud Migration</Eyebrow>
        <H2>Managing the Transition Across the Environment</H2>
        <Paras className="text-[#3b4453] mt-6" items={[
          "Cloud migration requires more than moving individual workloads. Applications may depend on databases, identity services, network connectivity, integrations, storage, security controls, and other systems that need to remain available throughout the transition.",
          "Intrinsic evaluates these dependencies before establishing the migration approach. Workloads are assessed for technical requirements, business criticality, security considerations, performance needs, and their relationship to the broader environment.",
          "Migration plans define sequencing, technical preparation, validation requirements, cutover procedures, and continuity considerations. Implementation is coordinated to limit operational disruption while maintaining visibility across the systems affected by the transition.",
          "Following migration, workloads and dependencies are reviewed to confirm that the environment is operating as intended.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6 lg:pt-[130px] lg:mt-[7%]">
        <ul className="relative" data-testid="cim-migration-timeline">
          {STEPS.map(({ n, title, body, color, fill }, i) => (
            <li key={n} className="relative flex items-start gap-6 pb-9 last:pb-0" data-testid={`cim-step-${i}`}>
              {i < STEPS.length - 1 && <span aria-hidden="true" data-testid={`cim-connector-${i}`} className="absolute left-[18.5px] top-10 bottom-0 w-[3px] bg-royal" />}
              <span data-testid={`cim-step-number-${i}`} className="relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-mono text-[13px] font-bold" style={fill ? { backgroundColor: color, color: color === "#faaf6a" ? "#1a1a2e" : "#fff" } : { border: `1.5px solid ${color}`, color: "#5c6b82" }}>{n}</span>
              <div className="pt-1.5">
                <p className="font-mono text-[12px] font-bold tracking-[0.12em] uppercase text-royal">{title}</p>
                <p className="text-slatesage text-[14px] leading-[1.6] mt-1.5">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);

const Hybrid = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="cim-hybrid">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-deepamber">Hybrid Infrastructure</Eyebrow>
        <H2>Cloud and On-Premises Systems Operating as One Environment</H2>
        <Paras className="text-[#3b4453] mt-6" items={[
          "Cloud adoption does not necessarily require every application, system, or workload to move away from existing infrastructure.",
          "Operational requirements, application dependencies, performance considerations, security requirements, or business constraints may require cloud and on-premises resources to continue operating together.",
          "Intrinsic designs and manages hybrid environments with consideration for connectivity, identity, application dependencies, security, data movement, performance, and business continuity.",
          "This creates an infrastructure model in which cloud and on-premises resources operate as a coordinated environment, with consistent management and visibility across both.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6">
        <svg viewBox="0 0 480 330" className="w-full h-auto" data-testid="cim-venn" aria-hidden="true">
          <circle className="cld-float" cx="170" cy="170" r="140" fill="#0b4aa2" opacity="0.14" stroke="#0b4aa2" strokeWidth="1.5" />
          <circle className="cld-float cld-float-2" cx="310" cy="170" r="140" fill="#33564a" opacity="0.14" stroke="#33564a" strokeWidth="1.5" />
          <text x="52" y="120" fontFamily="'DM Mono',monospace" fontSize="11" fontWeight="700" letterSpacing="1.5" fill="#0b4aa2">CLOUD</text>
          {["Azure", "Microsoft 365", "Cloud workloads", "Scalable resources"].map((t, i) => (
            <text key={t} x="52" y={148 + i * 20} fontFamily="Inter, sans-serif" fontSize="11" fill="#3b4453">{t}</text>
          ))}
          <text x="336" y="120" fontFamily="'DM Mono',monospace" fontSize="11" fontWeight="700" letterSpacing="1.5" fill="#33564a">ON-PREMISES</text>
          {["Existing infrastructure", "Business applications", "Data and services", "Site connectivity"].map((t, i) => (
            <text key={t} x="336" y={148 + i * 20} fontFamily="Inter, sans-serif" fontSize="11" fill="#3b4453">{t}</text>
          ))}
          <text x="240" y="158" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10.5" fontWeight="600" fill="#274b7a">Connected</text>
          <text x="240" y="174" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10.5" fontWeight="600" fill="#274b7a">and managed</text>
          <text x="240" y="190" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10.5" fontWeight="600" fill="#274b7a">as one environment</text>
        </svg>
      </Reveal>
    </div>
  </section>
);

const Framework = () => (
  <section className="ab-cream py-12 lg:py-16" data-testid="cim-framework">
    <div className="container-x">
      <Reveal className="max-w-[900px] mb-14">
        <Eyebrow color="text-deepamber">Our Delivery Framework</Eyebrow>
        <H2>Structured From Assessment Through Transition</H2>
        <p className="text-[#3b4453] text-[16px] leading-[1.72] mt-6">Cloud infrastructure changes require coordination across applications, systems, users, security, and operations. Intrinsic uses a structured delivery approach to manage these dependencies throughout the engagement.</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 lg:gap-x-0">
        {FRAMEWORK.map(({ n, title, body }, i) => (
          <Reveal key={n} delay={i * 80}>
            <div className="h-full lg:px-8 lg:first:pl-0 lg:border-l lg:border-royal/15 lg:first:border-l-0" data-testid={`cim-fw-${i}`}>
              <p className="ab-num ab-num-blue">{n}</p>
              <span className="ab-num-rule" />
              <h3 className="font-serif text-royal text-[19px] font-semibold mt-5">{title}</h3>
              <p className="text-slatesage text-[13.5px] leading-[1.6] mt-3">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const AfterMigration = () => (
  <section className="ab-green text-white py-12 lg:py-16" data-testid="cim-after">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <Eyebrow color="text-amber">Cloud Infrastructure Management</Eyebrow>
        <H2 className="text-white">Managing the Environment After Migration</H2>
        <Paras className="text-white/80 mt-6" items={[
          "Cloud infrastructure continues to change after deployment. Workloads evolve, resources scale, applications are introduced, permissions change, and security, performance, and consumption requirements shift.",
          "Intrinsic provides ongoing management to keep the environment documented, monitored, secure, resilient, and aligned with current business requirements.",
        ]} />
      </Reveal>
      <Reveal delay={140} className="lg:col-span-7 lg:pt-2">
        <MgmtTable rows={MGMT} testid="cim-mgmt" />
      </Reveal>
    </div>
  </section>
);

export default function CloudInfrastructure() {
  return (
    <div className="bg-white page-in" data-testid="cim-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Strategy />
        <Migration />
        <Hybrid />
        <Framework />
        <AfterMigration />
        <PlanNext
          eyebrow="Plan What Comes Next"
          heading="Know Where Your Cloud Environment Stands."
          body="Whether you're evaluating a migration, modernizing an existing environment, or looking for ongoing cloud management, Intrinsic can assess your current infrastructure and identify priorities across architecture, security, performance, resilience, and cost."
          cta="Talk to Our Team"
          testid="cim-plan"
        />
      </main>
      <Footer />
    </div>
  );
}
