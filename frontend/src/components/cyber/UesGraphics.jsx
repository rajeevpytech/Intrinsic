import React from "react";

const GREEN = "#2f6b57";

const lines = (() => {
  const out = [];
  const cols = ["#1e4fd8", "#3f7fe0", "#8fb3e8", "#9fb0c4", "#c3cfdf", "#2f6fd0", "#b9c7d9", "#6d94d9"];
  for (let i = 0; i < 16; i++) {
    const y0 = -30 + i * 38;
    const y1 = -20 + ((i * 7) % 16) * 36;
    const mid = 262 + (i % 3) * 6;
    out.push({
      d: `M-20 ${y0} C 200 ${y0}, 330 ${mid}, 470 ${mid} S 640 ${mid - 14}, 720 ${mid + 4} S 880 ${y1}, 1000 ${y1}`,
      c: cols[i % cols.length],
      w: 1.2 + (i % 3) * 0.6,
      o: 0.5 + (i % 4) * 0.12,
      flow: i % 4 === 0,
    });
  }
  return out;
})();

const NODES = [[48, 51], [63.3, 48.5], [73.5, 51.5]];

export const ConvergeLines = ({ className = "" }) => (
  <div className={className} data-testid="ues-converge-lines">
  <svg viewBox="0 0 980 520" className="absolute inset-0 w-full h-full" fill="none" aria-hidden="true" preserveAspectRatio="none">
    <defs>
      <linearGradient id="uesFade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fff" stopOpacity="0" /><stop offset="28%" stopColor="#fff" stopOpacity="1" /><stop offset="100%" stopColor="#fff" stopOpacity="1" /></linearGradient>
      <mask id="uesMask"><rect x="-40" y="-40" width="1100" height="600" fill="url(#uesFade)" /></mask>
    </defs>
    <g mask="url(#uesMask)">
    {lines.map((l, i) => (
      <path key={i} d={l.d} stroke={l.c} strokeWidth={l.w} strokeOpacity={l.o} strokeLinecap="round" className={l.flow ? "pm-wire" : ""} />
    ))}
    </g>
  </svg>
  {NODES.map(([x, y], i) => (
    <span key={i} className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-amber ring-[2.5px] ring-white shadow-[0_0_0_10px_rgba(245,166,35,0.18)] pm-pulse-node" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }} />
  ))}
  </div>
);

const LEFT = ["Users", "Devices", "Communications"];
const RIGHT = ["Applications", "Web Access", "Business Outcomes"];

export const ConnectedView = ({ className = "" }) => (
  <svg viewBox="0 0 700 260" className={className} fill="none" aria-hidden="true" data-testid="ues-connected-view">
    {LEFT.map((l, i) => {
      const y = 60 + i * 70;
      return (
        <g key={l}>
          <text x="118" y={y + 5} textAnchor="end" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="15" fill="#ffffff">{l}</text>
          <path d={`M130 ${y} C 190 ${y}, 200 130, 250 130`} stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.6" />
          <circle cx="130" cy={y} r="5.5" fill="#f2a91c" />
        </g>
      );
    })}
    {RIGHT.map((l, i) => {
      const y = 60 + i * 70;
      return (
        <g key={l}>
          <path d={`M390 130 C 440 130, 450 ${y}, 510 ${y}`} stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.6" />
          <circle cx="510" cy={y} r="5.5" fill="#ffffff" />
          <text x="524" y={y + 5} fontFamily="'DM Sans', system-ui, sans-serif" fontSize="15" fill="#ffffff">{l}</text>
        </g>
      );
    })}
    <rect x="250" y="88" width="140" height="84" rx="3" fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.4" />
    <text x="320" y="124" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="24" fill="#ffffff">Intrinsic</text>
    <text x="320" y="144" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="8.5" fontWeight="700" fill="#ffffff" fillOpacity="0.85" style={{ letterSpacing: "2px" }}>MANAGED SECURITY</text>
    <text x="320" y="158" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="8.5" fontWeight="700" fill="#ffffff" fillOpacity="0.85" style={{ letterSpacing: "2px" }}>SERVICES</text>
    <circle cx="250" cy="130" r="4" fill="#f2a91c" />
    <circle cx="390" cy="130" r="4" fill="#ffffff" />
  </svg>
);

export const UES_GREEN = GREEN;
