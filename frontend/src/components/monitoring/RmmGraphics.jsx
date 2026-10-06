import React from "react";

const NAVY = "#00388e";

/* ---- Step icons (traced from mock) ---- */
const MonitorIcon = () => (
  <g fill="none" stroke={NAVY} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="18" y="20" width="64" height="44" rx="4" />
    <path d="M28 44h10l6-12 8 24 6-12h14" />
    <path d="M42 76h16M50 64v12" />
  </g>
);
const DetectIcon = () => (
  <g fill="none" stroke={NAVY} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="44" cy="42" r="26" />
    <path d="M63 61l19 19" strokeWidth="6" />
    <path d="M44 28v16" />
    <circle cx="44" cy="53" r="1.8" fill={NAVY} />
  </g>
);
const TriageIcon = () => (
  <g fill="none" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 22l12 12M22 26l12 12M30 36l34 34" stroke="#4f5d75" />
    <path d="M78 22a12 12 0 0 1-14 16L36 66l-6-6 28-28a12 12 0 0 1 16-14l-8 8 6 6z" stroke="#4f5d75" />
    <path d="M40 66l-8 8-6-6 8-8" stroke="#f28c1b" strokeWidth="5" />
  </g>
);
const RemediateIcon = () => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g className="rp-gear" stroke="#ffffff" strokeWidth="3.5">
      <circle cx="50" cy="50" r="24" />
      {[...Array(8)].map((_, k) => (
        <rect key={k} x="44" y="14" width="12" height="14" rx="2" transform={`rotate(${k * 45} 50 50)`} fill="#0b4aa2" />
      ))}
    </g>
    <path d="M62 44a14 14 0 1 0 2 12" stroke="#f28c1b" strokeWidth="4" />
    <path d="M64 38v10h-10" stroke="#f28c1b" strokeWidth="4" />
  </g>
);

export const STEPS = [
  { n: "01", label: "MONITOR", Icon: MonitorIcon, circle: "#d6e4f7", color: "#00388e", bar: "#00388e", items: ["Device and system health", "Performance monitoring", "Availability and uptime", "Automated alerts"] },
  { n: "02", label: "DETECT", Icon: DetectIcon, circle: "#d6e4f7", color: "#1a7ff0", bar: "#1a7ff0", items: ["Anomaly detection", "Threshold alerts", "Proactive issue identification", "Root cause analysis"] },
  { n: "03", label: "TRIAGE", Icon: TriageIcon, circle: "#dcdfe4", color: "#4f5d75", bar: "#4f5d75", items: ["Automated remediation", "Issue prioritization", "Patch management", "Escalation when needed"] },
  { n: "04", label: "REMEDIATE", Icon: RemediateIcon, circle: "#0b4aa2", color: "#00388e", bar: "#f28c1b", items: ["Remote issue resolution", "Ongoing optimization", "Configuration management", "Reduced downtime"] },
];

/* ---- Response timeline: line + 4 circles ---- */
export const ResponseTimeline = () => (
  <div className="rp-grid" data-testid="rmm-response-timeline">
    <svg viewBox="0 0 1600 200" className="rp-line-svg" aria-hidden="true" preserveAspectRatio="none">
      <line x1="30" y1="100" x2="1570" y2="100" stroke={NAVY} strokeWidth="6" className="rp-line" pathLength="100" />
      <circle cx="30" cy="100" r="22" fill={NAVY} className="rp-end" />
      <circle cx="1570" cy="100" r="22" fill={NAVY} className="rp-end" style={{ "--i": 1 }} />
      <circle r="8" fill="#5ec8ff" className="rp-runner">
        <animateMotion dur="5s" repeatCount="indefinite" path="M30 100 H1570" begin="1.6s" />
      </circle>
    </svg>
    {STEPS.map((s, i) => (
      <div key={s.n} className="rp-step" style={{ "--i": i }} data-testid={`rmm-step-${i}`}>
        <span className="rp-num" style={{ color: i === 3 ? "#f28c1b" : i === 2 ? "#4f5d75" : s.color }}>{s.n}</span>
        <div className="rp-circle" style={{ background: s.circle }}>
          <svg viewBox="0 0 100 100" className="rp-icon" aria-hidden="true"><s.Icon /></svg>
        </div>
        <h3 className="rp-label" style={{ color: s.color }}>{s.label}</h3>
        <ul className="rp-list" style={{ borderColor: s.bar }}>
          {s.items.map((it) => <li key={it}>{it}</li>)}
        </ul>
      </div>
    ))}
  </div>
);

/* ---- Hero telemetry panel (traced from mock) ---- */
const LANES = [
  { label: "SERVERS", status: "HEALTHY", kind: "wave", ok: true },
  { label: "ENDPOINTS", status: "STABLE", kind: "ticks", ok: true },
  { label: "NETWORK", status: "OPTIMAL", kind: "wave", ok: true },
  { label: "APPLICATIONS", status: "HEALTHY", kind: "bars", ok: true },
  { label: "PATCHING", status: "ATTENTION", kind: "flat", ok: false },
  { label: "BACKUPS", status: "ON TRACK", kind: "wave2", ok: true },
];
const X0 = 235, X1 = 690;
const BARS = [12, 6, 6, 22, 30, 44, 60, 40, 28, 18, 10, 8, 18, 34, 46, 30, 14, 10];

