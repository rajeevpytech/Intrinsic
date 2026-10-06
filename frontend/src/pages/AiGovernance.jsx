import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { AiEyebrow, GoldBtn, NavyBtn, MiniArt, C } from "../components/ai/AiGraphics";
import { BlockMotion, FrameworkMotion, VisibilityMotion, CycleMotion } from "../components/ai/GovernanceMotion";

const QUESTIONS = [
  { q: "What can we use?", art: "grid", body: "Define approved AI platforms, applications, capabilities, and integrations." },
  { q: "Who can use it?", art: "circle", body: "Establish appropriate users, roles, authentication, permissions, and privileged access." },
  { q: "What can it access?", art: "docs", body: "Determine how AI can interact with business information, sensitive data, documents, applications, and connected systems." },
  { q: "What can we use it for?", art: "flow", body: "Define acceptable use, approved business purposes, limitations, and activities requiring additional review." },
  { q: "What controls apply?", art: "squares", body: "Establish security, privacy, information handling, retention, and other organizational requirements appropriate to the use." },
  { q: "Who is accountable?", art: "ops", body: "Define ownership for approval, administration, documentation, monitoring, review, and escalation." },
];

const CONSIDER = ["Business purpose", "Information involved", "Users and access", "System integrations", "Third-party platforms", "Security exposure", "Potential impact"];

const ALIGN = [
  { t: "Security", art: "bars", body: "AI policies and technical controls aligned with existing security requirements." },
  { t: "Privacy & Information", art: "docs", body: "Information handling, retention, and privacy obligations applied to AI use." },
  { t: "Risk Management", art: "circle", body: "Informed by established frameworks, including the NIST AI Risk Management Framework." },
  { t: "Regulatory Compliance", art: "ops", body: "Documentation and oversight connected to the broader compliance program." },
];

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)] text-white" style={{ background: C.navy }} data-testid="aig-hero">
    <div className="grid lg:grid-cols-2">
      <div className="px-5 sm:px-8 lg:pl-[max(2rem,calc((var(--vw)-1240px)/2+2rem))] lg:pr-14 py-12 lg:py-16 flex flex-col justify-center">
        <AiEyebrow light className="animate-fade-up">AI Governance</AiEyebrow>
        <h1 className="ai-h1 text-white mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>Turning AI Opportunity Into Responsible Growth</h1>
        <p className="ai-p text-white/90 mt-7 max-w-[520px] animate-fade-up" style={{ animationDelay: "160ms" }}>AI can create significant value—but it also introduces new risks, decisions, and responsibilities. Intrinsic helps organizations establish the governance, policies, and controls needed to use AI confidently and effectively within their business environment.</p>
        <div className="mt-9 animate-fade-up" style={{ animationDelay: "300ms" }}><GoldBtn testId="aig-hero-cta">Talk to Our Team</GoldBtn></div>
      </div>
      <div className="relative min-h-[320px] lg:min-h-full" data-testid="aig-hero-visual">
        <BlockMotion className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  </section>
);

const Foundation = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="aig-foundation">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-6">
        <AiEyebrow>The Governance Foundation</AiEyebrow>
        <h2 className="ai-h2 mt-6">From Individual Use to Organizational Control</h2>
        <p className="ai-p mt-6">AI adoption can begin in many places—an employee using a public AI service, a new capability appearing within an existing application, or a department introducing a specialized platform.</p>
        <p className="ai-p mt-4">Without a defined governance structure, these activities can develop independently, creating limited visibility into the applications being used, information being accessed, and controls being applied.</p>
        <p className="ai-p mt-4">Intrinsic helps organizations establish a common framework for AI use, bringing together policy, ownership, technical controls, documentation, and oversight.</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6"><FrameworkMotion className="h-[300px] lg:h-[440px]" /></Reveal>
    </div>
  </section>
);

const Visibility = () => (
  <section className="bg-[#eef3fa] py-12 lg:py-16 overflow-hidden" data-testid="aig-visibility">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-6">
        <AiEyebrow>AI Visibility</AiEyebrow>
        <h2 className="ai-h2 mt-6">Understanding Where AI Is Being Used</h2>
        <p className="ai-p mt-6">Effective governance begins with visibility.</p>
        <p className="ai-p mt-4">Intrinsic helps organizations develop a clearer view of the AI capabilities operating across the business—including approved platforms, AI functionality embedded within existing applications, third-party services, integrations, users, and information access.</p>
        <p className="ai-p mt-4">This provides a basis for identifying areas requiring additional review, establishing appropriate controls, and maintaining a more complete view as AI use expands.</p>
      </Reveal>
      <Reveal delay={150} className="lg:col-span-6 lg:pl-8"><VisibilityMotion /></Reveal>
    </div>
  </section>
);

