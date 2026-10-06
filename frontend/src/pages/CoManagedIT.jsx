import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { AiEyebrow, GoldBtn, NavyBtn, MiniArt, C } from "../components/ai/AiGraphics";
import { ImageMotion } from "../components/cyber/ImageMotion";

const SUPPORT = [
  { title: "IT Strategy & Roadmapping", art: "bars", body: "Collaborate with your internal IT team to develop technology roadmaps, lifecycle plans, infrastructure strategies, and annual budgeting aligned with business goals." },
  { title: "Help Desk Augmentation", art: "circle", body: "Extend your support capabilities with Tier 1 and Tier 2 service desk coverage, ensuring users receive timely assistance while your team focuses on higher-value initiatives." },
  { title: "Security & Compliance", art: "squares", body: "Enhance your security posture with managed detection, endpoint protection, vulnerability management, and compliance support integrated with your existing IT operations." },
  { title: "After-Hours & On-Call Coverage", art: "ops", body: "Provide monitoring and support beyond standard business hours, ensuring critical systems remain protected when your internal team is unavailable." },
  { title: "Tools & Platforms", art: "grid", body: "Give your team access to enterprise-grade RMM, SIEM, endpoint management, automation, and reporting platforms without additional licensing complexity." },
  { title: "Specialized Technical Expertise", art: "docs", body: "Access experienced engineers across cloud, networking, cybersecurity, Microsoft technologies, and infrastructure whenever additional expertise is needed." },
];

const MODEL = [
  { title: "Ownership & Responsibilities", body: "A defined division of responsibility across support, infrastructure, security, monitoring, projects, and other agreed functions." },
  { title: "Service & Escalation", body: "Clear processes for managing service requests, technical issues, and escalation between Intrinsic and internal IT." },
  { title: "Integrated Tools & Processes", body: "Appropriate integration of service desk, monitoring, management, and reporting platforms with existing operations." },
  { title: "Documentation & Visibility", body: "Shared technical and operational information to support coordination and continuity across both teams." },
  { title: "Operational Reviews", body: "Recurring review of service performance, issues, priorities, and planned changes across the environment." },
];

const DISCIPLINES = ["Cybersecurity", "Cloud", "Networking", "Microsoft", "Infrastructure", "Compliance"];

const TeamsGraphic = () => (
  <svg viewBox="0 0 520 380" className="w-full h-auto" aria-hidden="true" data-testid="cm-teams-graphic">
    <rect x="30" y="60" width="290" height="260" fill={C.pale} className="cm-pane" style={{ "--i": 0 }} />
    <rect x="200" y="30" width="290" height="260" fill={C.navy} fillOpacity="0.92" className="cm-pane" style={{ "--i": 1 }} />
    <rect x="200" y="60" width="120" height="230" fill={C.royal} fillOpacity="0.85" className="cm-pane" style={{ "--i": 2 }} />
    <rect x="248" y="150" width="24" height="120" fill={C.gold} className="cm-pane cm-gold" style={{ "--i": 3 }} />
    <text x="56" y="300" className="cm-label" fill={C.navy}>YOUR INTERNAL IT TEAM</text>
    <text x="330" y="70" className="cm-label" fill="#fff" opacity="0.9">INTRINSIC</text>
    <text x="260" y="330" textAnchor="middle" className="cm-label" fill={C.navy}>ONE OPERATING MODEL</text>
    {[0, 1, 2].map((k) => <line key={k} x1="90" y1={120 + k * 34} x2="190" y2={120 + k * 34} stroke={C.navy} strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" strokeDasharray={k === 1 ? "60 40" : "100"} className="cm-line" style={{ "--i": k }} />)}
    {[0, 1, 2].map((k) => <line key={k} x1="340" y1={110 + k * 34} x2={430 - k * 20} y2={110 + k * 34} stroke="#fff" strokeOpacity="0.6" strokeWidth="6" strokeLinecap="round" className="cm-line" style={{ "--i": k + 3 }} />)}
  </svg>
);

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)]" style={{ background: "#eef1f8" }} data-testid="comanaged-hero">
    <div className="grid lg:grid-cols-2">
      <div className="px-5 sm:px-8 lg:pl-[max(2rem,calc((var(--vw)-1240px)/2+2rem))] lg:pr-14 py-12 lg:py-16 flex flex-col justify-center">
        <AiEyebrow className="animate-fade-up">Co-Managed IT</AiEyebrow>
        <h1 className="ai-h1 mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>Keep Your IT Team. <br />Add Ours.</h1>
        <p className="ai-p mt-7 max-w-[520px] animate-fade-up" style={{ animationDelay: "160ms" }}>Co-managed IT combines the knowledge of your internal IT team with the expertise, tools, and resources of Intrinsic. We extend your capabilities—not replace them—helping your team stay focused, secure, and prepared for what's next.</p>
        <div className="mt-9 animate-fade-up" style={{ animationDelay: "300ms" }}><GoldBtn testId="comanaged-hero-cta">Talk to Our Team</GoldBtn></div>
      </div>
      <div className="relative flex items-center justify-center py-8 lg:py-12 pr-5 sm:pr-8 lg:pr-10 animate-fade-in" style={{ animationDelay: "200ms", background: "#eef1f8" }} data-testid="comanaged-hero-visual">
        <ImageMotion src="/images/comanaged-hero-transparent.webp" alt="Your internal IT team and the Intrinsic team operating one connected environment of offices, servers, cloud and endpoints" className="w-[90%]" imgClassName="live-float" w={1625} h={1177} testId="comanaged-hero-image" pulseR={15}
          pulses={[[180, 664], [766, 830], [1424, 652], [1256, 778], [766, 339], [766, 607], [334, 779], [1106, 680], [766, 740], [1106, 527], [490, 266], [1121, 414]]}
          paths={[
            { d: "M766 320 L766 840", dur: 5 },
            { d: "M766 840 L766 320", dur: 5, delay: 2.5, r: 5 },
            { d: "M830 527 L1106 527", dur: 3.6, delay: 0.5 },
            { d: "M830 680 L1106 680", dur: 3.6, delay: 1.2 },
          ]} />
      </div>
    </div>
  </section>
);

