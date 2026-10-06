import React from "react";
import { PenLine, BookOpen, FileSearch, Workflow, BarChart3, Bot } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { AiEyebrow, GoldBtn, NavyBtn, Mosaic, MiniArt, C } from "../components/ai/AiGraphics";
import { BlockMotion, ManagedLettersMotion } from "../components/ai/GovernanceMotion";
import { StagesMotion } from "../components/ai/AiMotion";

const CAPS = [
  { title: "AI Platforms & Copilot", art: "grid", body: "Deploy and manage Microsoft Copilot and other approved AI platforms, including licensing, configuration, access, integrations, and platform changes." },
  { title: "AI Application Management", art: "squares", body: "Evaluate and manage approved AI-enabled applications, including configuration, access, integrations, security requirements, and ongoing administration." },
  { title: "Business Workflows & Automation", art: "flow", body: "Identify defined processes where AI and automation can reduce repetitive work, improve access to information, or support more efficient execution." },
  { title: "Data, Identity & Access", art: "bars", body: "Manage the information and access environment AI depends on, including identity, permissions, data structure, sharing, and connections to business systems." },
  { title: "User Enablement & Adoption", art: "circle", body: "Support the introduction of approved AI capabilities with appropriate access, configuration, guidance, and ongoing user support." },
  { title: "AI Operations & Management", art: "ops", body: "Maintain AI platforms and applications as capabilities evolve, including configuration, integrations, security controls, licensing, and operational requirements." },
];

const USES = [
  { Icon: PenLine, title: "Employee Productivity", body: "Support everyday work such as drafting, summarizing, researching, preparing information, and working more effectively within existing applications." },
  { Icon: BookOpen, title: "Knowledge & Information", body: "Improve access to organizational knowledge by helping users find, understand, and work with information across approved business sources." },
  { Icon: FileSearch, title: "Document-Intensive Processes", body: "Use AI to assist with reviewing, extracting, organizing, summarizing, and preparing information across document-heavy workflows." },
  { Icon: Workflow, title: "Business Workflows", body: "Introduce AI into defined processes where repetitive steps, information handling, or manual activity can be reduced or streamlined." },
  { Icon: BarChart3, title: "Operational Analysis", body: "Use AI-assisted analysis to identify patterns, consolidate information, and provide greater context across operational data and activity." },
  { Icon: Bot, title: "Defined Automation", body: "Connect AI with applications and workflows to carry out specific activities within established permissions, controls, and business rules." },
];

const Hero = () => (
  <section className="relative overflow-hidden pt-[var(--nav-h)] text-white" style={{ background: C.navy }} data-testid="mai-hero">
    <div className="grid lg:grid-cols-2">
      <div className="px-5 sm:px-8 lg:pl-[max(2rem,calc((var(--vw)-1240px)/2+2rem))] lg:pr-14 py-12 lg:py-16 flex flex-col justify-center">
        <AiEyebrow light className="animate-fade-up">Managed AI</AiEyebrow>
        <h1 className="ai-h1 text-white mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>AI That Is Managed, <br />Not Just Deployed</h1>
        <p className="ai-p text-white/90 mt-7 max-w-[520px] animate-fade-up" style={{ animationDelay: "160ms" }}>AI is becoming part of the applications, information, and workflows organizations already rely on.</p>
        <p className="ai-p text-white/90 mt-4 max-w-[520px] animate-fade-up" style={{ animationDelay: "200ms" }}>Intrinsic helps organizations introduce and manage AI within their existing technology environment—from Microsoft Copilot and AI-enabled applications to business workflows, information access, security, and ongoing administration.</p>
        <div className="mt-9 animate-fade-up" style={{ animationDelay: "300ms" }}><GoldBtn testId="mai-hero-cta">Talk to Our Team</GoldBtn></div>
      </div>
      <div className="relative min-h-[360px] lg:min-h-full" data-testid="mai-hero-visual">
        <ManagedLettersMotion className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  </section>
);

const Structure = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="mai-structure">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-14">
      <Reveal className="lg:col-span-6"><AiEyebrow>From Adoption to Operation</AiEyebrow><h2 className="ai-h2 mt-6">Bringing Structure to AI Across the Business</h2></Reveal>
      <Reveal delay={100} className="lg:col-span-6">
        <p className="ai-p">Introducing AI involves more than providing access to a new application. Organizations need to determine where AI belongs, how it connects to existing systems and information, who should have access, and how it will be managed over time.</p>
        <p className="ai-p mt-4">Intrinsic brings these considerations together within a structured operating model—helping organizations move from individual AI tools and experimentation to capabilities that can be supported, secured, and managed as part of the broader technology environment.</p>
      </Reveal>
    </div>
    <div className="container-x mt-10"><Reveal><StagesMotion stages={["Adopt", "Connect", "Secure", "Operate"]} className="w-full max-w-[880px] mx-auto h-auto" /></Reveal></div>
  </section>
);

