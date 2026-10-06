import React from "react";

/* Hero motion graphic: network topology with packets travelling along links */
const NODES = {
  core: { x: 300, y: 230, r: 22, label: "Core" },
  hq: { x: 110, y: 110, r: 14, label: "HQ" },
  branch: { x: 110, y: 350, r: 14, label: "Branch" },
  cloud: { x: 500, y: 100, r: 16, label: "Cloud" },
  users: { x: 510, y: 360, r: 14, label: "Remote" },
  wifi: { x: 300, y: 60, r: 11, label: "Wireless" },
  edge: { x: 300, y: 410, r: 11, label: "Edge" },
};
const LINKS = [
  ["core", "hq", 0], ["core", "branch", 0.8], ["core", "cloud", 1.6], ["core", "users", 2.4], ["core", "wifi", 3.1], ["core", "edge", 3.7], ["hq", "wifi", 4.2], ["cloud", "users", 4.8],
];

export const NetworkTopology = ({ className = "" }) => (
  <svg viewBox="0 0 620 470" className={`topo ${className}`} aria-hidden="true" data-testid="network-topology">
    <defs>
      <radialGradient id="topo-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#faaf6a" /><stop offset="100%" stopColor="#d4883a" />
      </radialGradient>
    </defs>
    {LINKS.map(([a, b, d]) => {
      const A = NODES[a], B = NODES[b];
      return (
        <g key={a + b}>
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.5" />
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${d}s` }} />
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet topo-packet-rev" style={{ animationDelay: `${d + 2.6}s` }} />
        </g>
      );
    })}
    {Object.entries(NODES).map(([k, n], i) => (
      <g key={k} className="topo-node" style={{ animationDelay: `${i * 0.12}s` }}>
        {k === "core" && <circle cx={n.x} cy={n.y} r={n.r + 14} fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />}
        <circle cx={n.x} cy={n.y} r={n.r} fill={k === "core" ? "url(#topo-core)" : "#0f2a4a"} stroke={k === "core" ? "none" : "#ffffff"} strokeOpacity="0.6" strokeWidth="1.5" />
        {k !== "core" && <circle cx={n.x} cy={n.y} r="3.5" fill="#faaf6a" className="topo-dot" style={{ animationDelay: `${i * 0.5}s` }} />}
        <text x={n.x} y={n.y + n.r + 18} textAnchor="middle" className="topo-label" fill="#ffffff" fillOpacity="0.8">{n.label.toUpperCase()}</text>
      </g>
    ))}
  </svg>
);

/* Live-metrics panel: bandwidth bars + latency trace */
export const MetricsPanel = () => (
  <div className="relative bg-midnight text-white p-6 lg:p-8 overflow-hidden shadow-[0_30px_60px_-30px_rgba(8,76,152,0.45)]" data-testid="network-metrics">
    <span className="absolute top-0 left-0 right-0 h-[3px] bg-amber" />
    <div className="flex items-center justify-between mb-6">
      <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/70">Network visibility</p>
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-300"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE</span>
    </div>
    <p className="text-[11px] text-white/50 mb-2 font-mono">BANDWIDTH · 24H</p>
    <div className="flex items-end gap-[6px] h-[110px] mb-7">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="metric-bar flex-1 bg-royal/80 rounded-t-[2px]" style={{ height: `${25 + ((i * 53) % 70)}%`, animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
    <p className="text-[11px] text-white/50 mb-2 font-mono">LATENCY · MS</p>
    <svg viewBox="0 0 400 70" className="w-full h-[70px]" preserveAspectRatio="none">
      <polyline points="0,45 30,40 60,48 90,30 120,36 150,22 180,34 210,28 240,40 270,26 300,32 330,20 360,30 400,24" fill="none" stroke="#faaf6a" strokeWidth="2" className="metric-line" />
      <line x1="0" y1="60" x2="400" y2="60" stroke="#ffffff" strokeOpacity="0.15" />
    </svg>
    <div className="grid grid-cols-3 gap-4 mt-6 text-center">
      {[["99.98%", "Uptime"], ["18 ms", "Avg latency"], ["142", "Devices"]].map(([v, l]) => (
        <div key={l} className="border border-white/10 py-3"><p className="font-serif text-[22px] font-semibold text-amber">{v}</p><p className="text-[10.5px] tracking-[0.12em] uppercase text-white/60 mt-1">{l}</p></div>
      ))}
    </div>
  </div>
);

/* Continuous operating cycle: rotating ring with 4 stations */
export const CycleGraphic = ({ steps }) => (
  <div className="relative w-[300px] h-[300px] lg:w-[360px] lg:h-[360px] mx-auto" aria-hidden="true" data-testid="network-cycle">
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
      <circle cx="100" cy="100" r="80" fill="none" stroke="#c8d2de" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#faaf6a" strokeWidth="3" strokeDasharray="60 443" strokeLinecap="round" className="cycle-arc" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="#c8d2de" strokeWidth="1" strokeDasharray="3 6" className="cycle-spin-slow" />
    </svg>
    {steps.map((s, i) => {
      const a = (-90 + i * 90) * (Math.PI / 180);
      const x = 50 + 40 * Math.cos(a), y = 50 + 40 * Math.sin(a);
      return (
        <div key={s} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${x}%`, top: `${y}%` }}>
          <span className="cycle-station w-10 h-10 rounded-full bg-white border-2 border-royal flex items-center justify-center font-mono text-[11px] font-bold text-royal shadow" style={{ animationDelay: `${i * 2}s` }}>0{i + 1}</span>
          <span className="mt-1.5 text-[10.5px] font-bold tracking-[0.14em] uppercase text-royal bg-white/90 px-1.5">{s}</span>
        </div>
      );
    })}
    <div className="absolute inset-0 flex items-center justify-center"><p className="font-serif text-royal text-[15px] font-semibold text-center leading-tight max-w-[110px]">Continuous management</p></div>
  </div>
);
