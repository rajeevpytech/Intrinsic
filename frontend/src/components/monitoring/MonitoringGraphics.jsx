import React from "react";

/* ---- Shared: faint plus-grid dots for dark hero constellations ---- */
const GridDots = ({ w, h, step = 46 }) => {
  const dots = [];
  for (let x = step; x < w; x += step) for (let y = step; y < h; y += step) dots.push([x, y]);
  return (
    <g>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill="#ffffff" fillOpacity="0.10" />
      ))}
    </g>
  );
};

/* ---- Hero: data constellation (nodes streaming into a focal point) ---- */
export const DataConstellation = ({ nodes, focal, className = "" }) => (
  <svg viewBox="0 0 560 460" className={className} aria-hidden="true" data-testid="data-constellation">
    <GridDots w={560} h={460} />
    {nodes.map((n, i) => (
      <g key={n.label}>
        <line x1={n.x} y1={n.y} x2={focal.x} y2={focal.y} stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.4" />
        <line x1={n.x} y1={n.y} x2={focal.x} y2={focal.y} stroke="#faaf6a" strokeWidth="2.6" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.7}s` }} />
      </g>
    ))}
    {nodes.map((n, i) => (
      <g key={n.label + "n"} className="topo-node" style={{ animationDelay: `${i * 0.12}s` }}>
        <circle cx={n.x} cy={n.y} r="5.5" fill={n.accent ? "#faaf6a" : "#0f2a4a"} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" />
        <circle cx={n.x} cy={n.y} r="2.5" fill="#faaf6a" className="topo-dot" style={{ animationDelay: `${i * 0.5}s` }} />
        <text x={n.x} y={n.y - 14} textAnchor="middle" className="topo-label" fill="#ffffff" fillOpacity="0.85">{n.label}</text>
      </g>
    ))}
    <circle cx={focal.x} cy={focal.y} r="52" fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />
    <rect x={focal.x - 66} y={focal.y - 34} width="132" height="68" rx="12" fill="url(#dc-hub)" />
    <defs><radialGradient id="dc-hub" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#faaf6a" /><stop offset="100%" stopColor="#e08f3d" /></radialGradient></defs>
    {focal.lines.map((l, i) => (
      <text key={l} x={focal.x} y={focal.y - (focal.lines.length - 1) * 8 + i * 16 + 4} textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 800, letterSpacing: 1.4 }} fill="#1a1a2e">{l}</text>
    ))}
  </svg>
);

/* ---- SIEM: sources funnel into a single monitored view ---- */
export const SiemFunnel = ({ className = "" }) => {
  const sources = ["Endpoints", "Network", "Microsoft 365", "Cloud", "Identity", "Apps"];
  return (
    <svg viewBox="0 0 560 460" className={className} aria-hidden="true" data-testid="siem-funnel">
      {sources.map((s, i) => {
        const x = 55 + i * 90;
        return (
          <g key={s}>
            <rect x={x - 36} y="34" width="72" height="44" rx="8" fill="#ffffff" stroke="#c8d2de" className="m365-tile-box" style={{ animationDelay: `${i * 0.15}s` }} />
            <text x={x} y="60" textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 9.5, fontWeight: 700 }} fill="#00388e">{s.toUpperCase()}</text>
            <path d={`M ${x} 78 C ${x} 130, 280 130, 280 190`} fill="none" stroke="#c8d2de" strokeWidth="1.4" />
            <path d={`M ${x} 78 C ${x} 130, 280 130, 280 190`} fill="none" stroke="#1b61be" strokeWidth="2.6" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.6}s` }} />
          </g>
        );
      })}
      {/* funnel */}
      <polygon points="150,190 410,190 320,270 240,270" fill="#eaf1fc" stroke="#1b61be" strokeOpacity="0.35" />
      <text x="280" y="228" textAnchor="middle" style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700 }} fill="#00388e">SIEM</text>
      <text x="280" y="248" textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 9.5, fontWeight: 700, letterSpacing: 1 }} fill="#4a5259">COLLECT · CORRELATE · ANALYSE</text>
      <line x1="280" y1="270" x2="280" y2="330" stroke="#c8d2de" strokeWidth="1.4" />
      <line x1="280" y1="270" x2="280" y2="330" stroke="#faaf6a" strokeWidth="3" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: "1.2s" }} />
      <circle cx="280" cy="330" r="44" fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />
      {/* SOC card */}
      <rect x="170" y="352" width="220" height="66" rx="10" fill="#00388e" />
      <text x="280" y="382" textAnchor="middle" style={{ fontFamily: "Playfair Display, serif", fontSize: 17, fontWeight: 700 }} fill="#ffffff">Intrinsic SOC</text>
      <text x="280" y="401" textAnchor="middle" style={{ fontFamily: "Inter", fontSize: 9, fontWeight: 600, letterSpacing: 1 }} fill="#faaf6a">MONITORING · INVESTIGATION · RESPONSE</text>
    </svg>
  );
};

