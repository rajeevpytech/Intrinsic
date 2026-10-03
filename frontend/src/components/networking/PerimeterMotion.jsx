import React from "react";

const LANES = [104, 150, 196, 242, 288, 334, 380];
const ENDPOINTS = [
  { x: 558, y: 150, c: "#1f8f7a" },
  { x: 558, y: 242, c: "#0b3f95" },
  { x: 558, y: 334, c: "#8aa0b8" },
];
const HERO_PACKETS = [
  { y: 104, d: 0, bad: false }, { y: 150, d: 0.8, bad: true }, { y: 196, d: 1.6, bad: false },
  { y: 242, d: 2.4, bad: false }, { y: 288, d: 3.3, bad: true }, { y: 334, d: 4.1, bad: false }, { y: 380, d: 4.9, bad: false },
];

const SLATE = "#2f3f55";
const NAVYD = "#1e3560";
const BLUE = "#2b6cf0";
const ORANGE = "#f59e0b";
const CONV = "1150 440";
const L = [
  { d: `M565 265 H830 C 930 265, 990 340, 1060 400 C 1090 425, 1120 438, ${CONV}`, w: 2.6, c: SLATE, dots: [{ x: 770, y: 265, r: 15, f: NAVYD, ring: true }] },
  { d: `M590 330 H700`, w: 2, c: SLATE, dash: true },
  { d: `M715 330 C 780 330, 800 378, 900 378 C 990 378, 1050 420, ${CONV}`, w: 2, c: NAVYD, dash: true, dots: [{ x: 705, y: 330, r: 9, hollow: true, sw: 4 }, { x: 900, y: 378, r: 11, f: NAVYD }] },
  { d: `M565 360 H830 C 960 360, 1030 420, ${CONV}`, w: 1.4, c: "#6e84a8" },
  { d: `M565 490 H830 C 960 490, 1030 460, ${CONV}`, w: 2.4, c: SLATE, dots: [{ x: 690, y: 490, r: 18, hollow: true, sw: 6 }] },
  { d: `M833 545 C 870 545, 880 505, 945 505 C 1030 505, 1080 470, ${CONV}`, w: 2, c: NAVYD, dash: true, dots: [{ x: 833, y: 545, r: 9, f: "#3a4e78" }, { x: 945, y: 505, r: 9, hollow: true, sw: 4 }] },
  { d: `M580 590 H750`, w: 2.6, c: SLATE, dots: [{ x: 750, y: 590, r: 15, f: NAVYD, ring: true }] },
  { d: `M765 590 C 850 590, 900 570, 970 570 C 1060 570, 1100 490, ${CONV}`, w: 2, c: NAVYD, dash: true, dots: [{ x: 970, y: 570, r: 10, f: NAVYD }] },
];
const R = [
  { y: 370, c: "#2f5d55" },
  { y: 435, c: "#4a5f8a" },
  { y: 512, c: "#a9b8cc" },
];
const rPath = (y) => `M1448 432 C 1520 432, 1560 ${y}, 1655 ${y}`;

