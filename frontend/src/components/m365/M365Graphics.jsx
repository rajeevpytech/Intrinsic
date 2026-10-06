import React from "react";
import { Users, BarChart3, Shield, Settings, FileText, Headphones } from "lucide-react";

const NAVY = "#12306e";
const BLUE = "#1a56c4";
const SANS = "'DM Sans', sans-serif";

const MsLogo = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="0" y="0" width="26" height="26" fill="#f25022" />
    <rect x="30" y="0" width="26" height="26" fill="#7fba00" />
    <rect x="0" y="30" width="26" height="26" fill="#00a4ef" />
    <rect x="30" y="30" width="26" height="26" fill="#ffb900" />
  </g>
);

/* ---------------- HERO MOSAIC ---------------- */
const BANDS = [
  { x: 380, y: 0, w: 76, h: 680, o: 0.95, c: "#1e5fd6", d: "0s" },
  { x: 456, y: 0, w: 46, h: 680, o: 0.55, c: "#5b8fe6", d: "-3s" },
  { x: 502, y: 40, w: 48, h: 640, o: 0.35, c: "#8fb4ef", d: "-6s" },
  { x: 330, y: 120, w: 50, h: 480, o: 0.4, c: "#8fb4ef", d: "-2s" },
  { x: 560, y: 90, w: 60, h: 520, o: 0.5, c: "#5b8fe6", d: "-8s" },
  { x: 620, y: 200, w: 70, h: 320, o: 0.6, c: "#3d78dd", d: "-4s" },
  { x: 160, y: 300, w: 700, h: 60, o: 0.35, c: "#8fb4ef", d: "-5s" },
  { x: 300, y: 360, w: 520, h: 50, o: 0.3, c: "#b7cff5", d: "-1s" },
  { x: 250, y: 230, w: 160, h: 80, o: 0.45, c: "#5b8fe6", d: "-7s" },
  { x: 560, y: 400, w: 80, h: 200, o: 0.45, c: "#3d78dd", d: "-9s" },
];
const PANELS = [
  { x: 110, y: 70, w: 380, h: 220, fill: "#dbe7fb", title: ["IDENTITY", "& ACCESS"], items: ["Entra ID", "Authentication", "Permissions"], dot: { cx: 365, cy: 150, c: BLUE }, conn: "M 365 150 H 470 V 250", d: 0 },
  { x: 600, y: 70, w: 290, h: 220, fill: "#e8ebf0", title: ["COMMUNICATION"], items: ["Outlook", "Email", "Calendar", "Meetings"], dot: { cx: 640, cy: 180, c: "#f39b1b" }, conn: "M 640 180 H 655 V 300 H 585", d: 0.2, tx: 680 },
  { x: 110, y: 370, w: 260, h: 230, fill: "#e8ebf0", title: ["COLLABORATION", "& INFORMATION"], items: ["Teams", "SharePoint", "OneDrive", "Documents"], dot: { cx: 360, cy: 455, c: "#4a5b7a" }, conn: "M 360 455 H 440 V 395", d: 0.4 },
  { x: 620, y: 370, w: 270, h: 230, fill: "#dbe7fb", title: ["SECURITY", "& GOVERNANCE"], items: ["Information Protection", "Access Controls", "Data Retention", "Compliance"], dot: { cx: 630, cy: 485, c: "#2a72e8" }, conn: "M 630 485 H 600 V 392", d: 0.6, tx: 665 },
];

export const M365PanelsMobile = () => (
  <div className="grid grid-cols-2 gap-3" data-testid="m365-panels-mobile">
    {PANELS.map((p) => (
      <div key={p.title.join()} className="p-4" style={{ background: p.fill }}>
        <p className="text-[#1a56c4] font-bold text-[12px] leading-tight">{p.title.join(" ")}</p>
        <span className="block w-6 h-[3px] bg-[#f39b1b] mt-2" />
        <p className="text-[#3d4a63] text-[12px] leading-[1.5] mt-2">{p.items.join(" · ")}</p>
      </div>
    ))}
  </div>
);

