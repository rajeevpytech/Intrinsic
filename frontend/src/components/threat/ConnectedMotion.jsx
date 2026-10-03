import React from "react";

const S = { fill: "none", stroke: "#1e4fd8", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
const Ico = ({ type }) => {
  if (type === "endpoint") return <g {...S}><rect x="-11" y="-8" width="22" height="14" rx="1.5" /><line x1="-14" y1="9" x2="14" y2="9" /></g>;
  if (type === "network") return <g {...S}><circle cx="-9" cy="-6" r="3" /><circle cx="9" cy="-6" r="3" /><circle cx="0" cy="8" r="3" /><line x1="-7" y1="-4" x2="-2" y2="6" /><line x1="7" y1="-4" x2="2" y2="6" /></g>;
  if (type === "cloud") return <g {...S}><path d="M-12 6a5.5 5.5 0 0 1 1-10 7.5 7.5 0 0 1 14 1 5 5 0 0 1-1 9z" /></g>;
  if (type === "identity") return <g {...S}><circle cx="0" cy="-5" r="5" /><path d="M-9 10c0-6 4-9 9-9s9 3 9 9" /></g>;
  return null;
};

const NODES = [
  { x: 260, y: 92, t: "endpoint", l: "ENDPOINT", lx: 260, ly: 148 },
  { x: 428, y: 260, t: "network", l: "NETWORK", lx: 428, ly: 316 },
  { x: 260, y: 428, t: "cloud", l: "CLOUD", lx: 260, ly: 372 },
  { x: 92, y: 260, t: "identity", l: "IDENTITY", lx: 92, ly: 316 },
];

export const ConnectedMotion = ({ className = "" }) => (
  <svg viewBox="0 0 520 520" className={className} fill="none" aria-hidden="true" data-testid="connected-motion">
    <defs>
      <linearGradient id="cmShield" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3f7fe0" /><stop offset="100%" stopColor="#1450b0" /></linearGradient>
      <radialGradient id="cmGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3f7fe0" stopOpacity="0.55" /><stop offset="100%" stopColor="#3f7fe0" stopOpacity="0" /></radialGradient>
    </defs>
    <circle cx="260" cy="260" r="168" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.4" className="pm-breathe" />
    <g><animateTransform attributeName="transform" type="rotate" from="0 260 260" to="360 260 260" dur="18s" repeatCount="indefinite" /><circle cx="260" cy="92" r="5" fill="#f2a91c" /></g>

    {NODES.map((n) => (
      <line key={"l" + n.l} x1="260" y1="260" x2={n.x} y2={n.y} stroke="#8fb3ff" strokeOpacity="0.4" strokeWidth="1.6" strokeDasharray="5 8" className="pm-wire" />
    ))}

    <circle cx="260" cy="260" r="70" fill="url(#cmGlow)" className="pm-blink" />
    <circle cx="260" cy="260" r="36" fill="rgba(255,255,255,0.08)" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2" />
    <path d="M260 238 l20 8 v15 c0 14 -10 22 -20 26 c-10 -4 -20 -12 -20 -26 v-15 z" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M251 262 l6 6 l12 -13" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

    {NODES.map((n) => (
      <g key={n.l}>
        <circle cx={n.x} cy={n.y} r="34" fill="#ffffff" className="pm-pulse-node" />
        <g transform={`translate(${n.x} ${n.y})`}><Ico type={n.t} /></g>
        <text x={n.lx} y={n.ly} textAnchor="middle" className="perim-label" fill="#ffffff" style={{ letterSpacing: "1.8px" }}>{n.l}</text>
      </g>
    ))}
    {NODES.map((n, i) => (
      <circle key={"p" + n.l} r="4" fill="#8fb3ff" opacity="0">
        <animateMotion dur="2.6s" begin={`${i * 0.6}s`} repeatCount="indefinite" path={`M${n.x} ${n.y} L260 260`} />
        <animate attributeName="opacity" values="0;1;1;0" dur="2.6s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);
