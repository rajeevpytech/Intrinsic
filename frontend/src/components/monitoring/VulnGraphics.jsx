import React from "react";
import { AlertTriangle, Info, CircleAlert, CheckCircle2, Settings, BarChart3 } from "lucide-react";

const NAVY = "#0f2f7a", GOLD = "#f2a91c", GREEN = "#4a6b5c", BLUE = "#2f7ad6";

/* ---- Hero: signal lines converging into a blue plane ---- */
export const ConvergeHero = ({ className = "" }) => {
  const lanes = [
    { y: 90, x: 300, c: GREEN, sq: true },
    { y: 150, x: 200, c: GOLD },
    { y: 210, x: 480, c: NAVY, main: true },
    { y: 270, x: 240, c: "#6b8a7a" },
    { y: 330, x: 320, c: "#b9c4bb" },
  ];
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio="xMaxYMid slice" className={className} aria-hidden="true" data-testid="va-hero-graphic">
      <defs>
        <linearGradient id="va-plane" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3a7bd5" stopOpacity="0.15" /><stop offset="60%" stopColor="#2f6fd0" stopOpacity="0.85" /><stop offset="100%" stopColor="#1f56b8" /></linearGradient>
        <linearGradient id="va-green" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4d6d5c" stopOpacity="0.85" /><stop offset="100%" stopColor="#8a9a8f" stopOpacity="0.35" /></linearGradient>
        <filter id="va-glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <polygon points="640,40 720,70 720,520 640,540" fill="url(#va-plane)" className="va-plane" />
      <polygon points="722,0 1000,0 1000,560 722,560" fill="url(#va-green)" className="va-plane" style={{ "--i": 1 }} />
      <line x1="705" y1="30" x2="705" y2="540" stroke="#1f56b8" strokeWidth="4" className="va-axis" />
      {lanes.map((l, i) => (
        <g key={i}>
          <line x1="0" y1={l.y} x2={l.x} y2={l.y} stroke={l.main ? NAVY : "#9aa79e"} strokeOpacity={l.main ? 0.8 : 0.6} strokeWidth={l.main ? 3 : 2} />
          <path d={`M${l.x} ${l.y} C${l.x + 120} ${l.y}, 560 210, 705 210`} fill="none" stroke={l.main ? NAVY : "#9aa79e"} strokeOpacity={l.main ? 0.8 : 0.5} strokeWidth={l.main ? 3 : 1.6} strokeDasharray={l.main ? "" : "5 6"} pathLength="100" className="va-wire" style={{ "--i": i }} />
          <circle r="4" fill={l.c} className="va-packet" style={{ "--i": i }}><animateMotion dur="4s" repeatCount="indefinite" begin={`${i * 0.7}s`} path={`M${l.x} ${l.y} C${l.x + 120} ${l.y}, 560 210, 705 210`} /></circle>
          {l.sq || l.main ? <rect x={l.x - 8} y={l.y - 8} width="16" height="16" fill={l.c} /> : <circle cx={l.x} cy={l.y} r="8" fill={l.c} />}
        </g>
      ))}
      <line x1="705" y1="210" x2="790" y2="210" stroke={GOLD} strokeWidth="2.5" className="va-out" />
      <rect x="695" y="200" width="20" height="20" fill={GOLD} filter="url(#va-glow)" className="va-pulse" />
      <circle cx="775" cy="210" r="10" fill={GOLD} stroke="#fff" strokeWidth="2" className="va-pulse" style={{ "--i": 1 }} />
      <line x1="800" y1="120" x2="860" y2="120" stroke="#e9eee9" strokeWidth="2" />
      {["FIND", "EXPOSURE", "BEFORE", "IT BECOMES", "A PROBLEM"].map((t, i) => <text key={t} x="800" y={162 + i * 38} className="va-hero-word" style={{ "--i": i }}>{t}</text>)}
    </svg>
  );
};

/* ---- Lifecycle infographic ---- */
const GRID = [
  ["g", "g", "g", "g", "g", "G", "g", "g"], ["g", "h", "g", "d", "g", "g", "d", "g"], ["g", "g", "b", "h", "g", "g", "g", "g"], ["g", "d", "g", "b", "g", "g", "g", "g"],
];
const CELL = { g: "#b9c8bf", G: "#3f6a55", d: "#3d5a4c", b: "#2f7ad6", h: GOLD };

export const FindingsGrid = () => (
  <svg viewBox="0 0 300 200" className="w-full h-auto" aria-hidden="true" data-testid="va-findings-grid">
    <rect width="300" height="200" fill="#f3f6f8" />
    {[0, 1, 2, 3].map((r) => <line key={r} x1="18" y1={40 + r * 40} x2="282" y2={40 + r * 40} stroke="#d5dde0" strokeWidth="1.2" />)}
    {[...Array(8)].map((_, c) => <line key={c} x1={30 + c * 35} y1="22" x2={30 + c * 35} y2="180" stroke="#d5dde0" strokeWidth="1.2" />)}
    {GRID.map((row, r) => row.map((k, c) => (
      <g key={`${r}${c}`}>
        {k === "h" && <circle cx={30 + c * 35} cy={40 + r * 40} r="13" fill={GOLD} fillOpacity="0.28" className="va-halo" style={{ "--i": r + c }} />}
        <rect x={22 + c * 35} y={32 + r * 40} width="16" height="16" rx="2" fill={CELL[k]} className={k === "h" ? "va-pulse" : ""} />
      </g>
    )))}
  </svg>
);