export const ConvergeMotion = ({ className = "" }) => (
  <svg viewBox="530 90 1250 700" className={className} fill="none" aria-hidden="true" data-testid="converge-motion">
    <defs>
      <radialGradient id="cvSage" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c3d1c4" stopOpacity="0.55" /><stop offset="60%" stopColor="#d8e2d8" stopOpacity="0.25" /><stop offset="100%" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
      <linearGradient id="cvSlab" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3b78de" /><stop offset="28%" stopColor="#3f82ee" /><stop offset="55%" stopColor="#6ea3f3" /><stop offset="100%" stopColor="#dbe8fb" /></linearGradient>
      <linearGradient id="cvBeamV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2b6cf0" stopOpacity="0.15" /><stop offset="12%" stopColor="#2b6cf0" /><stop offset="88%" stopColor="#2b6cf0" /><stop offset="100%" stopColor="#2b6cf0" stopOpacity="0.15" /></linearGradient>
      <linearGradient id="cvBlueIn" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={BLUE} stopOpacity="0" /><stop offset="25%" stopColor={BLUE} /><stop offset="100%" stopColor={BLUE} /></linearGradient>
      <linearGradient id="cvGrayOut" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#b8c4cc" /><stop offset="100%" stopColor="#b8c4cc" stopOpacity="0.15" /></linearGradient>
      <filter id="cvGlowB" x="-300%" y="-5%" width="700%" height="110%"><feGaussianBlur stdDeviation="7" /></filter>
      <filter id="cvGlowO" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" /></filter>
    </defs>

    <ellipse cx="1450" cy="400" rx="420" ry="380" fill="url(#cvSage)" className="pm-breathe" style={{ animationDuration: "10s" }} />

    <g className="pm-float" style={{ animationDuration: "9s" }}>
      <polygon points="1150,235 1315,130 1315,740 1150,630" fill="url(#cvSlab)" />
      <polygon points="1150,235 1190,210 1190,655 1150,630" fill="#2f6ad6" fillOpacity="0.55" />
      <polygon points="1190,210 1240,178 1240,690 1190,655" fill="#3f82ee" fillOpacity="0.35" />
      <polygon points="1240,178 1315,130 1315,740 1240,690" fill="#ffffff" fillOpacity="0.28" />
    </g>

    <rect x="1230" y="0" width="20" height="880" fill="#2b6cf0" fillOpacity="0.28" filter="url(#cvGlowB)" className="pm-blink" />
    <rect x="1238" y="0" width="4" height="880" fill="url(#cvBeamV)" />

    {[
      "M1000 425 C 1040 425, 1060 400, 1090 372 L 1150 440",
      "M1000 432 C 1050 432, 1070 452, 1110 468 L 1150 440",
      "M1030 430 L 1150 440",
    ].map((d, i) => <path key={i} d={d} stroke="#8fb0ea" strokeOpacity="0.55" strokeWidth="1.2" />)}

    {L.map((l, i) => (
      <g key={i}>
        <path d={l.d} stroke={l.c} strokeWidth={l.w} strokeLinecap="round" strokeDasharray={l.dash ? "7 7" : undefined} className={l.dash ? "pm-wire" : "pm-draw"} style={{ animationDelay: `${0.1 + i * 0.08}s` }} />
        {(l.dots || []).map((d, k) => (
          <g key={k}>
            {d.ring && <circle cx={d.x} cy={d.y} r={d.r + 5} fill="#ffffff" stroke="#c7cfd8" strokeWidth="1.5" />}
            {d.hollow
              ? <circle cx={d.x} cy={d.y} r={d.r} fill="#ffffff" stroke={SLATE} strokeWidth={d.sw} />
              : <circle cx={d.x} cy={d.y} r={d.r} fill={d.f} />}
          </g>
        ))}
        {!l.dash && l.w > 2 && <circle r="4" fill={SLATE} opacity="0"><animateMotion dur="4.4s" begin={`${i * 0.9}s`} repeatCount="indefinite" path={l.d} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.45 0 0.3 1" /><animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.08;0.92;1" dur="4.4s" begin={`${i * 0.9}s`} repeatCount="indefinite" /></circle>}
      </g>
    ))}

    <path d="M565 425 H1000 C 1040 425, 1060 432, 1100 432 H1240" stroke="url(#cvBlueIn)" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M565 425 H1000 C 1040 425, 1060 432, 1100 432 H1240" stroke={BLUE} strokeOpacity="0.35" strokeWidth="9" strokeLinecap="round" filter="url(#cvGlowB)" />
    <circle r="5" fill="#ffffff" stroke={BLUE} strokeWidth="2"><animateMotion dur="2.6s" repeatCount="indefinite" path="M600 425 H1000 C 1040 425, 1060 432, 1100 432 H1225" /></circle>

    <circle cx="1240" cy="432" r="26" fill={ORANGE} fillOpacity="0.5" filter="url(#cvGlowO)" className="pm-blink" />
    <circle cx="1240" cy="432" r="17" fill="#ffffff" stroke={ORANGE} strokeWidth="4.5" className="pm-ring" />
    <circle cx="1240" cy="432" r="17" fill="#ffffff" stroke={ORANGE} strokeWidth="4.5" />
    <line x1="1258" y1="432" x2="1435" y2="432" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
    <circle r="4" fill="#ffffff" stroke={ORANGE} strokeWidth="2"><animateMotion dur="1.6s" repeatCount="indefinite" path="M1258 432 H1425" /></circle>
    <circle cx="1435" cy="432" r="20" fill={ORANGE} fillOpacity="0.45" filter="url(#cvGlowO)" />
    <circle cx="1435" cy="432" r="13" fill={ORANGE} className="pm-pulse-node" />

    {R.map((r, i) => (
      <g key={r.y}>
        <path d={rPath(r.y)} stroke={SLATE} strokeWidth="2.6" strokeLinecap="round" className="pm-draw" style={{ animationDelay: `${0.7 + i * 0.12}s` }} />
        <line x1="1655" y1={r.y} x2="1765" y2={r.y} stroke="url(#cvGrayOut)" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="1655" cy={r.y} r="14" fill={r.c} className="pm-pulse-node" style={{ animationDelay: `${i * 0.4}s` }} />
        <circle r="4" fill={r.c} opacity="0"><animateMotion dur="2.8s" begin={`${1 + i * 0.5}s`} repeatCount="indefinite" path={rPath(r.y)} /><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.8s" begin={`${1 + i * 0.5}s`} repeatCount="indefinite" /></circle>
      </g>
    ))}
  </svg>
);

export const PerimeterHeroMotion = ({ className = "" }) => (
  <svg viewBox="0 0 620 470" className={className} fill="none" aria-hidden="true" data-testid="perimeter-hero-motion">
    <defs>
      <linearGradient id="pmWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f6fd0" /><stop offset="100%" stopColor="#0b3f95" /></linearGradient>
      <linearGradient id="pmGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" /><stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" /></linearGradient>
      <radialGradient id="pmSage" cx="68%" cy="42%" r="72%"><stop offset="0%" stopColor="#c6d8c6" stopOpacity="0.55" /><stop offset="100%" stopColor="#c6d8c6" stopOpacity="0" /></radialGradient>
    </defs>
    <rect x="352" y="64" width="262" height="344" rx="28" fill="url(#pmSage)" />
    {LANES.map((y) => <line key={y} x1="34" y1={y} x2="590" y2={y} stroke="#0b3f95" strokeOpacity="0.10" />)}
    {LANES.map((y, i) => <circle key={"o" + y} cx="40" cy={y} r={i % 2 ? 3 : 5} fill={i % 2 ? "none" : "#8aa0b8"} stroke="#8aa0b8" strokeWidth="1.4" />)}
    <g>
      <rect x="292" y="60" width="36" height="352" rx="6" fill="url(#pmWall)" />
      <rect x="292" y="60" width="36" height="352" rx="6" fill="url(#pmGlass)" />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x="299" y={72 + i * 38} width="22" height="24" rx="2" fill="#ffffff" fillOpacity="0.12" />)}
      <rect x="292" y="60" width="36" height="352" rx="6" fill="none" stroke="#f2a91c" strokeWidth="2" className="perim-wall-glow" />
    </g>
    <circle cx="310" cy="235" r="17" fill="none" stroke="#f2a91c" strokeWidth="2.5" className="pm-ring" />
    <circle cx="310" cy="235" r="5" fill="#f2a91c" />
    {ENDPOINTS.map((n) => (
      <g key={n.y}>
        <line x1="352" y1="235" x2={n.x} y2={n.y} stroke="#0b3f95" strokeOpacity="0.20" strokeDasharray="4 6" className="pm-wire" />
        <circle cx={n.x} cy={n.y} r="10" fill="#ffffff" stroke={n.c} strokeWidth="2" className="pm-pulse-node" />
        <circle cx={n.x} cy={n.y} r="3.5" fill={n.c} />
      </g>
    ))}
    {HERO_PACKETS.map((p, i) => (
      p.bad ? (
        <g key={i}>
          <circle cy={p.y} r="6" fill="#e5533d" className="perim-packet perim-bad" style={{ animationDelay: `${p.d}s` }} />
          <g className="perim-block" style={{ animationDelay: `${p.d}s` }}>
            <line x1="284" y1={p.y - 8} x2="300" y2={p.y + 8} stroke="#e5533d" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="300" y1={p.y - 8} x2="284" y2={p.y + 8} stroke="#e5533d" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      ) : <circle key={i} cy={p.y} r="5.5" fill="#1f8f7a" className="perim-packet perim-good" style={{ animationDelay: `${p.d}s` }} />
    ))}
  </svg>
);