const Lane = ({ lane, y, i }) => {
  const mid = (X0 + X1) / 2;
  const track = "#4f8fe0";
  return (
    <g className="tl-lane" style={{ "--i": i }}>
      <text x="0" y={y + 7} className="tl-label">{lane.label}</text>
      <circle cx={X0} cy={y} r="11" fill="#e8f0fb" />
      {lane.kind === "wave" && (
        <>
          <path d={`M${X0} ${y} C${X0 + 60} ${y}, ${X0 + 90} ${y - 32}, ${X0 + 140} ${y - 30} S${X0 + 220} ${y + 14}, ${X0 + 290} ${y + 4} L${X1} ${y}`} fill="none" stroke={track} strokeWidth="4" strokeLinecap="round" />
          <line x1={X0 + 330} y1={y} x2={X0 + 430} y2={y} stroke="#4ad4ff" strokeWidth="9" strokeLinecap="round" className="tl-seg" />
        </>
      )}
      {lane.kind === "wave2" && (
        <>
          <path d={`M${X0} ${y} L${X0 + 120} ${y} C${X0 + 160} ${y}, ${X0 + 180} ${y - 18}, ${X0 + 230} ${y - 16} S${X0 + 330} ${y + 12}, ${X0 + 400} ${y - 4} L${X1} ${y}`} fill="none" stroke={track} strokeWidth="4" strokeLinecap="round" />
          <line x1={X0 + 260} y1={y - 14} x2={X0 + 340} y2={y - 14} stroke="#4ad4ff" strokeWidth="9" strokeLinecap="round" className="tl-seg" />
        </>
      )}
      {lane.kind === "ticks" && (
        <>
          <line x1={X0} y1={y} x2={X1} y2={y} stroke={track} strokeWidth="4" strokeLinecap="round" />
          {[[170, 22], [196, 14], [214, 30], [232, 12], [336, 18], [378, 10], [392, 14]].map(([dx, h], k) => (
            <rect key={k} x={X0 + dx} y={y - h / 2} width="8" height={h} rx="3" fill="#4ad4ff" className="tl-tick" style={{ "--k": k }} />
          ))}
        </>
      )}
      {lane.kind === "bars" && (
        <>
          <line x1={X0} y1={y} x2={X1} y2={y} stroke={track} strokeWidth="4" strokeLinecap="round" />
          {BARS.map((h, k) => (
            <rect key={k} x={X0 + 60 + k * 24} y={y - h - 3} width="9" height={h} rx="3" fill="#4ad4ff" className="tl-bar" style={{ "--k": k }} />
          ))}
        </>
      )}
      {lane.kind === "flat" && (
        <>
          <line x1={X0} y1={y} x2={X1} y2={y} stroke={track} strokeWidth="4" strokeLinecap="round" />
          <circle cx={X0 + 100} cy={y} r="8" fill="#4ad4ff" className="tl-blip" />
          <line x1={X0 + 350} y1={y} x2={X0 + 450} y2={y} stroke="#f7b23b" strokeWidth="10" strokeLinecap="round" className="tl-warn" />
        </>
      )}
      <circle cx={X1 + 45} cy={y} r="15" fill={lane.ok ? "#7fd1a5" : "#f7b23b"} className="tl-status" />
      <text x={X1 + 90} y={y + 8} className="tl-status-text" fill={lane.ok ? "#7fd1a5" : "#f7b23b"}>{lane.status}</text>
      <rect x={mid - 40} y={y - 40} width="80" height="80" fill="none" />
    </g>
  );
};

export const TelemetryPanel = ({ className = "" }) => (
  <svg viewBox="0 0 1100 860" className={className} aria-hidden="true" data-testid="telemetry-graphic">
    <defs>
      <radialGradient id="tl-bg" cx="35%" cy="30%" r="90%">
        <stop offset="0%" stopColor="#1f63c9" /><stop offset="55%" stopColor="#0d47a8" /><stop offset="100%" stopColor="#062f7d" />
      </radialGradient>
      <clipPath id="tl-clip"><rect width="1100" height="860" rx="18" /></clipPath>
    </defs>
    <g clipPath="url(#tl-clip)">
      <rect width="1100" height="860" fill="url(#tl-bg)" />
      {[560, 640, 720].map((r, k) => (
        <circle key={r} cx="1180" cy="430" r={r} fill="none" stroke="#9fc4ff" strokeOpacity={0.5 - k * 0.14} strokeWidth="1.6" />
      ))}
      <circle cx="1180" cy="430" r="640" fill="none" stroke="#ffffff" strokeWidth="2.5" className="tl-arc" />
      <circle cx="1040" cy="135" r="11" fill="#7fd1a5" className="tl-orb" />
      <circle cx="1015" cy="315" r="10" fill="#9aa08a" className="tl-orb" style={{ "--k": 1 }} />
      <circle cx="1012" cy="640" r="10" fill="#d9a04a" className="tl-orb" style={{ "--k": 2 }} />
      {[...Array(14)].map((_, k) => <circle key={k} cx={960 + (k % 4) * 14} cy={720 + Math.floor(k / 4) * 14} r="1.6" fill="#9fc4ff" fillOpacity="0.6" />)}
      <text x="60" y="145" className="tl-title">TELEMETRY · LIVE</text>
      <line x1="370" y1="137" x2="690" y2="137" stroke="#c9dcff" strokeWidth="1.5" strokeOpacity="0.8" />
      <g transform="translate(60 0)">
        {LANES.map((ln, i) => <Lane key={ln.label} lane={ln} y={228 + i * 96} i={i} />)}
      </g>
    </g>
  </svg>
);
