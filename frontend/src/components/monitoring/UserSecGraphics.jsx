import React from "react";
import { FileText } from "lucide-react";

/* Flowing telemetry into receding control panels — "managed as one environment" */
export const FlowPanels = ({ labels, dark = false, className = "" }) => {
  const line = dark ? "#ffffff" : "#00388e";
  const faint = dark ? 0.2 : 0.16;
  const focal = { x: 336, y: 232 };
  const H = labels.length;
  return (
    <svg viewBox="0 0 620 460" className={className} aria-hidden="true" data-testid="flow-panels">
      {[0, 1, 2, 3].map((i) => {
        const x = 330 + i * 64;
        return (
          <polygon key={i} points={`${x},${100 + i * 6} ${x + 54},${78 + i * 6} ${x + 54},${372 + i * 6} ${x},${394 + i * 6}`} fill={dark ? "#ffffff" : "#1b61be"} fillOpacity={(dark ? 0.05 : 0.05) + (3 - i) * 0.03} stroke={line} strokeOpacity="0.3" className="fp-panel" style={{ animationDelay: `${i * 0.15}s` }} />
        );
      })}
      {labels.map((l, i) => {
        const y = 66 + i * (330 / (H - 1));
        const d = `M 152 ${y} C 240 ${y}, 280 ${focal.y}, ${focal.x} ${focal.y}`;
        return (
          <g key={l}>
            <path d={d} fill="none" stroke={line} strokeOpacity={faint} strokeWidth="1.3" />
            <path d={d} fill="none" stroke="#faaf6a" strokeWidth="2.4" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.5}s` }} />
            <circle cx="152" cy={y} r="4" fill={dark ? "#faaf6a" : "#1b61be"} />
            <text x="142" y={y + 4} textAnchor="end" style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: 1 }} fill={line} fillOpacity={dark ? 0.9 : 0.82}>{l}</text>
          </g>
        );
      })}
      {[[382, 150], [432, 214], [470, 300], [402, 338], [500, 186]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#faaf6a" className="mg-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </svg>
  );
};

/* Identity hero: receding access panels with icons + streaming access lines */
export const AccessLayers = ({ items, className = "" }) => (
  <div className={`al-wrap ${className}`} data-testid="access-layers">
    <svg className="al-flow" viewBox="0 0 640 420" preserveAspectRatio="none" aria-hidden="true">
      <circle cx="42" cy="356" r="7" fill="#faaf6a" className="mg-pulse" />
      {items.map((_, i) => {
        const x = 96 + i * 88;
        const d = `M 42 356 C 190 356, ${x - 30} 300, ${x} 236`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="#1b61be" strokeOpacity="0.16" strokeWidth="1.3" />
            <path d={d} fill="none" stroke="#faaf6a" strokeWidth="2.2" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        );
      })}
    </svg>
    <div className="al-panels">
      {items.map((it, i) => {
        const Icon = it.Icon;
        return (
          <div key={it.label} className="al-panel" style={{ animationDelay: `${i * 0.12}s`, marginBottom: `${(items.length - 1 - i) * 9}px` }}>
            <span className="al-inner">
              <Icon size={26} strokeWidth={1.6} className="text-royal" />
              <span className="al-label">{it.label}</span>
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

/* Threat page: security operations report mock with audit-ready callout */
export const SecOpsReport = ({ className = "" }) => (
  <div className={`relative ${className}`} data-testid="secops-report">
    <div className="bg-white border border-powder shadow-[0_30px_60px_-34px_rgba(8,76,152,0.4)] p-6">
      <div className="flex items-center justify-between">
        <p className="font-serif text-royal font-semibold text-[16px]">Security Operations Report</p>
        <span className="text-[11px] text-slatesage font-mono tracking-wide">Last 30 Days</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-5">
        {[["3,482", "Events Analyzed", "text-royal"], ["27", "Active Investigations", "text-royal"], ["0", "Critical Incidents", "text-emerald-600"]].map(([v, l, c]) => (
          <div key={l}>
            <p className={`font-serif text-[30px] font-semibold leading-none ${c}`}>{v}</p>
            <p className="text-slatesage text-[11.5px] mt-1.5 leading-tight">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-[6px] h-[96px] mt-7">
        {[38, 55, 44, 66, 50, 72, 58, 80, 62, 74, 52, 68].map((h, i) => (
          <span key={i} className="mg-rise flex-1 rounded-t-[2px]" style={{ height: `${h}%`, background: i % 3 === 0 ? "#1b61be" : i % 3 === 1 ? "#5aa0ec" : "#c8ddf7", animationDelay: `${i * 0.06}s` }} />
        ))}
      </div>
    </div>
    <div className="absolute -bottom-6 right-4 sm:right-8 bg-[#2f5149] text-white p-5 max-w-[236px] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.6)]">
      <FileText size={22} className="text-amber" />
      <p className="font-serif font-semibold text-[16px] mt-3">Audit-ready</p>
      <p className="text-white/80 text-[12.5px] leading-[1.5] mt-1.5">for frameworks including HIPAA, NYDFS Part 500, SOC 2, and NIST CSF.</p>
    </div>
  </div>
);