const Ico = ({ type, s = 1, c = "#0b3f95" }) => {
  const st = { fill: "none", stroke: c, strokeWidth: 2.6 / s, strokeLinecap: "round", strokeLinejoin: "round", transform: `scale(${s})` };
  if (type === "globe") return <g {...st}><circle cx="0" cy="0" r="12" /><ellipse cx="0" cy="0" rx="5" ry="12" /><line x1="-12" y1="0" x2="12" y2="0" /><path d="M-9 -7 Q0 -3 9 -7" /><path d="M-9 7 Q0 3 9 7" /></g>;
  if (type === "laptop") return <g {...st}><rect x="-11" y="-9" width="22" height="14" rx="1.5" /><path d="M-15 9 H15 L13 12 H-13 Z" /></g>;
  if (type === "people") return <g {...st}><circle cx="-6" cy="-5" r="3.5" /><circle cx="6" cy="-5" r="3.5" /><circle cx="0" cy="-8" r="3" /><path d="M-13 9c0-5 3-7 7-7s7 2 7 7" /><path d="M-1 9c0-5 3-7 7-7s7 2 7 7" /></g>;
  if (type === "server") return <g {...st}><rect x="-12" y="-11" width="24" height="7" rx="1.5" /><rect x="-12" y="-3" width="24" height="7" rx="1.5" /><rect x="-12" y="5" width="24" height="7" rx="1.5" /><circle cx="7" cy="-7.5" r="1" fill={c} /><circle cx="7" cy="0.5" r="1" fill={c} /><circle cx="7" cy="8.5" r="1" fill={c} /></g>;
  if (type === "cloud") return <g {...st}><path d="M-12 6a5.5 5.5 0 0 1 1-10 7.5 7.5 0 0 1 14 1 5 5 0 0 1-1 9z" /></g>;
  return null;
};

