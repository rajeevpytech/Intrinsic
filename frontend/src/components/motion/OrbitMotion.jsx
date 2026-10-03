import React from "react";

const DEFAULT_LABELS = [
  { label: "ENDPOINTS", c: "#1f8f7a", y: 112 },
  { label: "NETWORKS", c: "#2f6fd0", y: 190 },
  { label: "CLOUD", c: "#8aa0b8", y: 268 },
  { label: "IDENTITY", c: "#0b1f45", y: 346 },
];

const Orbiter = ({ r, dur, color, cx = 430, cy = 235 }) => (
  <g>
    <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur={`${dur}s`} repeatCount="indefinite" />
    <circle cx={cx} cy={cy - r} r="5.5" fill={color} />
  </g>
);

export const OrbitMotion = ({ className = "", labels = DEFAULT_LABELS }) => (
  <svg viewBox="0 0 620 470" className={className} fill="none" aria-hidden="true" data-testid="orbit-motion">
    <defs>
      <linearGradient id="orbShield" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f6fd0" /><stop offset="100%" stopColor="#0b3f95" /></linearGradient>
      <filter id="orbShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0b3f95" floodOpacity="0.18" /></filter>
    </defs>
    {[72, 122, 174, 226].map((r, i) => (
      <circle key={r} cx="430" cy="235" r={r} fill="none" stroke="#0b3f95" strokeOpacity={0.16 - i * 0.02} strokeWidth="1.4" strokeDasharray={i % 2 ? "3 8" : "0"} className={i === 3 ? "pm-breathe" : ""} />
    ))}
    <Orbiter r={122} dur={16} color="#1f8f7a" />
    <Orbiter r={174} dur={24} color="#f2a91c" />
    <Orbiter r={226} dur={34} color="#2f6fd0" />

    {labels.map((n) => (
      <g key={n.label}>
        <line x1="66" y1={n.y} x2="386" y2="235" stroke="#0b3f95" strokeOpacity="0.16" strokeDasharray="4 7" className="pm-wire" />
        <circle cx="54" cy={n.y} r="6" fill={n.c} className="pm-pulse-node" />
        <text x="72" y={n.y + 4} className="perim-label" fill="#2b3a4a" style={{ letterSpacing: "1.8px" }}>{n.label}</text>
      </g>
    ))}

    <g className="pm-float">
      <rect x="386" y="191" width="88" height="88" rx="18" fill="#ffffff" filter="url(#orbShadow)" />
      <path d="M430 205 l26 10 v20 c0 18 -13 29 -26 34 c-13 -5 -26 -16 -26 -34 v-20 z" fill="url(#orbShield)" />
      <path d="M419 236 l7 7 l15 -16" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);
