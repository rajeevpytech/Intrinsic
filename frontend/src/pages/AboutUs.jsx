import React from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { Eyebrow, H2, Paras } from "../components/industry/IndustrySections";

const PRINCIPLES = [
  { n: "01", title: "Accountability", body: "Clear ownership of responsibilities, issues, and priorities through resolution." },
  { n: "02", title: "Visibility", body: "Ongoing insight into service activity, infrastructure health, security posture, technology risk, and emerging requirements." },
  { n: "03", title: "Discipline", body: "Defined processes for support, maintenance, security, documentation, change management, and escalation." },
  { n: "04", title: "Direction", body: "Operational and technical insight translated into priorities, recommendations, and longer-term technology planning." },
];

const EXPERTISE = [
  { n: "01", title: "Managed Technology", body: "Day-to-day support, infrastructure, networks, endpoints, administration, and service management." },
  { n: "02", title: "Cybersecurity & Resilience", body: "Security controls, monitoring, vulnerability management, governance, response, and business continuity." },
  { n: "03", title: "Cloud & Strategic Direction", body: "Cloud and Microsoft 365, identity, collaboration, migration, lifecycle planning, budgeting, and technology roadmaps." },
];

const Hero = () => (
  <section className="relative overflow-hidden bg-royal pt-[var(--nav-h)]" data-testid="about-hero">
    <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, #002a76 0%, #003b96 48%, #0045ac 100%)" }} />
    <div className="container-x relative z-10 pt-16 lg:pt-24 pb-16 lg:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <div className="lg:col-span-6">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-7 animate-fade-up">About Intrinsic</p>
        <h1 className="font-serif font-semibold text-white text-[36px] sm:text-[52px] lg:text-[62px] leading-[1.07] max-w-[15ch] animate-fade-up" style={{ animationDelay: "80ms" }}>
          Technology Management with Clear Responsibility
        </h1>
        <p className="text-white/80 text-[16px] sm:text-[17px] leading-[1.72] mt-8 max-w-[52ch] animate-fade-up" style={{ animationDelay: "180ms" }}>
          Intrinsic brings technical expertise, operational responsibility, and strategic direction together within one accountable technology relationship.
        </p>
      </div>
      <div className="lg:col-span-6 animate-fade-in" style={{ animationDelay: "220ms" }}>
        <img src="/images/about/technology-management.svg" alt="Operations, security, cloud, and direction converging into one managed technology relationship" className="w-full h-auto select-none pointer-events-none lg:scale-[1.2]" loading="eager" draggable="false" data-testid="about-hero-graphic" />
      </div>
    </div>
  </section>
);

const Partner = () => (
  <section className="bg-white py-14 lg:py-20" data-testid="about-partner">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-deepamber">Who We Are</Eyebrow>
        <H2>A Technology Partner Built for Ongoing Management</H2>
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6 lg:border-l lg:border-royal/15 lg:pl-16">
        <Paras className="text-[#3b4453]" items={[
          "Intrinsic is a managed technology and cybersecurity partner providing ongoing management across IT infrastructure, cloud, security, users, and business continuity.",
          "We work with organizations that require more than technical support\u2014bringing together experienced professionals, defined operating processes, and ongoing oversight to manage technology as a critical business function.",
        ]} />
        <div className="mt-9">
          <a href="#contact" className="btn-amber" data-testid="about-partner-cta"><span>Talk to Our Team</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
        </div>
      </Reveal>
    </div>
  </section>
);