export const PriorityStack = () => {
  const rows = [
    { Icon: AlertTriangle, t: "High Priority", s: "Material risk, immediate attention", n: 12, bg: "#fdf1dd", bar: GOLD, ic: GOLD },
    { Icon: Info, t: "Medium Priority", s: "Assess and plan remediation", n: 28, bg: "#e6eefb", bar: BLUE, ic: BLUE },
    { Icon: CircleAlert, t: "Low Priority", s: "Monitor and address over time", n: 64, bg: "#e7ede8", bar: GREEN, ic: GREEN },
  ];
  return (
    <div className="space-y-2.5" data-testid="va-priority-stack">
      {rows.map((r, i) => (
        <div key={r.t} className="va-prow" style={{ background: r.bg, borderColor: r.bar, "--i": i }}>
          <r.Icon size={26} strokeWidth={2} style={{ color: r.ic }} />
          <div className="flex-1 min-w-0"><p className="font-semibold text-[#0f2f7a] text-[15px] leading-tight">{r.t}</p><p className="text-[#4a5259] text-[11.5px] mt-0.5 truncate">{r.s}</p></div>
          <span className="va-pnum">{r.n}</span>
        </div>
      ))}
    </div>
  );
};

export const ResolveStack = () => {
  const rows = [
    { Icon: CheckCircle2, t: "Remediate", s: "Apply fixes and updates", pct: 75, c: GREEN, bg: "#e7ede8" },
    { Icon: Settings, t: "Validate", s: "Confirm resolution", pct: 60, c: BLUE, bg: "#e6eefb" },
    { Icon: BarChart3, t: "Monitor", s: "Track and manage", pct: 100, c: "#3d5a4c", bg: "#e7ede8" },
  ];
  return (
    <div className="space-y-2.5" data-testid="va-resolve-stack">
      {rows.map((r, i) => (
        <div key={r.t} className="va-rrow" style={{ "--i": i }}>
          <span className="va-ricon" style={{ background: r.bg, color: r.c }}><r.Icon size={18} strokeWidth={2} /></span>
          <div className="min-w-0"><p className="font-semibold text-[#0f2f7a] text-[14.5px] leading-tight">{r.t}</p><p className="text-[#4a5259] text-[11px] mt-0.5 truncate">{r.s}</p></div>
          <span className="va-track"><span className="va-fill" style={{ "--w": `${r.pct}%`, background: r.c }} /></span>
          <span className="text-[#0f2f7a] text-[12px] font-semibold w-[38px] text-right">{r.pct}%</span>
        </div>
      ))}
    </div>
  );
};

/* ---- Reporting: ring + trend ---- */
export const Ring = ({ pct = 75 }) => {
  const r = 30, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="w-[74px] h-[74px] shrink-0" aria-hidden="true">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#dfe7f3" strokeWidth="7" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={BLUE} strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 40 40)" className="va-ring" style={{ "--c": c }} />
      <text x="40" y="45" textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 700 }} fill={NAVY}>{`${pct}%`}</text>
    </svg>
  );
};

export const TrendChart = () => (
  <svg viewBox="0 0 320 130" className="w-full h-auto" aria-hidden="true" data-testid="va-trend">
    {[0, 40, 80, 120].map((v, i) => <text key={v} x="22" y={112 - i * 30} textAnchor="end" style={{ fontFamily: "Inter", fontSize: 8 }} fill="#7c8791">{v}</text>)}
    <polygon points="34,20 96,58 158,80 220,92 282,104 282,110 34,110" fill="#4a6b5c" fillOpacity="0.14" />
    <polyline points="34,20 96,58 158,80 220,92 282,104" fill="none" stroke="#4a6b5c" strokeWidth="2.2" pathLength="100" className="va-trendline" />
    {[[34, 20], [96, 58], [158, 80], [220, 92], [282, 104]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill="#4a6b5c" className="va-dot" style={{ "--i": i }} />)}
    {["Q1", "Q2", "Q3", "Q4", "Today"].map((l, i) => <text key={l} x={34 + i * 62} y="124" textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 8 }} fill="#7c8791">{l}</text>)}
    <text x="180" y="24" style={{ fontFamily: "Inter", fontSize: 9.5, fontWeight: 600 }} fill="#2b3550">Decreasing risk,</text>
    <text x="180" y="36" style={{ fontFamily: "Inter", fontSize: 9.5, fontWeight: 600 }} fill="#2b3550">stronger security posture.</text>
  </svg>
);
