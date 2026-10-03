import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Cross, HeartHandshake, Building2, Construction, ShieldCheck, ScrollText, Server, RefreshCw, Settings } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { H2 } from "../components/industry/IndustrySections";
import { P } from "../components/industry/DiagramKit";


const INDUSTRIES = [
  { Icon: Landmark, t: "Financial Services", s: "Secure, governed technology supporting sensitive information, regulated operations, business continuity, and ongoing oversight.", to: "/industries/financial-services" },
  { Icon: Cross, t: "Healthcare", s: "Reliable technology supporting clinical and administrative operations, patient-information protection, security governance, and continuity of care.", to: "/industries/healthcare" },
  { Icon: HeartHandshake, t: "Non-Profit", s: "Practical technology supporting programs, fundraising, administration, employees, volunteers, and the delivery of your mission.", to: "/industries/non-profit" },
  { Icon: Building2, t: "Professional Services", s: "Connected, secure technology supporting client delivery, confidential information, collaboration, and distributed teams.", to: "/industries/professional-services" },
  { Icon: Construction, t: "Construction", s: "Consistent connectivity, access, security, and support across offices, project sites, field teams, and temporary locations.", to: "/industries/construction" },
];
const CONTEXT = [
  { Icon: ShieldCheck, t: "Security & Access", s: "Controls aligned with information sensitivity, user responsibilities, access requirements, and organizational risk." },
  { Icon: ScrollText, t: "Governance & Compliance", s: "Policies, controls, documentation, and oversight aligned with regulatory, contractual, and organizational requirements." },
  { Icon: Server, t: "Infrastructure & Connectivity", s: "Infrastructure designed around locations, applications, users, performance requirements, and operating models." },
  { Icon: RefreshCw, t: "Business Continuity", s: "Recovery strategies aligned with critical systems, information requirements, and the operational impact of disruption." },
  { Icon: Settings, t: "Ongoing Management", s: "Technology reviewed and maintained as systems, risks, business priorities, and regulatory obligations evolve." },
];

const HERO_BG = "#d5ebe3", HERO_BLUE = "#0a15ba", HERO_INK = "#2450ae", AMBER = "#feb94f";

const Kicker = ({ children, color, testId }) => (
  <>
    <p className="eyebrow" style={{ color }} data-testid={testId}>{children}</p>
    <span className="block w-[42px] h-[2px] mt-2 mb-5" style={{ background: AMBER }} />
  </>
);
const FlatBtn = ({ children, testId }) => (
  <button type="button" data-contact-trigger data-testid={testId} className="btn-amber">
    <span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);

const Hero = () => (
  <section className="pt-[var(--nav-h)]" style={{ background: HERO_BG, "--type-hero-ink": HERO_BLUE, "--type-eyebrow-ink": HERO_BLUE, "--type-body-ink": HERO_INK, "--type-hero-desktop": 42, "--type-hero-tablet": 38 }} data-testid="industries-hero">
    <div className="container-x pt-10 lg:pt-14 pb-10 lg:pb-12 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
      <div className="lg:col-span-5">
        <Kicker color={HERO_BLUE} testId="industries-hero-eyebrow">Industries</Kicker>
        <h1 className="font-serif text-[36px] sm:text-[42px] lg:text-[44px] leading-[1.1] animate-fade-up" style={{ color: HERO_BLUE }} data-testid="industries-hero-title">Technology Management<br className="hidden lg:inline" /> Shaped by the Way<br className="hidden lg:inline" /> You Operate</h1>
        <p className="mt-5 text-[15px] leading-[1.55] animate-fade-up" style={{ color: HERO_INK }} data-testid="industries-hero-copy-1">Every organization operates within a distinct combination of systems, information, users, locations, risks, and regulatory requirements. These factors influence how technology should be managed, secured, governed, and maintained.</p>
        <p className="mt-4 text-[15px] leading-[1.55] animate-fade-up" style={{ color: HERO_INK }} data-testid="industries-hero-copy-2">Intrinsic brings industry experience to managed IT, cybersecurity, cloud, governance, and business continuity—while building each technology environment around the organization itself.</p>
        <div className="mt-7 animate-fade-up"><FlatBtn testId="industries-hero-cta">Talk to Our Team</FlatBtn></div>
      </div>
      <div className="lg:col-span-7 flex justify-center lg:justify-end animate-fade-in">
        <img src="/images/industries-hero-transparent.webp" alt="Financial services, healthcare, construction, professional services and non-profit buildings connected to technology for a stronger tomorrow" className="w-full max-w-[600px] h-auto" width="1024" height="753" data-testid="industries-hero-illustration" />
      </div>
    </div>
  </section>
);

