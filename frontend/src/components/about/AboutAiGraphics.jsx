import React from "react";

/* Hero planet: translucent sphere with crosshair, glowing amber core, small moon */
export const OrbitPlanet = ({ flip = false, className = "" }) => (
  <svg viewBox="0 0 560 460" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden="true" data-testid="orbit-planet">
    <defs>
      <radialGradient id="op-sphere" cx="42%" cy="40%" r="68%">
        <stop offset="0%" stopColor="#eef4fd" /><stop offset="58%" stopColor="#d7e6fb" /><stop offset="100%" stopColor="#bcd6f6" />
      </radialGradient>
      <radialGradient id="op-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffe0b8" /><stop offset="55%" stopColor="#faaf6a" /><stop offset="100%" stopColor="#e08f3d" />
      </radialGradient>
    </defs>
    <line x1="0" y1="230" x2="560" y2="230" stroke="#9db9de" strokeOpacity="0.55" strokeWidth="1" />
    <line x1="250" y1="0" x2="250" y2="460" stroke="#9db9de" strokeOpacity="0.4" strokeWidth="1" />
    <circle cx="250" cy="230" r="200" fill="url(#op-sphere)" stroke="#9db9de" strokeOpacity="0.5" />
    <circle cx="250" cy="230" r="150" fill="none" stroke="#ffffff" strokeOpacity="0.6" />
    <circle cx="250" cy="230" r="150" fill="none" stroke="#9db9de" strokeOpacity="0.25" strokeDasharray="2 9" />
    <circle cx="300" cy="230" r="48" fill="url(#op-core)" opacity="0.25" className="topo-ping" />
    <circle cx="300" cy="230" r="11" fill="url(#op-core)" />
    <circle cx="300" cy="230" r="4" fill="#ffffff" opacity="0.9" />
    <circle cx="442" cy="258" r="18" fill="url(#op-sphere)" stroke="#9db9de" strokeOpacity="0.5" />
  </svg>
);

/* AI: use cases -> evaluate -> defined initiative flow */
export const AiFlowDiagram = ({ className = "" }) => {
  const cases = ["Customer Service", "Document Processing", "Internal Knowledge", "Workflow Automation", "Microsoft Copilot", "and more…"];
  const evals = ["Business Value", "Workflow", "Data", "Security", "Integration"];
  const initiative = ["Requirements established", "Dependencies identified", "Controls defined", "Implementation approach"];
  return (
    <svg viewBox="0 0 720 420" className={className} aria-hidden="true" data-testid="ai-flow">
      <text x="30" y="34" className="perim-label" fill="#4a5259">POTENTIAL USE CASES</text>
      <text x="322" y="34" className="perim-label" fill="#4a5259">EVALUATE</text>
      <text x="560" y="34" className="perim-label" fill="#4a5259">DEFINED INITIATIVE</text>
      {cases.map((c, i) => {
        const y = 70 + i * 52;
        const d = `M 150 ${y} C 240 ${y}, 250 220, 312 220`;
        return (
          <g key={c}>
            <path d={d} fill="none" stroke="#c8d2de" strokeWidth="1.2" />
            <path d={d} fill="none" stroke="#1b61be" strokeWidth="2.2" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.4}s` }} />
            <circle cx="150" cy={y} r="3.5" fill="#faaf6a" />
            <text x="30" y={y + 4} style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 500 }} fill="#2f3a42">{c}</text>
          </g>
        );
      })}
      <rect x="312" y="120" width="150" height="200" rx="10" fill="#ffffff" stroke="#c8d2de" />
      {evals.map((e, i) => (
        <g key={e}>
          <circle cx="332" cy={158 + i * 34} r="3.5" fill="#faaf6a" className="mg-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          <text x="344" y={162 + i * 34} style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 500 }} fill="#2f3a42">{e}</text>
        </g>
      ))}
      <path d="M 462 220 C 500 220, 500 220, 520 220" fill="none" stroke="#1b61be" strokeWidth="2.2" pathLength="100" className="topo-packet" style={{ animationDelay: "0.8s" }} />
      <circle cx="520" cy="220" r="30" fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />
      <circle cx="520" cy="220" r="9" fill="#faaf6a" />
      <rect x="552" y="150" width="150" height="140" rx="10" fill="#0a2f6e" />
      {initiative.map((t, i) => (
        <g key={t}>
          <circle cx="572" cy={182 + i * 30} r="3" fill="#faaf6a" />
          <text x="584" y={186 + i * 30} style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 500 }} fill="#ffffff">{t}</text>
        </g>
      ))}
    </svg>
  );
};

/* AI: isometric technology stack with labels + glowing nodes */
export const AiStack = ({ labels, className = "" }) => {
  const cx = 400;
  return (
    <svg viewBox="0 0 560 460" className={className} aria-hidden="true" data-testid="ai-stack">
      {labels.map((l, i) => {
        const y = 90 + i * 58;
        const accent = i === 3;
        const top = `${cx},${y - 26} ${cx + 96},${y} ${cx},${y + 26} ${cx - 96},${y}`;
        return (
          <g key={l}>
            <line x1="60" y1={y} x2={cx - 96} y2={y} stroke="#9db9de" strokeOpacity="0.45" strokeWidth="1" />
            <text x="30" y={y + 4} className="perim-label" fill="#1b61be">{l}</text>
            {i < labels.length - 1 && <line x1={cx} y1={y + 26} x2={cx} y2={y + 32} stroke="#9db9de" strokeOpacity="0.5" strokeWidth="1" />}
            <polygon points={top} fill={accent ? "#faddbd" : "#d7e6fb"} fillOpacity={accent ? 0.9 : 0.85} stroke={accent ? "#e08f3d" : "#7fa8dd"} strokeOpacity="0.7" className="fp-panel" style={{ animationDelay: `${i * 0.12}s` }} />
            <circle cx={cx - 96} cy={y} r="3.5" fill="#faaf6a" className="mg-pulse" style={{ animationDelay: `${i * 0.25}s` }} />
            <circle cx={cx + 96} cy={y} r="3.5" fill="#faaf6a" className="mg-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          </g>
        );
      })}
    </svg>
  );
};

/* concentric radar arcs (dark bands) */
export const RadarArc = ({ className = "" }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
    {[55, 90, 125, 160].map((r) => (
      <path key={r} d={`M ${200 - r} 200 A ${r} ${r} 0 0 1 200 ${200 - r}`} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />
    ))}
    <path d="M 78 200 A 122 122 0 0 1 200 78" fill="none" stroke="#faaf6a" strokeOpacity="0.8" strokeWidth="1.6" strokeDasharray="2 9" pathLength="100" className="topo-packet" />
  </svg>
);

/* loose constellation scatter */
export const ScatterField = ({ className = "" }) => {
  const pts = [[40, 70], [96, 34], [140, 96], [196, 52], [238, 118], [74, 150], [168, 158], [268, 74], [312, 126], [292, 186], [128, 190], [222, 196]];
  return (
    <svg viewBox="0 0 350 230" className={className} aria-hidden="true" data-testid="scatter-field">
      {pts.slice(0, -1).map((p, i) => {
        const q = pts[i + 1];
        return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#c8d2de" strokeOpacity="0.5" strokeWidth="1" />;
      })}
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i % 3 === 0 ? 3.4 : 2.2} fill={i % 4 === 0 ? "#faaf6a" : "#1b61be"} className="topo-dot" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </svg>
  );
};
