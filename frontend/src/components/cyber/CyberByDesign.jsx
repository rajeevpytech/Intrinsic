import React from "react";
import { Reveal } from "../common";

/* Wire routes in a 600x470 canvas; pulses travel along them continuously */
const WIRES = [
  { d: "M48 118 H556", delay: 0 },
  { d: "M108 272 H600", delay: 1.2 },
  { d: "M174 118 V272", delay: 0.6 },
  { d: "M372 52 V272", delay: 0.9 },
  { d: "M492 272 V418", delay: 1.6 },
  { d: "M48 118 V343 H336 V408", delay: 0.3 },
];
const NODES = [[174, 118], [372, 272], [336, 343], [492, 272]];
const LABELS = [
  { text: "Secure Architecture", x: 60, y: 96 },
  { text: "Identity Protection", x: 204, y: 248 },
  { text: "Continuous Oversight", x: 384, y: 96 },
  { text: "Operational Alignment", x: 90, y: 372 },
  { text: "Compliance Readiness", x: 356, y: 396 },
];
const STATUS = [
  { text: "Environment secured", x: 60, y: 150 },
  { text: "Controls active", x: 390, y: 302 },
  { text: "Visibility maintained", x: 348, y: 436 },
];

const Environment = () => (
  <div className="relative bg-[#e8edf2] overflow-hidden" data-testid="cyber-environment">
    <span className="absolute top-0 right-0 w-[29%] h-full bg-sage/20" />
    <span className="absolute top-0 left-0 w-[4px] h-full bg-amber" />
    <svg viewBox="0 0 600 470" className="relative w-full h-auto block" aria-hidden="true">
      <defs>
        <filter id="env-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      {WIRES.map((w, i) => (
        <g key={i}>
          <path d={w.d} fill="none" stroke="#00388e" strokeWidth="3" className="env-wire" style={{ animationDelay: `${w.delay}s` }} />
          <path d={w.d} fill="none" stroke="#faaf6a" strokeWidth="3.5" strokeLinecap="round" pathLength="100" className="env-pulse" style={{ animationDelay: `${1.6 + w.delay * 1.4}s` }} />
          <path d={w.d} fill="none" stroke="#faaf6a" strokeWidth="7" strokeLinecap="round" pathLength="100" filter="url(#env-glow)" className="env-pulse" style={{ animationDelay: `${1.6 + w.delay * 1.4}s`, opacity: 0.55 }} />
        </g>
      ))}
      {NODES.map(([x, y], i) => (
        <g key={i} className="env-node-g" style={{ animationDelay: `${1.4 + i * 0.25}s` }}>
          <rect x={x - 5} y={y - 5} width="10" height="10" fill="#faaf6a" />
          <rect x={x - 5} y={y - 5} width="10" height="10" fill="none" stroke="#faaf6a" className="env-ring" style={{ animationDelay: `${2 + i * 0.8}s` }} />
        </g>
      ))}
      {LABELS.map((l) => (
        <g key={l.text} className="env-fade">
          <rect x={l.x - 7} y={l.y - 12} width={l.text.length * 8.1 + 14} height="18" fill="#e8edf2" />
          <text x={l.x} y={l.y} className="env-svg-label" fill="#00388e">{l.text.toUpperCase()}</text>
        </g>
      ))}
      {STATUS.map((s) => <text key={s.text} x={s.x} y={s.y} className="env-svg-status" fill="#6b7a78">{s.text.toUpperCase()}</text>)}
    </svg>
  </div>
);

export const CyberByDesign = () => (
  <section className="bg-white py-24 lg:py-32 overflow-hidden" data-testid="cyber-by-design">
    <div className="container-x">
      <div className="grid lg:grid-cols-[41fr_59fr] gap-12 lg:gap-[74px] items-center">
        <Reveal dir="left">
          <p className="eyebrow eyebrow-line text-[#f2a91c] mb-5">Security by Design</p>
          <h2 className="font-serif text-royal font-semibold text-[32px] sm:text-[42px] leading-[1.14] max-w-[14ch] mb-6">Building Security into the Way Technology Operates</h2>
          <p className="text-[#4a5259] text-[16px] leading-[1.68] max-w-[39ch]">
            Effective cybersecurity begins with the way the technology environment is designed, configured, and managed.
          </p>
          <p className="text-[#4a5259] text-[16px] leading-[1.68] max-w-[39ch] mt-4">
            Intrinsic applies security principles throughout the technology lifecycle—strengthening architecture, access controls, visibility, and operational consistency as the environment evolves.
          </p>
        </Reveal>
        <Reveal delay={150} dir="right"><Environment /></Reveal>
      </div>
    </div>
  </section>
);