const EXT = [{ y: 330, t: "globe", l: "Internet" }, { y: 440, t: "laptop", l: "Remote Users" }, { y: 550, t: "people", l: "Third Parties" }];
const TRUST = [{ y: 345, t: "laptop", l: "Users & Devices" }, { y: 440, t: "server", l: "Applications" }, { y: 550, t: "cloud", l: "Cloud Resources" }];
const PANELS = [
  { pts: "955,300 1000,325 1000,610 955,585", fill: "#a9c6ee", op: 0.5, d: -3.5 },
  { pts: "905,285 950,315 950,635 905,600", fill: "#7fb0ee", op: 0.62, d: -2 },
  { pts: "770,345 900,285 900,610 770,585", fill: "url(#pfPanel)", op: 1, d: 0, main: true },
];
const FLOW_PATH = "M455 440 H1440";

export const PerimeterFlowMotion = ({ className = "" }) => (
  <svg viewBox="0 170 1860 500" className={className} fill="none" aria-hidden="true" data-testid="perimeter-flow-motion">
    <defs>
      <linearGradient id="pfPanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5f9ae8" /><stop offset="100%" stopColor="#2b6fd6" /></linearGradient>
      <linearGradient id="pfTrust" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#b9c7bd" /><stop offset="55%" stopColor="#cfd9cf" /><stop offset="100%" stopColor="#e6ecf2" stopOpacity="0.2" /></linearGradient>
      <radialGradient id="pfHalo" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#bcd6f5" stopOpacity="0.9" /><stop offset="100%" stopColor="#bcd6f5" stopOpacity="0" /></radialGradient>
      <filter id="pfSoft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0b3f95" floodOpacity="0.16" /></filter>
    </defs>

    <text x="445" y="270" textAnchor="middle" fill="#4c5b73" style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "3px" }}>EXTERNAL</text>
    {EXT.map((n, i) => (
      <g key={n.l}>
        <path d={`M290 ${n.y} H320 C 360 ${n.y}, 345 440, 385 440`} stroke="#5c6f8c" strokeOpacity="0.85" strokeWidth={i === 1 ? 10 : 12} strokeLinecap="round" />
        <circle cx="248" cy={n.y} r="40" fill="#e6ecf4" stroke="#c9d4e3" strokeWidth="2" className="pm-pulse-node" style={{ animationDelay: `${i * 0.4}s` }} />
        <g transform={`translate(248 ${n.y})`}><Ico type={n.t} s={1.35} /></g>
        <text x="190" y={n.y + 7} textAnchor="end" fill="#1f2e4a" style={{ fontFamily: "'Inter', sans-serif", fontSize: 20 }}>{n.l}</text>
      </g>
    ))}
    <line x1="385" y1="440" x2="455" y2="440" stroke="#0b3f95" strokeWidth="10" strokeLinecap="round" />
    <circle cx="365" cy="440" r="13" fill="#0b3f95" />
    <circle cx="455" cy="440" r="92" fill="url(#pfHalo)" className="pm-breathe" />
    <circle cx="455" cy="440" r="70" fill="#dbe8f8" />
    <g transform="translate(455 440)"><Ico type="globe" s={4.4} c="#0b3f95" /></g>

    <path d={FLOW_PATH} stroke="#0b3f95" strokeWidth="9" strokeLinecap="round" />
    <path d="M1160 440 H1440" stroke="#1e56b8" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.55" />

    <g className="pm-ring"><circle cx="660" cy="440" r="26" fill="#ffffff" stroke="#f2a91c" strokeWidth="9" /></g>
    <text x="660" y="500" textAnchor="middle" fill="#4c5b73" style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "2px" }}>INSPECTED</text>

    <text x="870" y="205" textAnchor="middle" fill="#0b3f95" style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "3px" }}>PERIMETER</text>
    <text x="870" y="238" textAnchor="middle" fill="#5b6b7a" style={{ fontFamily: "'Inter', sans-serif", fontSize: 20 }}>Firewall  |  IPS  |  VPN</text>
    {PANELS.map((p, i) => (
      <g key={i} className="pm-float" style={{ animationDelay: `${p.d}s`, animationDuration: `${7 + i}s` }}>
        <polygon points={p.pts} fill={p.fill} fillOpacity={p.op} filter={p.main ? "url(#pfSoft)" : undefined} />
        {p.main && <polygon points={p.pts} fill="#ffffff" fillOpacity="0.1" />}
      </g>
    ))}
    <g className="pm-float">
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={796 + c * 42} y={378 + r * 40 - c * 8} width="36" height="32" rx="3" fill="#0b2f6b" />))}
      <rect x="788" y="356" width="140" height="146" rx="4" fill="none" stroke="#f2a91c" strokeOpacity="0.9" strokeWidth="2" className="perim-wall-glow" />
    </g>

    <g className="pm-ring" style={{ animationDelay: "1.3s" }}><circle cx="1075" cy="440" r="26" fill="#ffffff" stroke="#f2a91c" strokeWidth="9" /></g>
    <text x="1075" y="500" textAnchor="middle" fill="#4c5b73" style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "2px" }}>AUTHORIZED</text>

    <polygon points="1290,270 1350,265 1860,265 1860,640 1350,640 1290,610 1145,440" fill="url(#pfTrust)" />
    <polygon points="1290,270 1350,265 1860,265 1860,640 1350,640 1290,610 1145,440" fill="#ffffff" fillOpacity="0.1" />
    <text x="1435" y="205" textAnchor="middle" fill="#0b3f95" style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "3px" }}>TRUSTED NETWORK</text>
    <text x="1435" y="238" textAnchor="middle" fill="#5b6b7a" style={{ fontFamily: "'Inter', sans-serif", fontSize: 20 }}>Your Business Environment</text>
    <line x1="1290" y1="345" x2="1290" y2="550" stroke="#1450a8" strokeWidth="10" strokeLinecap="round" />
    {TRUST.map((n, i) => (
      <g key={n.l}>
        <path d={`M1290 ${n.y} H1330 C 1370 ${n.y}, 1380 ${n.y}, 1425 ${n.y}`} stroke="#1450a8" strokeWidth="10" strokeLinecap="round" />
        <circle cx="1428" cy={n.y} r="15" fill="#1450a8" className="pm-pulse-node" style={{ animationDelay: `${i * 0.35}s` }} />
        <g transform={`translate(1505 ${n.y})`}><Ico type={n.t} s={1.7} c="#1450a8" /></g>
        <text x="1580" y={n.y + 7} fill="#1f2e4a" style={{ fontFamily: "'Inter', sans-serif", fontSize: 20 }}>{n.l}</text>
        <circle r="6" fill="#ffffff" opacity="0">
          <animateMotion dur="2.2s" begin={`${2.4 + i * 0.3}s`} repeatCount="indefinite" path={`M1290 440 V${n.y} H1425`} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.2s" begin={`${2.4 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      </g>
    ))}

    {[0, 1.5, 3].map((d) => (
      <g key={d}>
        <circle r="8" fill="#f2a91c" opacity="0">
          <animateMotion dur="4.5s" begin={`${d}s`} repeatCount="indefinite" path="M455 440 H1290" calcMode="linear" />
          <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.05;0.5;0.92;1" dur="4.5s" begin={`${d}s`} repeatCount="indefinite" />
          <animate attributeName="fill" values="#f2a91c;#f2a91c;#1f8f7a;#1f8f7a" keyTimes="0;0.24;0.26;1" dur="4.5s" begin={`${d}s`} repeatCount="indefinite" />
        </circle>
      </g>
    ))}
    {EXT.map((n, i) => (
      <circle key={"e" + n.l} r="6" fill="#5c6f8c" opacity="0">
        <animateMotion dur="1.6s" begin={`${i * 0.55}s`} repeatCount="indefinite" path={`M290 ${n.y} H320 C 360 ${n.y}, 345 440, 385 440 H455`} />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="1.6s" begin={`${i * 0.55}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);