/* ---- SIEM: correlation web (sources converge to a highlighted event) ---- */
export const CorrelationWeb = ({ className = "" }) => {
  const rows = ["Identity", "Endpoints", "Network", "Microsoft 365", "Cloud", "Applications"];
  return (
    <svg viewBox="0 0 480 380" className={className} aria-hidden="true" data-testid="correlation-web">
      {rows.map((r, i) => {
        const y = 44 + i * 56;
        return (
          <g key={r}>
            <circle cx="40" cy={y} r="4.5" fill="#1b61be" />
            <text x="56" y={y + 4} style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 600 }} fill="#4a5259">{r}</text>
            <path d={`M 150 ${y} C 260 ${y}, 300 200, 360 200`} fill="none" stroke="#c8d2de" strokeWidth="1.3" />
            <path d={`M 150 ${y} C 260 ${y}, 300 200, 360 200`} fill="none" stroke="#1b61be" strokeWidth="2.4" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        );
      })}
      {[[210, 120], [250, 250], [300, 90], [330, 300], [190, 300], [280, 160]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#94a3b8" fillOpacity="0.6" className="topo-dot" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      <circle cx="380" cy="200" r="30" fill="none" stroke="#faaf6a" strokeOpacity="0.5" className="topo-ping" />
      <circle cx="380" cy="200" r="14" fill="#faaf6a" />
      <text x="380" y="248" textAnchor="middle" className="perim-label" fill="#00388e">CORRELATED EVENT</text>
    </svg>
  );
};

