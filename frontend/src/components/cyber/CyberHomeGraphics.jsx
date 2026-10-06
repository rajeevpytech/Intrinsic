import React from "react";

/* Hero: perspective panels with traffic flowing through them */
const PANELS = [[300, 80, 30, 300], [360, 100, 24, 260], [420, 115, 20, 230], [470, 125, 16, 210]];
const FLOWS = [110, 150, 190, 230, 270, 310, 350];

export const SecurityPanels = ({ className = "" }) => (
  <svg viewBox="0 0 640 460" className={className} fill="none" aria-hidden="true" data-testid="cyber-hero-panels">
    <defs>
      <linearGradient id="chPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dbe8fa" stopOpacity="0.95" /><stop offset="100%" stopColor="#7fa6e6" stopOpacity="0.55" /></linearGradient>
      <linearGradient id="chPanelB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3f7fe0" stopOpacity="0.9" /><stop offset="100%" stopColor="#1e4fd8" stopOpacity="0.5" /></linearGradient>
    </defs>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={"v" + i} d={`M${40 + i * 44} 0 V460`} stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
    ))}
    {FLOWS.map((y, i) => {
      const yy = y + (i % 2 ? 8 : -6);
      return (
        <g key={y}>
          <path d={`M-10 ${y} C 120 ${y}, 160 ${yy + 30}, 280 ${yy + 30} L 560 ${yy + 30}`} stroke="#ffffff" strokeOpacity={0.5 + (i % 3) * 0.15} strokeWidth="1.4" className={i % 2 ? "pm-wire" : ""} />
          <path d={`M556 ${yy + 30} l-8 -5 m8 5 l-8 5`} stroke="#ffffff" strokeOpacity="0.9" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      );
    })}
    <path d="M-10 90 C 200 90, 230 20, 420 20 L 640 20" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.2" />
    <path d="M-10 400 C 200 400, 230 450, 420 450 L 640 450" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.2" />
    {PANELS.map(([x, y, w, h], i) => (
      <g key={i} className="pm-float" style={{ animationDuration: `${7 + i}s`, animationDelay: `${i * 0.6}s` }}>
        <path d={`M${x} ${y} l${w} -14 v${h} l-${w} 14 z`} fill={i === 1 ? "url(#chPanelB)" : "url(#chPanel)"} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
      </g>
    ))}
    {[[240, 150], [520, 200], [590, 260], [180, 300]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="4.5" fill="#f2a91c" className="pm-pulse-node" style={{ animationDelay: `${i * 0.5}s` }} />
    ))}
  </svg>
);

/* Security by Design: woven grid — horizontal navy layers, vertical light bars, one orange thread */
const LAYERS = ["Applications", "Data", "Identity", "Infrastructure", "Physical"];
export const SecurityWeave = ({ className = "" }) => (
  <svg viewBox="0 0 600 300" className={className} fill="none" aria-hidden="true" data-testid="cyber-weave">
    {[170, 240, 310, 380].map((x, i) => (
      <rect key={x} x={x} y="10" width="30" height="280" fill={x === 240 ? "#f2a91c" : "#d6e2f5"} className={x === 240 ? "pm-blink" : ""} style={{ animationDuration: "4s" }} />
    ))}
    {LAYERS.map((l, i) => {
      const y = 40 + i * 52;
      return (
        <g key={l}>
          <text x="0" y={y + 5} fontFamily="'DM Sans', system-ui, sans-serif" fontSize="10.5" fontWeight="700" fill="#0b3f95" style={{ letterSpacing: "1.6px" }}>{l.toUpperCase()}</text>
          <path d={`M${l.length * 7.2 + 8} ${y} H 150`} stroke="#0b3f95" strokeWidth="1.2" />
          <rect x="150" y={y - 11} width="290" height="22" fill="#0b3f95" />
          {[170, 310, 380].map((x) => (i % 2 ? <rect key={x} x={x} y={y - 11} width="30" height="22" fill="#d6e2f5" /> : null))}
          {i % 2 === 0 && <rect x="240" y={y - 11} width="30" height="22" fill="#f2a91c" />}
        </g>
      );
    })}
    <text x="470" y="140" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="12.5" fontWeight="700" fill="#f2a91c" style={{ letterSpacing: "1.4px" }}>
      <tspan x="470" dy="0">SECURITY</tspan><tspan x="470" dy="16">INTEGRATED</tspan><tspan x="470" dy="16">THROUGHOUT</tspan>
    </text>
  </svg>
);

/* CTA: wireframe perspective panels */
export const WirePanels = ({ className = "" }) => (
  <svg viewBox="0 0 320 260" className={className} fill="none" aria-hidden="true" data-testid="cyber-cta-wire">
    {[[40, 60, 60, 190], [110, 40, 60, 210], [180, 20, 60, 230]].map(([x, y, w, h], i) => (
      <path key={i} d={`M${x} ${y + 30} l${w} -30 v${h} l-${w} 30 z`} stroke="#ffffff" strokeOpacity={0.35 + i * 0.15} strokeWidth="1" />
    ))}
    {[80, 120, 160, 200].map((y) => <path key={y} d={`M0 ${y + 40} L 320 ${y - 60}`} stroke="#ffffff" strokeOpacity="0.18" strokeWidth="0.8" />)}
    <circle cx="240" cy="30" r="3" fill="#f2a91c" />
  </svg>
);
