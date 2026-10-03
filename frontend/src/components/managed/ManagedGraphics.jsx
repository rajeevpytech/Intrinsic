import React from "react";
import { Users, Headset, Server, Building2, Share2, Cloud, Shield, RefreshCw } from "lucide-react";

const NAVY = "#0b3f95";
const ORANGE = "#f2a91c";

/* ---------- Hero hub: everything connects to one team ---------- */
const HUB_LEFT = [
  { Icon: Users, t: "Users", s: "Productivity every day", y: 22 },
  { Icon: Headset, t: "Support", s: "Real people. Real solutions", y: 50 },
  { Icon: Server, t: "Infrastructure", s: "Stable. Secure. Always on.", y: 78 },
];
const HUB_RIGHT = [
  { Icon: Share2, t: "Networks", s: "A connected foundation", y: 16 },
  { Icon: Cloud, t: "Cloud", s: "Flexible and ready", y: 38 },
  { Icon: Shield, t: "Security", s: "Protection that persists", y: 60 },
  { Icon: RefreshCw, t: "Backup & Continuity", s: "Resilience builds confidence", y: 82 },
];
const Node = ({ Icon, t, s, side, y }) => (
  <div className={`absolute flex items-start gap-3 ${side === "l" ? "left-0 flex-row" : "right-0 flex-row-reverse text-right"}`} style={{ top: `${y}%`, transform: "translateY(-50%)" }}>
    <Icon size={28} strokeWidth={1.5} style={{ color: NAVY }} className="shrink-0" />
    <div>
      <p className="font-sans text-[10.5px] font-bold tracking-[0.14em] uppercase leading-tight" style={{ color: NAVY }}>{t}</p>
      <p className="font-sans text-[9px] font-semibold tracking-[0.1em] uppercase text-[#3b6cc0] mt-1 leading-[1.5] max-w-[110px]">{s}</p>
    </div>
  </div>
);

