import React from "react";
import { Laptop, Server, Cloud, Share2, Shield, Users, TriangleAlert, FileText, Settings, ShieldCheck, BarChart3 } from "lucide-react";

const NAVY = "#12306e";
const SANS = "'DM Sans', sans-serif";

/* ============ HERO: signals converging into SIEM, three outputs ============ */
const SRC = [
  { label: "ENDPOINTS", x: 220, y: 122, c: "#1d4fd8" },
  { label: "SERVERS", x: 220, y: 157, c: "#8a97a6" },
  { label: "CLOUD", x: 220, y: 192, c: "#f2a91c" },
  { label: "NETWORK", x: 220, y: 227, c: "#4c6a5e" },
  { label: "APPLICATIONS", x: 238, y: 262, c: "#a9b8b0" },
  { label: "SECURITY TOOLS", x: 258, y: 297, c: "#0f2a9e" },
];
const OUT = [
  { label: "DETECT", y: 180, c: "#1d4fd8" },
  { label: "CORRELATE", y: 212, c: "#4c6a5e" },
  { label: "PRIORITIZE", y: 248, c: "#f2a91c" },
];
const CX = 512;
const CY = 212;

export const SiemConverge = ({ className = "" }) => (
  <div className={className} aria-hidden="true" data-testid="siem-converge">
    <svg viewBox="70 60 770 320" className="w-full h-auto overflow-visible">
      <defs>
        <linearGradient id="sc-out" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#1d4fd8" stopOpacity="1" />
        </linearGradient>
      </defs>
      <line x1={CX} y1="40" x2={CX} y2="390" stroke="#1d4fd8" strokeWidth="1.5" strokeOpacity="0.55" className="sc-axis" />
      {SRC.map((s, i) => {
        const d = `M ${s.x} ${s.y} H ${s.x + 130} C ${s.x + 230} ${s.y}, ${CX - 110} ${CY}, ${CX - 8} ${CY}`;
        return (
          <g key={s.label}>
            <text x={s.x - 20} y={s.y + 5} textAnchor="end" fill={NAVY} fontFamily={SANS} fontSize="13.5" fontWeight="700" letterSpacing="3.2">{s.label}</text>
            <path d={d} fill="none" stroke={s.c} strokeWidth="1.6" strokeOpacity="0.8" className="sc-path" style={{ animationDelay: `${i * 0.12}s` }} />
            <path d={d} fill="none" stroke={s.c} strokeWidth="3" strokeLinecap="round" className="sc-signal" style={{ animationDelay: `${i * 0.7}s` }} />
            <circle cx={s.x} cy={s.y} r="8" fill={s.c} className="sc-dot" style={{ animationDelay: `${i * 0.7}s` }} />
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r="7" fill="#fff" stroke="#1d4fd8" strokeWidth="2.5" className="sc-core" />
      <circle cx={CX} cy={CY} r="7" fill="none" stroke="#1d4fd8" strokeWidth="1.5" className="sc-ring" />
      <text x={CX + 26} y={CY + 11} fill={NAVY} fontFamily={SANS} fontSize="34" fontWeight="700" letterSpacing="4">SIEM</text>
      {OUT.map((o, i) => (
        <g key={o.label}>
          <line x1={CX + 100} y1={o.y} x2={CX + 165} y2={o.y} stroke={o.c} strokeWidth="1.8" strokeOpacity="0.85" className="sc-outline" style={{ animationDelay: `${i * 0.25}s` }} />
          <circle cx={CX + 165} cy={o.y} r="8" fill={o.c} className="sc-dot" style={{ animationDelay: `${1 + i * 0.5}s` }} />
          <text x={CX + 190} y={o.y + 5} fill={NAVY} fontFamily={SANS} fontSize="15" fontWeight="700" letterSpacing="3.4">{o.label}</text>
        </g>
      ))}
    </svg>
  </div>
);

/* ============ INFOGRAPHIC: sources → SIEM → detection → outcomes ============ */
const SOURCES = [
  { Icon: Laptop, title: "Endpoints", sub: ["Devices and users"], x: 128, bg: "#dce8fb", ic: "#1e3a8a", pipe: "#1d4fd8" },
  { Icon: Server, title: "Servers", sub: ["On-prem and cloud"], x: 298, bg: "#e1e5ec", ic: "#4a5b6e", pipe: "#8a99ad" },
  { Icon: Cloud, title: "Cloud", sub: ["Microsoft 365,", "Azure, AWS"], x: 472, bg: "#fde4cc", ic: "#e07b1a", pipe: "#f2a91c" },
  { Icon: Share2, title: "Network", sub: ["Firewalls, routers,", "switches"], x: 656, bg: "#dce8fb", ic: "#1d4fd8", pipe: "#2c63d6" },
  { Icon: Shield, title: "Security Tools", sub: ["Identity, email,", "EDR, vulnerability"], x: 840, bg: "#dce8fb", ic: "#1e3a8a", pipe: "#1e4db7" },
  { Icon: Users, title: "Applications", sub: ["Business and", "SaaS apps"], x: 1026, bg: "#fde4cc", ic: "#e07b1a", pipe: "#f0932b" },
];
const LEFT = ["Normalize data", "Correlate events", "Apply threat intelligence"];
const RIGHT = ["Detect anomalies", "Identify risks", "Prioritize threats"];
const OUTCOMES = [
  { Icon: Settings, title: "RESPOND", sub: ["Investigate and contain"], x: 255, bg: "#dce8fb", ic: "#1e4db7" },
  { Icon: ShieldCheck, title: "PROTECT", sub: ["Reduce risk and", "prevent recurrence"], x: 580, bg: "#e6ebf1", ic: "#1e3a8a" },
  { Icon: BarChart3, title: "IMPROVE", sub: ["Stronger security", "over time"], x: 905, bg: "#fde4cc", ic: "#e07b1a" },
];

const Bars = ({ x, y, s = 1, fill = "#fff" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <rect x="0" y="34" width="14" height="26" rx="2" />
    <rect x="22" y="18" width="14" height="42" rx="2" />
    <rect x="44" y="0" width="14" height="60" rx="2" />
  </g>
);

export const SiemInfographic = ({ className = "" }) => (
  <div className={className} data-testid="siem-infographic">
    <svg viewBox="0 0 1160 1300" className="w-full h-auto overflow-visible" role="img" aria-label="How Intrinsic SIEM collects, correlates and analyzes security data">
      <defs>
        <linearGradient id="sg-box" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f74e6" />
          <stop offset="1" stopColor="#0b3d9e" />
        </linearGradient>
        <linearGradient id="sg-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d5e0ef" />
          <stop offset="1" stopColor="#9fb3cf" />
        </linearGradient>
        <filter id="sg-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>

      {/* pipes from sources into SIEM */}
      {SOURCES.map((s, i) => {
        const d = `M ${s.x} 258 V 300 C ${s.x} 380, 580 330, 580 428`;
        return (
          <g key={s.title}>
            <path d={d} fill="none" stroke={s.pipe} strokeWidth="14" strokeLinecap="round" strokeOpacity="0.9" className="sg-pipe" style={{ animationDelay: `${0.2 + i * 0.1}s` }} />
            <path d={d} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.7" className="sg-flow" style={{ animationDelay: `${i * 0.45}s` }} />
          </g>
        );
      })}

      {/* sources */}
      {SOURCES.map((s, i) => (
        <g key={s.title} className="sg-pop" style={{ "--i": i }}>
          <circle cx={s.x} cy="110" r="60" fill={s.bg} />
          <s.Icon x={s.x - 26} y={84} width={52} height={52} color={s.ic} strokeWidth={1.7} />
          <text x={s.x} y="198" textAnchor="middle" fill={NAVY} fontFamily={SANS} fontSize="19" fontWeight="700">{s.title}</text>
          {s.sub.map((t, j) => (
            <text key={t} x={s.x} y={221 + j * 21} textAnchor="middle" fill="#3b5a99" fontFamily={SANS} fontSize="15.5">{t}</text>
          ))}
        </g>
      ))}

      {/* SIEM core */}
      <circle cx="580" cy="432" r="15" fill="#f2a91c" className="sg-node" />
      <rect x="425" y="440" width="310" height="195" rx="14" fill="#2f74e6" opacity="0.35" filter="url(#sg-glow)" className="sg-boxglow" />
      <rect x="425" y="440" width="310" height="195" rx="14" fill="url(#sg-box)" />
      <rect x="452" y="482" width="104" height="104" rx="8" fill="#fff" fillOpacity="0.18" />
      <Bars x="475" y="504" s="0.98" />
      <text x="585" y="510" fill="#fff" fontFamily={SANS} fontSize="38" fontWeight="700">SIEM</text>
      {["Collect", "Correlate", "Analyze"].map((t, i) => (
        <text key={t} x="585" y={548 + i * 29} fill="#fff" fillOpacity="0.92" fontFamily={SANS} fontSize="21">{t}</text>
      ))}

      {/* left + right pills */}
      {LEFT.map((t, i) => {
        const y = 450 + i * 65;
        return (
          <g key={t} className="sg-pill sg-pill-l" style={{ "--i": i }}>
            <rect x="75" y={y} width="260" height="50" rx="6" fill="#dfe8f7" />
            <text x="97" y={y + 32} fill={NAVY} fontFamily={SANS} fontSize="19">{t}</text>
            <line x1="335" y1={y + 25} x2="425" y2={y + 25} stroke="#1e4db7" strokeWidth="4" />
            <circle cx="352" cy={y + 25} r="10" fill="#1e4db7" />
          </g>
        );
      })}
      {RIGHT.map((t, i) => {
        const y = 450 + i * 65;
        return (
          <g key={t} className="sg-pill sg-pill-r" style={{ "--i": i }}>
            <rect x="825" y={y} width="260" height="50" rx="6" fill="#dfe8f7" />
            <text x="847" y={y + 32} fill={NAVY} fontFamily={SANS} fontSize="19">{t}</text>
            <line x1="735" y1={y + 25} x2="825" y2={y + 25} stroke="#1e4db7" strokeWidth="4" />
            <circle cx="808" cy={y + 25} r="10" fill="#1e4db7" />
          </g>
        );
      })}

      {/* down to detection ring */}
      <line x1="580" y1="635" x2="580" y2="720" stroke="#1e4db7" strokeWidth="10" className="sg-pipe" />
      <circle cx="580" cy="690" r="15" fill="#f2a91c" className="sg-node" style={{ animationDelay: "0.8s" }} />

      {/* detection & analysis ring */}
      <circle cx="580" cy="830" r="175" fill="none" stroke="#9fb3cf" strokeWidth="2" strokeDasharray="3 9" className="sg-ringdots" />
      <circle cx="580" cy="830" r="150" fill="url(#sg-ring)" />
      <circle cx="580" cy="830" r="128" fill="#c9d6e8" />
      <circle cx="580" cy="830" r="106" fill="#fff" />
      <Bars x="551" y="768" s="0.95" fill="#1e4db7" />
      <text x="580" y="864" textAnchor="middle" fill={NAVY} fontFamily={SANS} fontSize="20" fontWeight="700" letterSpacing="1">DETECTION</text>
      <text x="580" y="890" textAnchor="middle" fill={NAVY} fontFamily={SANS} fontSize="20" fontWeight="700" letterSpacing="1">&amp; ANALYSIS</text>

      {/* side outcomes */}
      <g className="sg-side sg-side-l">
        <polygon points="75,700 300,700 400,830 300,960 75,960" fill="#dce8fb" />
        <line x1="400" y1="830" x2="475" y2="830" stroke="#1e4db7" strokeWidth="6" />
        <circle cx="386" cy="830" r="13" fill="#1e4db7" />
        <TriangleAlert x={183} y={748} width={62} height={62} color="#1e3a8a" strokeWidth={1.6} />
        <text x="215" y="843" textAnchor="middle" fill={NAVY} fontFamily={SANS} fontSize="25" fontWeight="700">Threats</text>
        <text x="215" y="873" textAnchor="middle" fill={NAVY} fontFamily={SANS} fontSize="25" fontWeight="700">Identified</text>
        <text x="215" y="906" textAnchor="middle" fill="#2c4a86" fontFamily={SANS} fontSize="17.5">Greater visibility</text>
        <text x="215" y="930" textAnchor="middle" fill="#2c4a86" fontFamily={SANS} fontSize="17.5">across the environment</text>
      </g>
      <g className="sg-side sg-side-r">
        <polygon points="1085,700 860,700 760,830 860,960 1085,960" fill="#fbe3cc" />
        <line x1="685" y1="830" x2="760" y2="830" stroke="#1e4db7" strokeWidth="6" />
        <circle cx="774" cy="830" r="13" fill="#1e4db7" />
        <FileText x={912} y={748} width={62} height={62} color="#1e3a8a" strokeWidth={1.6} />
        <text x="945" y="843" textAnchor="middle" fill={NAVY} fontFamily={SANS} fontSize="25" fontWeight="700">Actionable</text>
        <text x="945" y="873" textAnchor="middle" fill={NAVY} fontFamily={SANS} fontSize="25" fontWeight="700">Insights</text>
        <text x="945" y="906" textAnchor="middle" fill="#2c4a86" fontFamily={SANS} fontSize="17.5">Faster, more informed</text>
        <text x="945" y="930" textAnchor="middle" fill="#2c4a86" fontFamily={SANS} fontSize="17.5">decisions</text>
      </g>

      {/* down + branch to outcomes */}
      <line x1="580" y1="980" x2="580" y2="1060" stroke="#1e4db7" strokeWidth="10" className="sg-pipe" />
      <circle cx="580" cy="990" r="15" fill="#f2a91c" className="sg-node" style={{ animationDelay: "1.6s" }} />
      <path d="M 580 1000 C 580 1020, 560 1015, 300 1015 Q 255 1015 255 1060" fill="none" stroke="#1e4db7" strokeWidth="10" strokeLinecap="round" className="sg-pipe" />
      <path d="M 580 1000 C 580 1020, 600 1015, 860 1015 Q 905 1015 905 1060" fill="none" stroke="#1e4db7" strokeWidth="10" strokeLinecap="round" className="sg-pipe" />
      {OUTCOMES.map((o, i) => (
        <g key={o.title} className="sg-pop" style={{ "--i": 6 + i }}>
          <circle cx={o.x} cy="1130" r="66" fill={o.bg} />
          <o.Icon x={o.x - 30} y={1100} width={60} height={60} color={o.ic} strokeWidth={1.6} />
          <text x={o.x} y="1226" textAnchor="middle" fill={NAVY} fontFamily={SANS} fontSize="24" fontWeight="700" letterSpacing="1">{o.title}</text>
          {o.sub.map((t, j) => (
            <text key={t} x={o.x} y={1252 + j * 23} textAnchor="middle" fill="#2c4a86" fontFamily={SANS} fontSize="17.5">{t}</text>
          ))}
        </g>
      ))}
    </svg>
  </div>
);

/* Compact stacked version for small screens */
export const SiemInfographicMobile = () => (
  <div className="space-y-6" data-testid="siem-infographic-mobile">
    <div className="grid grid-cols-2 gap-3">
      {SOURCES.map((s) => (
        <div key={s.title} className="flex items-center gap-3 rounded-lg bg-white p-3 border border-[#dfe8f7]">
          <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: s.bg }}><s.Icon size={22} color={s.ic} strokeWidth={1.7} /></span>
          <div><p className="text-[#12306e] font-bold text-[13px]">{s.title}</p><p className="text-[#3b5a99] text-[11.5px] leading-tight">{s.sub.join(" ")}</p></div>
        </div>
      ))}
    </div>
    <div className="rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg,#2f74e6,#0b3d9e)" }}>
      <p className="font-bold text-[26px]">SIEM</p>
      <p className="text-white/90 text-[15px]">Collect · Correlate · Analyze</p>
      <div className="grid grid-cols-2 gap-2 mt-4 text-[12.5px]">
        {[...LEFT, ...RIGHT].map((t) => <span key={t} className="bg-white/15 rounded px-2.5 py-1.5">{t}</span>)}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-[#dce8fb] p-4"><TriangleAlert size={26} color="#1e3a8a" /><p className="text-[#12306e] font-bold mt-2">Threats Identified</p><p className="text-[#2c4a86] text-[12.5px]">Greater visibility across the environment</p></div>
      <div className="rounded-lg bg-[#fbe3cc] p-4"><FileText size={26} color="#1e3a8a" /><p className="text-[#12306e] font-bold mt-2">Actionable Insights</p><p className="text-[#2c4a86] text-[12.5px]">Faster, more informed decisions</p></div>
    </div>
    <div className="grid grid-cols-3 gap-3 text-center">
      {OUTCOMES.map((o) => (
        <div key={o.title}>
          <span className="w-14 h-14 rounded-full inline-flex items-center justify-center" style={{ background: o.bg }}><o.Icon size={26} color={o.ic} strokeWidth={1.6} /></span>
          <p className="text-[#12306e] font-bold text-[13px] mt-2">{o.title}</p>
          <p className="text-[#2c4a86] text-[11.5px] leading-tight">{o.sub.join(" ")}</p>
        </div>
      ))}
    </div>
  </div>
);
