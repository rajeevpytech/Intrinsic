import React from "react";

/* Generic orbit graphic: labelled nodes orbiting a core, with sync pulses */
export const OrbitGraphic = ({ core, sub, nodes, className = "", dark = false }) => {
  const fg = dark ? "#ffffff" : "#00388e";
  return (
    <svg viewBox="0 0 600 480" className={className} aria-hidden="true" data-testid="orbit-graphic">
      <circle cx="300" cy="240" r="170" fill="none" stroke={fg} strokeOpacity="0.14" strokeDasharray="3 8" className="cycle-spin-slow" />
      <circle cx="300" cy="240" r="105" fill="none" stroke={fg} strokeOpacity="0.18" />
      {nodes.map((n, i) => {
        const a = (-90 + (360 / nodes.length) * i) * (Math.PI / 180);
        const x = 300 + 170 * Math.cos(a), y = 240 + 170 * Math.sin(a);
        return (
          <g key={n}>
            <line x1="300" y1="240" x2={x} y2={y} stroke={fg} strokeOpacity="0.15" strokeWidth="1.5" />
            <line x1="300" y1="240" x2={x} y2={y} stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.9}s` }} />
            <g className="m365-tile" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
              <rect x={x - 56} y={y - 18} width="112" height="36" rx="18" fill={dark ? "#1a1a2e" : "#ffffff"} stroke={dark ? "#ffffff55" : "#c8d2de"} className="m365-tile-box" style={{ animationDelay: `${i * 0.9}s` }} />
              <text x={x} y={y + 4} textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: 1 }} fill={fg}>{n.toUpperCase()}</text>
            </g>
          </g>
        );
      })}
      <circle cx="300" cy="240" r="58" fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />
      <circle cx="300" cy="240" r="46" fill="url(#m365-hub)" />
      <defs><radialGradient id="m365-hub" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1b61be" /><stop offset="100%" stopColor="#00388e" /></radialGradient></defs>
      <text x="300" y="238" textAnchor="middle" fill="#ffffff" className="perim-label">{core}</text>
      {sub && <text x="300" y="253" textAnchor="middle" fill="#ffffff" fillOpacity="0.75" style={{ fontFamily: "Inter", fontSize: 8, letterSpacing: 1.2 }}>{sub}</text>}
    </svg>
  );
};

/* Backup & DR: data flows to a protected vault; restore path with RTO/RPO markers */
export const RecoveryGraphic = ({ className = "" }) => (
  <svg viewBox="0 0 620 420" className={className} aria-hidden="true" data-testid="recovery-graphic">
    {["Servers", "Cloud", "M365", "Endpoints"].map((s, i) => {
      const y = 70 + i * 90;
      return (
        <g key={s}>
          <rect x="30" y={y - 20} width="110" height="40" rx="4" fill="#ffffff" fillOpacity="0.08" stroke="#ffffff" strokeOpacity="0.5" className="stack-layer" style={{ animationDelay: `${i * 0.12}s` }} />
          <text x="85" y={y + 4} textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600 }} fill="#ffffff">{s}</text>
          <line x1="140" y1={y} x2="300" y2="210" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.5" />
          <line x1="140" y1={y} x2="300" y2="210" stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 1.2}s` }} />
        </g>
      );
    })}
    <circle cx="330" cy="210" r="60" fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />
    <rect x="290" y="170" width="80" height="80" rx="10" fill="#faaf6a" />
    <rect x="308" y="196" width="44" height="34" rx="4" fill="none" stroke="#1a1a2e" strokeWidth="3" />
    <path d="M316 196 v-8 a14 14 0 0 1 28 0 v8" fill="none" stroke="#1a1a2e" strokeWidth="3" />
    <text x="330" y="275" textAnchor="middle" className="perim-label" fill="#ffffff">PROTECTED RESTORE POINTS</text>
    <line x1="370" y1="210" x2="560" y2="210" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" />
    <line x1="370" y1="210" x2="560" y2="210" stroke="#108474" strokeWidth="4" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: "2.4s" }} />
    <polygon points="560,202 576,210 560,218" fill="#ffffff" fillOpacity="0.7" />
    <text x="470" y="196" textAnchor="middle" className="perim-label" fill="#ffffff">RESTORE</text>
    {[["RPO", 420], ["RTO", 520]].map(([l, x]) => (
      <g key={l}><line x1={x} y1="222" x2={x} y2="240" stroke="#ffffff" strokeOpacity="0.5" /><text x={x} y="256" textAnchor="middle" className="perim-label" fill="#faaf6a">{l}</text></g>
    ))}
  </svg>
);