export const M365Mosaic = ({ className = "" }) => (
  <div className={className} aria-hidden="true" data-testid="m365-mosaic">
    <svg viewBox="0 0 1000 680" className="w-full h-auto overflow-visible">
      <defs>
        <filter id="mm-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0b3d9e" floodOpacity="0.18" /></filter>
      </defs>
      {BANDS.map((b, i) => (
        <rect key={i} className="mm-band" x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} fillOpacity={b.o} style={{ animationDelay: b.d, "--i": i }} />
      ))}
      {PANELS.map((p, i) => {
        const tx = p.tx || p.x + 30;
        const ty = p.y + 45;
        const n = p.title.length;
        return (
          <g key={i} className="mm-panel" style={{ animationDelay: `${0.3 + p.d}s` }}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={p.fill} fillOpacity="0.92" />
            {p.title.map((t, j) => <text key={t} x={tx} y={ty + j * 30} fill={BLUE} fontFamily={SANS} fontSize="24" fontWeight="700">{t}</text>)}
            <rect x={tx} y={ty + (n - 1) * 30 + 14} width="40" height="4" fill="#f39b1b" />
            {p.items.map((t, j) => <text key={t} x={tx} y={ty + (n - 1) * 30 + 52 + j * 27} fill="#3d4a63" fontFamily={SANS} fontSize="18">{t}</text>)}
          </g>
        );
      })}
      {PANELS.map((p, i) => (
        <g key={`c${i}`}>
          <path className="mm-conn" d={p.conn} fill="none" stroke={BLUE} strokeWidth="10" strokeLinejoin="miter" style={{ animationDelay: `${1 + p.d}s` }} />
          <circle className="mm-dot" cx={p.dot.cx} cy={p.dot.cy} r="17" fill={p.dot.c} stroke="#fff" strokeWidth="4" style={{ animationDelay: `${1.4 + p.d}s` }} />
        </g>
      ))}
      {/* side captions */}
      <g className="mm-panel" style={{ animationDelay: "0.9s" }}>
        {["PEOPLE", "INFORMATION", "APPLICATIONS", "CONNECTED"].map((t, j) => <text key={t} x="20" y={245 + j * 21} fill={NAVY} fontFamily={SANS} fontSize="13" fontWeight="700" letterSpacing="1.5">{t}</text>)}
        <rect x="20" y="318" width="40" height="3" fill={BLUE} />
        <line className="mm-conn" x1="40" y1="335" x2="160" y2="335" stroke={BLUE} strokeWidth="10" style={{ animationDelay: "1.2s" }} />
        <circle className="mm-dot" cx="40" cy="335" r="16" fill={BLUE} />
      </g>
      <g className="mm-panel" style={{ animationDelay: "1.1s" }}>
        {["A MORE", "PRODUCTIVE", "AND SECURE", "WORKPLACE"].map((t, j) => <text key={t} x="895" y={295 + j * 21} fill={NAVY} fontFamily={SANS} fontSize="13" fontWeight="700" letterSpacing="1.5">{t}</text>)}
        <rect x="895" y="368" width="40" height="3" fill={BLUE} />
        <line className="mm-conn" x1="830" y1="395" x2="960" y2="395" stroke="#2a72e8" strokeWidth="10" style={{ animationDelay: "1.4s" }} />
        <circle className="mm-dot" cx="960" cy="395" r="16" fill="#f39b1b" style={{ animationDelay: "0.6s" }} />
      </g>
      {/* orange accents */}
      <rect className="mm-square" x="830" y="40" width="45" height="45" fill="#f39b1b" />
      <rect className="mm-square" x="310" y="560" width="55" height="55" fill="#f39b1b" style={{ animationDelay: "-3s" }} />
      {/* centre card */}
      <g className="mm-card">
        <rect x="422" y="232" width="156" height="156" fill="#fff" filter="url(#mm-shadow)" />
        <MsLogo x={472} y={256} s={1} />
        <text x="500" y="352" textAnchor="middle" fill="#1f2937" fontFamily={SANS} fontSize="19" fontWeight="700">Microsoft 365</text>
      </g>
    </svg>
  </div>
);

/* ---------------- ONGOING MANAGEMENT ORBIT ---------------- */
const NODES = [
  { a: -90, Icon: Users, label: ["Users &", "Permissions"], pos: "top" },
  { a: -30, Icon: BarChart3, label: ["Licensing &", "Optimization"], pos: "right" },
  { a: 30, Icon: Shield, label: ["Security", "Configuration"], pos: "right" },
  { a: 90, Icon: Settings, label: ["Platform", "Changes"], pos: "bottom" },
  { a: 150, Icon: FileText, label: ["Governance", "Settings"], pos: "left" },
  { a: 210, Icon: Headphones, label: ["Support", "& Escalation"], pos: "left" },
];
const C = 260;
const R = 170;

export const M365Orbit = ({ className = "" }) => (
  <div className={className} aria-hidden="true" data-testid="m365-orbit">
    <svg viewBox="0 0 520 520" className="w-full h-auto overflow-visible">
      <defs>
        <filter id="mo-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0b3d9e" floodOpacity="0.16" /></filter>
      </defs>
      <circle cx={C} cy={C} r={R} fill="none" stroke="#d6dfee" strokeWidth="2" />
      <circle className="mo-ring" cx={C} cy={C} r={R + 12} fill="none" stroke="#b7c8e6" strokeWidth="1.5" strokeDasharray="4 10" />
      <circle r="6" fill="#f39b1b" className="mo-sat">
        <animateMotion dur="12s" repeatCount="indefinite" path={`M ${C} ${C - R} a ${R} ${R} 0 1 1 0 ${2 * R} a ${R} ${R} 0 1 1 0 ${-2 * R}`} />
      </circle>
      <g className="mo-center">
        <circle cx={C} cy={C} r="78" fill="#fff" filter="url(#mo-shadow)" />
        <MsLogo x={C - 22} y={C - 50} s={0.8} />
        <text x={C} y={C + 20} textAnchor="middle" fill="#1f2937" fontFamily={SANS} fontSize="15" fontWeight="700">Microsoft 365</text>
        <text x={C} y={C + 40} textAnchor="middle" fill={BLUE} fontFamily={SANS} fontSize="12.5" fontWeight="700">Ongoing Management</text>
      </g>
      {NODES.map((n, i) => {
        const rad = (n.a * Math.PI) / 180;
        const x = C + R * Math.cos(rad);
        const y = C + R * Math.sin(rad);
        const anchor = n.pos === "left" ? "end" : n.pos === "right" ? "start" : "middle";
        const lx = n.pos === "left" ? x - 38 : n.pos === "right" ? x + 38 : x;
        const ly = n.pos === "top" ? y - 50 : n.pos === "bottom" ? y + 52 : y - 4;
        return (
          <g key={i} className="mo-node" style={{ "--i": i }}>
            <circle cx={x} cy={y} r="27" fill="#fff" stroke="#c9d6ea" strokeWidth="2" className="mo-node-ring" style={{ animationDelay: `${i * 2}s` }} />
            <n.Icon x={x - 13} y={y - 13} width={26} height={26} color={NAVY} strokeWidth={1.8} />
            {n.label.map((t, j) => <text key={t} x={lx} y={ly + j * 16} textAnchor={anchor} fill={NAVY} fontFamily={SANS} fontSize="13" fontWeight="700">{t}</text>)}
          </g>
        );
      })}
    </svg>
  </div>
);
