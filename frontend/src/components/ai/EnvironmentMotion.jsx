import React from "react";
import { C } from "./AiGraphics";

const LAYERS = [
  { y: 372, l: "IDENTITY & ACCESS", c: C.navy, d: 0 },
  { y: 306, l: "INFORMATION & DATA", c: C.royal, d: -1.6 },
  { y: 240, l: "APPLICATIONS · M365", c: C.sky, d: -3.2, dark: true },
  { y: 174, l: "GOVERNANCE & POLICY", c: "#5b7fb8", d: -4.8 },
];
const PLATE = "M60 0 L300 0 L360 34 L120 34 Z";

export const EnvironmentMotion = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-[#eef3fa] ${className}`} data-testid="environment-motion">
    <svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="envCore" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3f7fe0" /><stop offset="100%" stopColor={C.navy} /></linearGradient>
        <radialGradient id="envGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3f7fe0" stopOpacity="0.5" /><stop offset="100%" stopColor="#3f7fe0" stopOpacity="0" /></radialGradient>
        <filter id="envShadow" x="-20%" y="-40%" width="140%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="10" floodColor={C.navy} floodOpacity="0.18" /></filter>
      </defs>
      {[0, 1, 2, 3].map((i) => <line key={i} x1={-120 + i * 110} y1="0" x2={140 + i * 110} y2="460" stroke="#ffffff" strokeOpacity="0.55" strokeWidth={i % 2 ? 26 : 10} />)}

      <g className="pm-wire">{[130, 210, 290].map((x) => <line key={x} x1={x} y1="96" x2={x} y2="392" stroke={C.royal} strokeOpacity="0.28" strokeWidth="1.4" strokeDasharray="4 8" />)}</g>
      {[130, 210, 290].map((x, i) => (
        <circle key={x} r="4" fill={C.gold}>
          <animateMotion dur="3.2s" begin={`${i * 1.05}s`} repeatCount="indefinite" path={`M${x} 392 L${x} 96`} />
          <animate attributeName="opacity" values="0;1;1;0" dur="3.2s" begin={`${i * 1.05}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {LAYERS.map((p, i) => (
        <g key={p.l} className="cld-float" style={{ animationDelay: `${p.d}s`, animationDuration: `${7 + i}s` }}>
          <path d={PLATE} transform={`translate(0 ${p.y})`} fill={p.c} fillOpacity={i === 2 ? 0.9 : 1} filter="url(#envShadow)" />
          <path d="M60 0 L300 0 L360 34 L120 34 Z" transform={`translate(0 ${p.y})`} fill="#ffffff" fillOpacity="0.08" />
          <text x="130" y={p.y + 22} className="perim-label" fill={p.dark ? C.navy : "#ffffff"} style={{ letterSpacing: "1.8px" }}>{p.l}</text>
          <rect x="336" y={p.y + 12} width="10" height="10" fill={C.gold} className="pm-blink" style={{ animationDelay: `${i * 0.4}s` }} />
        </g>
      ))}

      <circle cx="210" cy="86" r="62" fill="url(#envGlow)" className="pm-blink" />
      <circle cx="210" cy="86" r="46" fill="none" stroke={C.royal} strokeOpacity="0.25" strokeWidth="1.2" className="pm-breathe" />
      <g className="pm-float">
        <rect x="176" y="52" width="68" height="68" rx="14" fill="#ffffff" filter="url(#envShadow)" />
        <rect x="186" y="62" width="48" height="48" rx="10" fill="url(#envCore)" />
        <text x="210" y="93" textAnchor="middle" fill="#ffffff" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 600 }}>AI</text>
      </g>
      <g><animateTransform attributeName="transform" type="rotate" from="0 210 86" to="360 210 86" dur="12s" repeatCount="indefinite" /><circle cx="210" cy="40" r="4" fill={C.gold} /></g>

      <rect x="446" y="0" width="154" height="460" fill={C.navy} fillOpacity="0.94" />
      <rect x="400" y="0" width="46" height="460" fill={C.sky} fillOpacity="0.55" />
      <g className="air-band-lines">{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="470" y={40 + i * 66} width={i % 2 ? 60 : 96} height="6" fill="#ffffff" fillOpacity="0.14" />)}</g>
    </svg>
  </div>
);
