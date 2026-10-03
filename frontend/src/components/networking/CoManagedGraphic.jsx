import React from "react";

/* Co-managed graphic: two teams connected through one shared operating model; handoff pulses travel both ways */
const LEFT = [{ y: 120, l: "Service Desk" }, { y: 210, l: "Infrastructure" }, { y: 300, l: "Projects" }, { y: 390, l: "Users" }];
const RIGHT = [{ y: 120, l: "Engineering" }, { y: 210, l: "Security Ops" }, { y: 300, l: "After-Hours" }, { y: 390, l: "Specialists" }];

export const CoManagedGraphic = ({ className = "" }) => (
  <svg viewBox="0 0 620 480" className={className} aria-hidden="true" data-testid="comanaged-graphic">
    <defs><linearGradient id="cm-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1b61be" /><stop offset="100%" stopColor="#00388e" /></linearGradient></defs>
    <text x="90" y="62" textAnchor="middle" className="perim-label" fill="#00388e">YOUR IT TEAM</text>
    <text x="530" y="62" textAnchor="middle" className="perim-label" fill="#00388e">INTRINSIC</text>
    <text x="310" y="62" textAnchor="middle" className="perim-label" fill="#6b7a78">ONE OPERATING MODEL</text>
    {LEFT.map((n, i) => (
      <g key={n.l}>
        <line x1="130" y1={n.y} x2="262" y2="255" stroke="#00388e" strokeOpacity="0.18" strokeWidth="1.5" />
        <line x1="130" y1={n.y} x2="262" y2="255" stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 1.1}s` }} />
        <rect x="30" y={n.y - 20} width="100" height="40" rx="4" fill="#ffffff" stroke="#c8d2de" className="stack-layer" style={{ animationDelay: `${i * 0.12}s` }} />
        <text x="80" y={n.y + 4} textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600 }} fill="#1a1a2e">{n.l}</text>
      </g>
    ))}
    {RIGHT.map((n, i) => (
      <g key={n.l}>
        <line x1="490" y1={n.y} x2="358" y2="255" stroke="#00388e" strokeOpacity="0.18" strokeWidth="1.5" />
        <line x1="490" y1={n.y} x2="358" y2="255" stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet topo-packet-rev" style={{ animationDelay: `${0.55 + i * 1.1}s` }} />
        <rect x="490" y={n.y - 20} width="100" height="40" rx="4" fill="#1a1a2e" className="stack-layer" style={{ animationDelay: `${0.3 + i * 0.12}s` }} />
        <text x="540" y={n.y + 4} textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600 }} fill="#ffffff">{n.l}</text>
      </g>
    ))}
    <circle cx="310" cy="255" r="70" fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />
    <rect x="262" y="207" width="96" height="96" rx="12" fill="url(#cm-core)" />
    <text x="310" y="250" textAnchor="middle" fill="#ffffff" className="perim-label">SHARED</text>
    <text x="310" y="266" textAnchor="middle" fill="#ffffff" className="perim-label">MODEL</text>
    {["Ownership", "Escalation", "Tools", "Reviews"].map((t, i) => (
      <text key={t} x={310} y={330 + i * 16} textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 9, letterSpacing: 1.4 }} fill="#6b7a78" className="env-fade">{t.toUpperCase()}</text>
    ))}
  </svg>
);
