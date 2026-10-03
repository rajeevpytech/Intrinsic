import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Headset, Cloud, Sparkles, ArrowRight } from "lucide-react";
import { Reveal } from "./common";
import { capabilities } from "../mock/mock";

const icons = [ShieldCheck, Headset, Cloud, Sparkles];

export const slugify = (s) =>
  s.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const WhatWeDo = () => {
  return (
    <section id="services" className="relative bg-white py-24 lg:py-28 overflow-hidden">
      {/* refined decorative corner accent */}
      <div className="absolute -top-20 -right-20 w-[340px] h-[340px] pointer-events-none select-none float-a">
        <div className="absolute inset-10 rounded-full bg-navy/[0.04] blur-2xl" />
        <div className="absolute inset-0 rounded-full border border-powder/60" />
        <div className="absolute inset-12 rounded-full border border-dashed border-powder/50" />
        <div className="absolute inset-24 rounded-full border border-powder/40" />
        <span className="absolute left-1/2 top-0 w-2.5 h-2.5 -translate-x-1/2 rounded-full bg-amber" />
      </div>

      <div className="container-x relative z-10">
        <Reveal>
          <p className="eyebrow eyebrow-line text-[#f2a91c] mb-4">What we do</p>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-end mb-16">
            <h2 className="font-serif text-midnight font-semibold text-[32px] sm:text-[42px] leading-[1.06]">
              Four areas. One team. Complete accountability.
            </h2>
            <p className="text-slatesage text-[16px] leading-relaxed">
              Intrinsic brings together four areas of technology management within one coordinated
              environment—providing the operational expertise, security oversight, infrastructure
              management, and strategic guidance organizations require.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-7">
          {capabilities.map((c, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={c.title} delay={i * 80}>
                <Link
                  to={`/services/${slugify(c.title)}`}
                  data-testid={`service-card-${slugify(c.title)}`}
                  className="group relative bg-white border border-powder/70 h-full flex flex-col p-8 lg:p-10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgba(8,76,152,0.5)] hover:border-navy/30"
                >
                  {/* top growing accent bar */}
                  <span className="absolute top-0 left-0 h-[3px] w-0 bg-amber transition-all duration-500 group-hover:w-full" />

                  <div className="flex items-start justify-between mb-7">
                    <span className="svc-icon inline-flex items-center justify-center w-14 h-14 bg-navy/8 text-navy group-hover:bg-navy group-hover:text-white transition-colors duration-300">
                      <span className="svc-icon-inner inline-flex"><Icon size={26} /></span>
                    </span>
                    <span className="font-mono text-powder text-[34px] leading-none group-hover:text-amber transition-colors duration-300">
                      {c.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-[26px] lg:text-[28px] text-navy font-semibold mb-3">
                    {c.title}
                  </h3>
                  <p className="text-slatesage text-[15.5px] leading-relaxed">{c.body}</p>

                  <span className="mt-auto pt-7 inline-flex items-center gap-2 eyebrow text-navy">
                    Learn More
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
