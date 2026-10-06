import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../common";

const LEVELS = [
  { axis: "Define", num: "01", title: "Governance & Policy", body: "Establish policies, standards, ownership, and control requirements that define how systems and information are protected across the organization." },
  { axis: "Manage", num: "02", title: "Risk & Controls", body: "Identify, assess, prioritize, and track cybersecurity risks while maintaining oversight of the controls established to manage them." },
  { axis: "Maintain", num: "03", title: "Compliance & Resilience", body: "Align security controls and supporting processes with applicable requirements while establishing governance around incident response, business continuity, and recovery." },
  { axis: "Oversee", num: "04", title: "Executive Oversight", body: "Provide leadership with clear visibility into security posture, control effectiveness, outstanding risks, and remediation priorities.", last: true },
];

export const CyberGovernance = () => (
  <section className="bg-white pt-16 lg:pt-24" data-testid="cyber-governance">
    <div className="flex flex-col lg:flex-row items-stretch min-h-[640px]">
      <div className="lg:w-[42%] px-5 sm:px-8 lg:pl-[max(48px,calc((var(--vw)-1240px)/2+32px))] lg:pr-12 pt-5 pb-12 lg:pb-[100px]">
        <Reveal>
          <p className="eyebrow eyebrow-line text-[#f2a91c] mb-5">Security Governance</p>
          <h2 className="font-serif text-royal font-semibold text-[32px] sm:text-[42px] leading-[1.14] max-w-[14ch] mb-6">Establishing the Framework for Managing Cybersecurity Risk</h2>
          <p className="text-[#4a5259] text-[16px] leading-[1.68] max-w-[38ch]">
            Effective cybersecurity requires more than technical controls. It requires clear policies, defined accountability, ongoing risk management, control oversight, and meaningful visibility at the leadership level.
          </p>
          <p className="text-[#4a5259] text-[16px] leading-[1.68] max-w-[38ch] mt-4 mb-8">
            Intrinsic helps organizations establish and maintain the governance structure required to manage cybersecurity as an ongoing business responsibility—connecting security priorities with operational requirements, regulatory obligations, and organizational risk.
          </p>
          <Link to="/services/security-governance-compliance" className="group inline-flex items-center gap-2 text-royal font-semibold text-[15px] border-b border-transparent hover:border-royal transition-[border-color,gap] duration-200 hover:gap-3" data-testid="cyber-governance-link">
            Explore Security Governance <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
      <div className="w-full h-5 lg:h-auto lg:w-[26px] bg-sage shrink-0" />
      <div className="flex-1 bg-[#e6ecf2] px-5 sm:px-8 lg:pl-[72px] lg:pr-16 pt-10 lg:pt-5 pb-16 lg:pb-[100px]">
        <Reveal delay={120}>
          <p className="font-mono text-[12px] font-bold tracking-[0.14em] text-slatesage mb-4 uppercase">Security Program</p>
          <span className="block h-[3px] w-16 bg-royal mb-10 lg:mb-14" />
          <div className="relative">
            <span className="absolute left-[58px] lg:left-[82px] top-3 bottom-3 w-[6px] bg-amber/40 gov-track" />
            <span className="absolute left-[58px] lg:left-[82px] top-3 bottom-3 w-[6px] overflow-hidden"><span className="gov-runner absolute left-0 w-full h-[120px] bg-gradient-to-b from-transparent via-amber to-royal" /></span>
            {LEVELS.map((lv, i) => (
              <Reveal key={lv.num} delay={i * 110} className="relative flex py-7 lg:py-8" data-testid={`cyber-gov-level-${i}`}>
                <span className="w-[62px] lg:w-[66px] shrink-0 text-right pr-2 lg:pr-3.5 pt-1.5 font-mono text-[10px] lg:text-[11px] font-bold tracking-[0.12em] text-slatesage uppercase">{lv.axis}</span>
                <span className={`gov-dot absolute left-[56px] lg:left-[80px] top-[38px] lg:top-[46px] w-[14px] h-[14px] -ml-[2px] -mt-[2px] rounded-full border-[3px] border-[#e6ecf2] ${lv.last ? "bg-amber" : "bg-royal"}`} style={{ animationDelay: `${i * 1.5}s` }} />
                <div className="ml-[26px] lg:ml-10">
                  <p className="text-[12px] font-bold text-slatesage tracking-[0.05em] mb-2">{lv.num}</p>
                  <h3 className="font-serif text-royal font-semibold text-[22px] lg:text-[27px] mb-2 flex items-center gap-3.5">
                    {lv.title}{lv.last && <span className="inline-block w-[34px] h-[2px] bg-amber" />}
                  </h3>
                  <p className="text-slatesage text-[14.5px] leading-relaxed max-w-[52ch]">{lv.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
