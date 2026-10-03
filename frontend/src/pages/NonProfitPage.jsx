import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { H2 } from "../components/industry/IndustrySections";
import { ImageMotion } from "../components/cyber/ImageMotion";

const BLUE = "#1e3f9e", INK = "#2f4a8f", AMBER = "#f2a91c";
const light = (extra = {}) => ({ "--type-eyebrow-ink": BLUE, "--type-hero-ink": BLUE, "--type-section-ink": BLUE, "--type-body-ink": INK, "--type-small-ink": INK, "--type-subheading-ink": BLUE, "--type-section-desktop": 32, ...extra });
const dark = (extra = {}) => ({ "--type-eyebrow-ink": "#ffffff", "--type-section-ink": "#ffffff", "--type-body-ink": "#e3efea", "--type-small-ink": "#e3efea", "--type-section-desktop": 32, ...extra });

const Kicker = ({ children, testId }) => <p className="eyebrow eyebrow-line mb-4" data-testid={testId}>{children}</p>;
const FlatBtn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="btn-amber">
    <span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);
const Copy = ({ children, className = "" }) => <p className={`text-[15px] leading-[1.6] ${className}`}>{children}</p>;
const Art = ({ src, alt, testId, max = 640, w, h, className = "" }) => (
  <img src={src} alt={alt} className={`w-full h-auto ${className}`} style={{ maxWidth: max }} width={w} height={h} data-testid={testId} />
);
const COLS = { 5: "lg:col-span-5", 6: "lg:col-span-6", 7: "lg:col-span-7" };

const Split = ({ id, bg, tone = light, eyebrow, title, children, art, extra = {}, textCol = 6, artCol = 6 }) => (
  <section className="py-12 lg:py-16" style={{ background: bg, ...tone(extra) }} data-testid={id}>
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <Reveal className={COLS[textCol]}>
        <Kicker testId={`${id}-eyebrow`}>{eyebrow}</Kicker>
        <H2 className={tone === dark ? "text-white" : ""}>{title}</H2>
        {children}
      </Reveal>
      <Reveal delay={120} className={`${COLS[artCol]} flex justify-end`}>{art}</Reveal>
    </div>
  </section>
);

const Stack = ({ id, bg, tone = light, eyebrow, title, children, art, note, extra = {} }) => (
  <section className="py-12 lg:py-16" style={{ background: bg, ...tone(extra) }} data-testid={id}>
    <div className="container-x">
      <Reveal className="max-w-[900px]">
        <Kicker testId={`${id}-eyebrow`}>{eyebrow}</Kicker>
        <H2>{title}</H2>
        {children}
      </Reveal>
      <Reveal delay={120} className="mt-8 flex justify-center">{art}</Reveal>
      {note && <Reveal delay={180}><p className="text-[13px] leading-[1.6] text-center mt-6 max-w-[900px] mx-auto" style={{ color: INK }} data-testid={`${id}-note`}>{note}</p></Reveal>}
    </div>
  </section>
);

const Hero = () => (
  <section className="pt-[var(--nav-h)]" style={{ background: "#e3f5f1", ...light({ "--type-hero-desktop": 36, "--type-hero-tablet": 32 }) }} data-testid="np-hero">
    <div className="container-x pt-12 lg:pt-14 pb-10 lg:pb-12 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
      <div className="lg:col-span-5">
        <Kicker testId="np-hero-eyebrow">Non-Profit Organizations</Kicker>
        <h1 className="font-serif leading-[1.12] animate-fade-up" data-testid="np-hero-title">Technology Management<br className="hidden lg:inline" /> for Non-Profit Organizations</h1>
        <Copy className="mt-5 animate-fade-up">Reliable technology, stronger information protection, and clear oversight for the people and programs advancing your mission.</Copy>
        <Copy className="mt-4 animate-fade-up">Intrinsic brings managed IT, cybersecurity, cloud, governance, and strategic guidance together in one accountable technology relationship.</Copy>
        <div className="mt-7 animate-fade-up"><FlatBtn testId="np-hero-cta">Talk to Our Team</FlatBtn></div>
      </div>
      <div className="lg:col-span-7 flex justify-end animate-fade-in">
        <Art src="/images/np-hero.png" alt="Programs, fundraising, people, operations and information connected — a stronger mission through technology" testId="np-mission-hub" max={680} w={1260} h={668} className="hero-wipe" />
      </div>
    </div>
  </section>
);

const Environment = () => (
  <Split id="np-environment" bg="#fefeff" eyebrow="The Non-Profit Technology Environment" title={<>Supporting Programs,<br className="hidden lg:inline" /> People, and Operations.</>} textCol={5} artCol={7}
    art={<Art src="/images/np-ecosystem.png" alt="Donor and fundraising platforms, program databases, financial applications, volunteer management, Microsoft 365, Google Workspace and cloud services connected through the cloud" testId="np-systems" max={680} w={1361} h={659} />}>
    <Copy className="mt-5">Non-profit organizations rely on a connected ecosystem of technology to manage donor relationships, deliver programs, support volunteers, maintain financial operations and enable collaboration across teams and partners. We help bring these systems together so your organization can operate more efficiently and focus on advancing your mission.</Copy>
  </Split>
);