const Questions = () => (
  <section className="bg-[#dbe7f5] py-12 lg:py-16" data-testid="aig-questions">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-end">
        <Reveal className="lg:col-span-7"><AiEyebrow>Six Questions Governance Should Answer</AiEyebrow><h2 className="ai-h2 mt-6">A Defined Framework <br />for AI Use</h2></Reveal>
        <Reveal delay={100} className="lg:col-span-5"><p className="ai-p-sm text-[#2e3745]">A common framework brings together policy, ownership, technical controls, documentation, and oversight—answering the questions that determine how AI is selected, used, and managed.</p></Reveal>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-12 ai-divided">
        {QUESTIONS.map((q, i) => (
          <Reveal key={q.q} delay={i * 70} className="ai-divided-cell">
            <MiniArt kind={q.art} className="w-[92px] h-auto" />
            <h3 className="ai-h3 mt-6">{q.q}</h3>
            <p className="ai-p-sm mt-3">{q.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Review = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="aig-review">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-7">
        <AiEyebrow>AI Risk &amp; Use-Case Review</AiEyebrow>
        <h2 className="ai-h2 mt-6">Applying the Right Controls to the Right Use</h2>
        <p className="ai-p mt-6">Different uses of AI introduce different considerations.</p>
        <p className="ai-p mt-4">An employee using an approved productivity assistant to summarize internal information does not present the same requirements as an AI-enabled workflow processing sensitive data, connecting to business systems, or supporting a consequential business process.</p>
        <p className="ai-p mt-4">The objective is to determine the level of control and oversight appropriate to the use case rather than applying the same requirements to every AI capability.</p>
        <p className="ai-p mt-4">Third-party AI services are considered as part of this process, including how organizational information is handled, what systems are connected, and what access the application requires.</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-5">
        <p className="text-[#1f3f8f] font-semibold text-[15px]">Intrinsic helps organizations evaluate AI use cases in context, considering:</p>
        <ol className="mt-6" data-testid="aig-considerations">
          {CONSIDER.map((c, i) => (
            <li key={c} className="ai-olist-row" style={{ "--i": i }}><span className="ai-num text-[30px]">0{i + 1}</span><span className="ai-h3 text-[16px]">{c}</span></li>
          ))}
        </ol>
      </Reveal>
    </div>
  </section>
);

const Alignment = () => (
  <section className="bg-[#eef3fa] py-12 lg:py-16" data-testid="aig-alignment">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-5">
        <AiEyebrow>Governance &amp; Compliance Alignment</AiEyebrow>
        <h2 className="ai-h2 mt-6">Connecting AI to Existing Organizational Requirements</h2>
        <p className="ai-p mt-6">AI introduces new capabilities, but it does not replace existing responsibilities for security, privacy, information management, risk, and regulatory compliance.</p>
        <p className="ai-p mt-4">Intrinsic helps organizations incorporate AI into their broader governance structure by aligning AI policies, technical controls, documentation, and oversight with existing organizational requirements.</p>
        <p className="ai-p mt-4">Where appropriate, AI governance can also be informed by established and emerging frameworks, including the NIST AI Risk Management Framework, while remaining aligned with the organization's broader security and compliance program.</p>
        <div className="mt-8"><GoldBtn to="/services/security-governance-compliance" testId="aig-gov-link">Explore Governance &amp; Compliance</GoldBtn></div>
      </Reveal>
      <div className="lg:col-span-7 grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 ai-divided" data-testid="aig-align-grid">
        {ALIGN.map((a, i) => (
          <Reveal key={a.t} delay={i * 90} className="ai-divided-cell flex gap-5 items-start">
            <MiniArt kind={a.art} className="w-[72px] h-auto shrink-0" />
            <div><h3 className="ai-h3 text-[16px]">{a.t}</h3><p className="ai-p-sm mt-2">{a.body}</p></div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Ongoing = () => (
  <section className="ai-sage text-white py-12 lg:py-16" data-testid="aig-ongoing">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-4 flex justify-center lg:justify-start"><CycleMotion className="w-[299px] sm:w-[345px] h-auto" /></Reveal>
      <Reveal delay={100} className="lg:col-span-8">
        <AiEyebrow light>Ongoing Governance</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">Maintaining Control as AI Evolves</h2>
        <p className="ai-p text-white/90 mt-6">AI governance needs to evolve alongside the technology.</p>
        <p className="ai-p text-white/90 mt-4">New applications, embedded AI capabilities, integrations, use cases, and regulatory expectations can change the organization's risk profile and introduce new requirements.</p>
        <p className="ai-p text-white/90 mt-4">Intrinsic provides ongoing review to help organizations evaluate these changes, maintain policies and controls, document material decisions, and identify matters requiring technical or leadership attention.</p>
      </Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative overflow-hidden text-white py-12 lg:py-16" style={{ background: C.navy }} data-testid="aig-cta">
    <div className="absolute right-0 top-0 h-full w-[36%] hidden lg:block"><BlockMotion className="w-full h-full" /></div>
    <div className="container-x relative z-10">
      <Reveal className="max-w-[760px] lg:max-w-[60%] xl:max-w-[760px]">
        <AiEyebrow light>Take the Next Step</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">Enable AI. Maintain Control.</h2>
        <p className="ai-p text-white/90 mt-6 max-w-[760px]">A defined governance structure allows organizations to pursue appropriate uses of AI <br className="hidden lg:block" />while maintaining visibility into information, access, security, risk, and responsibility.</p>
        <div className="mt-8"><GoldBtn testId="aig-cta-btn">Talk to Our Team</GoldBtn></div>
      </Reveal>
    </div>
  </section>
);

export default function AiGovernance() {
  return (
    <div className="bg-white page-in" data-testid="ai-governance-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Foundation /><Visibility /><Questions /><Review /><Alignment /><Ongoing /><CTA /></main>
      <Footer />
    </div>
  );
}
