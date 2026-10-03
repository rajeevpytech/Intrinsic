import React from "react";

const RINGS = [70, 130, 195, 265, 340, 420];
const ORBITS = [
  { r: 130, dur: 38, start: 20 },
  { r: 195, dur: 52, start: 200, rev: true },
  { r: 265, dur: 64, start: 300 },
  { r: 340, dur: 80, start: 120, rev: true },
  { r: 420, dur: 96, start: 250 },
];
const LABELS = [
  { text: "Cloud", x: 40, y: -222 },
  { text: "Identity", x: -345, y: -96 },
  { text: "Endpoint", x: -352, y: 118 },
  { text: "Network", x: -262, y: 262 },
];

/* Animated concentric "security radar": slow sweep, orbiting nodes, breathing rings */
export const SecurityRadar = ({ className = "" }) => (
  <svg viewBox="-460 -460 920 920" className={`radar ${className}`} aria-hidden="true" data-testid="cyber-radar">
    <defs>
      <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
        <stop offset="55%" stopColor="#ffffff" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="radar-sweep" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="440" y2="0">
        <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0" />
      </linearGradient>
    </defs>

    {RINGS.map((r, i) => (
      <circle key={r} r={r} fill={i % 2 ? "url(#radar-fill)" : "none"} stroke="#1a1a2e" strokeOpacity={0.22 + (i % 2) * 0.08} strokeWidth={i === 3 ? 2.6 : 1.7}
        strokeDasharray={i === 4 ? "4 12" : undefined} className="radar-ring" style={{ animationDelay: `${i * 0.35}s` }} />
    ))}

    <g className="radar-spin" style={{ animationDuration: "48s" }}>
      <line x1="0" y1="0" x2="440" y2="0" stroke="url(#radar-sweep)" strokeWidth="2.6" />
      <circle cx="440" cy="0" r="9" fill="#1a1a2e" fillOpacity="0.45" />
    </g>

    {ORBITS.map((o, i) => (
      <g key={i} className={`radar-spin ${o.rev ? "radar-rev" : ""}`} style={{ animationDuration: `${o.dur}s`, animationDelay: `-${((o.start / 360) * o.dur).toFixed(1)}s` }}>
        <circle cx={o.r} cy="0" r={i === 2 ? 12 : 9} fill="#2f4a3f" fillOpacity="0.85" className="radar-node" style={{ animationDelay: `${i * 0.7}s` }} />
      </g>
    ))}

    <circle r="13" fill="#1a1a2e" fillOpacity="0.8" />
    <circle r="30" fill="none" stroke="#1a1a2e" strokeOpacity="0.35" strokeWidth="2" className="radar-core" />

    {LABELS.map((l) => (
      <text key={l.text} x={l.x} y={l.y} className="radar-label hidden sm:block" fill="#2f3d38" fillOpacity="0.85">{l.text.toUpperCase()}</text>
    ))}
  </svg>
);