const Managed = () => (
  <Split id="np-managed" bg="#e5f4f1" eyebrow="Managed Technology & Support" title={<>Reliable Technology for the<br className="hidden lg:inline" /> People Doing the Work</>} textCol={6} artCol={6}
    art={<Art src="/images/np-support.png" alt="Support, people and devices connected above an organization's building" testId="np-managed-grid" max={440} w={1305} h={984} />}>
    <Copy className="mt-5">Your team needs technology that works — and a responsive partner who understands how non-profits operate.</Copy>
    <Copy className="mt-4">Intrinsic provides managed IT and ongoing support to keep your systems secure, reliable, and ready for what's next.</Copy>
    <Copy className="mt-4">We help you reduce disruption, improve productivity, and get the most from the tools your team uses every day.</Copy>
    <Copy className="mt-4">From day-to-day support to long-term planning, we deliver practical solutions that help your people do more for your mission.</Copy>
  </Split>
);

const Security = () => (
  <Split id="np-security" bg="#24675d" tone={dark} eyebrow="Information Protection & Governance" title={<>Protecting Information and<br className="hidden lg:inline" /> Managing Responsibility</>} textCol={6} artCol={6}
    art={<Art src="/images/np-protect.png" alt="Protect access, secure systems, monitor activity, maintain oversight" testId="np-security-chips" max={600} w={1368} h={365} />}>
    <Copy className="mt-5">Non-profits handle sensitive information about the people they serve, their supporters, and their teams. Protecting this information is essential to maintaining trust and fulfilling your mission.</Copy>
    <Copy className="mt-4">Intrinsic helps you strengthen security, manage risk, and meet compliance requirements through practical, right-sized governance and security solutions. We provide day-to-day guidance and tools to help your organization operate securely.</Copy>
  </Split>
);

const Cloud = () => (
  <Stack id="np-cloud" bg="#fefeff" eyebrow="Cloud, Data & Continuity" title="Connecting the Systems Behind Your Mission"
    art={<Art src="/images/np-cloud.png" alt="Cloud and collaboration, system integration, data and reporting, backup and recovery" testId="np-cloud-cards" max={1176} w={1400} h={235} />}>
    <Copy className="mt-5">Your organization depends on a connected ecosystem of cloud services, data, and applications to serve your community. Intrinsic helps you design, implement, and manage a modern, secure environment that keeps your information accessible, protected, and ready for what's next.</Copy>
  </Stack>
);

const Model = () => (
  <Stack id="np-planning" bg="#e0f2fe" eyebrow="One Accountable Technology Relationship" title="From Immediate Priorities to Ongoing Improvement"
    art={<ImageMotion src="/images/np-model.png" alt="Understand, stabilize, manage, improve" testId="np-steps" max={1176} className="w-full" w={1395} h={206} paths={[{ d: "M120 60 L1275 60", dur: 7, r: 3 }]} />}
    note="This approach helps you build a stronger, more resilient technology environment that supports your mission today and grows with you tomorrow.">
    <Copy className="mt-5">Intrinsic follows a structured operating model from the beginning of the relationship through ongoing service delivery.</Copy>
  </Stack>
);

const Why = () => (
  <Split id="np-why" bg="#dbf0eb" eyebrow="Non-Profit Experience" title={<>Your Organization Defines<br className="hidden lg:inline" /> the Requirements</>} textCol={6} artCol={6}
    art={<Art src="/images/np-skyline.png" alt="Community skyline with trees" testId="np-why-image" max={600} w={1385} h={597} />}>
    <Copy className="mt-5">Every non-profit is unique. Your programs, communities, funding models, and operating requirements all shape your technology needs.</Copy>
    <Copy className="mt-4">Intrinsic takes the time to understand your environment and goals, then delivers right-sized solutions that support your mission and set you up for long-term success.</Copy>
  </Split>
);

const CTA = () => (
  <section className="py-12 lg:py-16" style={{ background: "#216357", ...dark({ "--type-section-desktop": 30, "--type-section-tablet": 28 }) }} data-testid="np-cta">
    <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <Reveal className="lg:col-span-7">
        <Kicker testId="np-cta-eyebrow">Technology Aligned with Your Mission</Kicker>
        <H2 className="text-white">Start With the Environment You Have Today.</H2>
        <Copy className="mt-4">Let's talk about your organization's goals, challenges and opportunities, and how we can help you build a more secure, connected and effective technology environment.</Copy>
        <div className="mt-6"><FlatBtn testId="np-cta-btn">Talk to Our Team</FlatBtn></div>
      </Reveal>
      <Reveal delay={120} className="hidden lg:flex lg:col-span-5 justify-end">
        <Art src="/images/np-cta.png" alt="Technology supports people, people advance possibilities" testId="np-cta-image" max={560} w={1329} h={429} />
      </Reveal>
    </div>
  </section>
);

export default function NonProfitPage() {
  return (
    <div className="page-in min-h-screen bg-white" data-testid="industry-page-non-profit">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Environment /><Managed /><Security /><Cloud /><Model /><Why /><CTA /></main>
      <Footer />
    </div>
  );
}