const SERVE_BLUE = "#0000ad", SERVE_INK = "#3c57ae";
const ICONS = ["industry-financial", "industry-healthcare", "industry-nonprofit", "industry-professional", "industry-construction"];

const Serve = () => (
  <section className="bg-white py-12 lg:py-16" style={{ "--type-eyebrow-ink": SERVE_BLUE, "--type-section-ink": SERVE_BLUE, "--type-subheading-ink": SERVE_BLUE, "--type-small-ink": SERVE_INK, "--type-body-ink": SERVE_INK, "--type-subheading-mobile": 11, "--type-subheading-tablet": 11, "--type-subheading-desktop": 11.5, "--type-subheading-letterSpacing": 0.1 }} data-testid="industries-serve">
    <div className="container-x">
      <Reveal>
        <Kicker color={SERVE_BLUE} testId="industries-serve-eyebrow">Industries We Serve</Kicker>
        <H2>Experience Across Distinct Operating Environments</H2>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-5 mt-10 gap-y-10 lg:gap-y-0 lg:divide-x lg:divide-[#d9e9e7]" data-testid="industries-list">
        {INDUSTRIES.map(({ t, s, to }, i) => (
          <Reveal key={t} delay={i * 70} className="px-4 lg:first:pl-0 lg:last:pr-0 flex flex-col" data-testid={`industries-item-${i}`}>
            <span className="h-[100px] flex items-end"><img src={`/images/${ICONS[i]}.png`} alt="" className="h-[100px] w-auto" data-testid={`industries-icon-${i}`} /></span>
            <h3 className="font-sans text-[11px] font-bold tracking-[0.12em] uppercase mt-3" style={{ color: SERVE_BLUE }}>{t}</h3>
            <p className="text-[13px] leading-[1.5] mt-3 flex-1" style={{ color: SERVE_INK }}>{s}</p>
            <Link to={to} className="inline-flex items-center gap-1.5 font-medium text-[13px] mt-6 whitespace-nowrap hover:gap-2.5 transition-[gap]" style={{ color: SERVE_BLUE }} data-testid={`industries-link-${i}`}>Explore {t} <ArrowRight size={14} /></Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Context = () => (
  <section className="text-white py-12 lg:py-16" style={{ background: "#3e665c", "--type-eyebrow-ink": "#ffffff", "--type-small-ink": "#dde9e4", "--type-small-mobile": 12, "--type-small-tablet": 12, "--type-small-desktop": 12, "--type-section-desktop": 29, "--type-section-tablet": 28, "--type-subheading-mobile": 10.5, "--type-subheading-tablet": 10.5, "--type-subheading-desktop": 10.5, "--type-subheading-letterSpacing": 0.1, "--type-subheading-lineHeight": 1.45 }} data-testid="industries-context">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-8 items-start">
      <Reveal className="lg:col-span-4">
        <Kicker color="#ffffff" testId="industries-context-eyebrow">Where Industry Context Matters</Kicker>
        <H2 className="text-white">The Operating Environment Shapes the Technology</H2>
        <P light className="mt-5 text-[13px]">Industry context influences how technology is designed, secured, supported, and governed—from the way people access systems and information to how organizations prepare for disruption and manage change.</P>
      </Reveal>
      <div className="lg:col-span-8 relative" data-testid="industries-context-list">
        <span className="hidden sm:block absolute left-[10%] right-[10%] top-[60px] h-px bg-white/55" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-8">
          {CONTEXT.map(({ Icon, t, s }, i) => (
            <Reveal key={t} delay={i * 80} className="gi-item flex flex-col items-center" data-testid={`industries-context-${i}`}>
              <span className="gi-icon text-white" style={{ "--i": i }}><Icon size={40} strokeWidth={1.3} /></span>
              <span className="w-3 h-3 rounded-full mt-3 relative" style={{ background: AMBER }} />
              <h3 className="font-sans text-[10.5px] font-bold tracking-[0.1em] uppercase mt-4 text-center text-white">{t}</h3>
              <p className="text-[13px] leading-[1.5] mt-3 self-start" style={{ color: "#dde9e4" }}>{s}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Defines = () => (
  <section className="py-12 lg:py-16" style={{ background: "#f2eae3", "--type-eyebrow-ink": "#00069b", "--type-section-ink": "#00009a", "--type-body-ink": "#1f53b5" }} data-testid="industries-requirements">
    <div className="container-x max-w-[980px] mr-auto">
      <Reveal>
        <Kicker color="#00069b" testId="industries-requirements-eyebrow">Industry Experience Provides Context</Kicker>
        <H2 className="text-[#00009a]">Your Organization Defines the Requirements</H2>
        <P className="mt-5 text-[#1f53b5]">Organizations within the same industry can have materially different technology environments.</P>
        <P className="mt-3 text-[#1f53b5]">Intrinsic considers your operating model, applications, information requirements, locations, business priorities, risk profile, and future plans when establishing technology priorities and recommending change.</P>
        <P className="mt-3 text-[#1f53b5]">Across managed IT, cybersecurity, cloud, governance and compliance, business continuity, and strategic IT advisory, we structure services around how your organization actually operates.</P>
      </Reveal>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative text-white pt-12 lg:pt-14 pb-12 lg:pb-0 overflow-hidden" style={{ background: "#0252b5", "--type-eyebrow-ink": AMBER, "--type-section-desktop": 32, "--type-section-tablet": 30 }} data-testid="industries-cta">
    <div className="container-x relative lg:min-h-[400px]">
      <Reveal className="lg:max-w-[620px] lg:pb-16 relative z-10">
        <Kicker color={AMBER} testId="industries-cta-eyebrow">Discuss Your Technology Requirements</Kicker>
        <h2 className="font-serif text-white leading-[1.15]">Start With How Your Organization Operates</h2>
        <P light className="mt-4 text-[14px]">Intrinsic begins by understanding your operating environment, the technology supporting it today, and the operational, security, governance, and regulatory requirements that need to be addressed.</P>
        <P light className="mt-3 text-[14px]">Whether you are evaluating your current provider, planning for growth, or addressing new security and compliance requirements, the conversation starts with how your organization operates.</P>
        <P light className="mt-3 text-[14px]">From there, we identify the technology priorities and services appropriate to your organization.</P>
        <div className="mt-6"><FlatBtn testId="industries-cta-btn">Talk to Our Team</FlatBtn></div>
      </Reveal>
      <Reveal delay={140} className="hidden lg:block absolute bottom-0 left-[46%] w-[48%] pointer-events-none">
        <img src="/images/industries-cta-skyline.png" alt="" className="w-full h-auto block" width="495" height="205" data-testid="industries-cta-skyline" />
      </Reveal>
      <Reveal delay={200} className="hidden lg:block absolute right-0 top-[30%]">
        <p className="font-sans text-[10.5px] font-bold tracking-[0.18em] uppercase text-white leading-[2] whitespace-nowrap">People<br />Purpose<br />Possibilities<br />Brighter Together<span className="block w-[26px] h-[2px] mt-2" style={{ background: AMBER }} /></p>
      </Reveal>
    </div>
  </section>
);

export default function Verticals() {
  return (
    <div className="bg-white page-in" data-testid="industries-page">
      <ScrollProgress />
      <Navbar />
      <main><Hero /><Serve /><Context /><Defines /><CTA /></main>
      <Footer />
    </div>
  );
}
