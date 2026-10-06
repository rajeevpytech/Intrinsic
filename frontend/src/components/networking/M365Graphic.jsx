import React from "react";

/* M365 hero graphic: workload tiles connected to a central tenant hub; tiles light up in turn, sync pulses travel the links */
const TILES = [
  { label: "Exchange", x: 120, y: 90, c: "#0078d4" }, { label: "Teams", x: 480, y: 90, c: "#5059c9" },
  { label: "SharePoint", x: 60, y: 240, c: "#036c70" }, { label: "OneDrive", x: 540, y: 240, c: "#0364b8" },
  { label: "Entra ID", x: 120, y: 390, c: "#00388e" }, { label: "Purview", x: 480, y: 390, c: "#7719aa" },
];
const HUB = { x: 300, y: 240 };

export const M365Graphic = ({ className = "" }) => (
  <svg viewBox="0 0 600 480" className={className} aria-hidden="true" data-testid="m365-graphic">
    <defs><radialGradient id="m365-hub" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1b61be" /><stop offset="100%" stopColor="#00388e" /></radialGradient></defs>
    <circle cx={HUB.x} cy={HUB.y} r="150" fill="none" stroke="#00388e" strokeOpacity="0.12" strokeDasharray="3 8" className="cycle-spin-slow" />
    <circle cx={HUB.x} cy={HUB.y} r="95" fill="none" stroke="#00388e" strokeOpacity="0.15" />
    {TILES.map((t, i) => (
      <g key={t.label}>
        <line x1={HUB.x} y1={HUB.y} x2={t.x} y2={t.y} stroke="#00388e" strokeOpacity="0.18" strokeWidth="1.5" />
        <line x1={HUB.x} y1={HUB.y} x2={t.x} y2={t.y} stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.85}s` }} />
        <line x1={HUB.x} y1={HUB.y} x2={t.x} y2={t.y} stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet topo-packet-rev" style={{ animationDelay: `${i * 0.85 + 2.6}s` }} />
      </g>
    ))}
    {TILES.map((t, i) => (
      <g key={t.label} className="m365-tile" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
        <rect x={t.x - 34} y={t.y - 34} width="68" height="68" rx="10" fill="#ffffff" stroke="#c8d2de" strokeWidth="1.5" className="m365-tile-box" style={{ animationDelay: `${i * 0.85}s` }} />
        <rect x={t.x - 18} y={t.y - 18} width="36" height="36" rx="6" fill={t.c} fillOpacity="0.9" />
        <rect x={t.x - 10} y={t.y - 10} width="20" height="20" rx="3" fill="#ffffff" fillOpacity="0.85" />
        <text x={t.x} y={t.y + 54} textAnchor="middle" className="perim-label" fill="#00388e">{t.label.toUpperCase()}</text>
      </g>
    ))}
    <circle cx={HUB.x} cy={HUB.y} r="44" fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />
    <circle cx={HUB.x} cy={HUB.y} r="34" fill="url(#m365-hub)" />
    <text x={HUB.x} y={HUB.y - 2} textAnchor="middle" fill="#ffffff" className="perim-label">M365</text>
    <text x={HUB.x} y={HUB.y + 12} textAnchor="middle" fill="#ffffff" fillOpacity="0.75" style={{ fontFamily: "Inter", fontSize: 8, letterSpacing: 1.2 }}>TENANT</text>
  </svg>
);