export const HubDiagram = ({ className = "" }) => (
  <div className={`relative ${className}`} style={{ aspectRatio: "600 / 470" }} data-testid="managed-hub">
    <svg viewBox="0 0 600 470" className="absolute inset-0 w-full h-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hubSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c7d8f2" stopOpacity="0" /><stop offset="100%" stopColor="#c7d8f2" stopOpacity="0.9" /></linearGradient>
      </defs>
      {/* skyline */}
      <g stroke="#9fb8de" strokeWidth="1" opacity="0.8">
        <path d="M40 430 v-70 h30 v-30 h25 v100 M110 430 v-50 h35 v50 M160 430 v-90 h20 v-20 h20 v110 M470 430 v-60 h30 v-40 h20 v100 M535 430 v-40 h25 v40" />
        <path d="M0 430 H600" />
      </g>
      {/* left curves into center */}
      {[105, 235, 365].map((y, i) => (
        <path key={"l" + y} d={`M150 ${y} C 215 ${y}, 220 235, 268 235`} stroke={NAVY} strokeWidth="1.6" strokeOpacity="0.85" className={i === 1 ? "" : "pm-wire"} />
      ))}
      {[76, 180, 283, 386].map((y, i) => (
        <path key={"r" + y} d={`M450 ${y} C 385 ${y}, 380 235, 332 235`} stroke={NAVY} strokeWidth="1.6" strokeOpacity="0.85" className={i % 2 ? "pm-wire" : ""} />
      ))}
      {/* top: your organization */}
      <path d="M300 98 V 200" stroke={NAVY} strokeWidth="1.6" />
      {/* orange junctions */}
      {[[215, 130], [222, 330], [385, 110], [388, 350], [300, 150]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={ORANGE} className="pm-pulse-node" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
      {/* center */}
      <circle cx="300" cy="235" r="34" fill="#ffffff" stroke={NAVY} strokeWidth="2.5" />
      <text x="300" y="248" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="34" fontWeight="600" fill={NAVY}>I</text>
      <text x="300" y="300" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="10.5" fontWeight="700" fill={NAVY} style={{ letterSpacing: "1.6px" }}>
        <tspan x="300" dy="0">ONE TEAM</tspan><tspan x="300" dy="14">A STRONGER</tspan><tspan x="300" dy="14">TOMORROW</tspan>
      </text>
      <text x="300" y="72" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="10.5" fontWeight="700" fill={NAVY} style={{ letterSpacing: "1.6px" }}>
        <tspan x="300" dy="0">YOUR</tspan><tspan x="300" dy="13">ORGANIZATION</tspan>
      </text>
    </svg>
    <div className="absolute" style={{ left: "50%", top: "2%", transform: "translateX(-50%)" }}><Building2 size={34} strokeWidth={1.5} style={{ color: NAVY }} /></div>
    <div className="absolute inset-y-0 left-0 w-[24%]">{HUB_LEFT.map((n) => <Node key={n.t} {...n} side="l" />)}</div>
    <div className="absolute inset-y-0 right-0 w-[24%]">{HUB_RIGHT.map((n) => <Node key={n.t} {...n} side="r" />)}</div>
  </div>
);

/* ---------- One coordinated environment ---------- */
const INPUTS = ["Your Team", "Our Experts", "Third-Party Vendors", "Technology Platforms"];
export const CoordinatedFlow = ({ className = "" }) => (
  <svg viewBox="-40 0 690 240" className={className} fill="none" aria-hidden="true" data-testid="managed-coordinated">
    {INPUTS.map((l, i) => {
      const y = 40 + i * 52;
      return (
        <g key={l}>
          <text x="150" y={y + 4} textAnchor="end" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#ffffff" style={{ letterSpacing: "1.4px" }}>{l.toUpperCase()}</text>
          <circle cx="164" cy={y} r="3.5" fill="#ffffff" />
          <path d={`M168 ${y} C 240 ${y}, 250 120, 300 120`} stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.4" />
          <path d={`M168 ${y} C 230 ${y}, 260 ${120 + (i - 1.5) * 8}, 300 ${120 + (i - 1.5) * 8}`} stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
        </g>
      );
    })}
    <circle cx="330" cy="120" r="28" fill="#2f6b57" stroke="#ffffff" strokeWidth="2.2" />
    <text x="330" y="131" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="30" fontWeight="600" fill="#ffffff">I</text>
    {[60, 90, 120, 150, 180].map((y, i) => (
      <g key={y}>
        <path d={`M360 120 C 400 120, 410 ${y}, 470 ${y}`} stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.4" className={i % 2 ? "pm-wire" : ""} />
        <path d={`M470 ${y} l-7 -4 m7 4 l-7 4`} stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    ))}
    <text x="490" y="105" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#ffffff" style={{ letterSpacing: "1.6px" }}>
      <tspan x="490" dy="0">ONE</tspan><tspan x="490" dy="15">COORDINATED</tspan><tspan x="490" dy="15">ENVIRONMENT</tspan>
    </text>
    <text x="490" y="170" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="8.5" fontWeight="700" fill="#ffffff" fillOpacity="0.8" style={{ letterSpacing: "1.2px" }}>
      <tspan x="490" dy="0">GREATER</tspan><tspan x="490" dy="11">STABILITY</tspan><tspan x="490" dy="11">STRONGER OUTCOMES</tspan>
    </text>
  </svg>
);

/* ---------- Signals to prioritized action ---------- */
const SIGNALS = ["Support Tickets", "System Alerts", "Security Events", "Performance Data", "Vendor Input", "User Feedback"];
const OUTS = ["Resolve Today", "Prevent Tomorrow", "Improve Over Time"];
export const SignalsFlow = ({ className = "" }) => (
  <svg viewBox="0 0 700 260" className={className} fill="none" aria-hidden="true" data-testid="managed-signals">
    {SIGNALS.map((l, i) => {
      const y = 30 + i * 40;
      return (
        <g key={l}>
          <text x="150" y={y + 4} textAnchor="end" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="10" fontWeight="700" fill={NAVY} style={{ letterSpacing: "1.4px" }}>{l.toUpperCase()}</text>
          <circle cx="164" cy={y} r="3.5" fill={NAVY} />
          <path d={`M168 ${y} C 240 ${y}, 250 130, 300 130`} stroke={NAVY} strokeWidth="1.4" strokeOpacity="0.85" className={i % 2 ? "pm-wire" : ""} />
        </g>
      );
    })}
    {[[236, 90], [262, 118], [244, 165]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill={ORANGE} className="pm-pulse-node" style={{ animationDelay: `${i * 0.4}s` }} />)}
    <path d="M310 40 V 220" stroke={NAVY} strokeWidth="2" />
    <path d="M304 118 h14 l14 12 l-14 12 h-14 z" fill="#8fd3c2" />
    <path d="M330 130 H 400 M400 130 l-8 -6 m8 6 l-8 6" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
    <text x="410" y="126" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="12.5" fontWeight="700" fill={NAVY} style={{ letterSpacing: "1.6px" }}>
      <tspan x="410" dy="0">PRIORITIZED</tspan><tspan x="410" dy="15">ACTION</tspan>
    </text>
    <path d="M530 80 V 180" stroke={NAVY} strokeWidth="1.2" />
    {OUTS.map((o, i) => (
      <text key={o} x="544" y={98 + i * 40} fontFamily="'DM Sans', system-ui, sans-serif" fontSize="9.5" fontWeight="700" fill={NAVY} style={{ letterSpacing: "1.3px" }}>{o.toUpperCase()}</text>
    ))}
  </svg>
);

/* ---------- Skyline for CTA ---------- */
export const SkylineWire = ({ className = "" }) => (
  <svg viewBox="0 0 360 200" className={className} fill="none" aria-hidden="true" data-testid="managed-skyline">
    <g stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1">
      <path d="M10 190 v-60 h25 v-30 h20 v90 M70 190 v-110 h30 v110 M115 190 v-80 h18 v-40 h22 v120 M170 190 v-50 h28 v50 M215 190 v-130 h24 v-20 h20 v150 M275 190 v-70 h30 v70 M320 190 v-40 h25 v40" />
      <path d="M0 190 H 360" />
      <path d="M180 0 V 190" strokeDasharray="3 5" strokeOpacity="0.35" />
    </g>
    <circle cx="180" cy="20" r="3" fill={ORANGE} />
  </svg>
);
