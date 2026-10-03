import React from "react";

const S = { fill: "none", stroke: "#dbe7ff", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
const Ico = ({ type }) => {
  if (type === "wifi") return <g {...S}><path d="M-11 -3a15 15 0 0 1 22 0" /><path d="M-6 3a8 8 0 0 1 12 0" /><circle cx="0" cy="8" r="1.6" fill="#dbe7ff" /></g>;
  if (type === "cloud") return <g {...S}><path d="M-11 5a5 5 0 0 1 1-9 7 7 0 0 1 13 1 4.5 4.5 0 0 1-1 8z" /></g>;
  if (type === "remote") return <g {...S}><rect x="-9" y="-8" width="18" height="12" rx="1.5" /><line x1="-12" y1="8" x2="12" y2="8" /></g>;
  if (type === "edge") return <g {...S}><circle cx="-8" cy="0" r="3" /><circle cx="8" cy="-5" r="3" /><circle cx="8" cy="6" r="3" /><line x1="-5" y1="-1" x2="5" y2="-4" /><line x1="-5" y1="1" x2="5" y2="5" /></g>;
  if (type === "hq" || type === "branch") return <g {...S}><rect x="-8" y="-9" width="16" height="18" rx="1" /><line x1="-3" y1="-4" x2="-3" y2="-4" /><line x1="3" y1="-4" x2="3" y2="-4" /><line x1="-3" y1="2" x2="-3" y2="2" /><line x1="3" y1="2" x2="3" y2="2" /></g>;
  return null;
};

const NODES = [
  { x: 280, y: 78, t: "wifi", l: "WIRELESS" },
  { x: 430, y: 158, t: "cloud", l: "CLOUD" },
  { x: 430, y: 312, t: "remote", l: "REMOTE" },
  { x: 280, y: 392, t: "edge", l: "EDGE" },
  { x: 130, y: 312, t: "branch", l: "BRANCH" },
  { x: 130, y: 158, t: "hq", l: "HQ" },
];

export const HubSpokeMotion = ({ className = "" }) => (
  <svg viewBox="0 0 560 470" className={className} fill="none" aria-hidden="true" data-testid="hub-spoke-motion">
    <defs>
      <radialGradient id="hsBg" cx="50%" cy="42%" r="70%"><stop offset="0%" stopColor="#123a70" /><stop offset="100%" stopColor="#0a2247" /></radialGradient>
      <radialGradient id="hsCore" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#ffc061" /><stop offset="100%" stopColor="#f2a91c" /></radialGradient>
    </defs>
    <rect x="0" y="0" width="560" height="470" rx="20" fill="url(#hsBg)" />
    {NODES.map((n) => <line key={"l" + n.l} x1="280" y1="235" x2={n.x} y2={n.y} stroke="#7ea4e6" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 7" className="pm-wire" />)}
    {NODES.map((n, i) => (
      <circle key={"p" + n.l} r="3.5" fill="#ffd27f" opacity="0">
        <animateMotion dur="2.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={`M280 235 L${n.x} ${n.y}`} />
        <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
      </circle>
    ))}
    {NODES.map((n) => (
      <g key={n.l}>
        <circle cx={n.x} cy={n.y} r="26" fill="#ffffff" fillOpacity="0.06" stroke="#9fc0f5" strokeOpacity="0.5" strokeWidth="1.4" className="pm-pulse-node" />
        <g transform={`translate(${n.x} ${n.y})`}><Ico type={n.t} /></g>
        <text x={n.x} y={n.y + 44} textAnchor="middle" className="perim-label" fill="#dbe7ff" style={{ letterSpacing: "1.6px" }}>{n.l}</text>
      </g>
    ))}
    <circle cx="280" cy="235" r="40" fill="none" stroke="#f2a91c" strokeOpacity="0.4" strokeWidth="1.5" className="pm-ring" />
    <circle cx="280" cy="235" r="27" fill="url(#hsCore)" className="pm-pulse-node" />
    <path d="M280 222 l14 5 v11 c0 10 -7 16 -14 19 c-7 -3 -14 -9 -14 -19 v-11 z" fill="#0a2247" fillOpacity="0.85" />
    <text x="280" y="300" textAnchor="middle" className="perim-label" fill="#ffffff" style={{ fontSize: 12, letterSpacing: "2px" }}>CORE</text>
  </svg>
);
