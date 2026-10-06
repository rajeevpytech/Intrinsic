import React from "react";

const Switch = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r="17" fill="#f2a91c" />
    <path d="M-7 -3 h11 M1 -6 l3 3 l-3 3 M7 4 h-11 M-1 1 l-3 3 l3 3" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const Ap = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r="15" fill="#e8f6ef" stroke="#1f8f7a" strokeWidth="1.6" />
    <g fill="none" stroke="#1f8f7a" strokeWidth="1.6" strokeLinecap="round"><path d="M-7 -1a10 10 0 0 1 14 0" /><path d="M-4 2a5 5 0 0 1 8 0" /></g>
    <circle cy="5" r="1.5" fill="#1f8f7a" />
  </g>
);
const Cloud = ({ x, y }) => <g transform={`translate(${x} ${y})`}><path d="M-13 6a6 6 0 0 1 1-11 8 8 0 0 1 15 1 5.5 5.5 0 0 1-1 10z" fill="#eef1f5" stroke="#8aa0b8" strokeWidth="1.6" /></g>;
const Device = ({ x, y }) => <g transform={`translate(${x} ${y})`}><rect x="-13" y="-10" width="26" height="17" rx="2" fill="#eaf0fb" stroke="#2f6fd0" strokeWidth="1.6" /><line x1="-6" y1="12" x2="6" y2="12" stroke="#2f6fd0" strokeWidth="1.6" strokeLinecap="round" /><line x1="0" y1="7" x2="0" y2="12" stroke="#2f6fd0" strokeWidth="1.6" /></g>;

const LINKS = [
  "M500 78 C 500 130, 250 120, 250 162", "M500 78 C 500 130, 560 120, 560 162", "M500 78 C 640 78, 700 116, 796 122",
  "M250 198 C 250 240, 150 250, 150 283", "M150 316 L90 388", "M150 316 L175 388", "M150 316 L260 388",
  "M560 198 L470 284", "M560 198 L585 284", "M560 198 C 620 240, 690 250, 700 284", "M812 146 L812 236",
];
const APS = [{ x: 90, y: 405, l: "AP-01" }, { x: 175, y: 405, l: "AP-02" }, { x: 260, y: 405, l: "AP-03" }, { x: 470, y: 300, l: "AP-04" }, { x: 585, y: 300, l: "AP-05" }];
const PACKET_PATHS = ["M500 78 C 500 130, 250 120, 250 162", "M500 78 C 500 130, 560 120, 560 162", "M500 78 C 640 78, 700 116, 796 122", "M150 316 L260 388"];

export const CoreToEdgeMotion = ({ className = "" }) => (
  <svg viewBox="0 0 900 470" className={className} fill="none" aria-hidden="true" data-testid="core-to-edge-motion" style={{ minWidth: 720 }}>
    {LINKS.map((d, i) => <path key={i} d={d} stroke="#2f6fd0" strokeOpacity="0.45" strokeWidth="1.8" strokeDasharray="5 7" className="pm-wire" />)}
    {PACKET_PATHS.map((d, i) => (
      <circle key={"p" + i} r="4" fill="#2f6fd0" opacity="0">
        <animateMotion dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
      </circle>
    ))}

    <text x="500" y="24" textAnchor="middle" className="pm-node-label" fill="#0b1f45" style={{ fontSize: 12, fontWeight: 600 }}>Core-SW-01</text>
    <Switch x={500} y={56} />
    <text x="250" y="146" textAnchor="middle" className="pm-node-label" fill="#0b1f45" style={{ fontSize: 12, fontWeight: 600 }}>Dist-SW-01</text>
    <Switch x={250} y={180} />
    <text x="560" y="146" textAnchor="middle" className="pm-node-label" fill="#0b1f45" style={{ fontSize: 12, fontWeight: 600 }}>Dist-SW-02</text>
    <Switch x={560} y={180} />
    <text x="150" y="268" textAnchor="middle" className="pm-node-label" fill="#0b1f45" style={{ fontSize: 12, fontWeight: 600 }}>Access-SW-01</text>
    <Switch x={150} y={300} />

    <text x="812" y="100" textAnchor="middle" className="pm-node-label" fill="#5b6b7a" style={{ fontSize: 11 }}>10.1.20.0/24</text>
    <Cloud x={812} y={126} />
    <Device x={812} y={250} />
    <text x="812" y="284" textAnchor="middle" className="pm-node-label" fill="#0b1f45" style={{ fontSize: 12 }}>Device-01</text>
    <Cloud x={700} y={300} />
    <text x="700" y="330" textAnchor="middle" className="pm-node-label" fill="#0b1f45" style={{ fontSize: 12 }}>IoT-01</text>

    {APS.map((a, i) => (
      <g key={a.l}>
        <Ap x={a.x} y={a.y} />
        <circle cx={a.x + 12} cy={a.y - 12} r="3" fill="#1f8f7a" className="pm-blink" style={{ animationDelay: `${i * 0.4}s` }} />
        <text x={a.x} y={a.y + 30} textAnchor="middle" className="pm-node-label" fill="#0b1f45" style={{ fontSize: 11 }}>{a.l}</text>
      </g>
    ))}
  </svg>
);