const Principles = () => (
  <section className="ab-lightblue py-14 lg:py-20" data-testid="about-principles">
    <div className="container-x">
      <Reveal className="max-w-[860px]">
        <Eyebrow color="text-deepamber">Our Operating Principles</Eyebrow>
        <H2>A Disciplined Approach to Technology Management</H2>
        <Paras className="text-[#3b4453] mt-6" items={[
          "Effective technology management requires more than resolving individual issues. It requires clear responsibility, consistent processes, technical standards, and an informed view of the environment as a whole.",
          "Intrinsic's approach is built around four operating principles.",
        ]} />
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 lg:gap-x-0 mt-16">
        {PRINCIPLES.map(({ n, title, body }, i) => (
          <Reveal key={title} delay={i * 90}>
            <div className="h-full lg:px-8 lg:first:pl-0 lg:border-l lg:border-royal/12 lg:first:border-l-0" data-testid={`about-principle-${i}`}>
              <p className="ab-num ab-num-blue">{n}</p>
              <span className="ab-num-rule" />
              <h3 className="font-mono text-[12.5px] font-bold tracking-[0.14em] uppercase text-royal mt-5">{title}</h3>
              <p className="text-[#3b4453]/85 text-[14px] leading-[1.62] mt-3">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const HowWeWork = () => (
  <section className="bg-white py-14 lg:py-20" data-testid="about-how">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <Reveal className="lg:col-span-5">
          <Eyebrow color="text-deepamber">How Intrinsic Works</Eyebrow>
          <H2>Operational Management Informed by the Environment</H2>
        </Reveal>
        <Reveal delay={140} className="lg:col-span-7 lg:border-l lg:border-royal/15 lg:pl-16">
          <Paras className="text-[#3b4453]" items={[
            "Our understanding of a client's technology environment develops through the work we perform every day.",
            "Service activity provides insight into user experience and recurring issues. Monitoring provides visibility into infrastructure and system health. Security operations identify change and risk.",
            "This information informs our ability to establish priorities, address immediate requirements, and support longer-term technology planning.",
          ]} />
        </Reveal>
      </div>
      <Reveal delay={120} className="mt-14">
        <img src="/images/about/operational-process-transparent.webp" alt="Operational process flow: environment to visibility to priorities to management" className="w-full h-auto select-none pointer-events-none" loading="lazy" draggable="false" data-testid="about-how-graphic" />
      </Reveal>
    </div>
  </section>
);

const Expertise = () => (
  <section className="ab-lightblue py-14 lg:py-20" data-testid="about-expertise">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16">
        <Reveal className="lg:col-span-6">
          <Eyebrow color="text-deepamber">Our Expertise</Eyebrow>
          <H2>Expertise Across the Technology Environment</H2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6 lg:border-l lg:border-royal/15 lg:pl-16">
          <p className="text-[#3b4453] text-[16px] leading-[1.7]">Technology environments require different areas of expertise at different times. Intrinsic brings these disciplines together within a coordinated service model.</p>
        </Reveal>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-0">
        {EXPERTISE.map(({ n, title, body }, i) => (
          <Reveal key={title} delay={i * 90}>
            <div className="h-full lg:px-10 lg:first:pl-0 lg:border-l lg:border-royal/12 lg:first:border-l-0" data-testid={`about-expertise-${i}`}>
              <p className="ab-num ab-num-blue">{n}</p>
              <span className="ab-num-rule" />
              <h3 className="font-mono text-[12.5px] font-bold tracking-[0.12em] uppercase text-royal mt-5 leading-snug">{title}</h3>
              <p className="text-[#3b4453]/85 text-[14px] leading-[1.62] mt-3">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Organizations = () => (
  <section className="ab-industries text-white py-14 lg:py-20" data-testid="about-orgs">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow color="text-amber">The Organizations We Support</Eyebrow>
        <H2 className="text-white">Experience Across Distinct Operating Environments</H2>
        <Paras className="text-white/82 mt-6" items={[
          "Intrinsic adapts technology management to each client's operating model, systems, information requirements, risk profile, and business priorities.",
        ]} />
        <div className="mt-9">
          <a href="/industries" className="btn-amber" data-testid="about-explore-industries"><span>Explore Industries</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
        </div>
      </Reveal>
      <Reveal delay={140} className="lg:col-span-6 lg:justify-self-end w-full">
        <img src="/images/about/supported-industries-transparent.webp" alt="Financial services, healthcare, nonprofit, professional services, and construction" className="w-full max-w-[560px] h-auto ml-auto select-none pointer-events-none" loading="lazy" draggable="false" data-testid="about-orgs-graphic" />
      </Reveal>
    </div>
  </section>
);

export default function AboutUs() {
  return (
    <div className="bg-white page-in" data-testid="about-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Partner />
        <Principles />
        <HowWeWork />
        <Expertise />
        <Organizations />
      </main>
      <Footer />
    </div>
  );
}
