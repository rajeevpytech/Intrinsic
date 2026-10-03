import React from "react";

const LABELS = [
  { t: "ENDPOINTS", y: 118 },
  { t: "NETWORKS", y: 190 },
  { t: "CLOUD", y: 262 },
  { t: "IDENTITY", y: 334 },
];
const CX = 560, CY = 225;
const ARCS = [130, 190, 250, 315, 385];
const DOTS = [
  { r: 250, a: 218, c: "#2f6fd0", s: 8 }, { r: 315, a: 232, c: "#0b3f95", s: 10 }, { r: 385, a: 196, c: "#2f6fd0", s: 6 },
  { r: 190, a: 152, c: "#0b3f95", s: 8 }, { r: 250, a: 132, c: "#2f6fd0", s: 6 }, { r: 315, a: 118, c: "#2f6fd0", s: 6 },
  { r: 385, a: 245, c: "#0b3f95", s: 6 }, { r: 130, a: 205, c: "#2f6fd0", s: 6 },
];
const pt = (r, a) => ({ x: CX + r * Math.cos((a * Math.PI) / 180), y: CY + r * Math.sin((a * Math.PI) / 180) });

export const ThreatHeroMotion = ({ className = "" }) => (
  <svg viewBox="0 0 620 470" className={className} fill="none" aria-hidden="true" data-testid="threat-hero-motion">
    <defs>
      <radialGradient id="thHalo" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#dbe8fa" /><stop offset="100%" stopColor="#dbe8fa" stopOpacity="0" /></radialGradient>
      <filter id="thShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0b3f95" floodOpacity="0.14" /></filter>
    </defs>

    {ARCS.map((r, i) => (
      <circle key={r} cx={CX} cy={CY} r={r} stroke="#0b3f95" strokeOpacity={0.34 - i * 0.04} strokeWidth={i === 1 ? 2.2 : 1.4} strokeDasharray={i % 2 ? "4 8" : "0"} className={i === ARCS.length - 1 ? "pm-breathe" : ""} />
    ))}

    {LABELS.map((l, i) => {
      const ex = CX - Math.sqrt(ARCS[2] ** 2 - (l.y - CY) ** 2);
      return (
        <g key={l.t}>
          <line x1="160" y1={l.y} x2={ex} y2={l.y} stroke="#0b3f95" strokeOpacity="0.18" strokeDasharray="4 7" className="pm-wire" />
          <text x="20" y={l.y + 5} fontFamily="'DM Sans', system-ui, sans-serif" fontSize="15" fontWeight="700" fill="#0b3f95" style={{ letterSpacing: "2.2px" }}>{l.t}</text>
        </g>
      );
    })}

    {DOTS.map((d, i) => { const p = pt(d.r, d.a); return <circle key={i} cx={p.x} cy={p.y} r={d.s} fill={d.c} className="pm-pulse-node" style={{ animationDelay: `${i * 0.3}s` }} />; })}
    <g><animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="28s" repeatCount="indefinite" /><circle cx={CX} cy={CY - 190} r="5.5" fill="#0b3f95" /></g>
    <g><animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`-360 ${CX} ${CY}`} dur="40s" repeatCount="indefinite" /><circle cx={CX} cy={CY - 315} r="5" fill="#2f6fd0" /></g>

    <g className="pm-float">
      <circle cx="470" cy="225" r="92" fill="url(#thHalo)" />
      <circle cx="470" cy="225" r="78" fill="#e9f1fb" filter="url(#thShadow)" />
      <path d="M470 168 l40 15 v32 c0 28 -20 46 -40 55 c-20 -9 -40 -27 -40 -55 v-32 z" stroke="#0b3f95" strokeWidth="5.5" strokeLinejoin="round" fill="#f4f8fd" />
      <path d="M452 226 l12 12 l26 -28" stroke="#0b3f95" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    <text x="440" y="392" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="16" fontWeight="700" fill="#0b3f95" style={{ letterSpacing: "3px" }}>
      <tspan x="440" dy="0">DETECT.</tspan><tspan x="440" dy="26">INVESTIGATE.</tspan><tspan x="440" dy="26">RESPOND.</tspan>
    </text>
  </svg>
);