const Strengthen = () => (
  <section className="ai-cream py-12 lg:py-16" data-testid="comanaged-strengthen">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-14">
      <Reveal className="lg:col-span-6"><AiEyebrow>Strengthening the Internal IT Function</AiEyebrow><h2 className="ai-h2 mt-6">Extend Capacity Without Replacing Internal Ownership</h2></Reveal>
      <Reveal delay={100} className="lg:col-span-6">
        <p className="ai-p">The responsibilities of an internal IT team extend well beyond day-to-day support. Infrastructure, cybersecurity, cloud platforms, user services, technology projects, lifecycle requirements, and strategic priorities all require time and increasingly specialized expertise.</p>
        <p className="ai-p mt-4">Intrinsic provides additional resources across these areas while your internal team retains its knowledge, relationships, and ownership of the environment.</p>
        <p className="ai-p mt-4">The model is structured around your existing IT function. We identify where additional capacity or expertise is required, define the responsibilities Intrinsic will assume, and establish how both teams will work together.</p>
        <p className="ai-p mt-4">This allows internal resources to remain focused on organizational priorities while providing broader technical and operational support across the environment.</p>
      </Reveal>
    </div>
  </section>
);

const Support = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="comanaged-support">
    <div className="container-x">
      <Reveal><AiEyebrow>How We Support Your IT Team</AiEyebrow><h2 className="ai-h2 mt-6">Capacity, Coverage, and Expertise</h2></Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-12 ai-divided">
        {SUPPORT.map((s, i) => (
          <Reveal key={s.title} delay={i * 70} className="ai-divided-cell" data-testid={`comanaged-support-${i}`}>
            <div className="flex items-start justify-between gap-4"><span className="ai-num">0{i + 1}</span><MiniArt kind={s.art} className="w-[92px] h-auto" /></div>
            <h3 className="ai-h3 mt-4">{s.title}</h3>
            <p className="ai-p-sm mt-3">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Model = () => (
  <section className="text-white py-12 lg:py-16" style={{ background: C.navy }} data-testid="comanaged-model">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-6">
        <AiEyebrow light>Clear Responsibilities. One Operating Model.</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">Defining How Both Teams Work Together</h2>
        <p className="ai-p text-white/90 mt-6">Co-managed IT is most effective when responsibilities are established from the outset.</p>
        <p className="ai-p text-white/90 mt-4">Intrinsic works with your internal IT team to define who owns each function, how issues move between teams, when escalation is required, and how information is shared.</p>
        <p className="ai-p text-white/90 mt-4">The result is a coordinated IT function with clear accountability across internal and Intrinsic resources.</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6">
        <p className="font-semibold text-[15px] text-white/90">The operating model establishes:</p>
        <ol className="mt-4 cm-olist" data-testid="comanaged-model-list">
          {MODEL.map((m, i) => (
            <li key={m.title} className="ai-olist-row cm-olist-row" style={{ "--i": i }}>
              <span className="ai-num text-[30px]">0{i + 1}</span>
              <div><p className="font-sans font-bold text-[16px] text-white">{m.title}</p><p className="text-white/80 text-[14.5px] leading-[1.55] mt-1">{m.body}</p></div>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  </section>
);

const Expertise = () => (
  <section className="bg-[#dbe7f5] py-12 lg:py-16" data-testid="comanaged-expertise">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
        <Reveal className="lg:col-span-6"><AiEyebrow>Access to Specialized Expertise</AiEyebrow><h2 className="ai-h2 mt-6">Broader Technical Depth Without Building Every Capability Internally</h2></Reveal>
        <Reveal delay={100} className="lg:col-span-6">
          <p className="ai-p">Modern technology environments require expertise across multiple technical disciplines. The level of specialization required in cybersecurity, cloud, networking, Microsoft technologies, infrastructure, and compliance may not justify maintaining dedicated internal resources in every area.</p>
          <p className="ai-p mt-4">A co-managed relationship provides the internal IT function with access to Intrinsic's broader engineering and technical resources as requirements arise.</p>
          <p className="ai-p mt-4">Specialists can support complex operational issues, infrastructure changes, security requirements, technology initiatives, and planning while working within the responsibilities and processes established for the engagement.</p>
          <p className="ai-p mt-4">This extends the technical depth available to the organization while preserving continuity and ownership within the internal IT function.</p>
        </Reveal>
      </div>
      <Reveal className="mt-14"><div className="ai-chips ai-chips--dark" data-testid="comanaged-disciplines">{DISCIPLINES.map((d, i) => <span key={d} className="ai-chip" style={{ "--i": i }}>{d}</span>)}</div></Reveal>
    </div>
  </section>
);

const Fit = () => (
  <section className="ai-sage text-white py-12 lg:py-16" data-testid="comanaged-fit">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-6">
        <AiEyebrow light>A Model That Fits Your IT Team</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">Define Where Intrinsic Adds Capacity</h2>
        <p className="ai-p mt-6">Co-managed IT should reflect the capabilities already established within the organization.</p>
        <p className="ai-p mt-4">Intrinsic begins by understanding your internal resources, existing responsibilities, technology environment, service requirements, and operational priorities.</p>
        <p className="ai-p mt-4">From there, responsibilities can be defined across the areas where additional support is required—whether that is service desk capacity, infrastructure management, engineering, cybersecurity, after-hours coverage, or strategic support.</p>
        <p className="ai-p mt-4">As requirements change, the model can be reviewed and adjusted to ensure the appropriate resources and expertise remain available to the internal IT function.</p>
      </Reveal>
      <Reveal delay={150} className="lg:col-span-6 hidden md:block"><TeamsGraphic /></Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="comanaged-cta">
    <div className="container-x grid lg:grid-cols-12 gap-10 items-center">
      <Reveal className="lg:col-span-6"><AiEyebrow>Extend Your IT Capabilities</AiEyebrow><h2 className="ai-h2 mt-6">Add Capacity, Coverage, and Technical Depth Where You Need It</h2></Reveal>
      <Reveal delay={100} className="lg:col-span-6">
        <p className="ai-p">We'll begin by understanding your current IT function, the responsibilities your team manages today, and where additional resources would strengthen the operation.</p>
        <p className="ai-p mt-4">From there, Intrinsic can define a co-managed model with clear responsibilities and the appropriate combination of operational support and specialist expertise.</p>
        <div className="mt-8"><GoldBtn testId="comanaged-cta-btn">Talk to Our Team</GoldBtn></div>
      </Reveal>
    </div>
  </section>
);

export default function CoManagedIT() {
  return (
    <div className="bg-white page-in" data-testid="comanaged-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Strengthen /><Support /><Model /><Expertise /><Fit /><CTA /></main>
      <Footer />
    </div>
  );
}
