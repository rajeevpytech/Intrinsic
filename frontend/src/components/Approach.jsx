import React from "react";
import { Search, PencilRuler, MonitorCheck, TrendingUp } from "lucide-react";
import { Reveal } from "./common";
import NetworkGraphic from "./NetworkGraphic";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Assess",
    body: "We map your environment end to end\u2014identities, endpoints, cloud, and data\u2014to understand risk, gaps, and opportunities.",
  },
  {
    icon: PencilRuler,
    step: "02",
    title: "Design",
    body: "We architect a secure, resilient environment shaped around how your teams actually work and the standards you must meet.",
  },
  {
    icon: MonitorCheck,
    step: "03",
    title: "Manage",
    body: "We run and monitor everything 24/7\u2014patching, backups, support, and threat response\u2014as one accountable partner.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Optimize",
    body: "We continuously review performance, cost, and posture, guiding smarter technology decisions as your organization evolves.",
  },
];

const Approach = () => {
  return (
    <section id="approach" className="relative bg-royal text-white py-24 lg:py-28 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-[360px] h-[360px] rounded-full bg-navy/40 blur-3xl float-a" />
      <div className="absolute bottom-0 left-10 w-[240px] h-[240px] rounded-full bg-amber/10 blur-3xl float-b" />
      {/* Animated network graphic */}
      <div className="absolute inset-x-0 top-0 h-[320px] opacity-[0.22] pointer-events-none">
        <NetworkGraphic className="w-full h-full" color="#9fc0ee" accent="#faaf6a" />
      </div>

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <Reveal>
            <p className="eyebrow text-[#f2a91c] mb-4">How We Work</p>
            <h2 className="font-serif font-semibold text-[32px] sm:text-[42px] leading-[1.06]">
              One coordinated approach to your entire technology environment.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-white/70 text-[16px] leading-relaxed">
              Instead of stitching together disconnected tools and vendors, Intrinsic manages
              security, infrastructure, cloud, and support as a single accountable system—so
              nothing falls through the cracks.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="group relative bg-white/[0.04] border border-white/10 p-8 h-full hover:bg-white/[0.08] hover:-translate-y-1.5 transition-all duration-300">
                <span className="absolute top-6 right-6 font-mono text-white/15 text-3xl group-hover:text-amber/60 transition-colors">{s.step}</span>
                <span className="inline-flex items-center justify-center w-12 h-12 bg-amber text-midnight mb-6">
                  <s.icon size={22} />
                </span>
                <h3 className="font-serif text-[24px] font-semibold">{s.title}</h3>
                <p className="text-white/70 text-[14.5px] leading-relaxed mt-3">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