/* ---- Vuln: exposure meters converge to a PRIORITY finding ---- */
export const ExposureMeters = ({ items, className = "" }) => (
  <div className={`bg-white border border-powder p-6 lg:p-8 ${className}`} data-testid="exposure-meters">
    <div className="grid grid-cols-[1fr_auto] gap-x-8 items-center">
      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={it.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-slatesage">{it.label}</span>
              <span className="font-serif text-royal text-[17px] font-semibold">{it.value}</span>
            </div>
            <div className="h-2 bg-ice rounded-full overflow-hidden">
              <span className="mg-fill block h-full rounded-full" style={{ width: `${it.pct}%`, background: it.accent ? "#faaf6a" : "#1b61be", animationDelay: `${i * 0.18}s` }} />
            </div>
            <p className="text-slatesage text-[12px] mt-1">{it.hint}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <span className="w-3 h-3 rounded-full bg-amber mg-pulse" />
        <span className="w-px flex-1 my-2 bg-powder" />
        <div className="text-center">
          <p className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-royal">Priority</p>
          <p className="text-slatesage text-[11px] mt-1 max-w-[92px]">Findings evaluated in context</p>
        </div>
      </div>
    </div>
  </div>
);

/* ---- Shared reporting dashboard mock (SIEM + Vuln) ---- */
export const ReportingDashboard = ({ tabs, bigStat, bigLabel, statusRows, trendPct, trendLabel, extraStat, className = "" }) => (
  <div className={`bg-white border border-powder shadow-[0_30px_60px_-34px_rgba(8,76,152,0.4)] ${className}`} data-testid="reporting-dashboard">
    <div className="flex items-center justify-between px-6 pt-5">
      <p className="font-serif text-royal font-semibold text-[17px]">Security Overview</p>
      <span className="inline-flex items-center gap-2 text-[10.5px] font-semibold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE</span>
    </div>
    <div className="flex gap-5 px-6 mt-3 border-b border-powder">
      {tabs.map((t, i) => (
        <span key={t} className={`pb-2.5 text-[12px] font-semibold ${i === 0 ? "text-royal border-b-2 border-amber" : "text-slatesage"}`}>{t}</span>
      ))}
    </div>
    <div className="grid sm:grid-cols-3 gap-6 p-6">
      <div>
        <p className="font-serif text-royal text-[40px] font-semibold leading-none">{bigStat}</p>
        <p className="text-slatesage text-[12px] mt-1.5">{bigLabel}</p>
        <div className="flex items-end gap-[5px] h-[52px] mt-4">
          {[40, 62, 48, 74, 55, 82, 60].map((h, i) => (
            <span key={i} className="mg-rise flex-1 bg-royal/70 rounded-t-[2px]" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
      <div>
        <p className="font-mono text-[10.5px] font-bold tracking-[0.14em] uppercase text-slatesage mb-3">Remediation Status</p>
        <div className="space-y-2.5">
          {statusRows.map((r, i) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
              <span className="h-2 rounded-full mg-fill" style={{ width: `${r.pct}%`, background: r.color, animationDelay: `${i * 0.14}s` }} />
              <span className="font-serif text-royal text-[13px] font-semibold ml-auto">{r.value}</span>
              <span className="text-slatesage text-[11px] w-[74px]">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="font-mono text-[10.5px] font-bold tracking-[0.14em] uppercase text-slatesage mb-3">Risk Trend</p>
        <svg viewBox="0 0 200 60" className="w-full h-[52px]" preserveAspectRatio="none">
          <polyline points="0,44 28,38 56,42 84,26 112,32 140,20 168,28 200,16" fill="none" stroke="#faaf6a" strokeWidth="2.5" className="metric-line" />
        </svg>
        <p className="font-serif text-emerald-600 text-[26px] font-semibold mt-2">{trendPct}</p>
        <p className="text-slatesage text-[11px]">{trendLabel}</p>
        {extraStat && (
          <div className="mt-4 pt-4 border-t border-powder">
            <p className="font-serif text-royal text-[22px] font-semibold">{extraStat.value}</p>
            <p className="text-slatesage text-[11px]">{extraStat.label}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ---- RMM: telemetry lanes with travelling pulses + status ---- */
export const TelemetryGraphic = ({ className = "" }) => {
  const lanes = [
    { label: "SERVERS", ok: true },
    { label: "ENDPOINTS", ok: true },
    { label: "NETWORK", ok: true },
    { label: "APPLICATIONS", ok: true },
    { label: "PATCHING", ok: true },
    { label: "BACKUPS", ok: false },
  ];
  return (
    <svg viewBox="0 0 560 440" className={className} aria-hidden="true" data-testid="telemetry-graphic">
      <text x="0" y="24" style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 800, letterSpacing: 2 }} fill="#ffffff" fillOpacity="0.85">TELEMETRY · LIVE</text>
      {lanes.map((ln, i) => {
        const y = 66 + i * 60;
        return (
          <g key={ln.label}>
            <text x="0" y={y + 4} style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 700, letterSpacing: 1.4 }} fill="#ffffff" fillOpacity="0.8">{ln.label}</text>
            <line x1="150" y1={y} x2="500" y2={y} stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.4" />
            <line x1="150" y1={y} x2="500" y2={y} stroke={ln.ok ? "#5eead4" : "#faaf6a"} strokeWidth="2.6" strokeLinecap="round" pathLength="100" className="topo-packet" style={{ animationDelay: `${i * 0.55}s` }} />
            <circle cx="518" cy={y} r="6" fill={ln.ok ? "#34d399" : "#faaf6a"} className="mg-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            <circle cx="150" cy={y} r="3" fill="#ffffff" fillOpacity="0.6" />
          </g>
        );
      })}
    </svg>
  );
};