const Capabilities = () => (
  <section className="ai-cream py-12 lg:py-16" data-testid="mai-capabilities">
    <div className="container-x">
      <Reveal><AiEyebrow>Managed AI Capabilities</AiEyebrow><h2 className="ai-h2 mt-6">Managing the Technology <br />Around AI</h2></Reveal>
      <div className="grid md:grid-cols-2 mt-12 ai-divided">
        {CAPS.map((c, i) => (
          <Reveal key={c.title} delay={i * 70} className="ai-divided-cell">
            <div className="grid grid-cols-[44px_1fr] sm:grid-cols-[52px_1fr_130px] md:grid-cols-[44px_1fr] lg:grid-cols-[52px_1fr_130px] gap-5 items-start">
              <span className="ai-num">0{i + 1}</span>
              <div><h3 className="ai-h3">{c.title}</h3><p className="ai-p-sm mt-3">{c.body}</p></div>
              <MiniArt kind={c.art} className="hidden sm:block md:hidden lg:block w-full h-auto" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Copilot = () => (
  <section className="bg-[#dbe7f5] py-12 lg:py-16 overflow-hidden" data-testid="mai-copilot">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <Reveal className="lg:col-span-6">
        <AiEyebrow>Microsoft Copilot</AiEyebrow>
        <h2 className="ai-h2 mt-6">Extending <br />Microsoft 365 With AI</h2>
        <p className="ai-p mt-6">Microsoft Copilot introduces AI directly into the applications and information employees already use across Microsoft 365.</p>
        <p className="ai-p mt-4">Intrinsic helps organizations prepare the underlying Microsoft environment before deployment—reviewing licensing, identity, permissions, information access, sharing, and security controls that can influence how Copilot operates.</p>
        <p className="ai-p mt-4">Following deployment, we provide ongoing administration and support as users, information, licensing, and Microsoft capabilities change.</p>
        <p className="ai-steps mt-8" data-testid="mai-copilot-steps">{["Prepare", "Configure", "Deploy", "Manage"].map((s, i) => <span key={s} style={{ "--i": i }}>{s}</span>)}</p>
        <div className="mt-8"><GoldBtn to="/services/microsoft-365" testId="mai-copilot-cta">Explore Microsoft 365 &amp; Copilot</GoldBtn></div>
      </Reveal>
      <Reveal delay={150} className="lg:col-span-6 hidden md:block"><Mosaic variant="copilot" className="w-full h-[380px] lg:h-[440px] lg:scale-[1.15]" /></Reveal>
    </div>
  </section>
);

const Uses = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="mai-uses">
    <div className="container-x">
      <Reveal>
        <AiEyebrow>AI Applications &amp; Business Workflows</AiEyebrow>
        <h2 className="ai-h2 mt-6">Applying AI Where It Has a Defined Role</h2>
        <p className="ai-p mt-6 max-w-[900px]">AI can support specific areas of work where information needs to be found, reviewed, summarized, created, or moved through a defined process. Intrinsic works with organizations to identify practical applications for AI and determine how they should connect with existing systems, information, and workflows.</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-12 ai-divided">
        {USES.map((u, i) => (
          <Reveal key={u.title} delay={i * 70} className="ai-divided-cell gi-item">
            <div className="flex gap-5">
              <span className="ai-icon-tile"><span className="gi-icon" style={{ "--i": i }}><u.Icon size={22} strokeWidth={1.7} /></span></span>
              <div><h3 className="ai-h3 text-[16px]">{u.title}</h3><p className="ai-p-sm mt-2.5">{u.body}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Ongoing = () => (
  <section className="ai-moss text-white py-12 lg:py-16 overflow-hidden relative" data-testid="mai-ongoing">
    <Mosaic variant="ongoing" className="absolute right-0 top-0 h-full w-[40%] hidden lg:block" />
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-10">
      <Reveal className="lg:col-span-7 xl:col-span-7 lg:pr-6">
        <AiEyebrow light>Ongoing AI Management</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">Managing a Capability <br />That Continues to Change</h2>
        <p className="ai-p text-white/90 mt-6">AI platforms and applications will continue to evolve. New capabilities will appear within existing software, integrations will change, licensing will develop, and new business use cases will emerge.</p>
        <p className="ai-p text-white/90 mt-4">Intrinsic provides ongoing technical oversight across approved AI platforms and applications—managing configuration, access, integrations, security requirements, platform changes, and issues requiring attention.</p>
        <p className="ai-p text-white/90 mt-4">This provides continuity between the initial introduction of AI and its ongoing operation within the business.</p>
        <div className="mt-8"><GoldBtn testId="mai-ongoing-cta">Talk to Our Team</GoldBtn></div>
      </Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative overflow-hidden text-white py-12 lg:py-16" style={{ background: C.navy }} data-testid="mai-cta">
    <div className="absolute right-0 top-0 h-full w-[36%] hidden lg:block"><BlockMotion className="w-full h-full" /></div>
    <div className="container-x relative z-10">
      <Reveal className="max-w-[760px] lg:max-w-[60%] xl:max-w-[760px]">
        <AiEyebrow light>AI That Continues to Work for the Business</AiEyebrow>
        <h2 className="ai-h2 text-white mt-6">A Structured Approach to AI Adoption</h2>
        <p className="ai-p text-white/90 mt-6">Intrinsic provides the technical structure and ongoing management required to make AI a supported part of the technology environment.</p>
        <div className="flex flex-wrap gap-4 mt-8">
          <GoldBtn testId="mai-cta-talk">Talk to Our Team</GoldBtn>
          <GoldBtn to="/services/ai-readiness-assessment" testId="mai-cta-assess">Start with an AI Readiness Assessment</GoldBtn>
        </div>
      </Reveal>
    </div>
  </section>
);

export default function ManagedAi() {
  return (
    <div className="bg-white page-in" data-testid="managed-ai-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Structure /><Capabilities /><Copilot /><Uses /><Ongoing /><CTA /></main>
      <Footer />
    </div>
  );
}
