import React from "react";
import { ArrowRight, ShieldAlert, Activity, ScrollText } from "lucide-react";
import brandIcon from "../assets/brand-mark-t.png";
import { Reveal } from "./common";
import { securityChips } from "../mock/mock";

const orbitNodes = [
  { Icon: ShieldAlert, label: "Threat Detection" },
  { Icon: Activity, label: "Security Monitoring" },
  { Icon: ScrollText, label: "Governance & Compliance" },
];

const SecurityGraphic = () => (
  <div className="relative w-full h-[420px] flex items-center justify-center">
    {/* pulsing rings */}
    <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          className="ring-pulse"
          cx="200" cy="200" r="90"
          fill="none" stroke="#084c98" strokeWidth="1.5"
          style={{ animationDelay: `${i * 1.05}s`, opacity: 0.5 }}
        />
      ))}
      <circle cx="200" cy="200" r="150" fill="none" stroke="#c8d2de" strokeWidth="1" strokeDasharray="4 8" />
    </svg>

    {/* core brand mark */}
    <div className="relative z-10 w-[77px] h-[77px] flex items-center justify-center">
      <img src={brandIcon} alt="Intrinsic" className="w-full h-full object-contain drop-shadow-[0_12px_28px_rgba(8,76,152,0.28)]" />
    </div>

    {/* orbiting capability nodes */}
    {orbitNodes.map(({ Icon, label }, i) => {
      const angle = (i / orbitNodes.length) * 2 * Math.PI - Math.PI / 2;
      const R = 150;
      const x = Math.cos(angle) * R;
      const y = Math.sin(angle) * R;
      return (
        <div
          key={label}
          className="group absolute z-20 float-a"
          style={{ left: `calc(50% + ${x}px - 28px)`, top: `calc(50% + ${y}px - 28px)`, animationDelay: `${i * 0.6}s` }}
          data-testid={`security-node-${i}`}
        >
          <div className="w-14 h-14 bg-white border border-powder flex items-center justify-center text-navy shadow-lg cursor-pointer transition-all duration-300 group-hover:bg-navy group-hover:text-white group-hover:border-navy group-hover:scale-110">
            <Icon size={22} />
          </div>
          <span className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-navy text-white text-[11px] font-medium tracking-wide px-2.5 py-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            {label}
          </span>
        </div>
      );
    })}
  </div>
);

const SecuritySection = () => {
  return (
    <section className="relative bg-ice py-24 lg:py-28 overflow-hidden">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <Reveal>
            <h2 className="font-serif text-navy font-semibold text-[32px] sm:text-[42px] leading-[1.06]">
              Security isn't an Add On. <span className="text-gradient">It's Intrinsic.</span>
            </h2>
            <p className="text-slatesage text-[15px] leading-[1.75] mt-6">
              Security is foundational—not an additional service layered onto the technology
              environment. From identities and endpoints to cloud platforms, email, backups, and
              network infrastructure, security is integrated into how the environment is designed,
              managed, and monitored.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-7">
              {securityChips.map((c) => (
                <span
                  key={c}
                  className="px-4 py-2 bg-white border border-powder text-midnight text-[13px] font-medium hover:border-navy hover:text-navy hover:-translate-y-0.5 transition-all duration-200"
                >
                  {c}
                </span>
              ))}
            </div>

            <p className="font-semibold text-midnight mt-8 text-[18px] leading-relaxed">
              One integrated security approach. One accountable technology partner.
            </p>

            <button type="button" data-assessment className="btn-amber mt-7" data-testid="security-assess-btn">
              <span>Talk to Our Team</span>
              <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
            </button>
          </Reveal>

          {/* Graphic */}
          <Reveal delay={150} dir="scale" className="hidden md:block">
            <SecurityGraphic />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
