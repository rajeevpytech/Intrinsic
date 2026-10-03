import React from "react";

/* Perimeter graphic: packets approach from the internet; the firewall blocks threats and passes clean traffic */
const PACKETS = [
  { y: 90, delay: 0, bad: false }, { y: 140, delay: 0.9, bad: true }, { y: 190, delay: 1.7, bad: false },
  { y: 240, delay: 2.6, bad: false }, { y: 290, delay: 3.3, bad: true }, { y: 340, delay: 4.1, bad: false }, { y: 390, delay: 5.0, bad: true },
];
const INSIDE = [
  { x: 520, y: 120, label: "Office" }, { x: 560, y: 240, label: "Cloud" }, { x: 520, y: 360, label: "Remote" },
];

export const PerimeterGraphic = ({ className = "" }) => (
  <svg viewBox="0 0 620 480" className={className} aria-hidden="true" data-testid="perimeter-graphic">
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1b61be" /><stop offset="100%" stopColor="#00388e" /></linearGradient>
    </defs>
    {/* outside zone */}
    <text x="70" y="52" className="perim-label" fill="#2f3d38" fillOpacity="0.7">INTERNET</text>
    <text x="440" y="52" className="perim-label" fill="#00388e">PROTECTED NETWORK</text>
    {[80, 160, 240].map((r, i) => <circle key={r} cx="40" cy="240" r={r} fill="none" stroke="#2f3d38" strokeOpacity={0.18 - i * 0.04} strokeDasharray="4 8" className="perim-ring" style={{ animationDelay: `${i * 0.4}s` }} />)}
    {/* lanes */}
    {PACKETS.map((p) => <line key={p.y} x1="40" y1={p.y} x2="580" y2={p.y} stroke="#2f3d38" strokeOpacity="0.1" />)}
    {/* firewall */}
    <g className="perim-wall">
      <rect x="296" y="60" width="28" height="360" fill="url(#wall)" rx="2" />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x="300" y={72 + i * 39} width="20" height="24" fill="#ffffff" fillOpacity="0.14" rx="1" />)}
      <rect x="296" y="60" width="28" height="360" fill="none" stroke="#faaf6a" strokeWidth="2" className="perim-wall-glow" rx="2" />
    </g>
    <text x="310" y="446" textAnchor="middle" className="perim-label" fill="#00388e">FIREWALL · IPS</text>
    {/* packets */}
    {PACKETS.map((p, i) => (
      <g key={i}>
        <circle cy={p.y} r="6" fill={p.bad ? "#d9534f" : "#108474"} className={p.bad ? "perim-packet perim-bad" : "perim-packet perim-good"} style={{ animationDelay: `${p.delay}s` }} />
        {p.bad && <g className="perim-block" style={{ animationDelay: `${p.delay}s` }}>
          <line x1="290" y1={p.y - 8} x2="306" y2={p.y + 8} stroke="#d9534f" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="306" y1={p.y - 8} x2="290" y2={p.y + 8} stroke="#d9534f" strokeWidth="2.5" strokeLinecap="round" />
        </g>}
      </g>
    ))}
    {/* inside nodes */}
    {INSIDE.map((n) => (
      <g key={n.label}>
        <circle cx={n.x} cy={n.y} r="16" fill="#ffffff" stroke="#00388e" strokeWidth="1.5" />
        <circle cx={n.x} cy={n.y} r="4" fill="#faaf6a" className="topo-dot" />
        <text x={n.x} y={n.y + 32} textAnchor="middle" className="perim-label" fill="#00388e">{n.label.toUpperCase()}</text>
      </g>
    ))}
  </svg>
);
