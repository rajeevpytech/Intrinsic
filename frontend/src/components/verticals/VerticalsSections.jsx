import React from "react";
import { Lock, ScrollText, Network, LifeBuoy, RefreshCw } from "lucide-react";
import { Reveal } from "../common";
import { VERTICALS } from "./VerticalsList";

/* Hero motion graphic: five industry "bands" rising and breathing, with a scanning line */
export const VerticalBands = () => (
  <div className="relative h-[300px] lg:h-[420px] flex items-end gap-3 lg:gap-4 justify-end pr-2" aria-hidden="true" data-testid="verticals-bands">
    {VERTICALS.map((v, i) => (
      <div key={v.slug} className="vband relative w-[44px] lg:w-[64px] rounded-t-sm" style={{ backgroundColor: v.color, height: `${48 + ((i * 37) % 45)}%`, animationDelay: `${i * 0.18}s` }}>
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow vband-dot" style={{ animationDelay: `${1 + i * 0.4}s` }} />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 [writing-mode:vertical-rl] rotate-180 text-[10px] font-bold tracking-[0.18em] uppercase text-white/90 whitespace-nowrap hidden lg:block">{v.name}</span>
      </div>
    ))}
    <span className="absolute left-0 right-0 h-px bg-royal/40 vband-scan" />
    <span className="absolute left-0 right-0 bottom-0 h-px bg-royal/30" />
  </div>
);

const REQUIREMENTS = [
  { Icon: Lock, title: "Security & Access", body: "Controls aligned with the sensitivity of information, user responsibilities, and access requirements." },
  { Icon: ScrollText, title: "Compliance & Governance", body: "Technology practices, controls, and documentation aligned with applicable regulatory, contractual, and organizational requirements." },
  { Icon: Network, title: "Infrastructure & Connectivity", body: "Infrastructure designed around locations, applications, users, performance requirements, and operating models." },
  { Icon: LifeBuoy, title: "Business Continuity", body: "Recovery strategies aligned with the criticality of systems and the operational impact of disruption." },
  { Icon: RefreshCw, title: "Ongoing Management", body: "Technology reviewed and maintained as business requirements, risks, systems, and regulatory obligations evolve." },
];

export const VerticalsContext = () => (
  <section className="bg-ice py-24 lg:py-32" data-testid="verticals-context">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-5">Industry Context in Practice</p>
        <h2 className="font-serif text-royal font-semibold text-[32px] sm:text-[42px] leading-[1.14]">Translating Business Requirements into Technology Priorities</h2>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7 space-y-5 text-[#4a5259] text-[16px] leading-[1.72]">
        <p>Industry experience provides important context for understanding the requirements surrounding an organization's technology environment. The priorities themselves are determined by how the organization operates, the information it manages, the systems it depends on, and the obligations it must meet.</p>
        <p>Intrinsic incorporates these considerations into technology management and planning—helping determine where stronger controls are required, which systems require greater resilience, how access should be structured, and where technology investment should be prioritized.</p>
        <p className="font-serif text-royal text-[20px] leading-snug border-l-[3px] border-amber pl-5">This approach allows technology decisions to reflect both industry requirements and the specific operational priorities of the organization.</p>
      </Reveal>
    </div>
  </section>
);

export const VerticalsRequirements = () => (
  <section className="bg-white py-24 lg:py-32" data-testid="verticals-requirements">
    <div className="container-x">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-end mb-14">
        <Reveal>
          <p className="eyebrow eyebrow-line text-[#f2a91c] mb-5">Where Industry Requirements Shape Technology</p>
          <h2 className="font-serif text-royal font-semibold text-[32px] sm:text-[42px] leading-[1.14]">Connecting Operational, Security, and Governance Requirements</h2>
        </Reveal>
        <Reveal delay={120}><p className="text-[#4a5259] text-[16px] leading-[1.7]">Industry requirements extend across the technology environment. They influence how users access systems, how information is protected and governed, how infrastructure is designed, how continuity is planned, and how technology is managed over time.</p></Reveal>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-powder">
        {REQUIREMENTS.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 80} className={`bg-white ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
            <div className="group h-full p-7 lg:p-8 relative overflow-hidden hover:bg-ice transition-colors duration-300" data-testid={`requirement-${i}`}>
              <span className="absolute top-0 left-0 h-[3px] w-0 bg-amber transition-all duration-500 group-hover:w-full" />
              <span className="inline-flex w-11 h-11 items-center justify-center bg-royal/8 text-royal group-hover:bg-royal group-hover:text-white transition-colors duration-300"><Icon size={20} /></span>
              <h3 className="font-serif text-royal font-semibold text-[20px] leading-tight mt-6">{title}</h3>
              <p className="text-slatesage text-[14px] leading-[1.65] mt-3">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
