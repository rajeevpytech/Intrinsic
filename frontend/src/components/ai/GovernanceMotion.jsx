import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { C } from "./AiGraphics";

/* Hero / CTA block mosaic (picture-style blue/sage/gold blocks) */
const BLOCKS = [
  [42, 0, 58, 100, "#0a2f70"], [42, 0, 18, 30, C.royal], [60, 0, 16, 48, "#8ea3a8"], [76, 0, 24, 40, C.royal],
  [48, 30, 18, 34, C.sky], [66, 40, 14, 32, "#c7d3d5"], [80, 40, 20, 30, C.navy], [42, 64, 22, 36, C.royal],
  [64, 72, 18, 28, C.pale], [82, 70, 18, 30, "#8ea3a8"], [0, 44, 42, 20, "#1a4aa8"], [20, 64, 22, 36, C.sky],
];
export const BlockMotion = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true" data-testid="block-motion">
    {BLOCKS.map(([x, y, w, h, f], i) => (
      <motion.rect key={i} x={x} y={y} width={w} height={h} fill={f} initial={{ opacity: 0, scaleY: 0.6 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: `${x + w / 2}px ${y + h}px`, transformBox: "view-box" }} className="ai-block" />
    ))}
    <motion.rect x="72" y="36" width="3" height="26" fill={C.gold} animate={{ y: [36, 30, 36] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
    <motion.rect x="42" y="62" width="22" height="1.2" fill={C.gold} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }} />
  </svg>
);

/* Managed AI hero: vertical block columns with giant "MAN / AGED" letters */
const COLS = [
  [64, 0, 12, 100, "#1a4aa8"], [76, 0, 8, 62, "#8ea3a8"], [84, 0, 16, 100, C.royal], [70, 40, 10, 60, "#0a2f70"],
  [58, 20, 8, 80, C.royal], [80, 55, 6, 45, "#c7d3d5"], [90, 30, 10, 50, C.navy], [50, 60, 10, 40, "#1a4aa8"],
];
export const ManagedLettersMotion = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true" data-testid="managed-letters-motion">
    <defs><clipPath id="mlClip"><rect x="0" y="0" width="100" height="100" /></clipPath></defs>
    {COLS.map(([x, y, w, h, f], i) => (
      <motion.rect key={i} x={x} y={y} width={w} height={h} fill={f} initial={{ opacity: 0, y: y + 8 }} animate={{ opacity: 1, y }} transition={{ delay: 0.1 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="ai-block" style={{ "--i": i }} />
    ))}
    <motion.rect x="93" y="38" width="4" height="26" fill={C.gold} animate={{ y: [38, 32, 38] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
    <g clipPath="url(#mlClip)" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}>
      <motion.text x="8" y="56" fill={C.sky} fillOpacity="0.55" style={{ fontSize: 58, letterSpacing: "-3px", mixBlendMode: "screen" }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 1 }} textLength="86" lengthAdjust="spacingAndGlyphs">MAN</motion.text>
      <motion.text x="30" y="100" fill={C.pale} fillOpacity="0.6" style={{ fontSize: 58, letterSpacing: "-3px", mixBlendMode: "screen" }} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 1 }} textLength="68" lengthAdjust="spacingAndGlyphs">AGED</motion.text>
    </g>
  </svg>
);

/* Foundation: scattered individual AI use converging into an organizational framework */
const SCATTER = [[70, 90], [150, 60], [110, 190], [60, 300], [170, 260], [120, 380], [200, 340], [80, 420]];
const GRID = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => [268 + c * 56, 160 + r * 56]));
export const FrameworkMotion = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-[#eef3fa] ${className}`} data-testid="framework-motion">
    <svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="fwCell" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={C.royal} /><stop offset="100%" stopColor={C.navy} /></linearGradient>
        <filter id="fwShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor={C.navy} floodOpacity="0.16" /></filter>
      </defs>
      {[0, 1, 2, 3].map((i) => <line key={i} x1={-140 + i * 110} y1="0" x2={120 + i * 110} y2="460" stroke="#ffffff" strokeOpacity="0.6" strokeWidth={i % 2 ? 28 : 10} />)}
      <text x="120" y="34" textAnchor="middle" className="perim-label" fill="#5a6b85" style={{ letterSpacing: "2px" }}>INDIVIDUAL USE</text>
      <text x="324" y="120" textAnchor="middle" className="perim-label" fill={C.navy} style={{ letterSpacing: "2px" }}>ORGANIZATIONAL CONTROL</text>
      {SCATTER.map(([x, y], i) => {
        const [gx, gy] = GRID[i % GRID.length];
        const d = `M${x} ${y} C ${x + 90} ${y}, ${gx - 80} ${gy + 28}, ${gx + 28} ${gy + 28}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={C.royal} strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="4 7" className="pm-wire" />
            <circle cx={x} cy={y} r={i % 3 ? 6 : 9} fill="#ffffff" stroke="#8a95a5" strokeWidth="2" className="pm-pulse-node" style={{ animationDelay: `${i * 0.3}s` }} />
            <circle r="4" fill={i % 4 === 1 ? C.gold : C.royal} opacity="0">
              <animateMotion dur="3.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={d} />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="3.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      <rect x="252" y="144" width="200" height="200" rx="10" fill="#ffffff" filter="url(#fwShadow)" />
      {GRID.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="48" height="48" rx="4" fill={i === 4 ? C.gold : i % 2 ? C.sky : "url(#fwCell)"} className="ai-block" style={{ "--i": i }} />
      ))}
      <rect x="252" y="144" width="200" height="200" rx="10" fill="none" stroke={C.gold} strokeOpacity="0.9" strokeWidth="1.5" className="perim-wall-glow" />
      <rect x="520" y="0" width="80" height="460" fill={C.navy} fillOpacity="0.94" />
      <rect x="488" y="0" width="32" height="460" fill={C.sky} fillOpacity="0.55" />
    </svg>
  </div>
);

/* Visibility: live inventory scan of AI across the environment */
const FOUND = [
  { l: "Approved platforms", n: 6, c: C.navy }, { l: "Embedded AI features", n: 14, c: C.royal }, { l: "Third-party services", n: 9, c: C.sky },
  { l: "Integrations", n: 11, c: C.royal }, { l: "Users with access", n: 128, c: C.navy }, { l: "Needs review", n: 4, c: C.gold },
];
export const VisibilityMotion = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 2400); return () => clearInterval(id); }, []);
  return (
    <div className="relative" data-testid="visibility-motion">
      <motion.span className="absolute -top-6 -right-6 left-16 bottom-16 bg-[#dbe7f5]" animate={{ x: [0, -5, 0], y: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <div className="relative bg-white p-7 sm:p-9 shadow-[0_40px_80px_-40px_rgba(0,20,60,0.35)]">
        <div className="flex items-start justify-between gap-4">
          <div><span className="block w-[34px] h-[2px] bg-[#f2a91c] mb-3" /><p className="font-sans text-[#00388e] font-bold text-[15px]">AI Inventory</p></div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-[#1f3f8f] whitespace-nowrap">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-[#f2a91c] opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#f2a91c]" /></span>Scanning
          </span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
          {FOUND.map((f, i) => {
            const v = f.n + ((tick + i) % 3 === 0 ? 1 : 0);
            return (
              <div key={f.l} data-testid={`visibility-item-${i}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[12px] text-[#2e3745]">{f.l}</span>
                  <motion.span key={v} initial={{ opacity: 0.3, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-[22px] leading-none tabular-nums" style={{ color: f.c === C.sky ? C.royal : f.c, fontFamily: "'Playfair Display', Georgia, serif" }}>{v}</motion.span>
                </div>
                <div className="mt-2 h-[6px] bg-[#eef3fa] overflow-hidden">
                  <motion.div className="h-full" style={{ background: f.c }} initial={{ width: 0 }} animate={{ width: `${Math.min(100, (v / (f.l === "Users with access" ? 160 : 16)) * 100)}%` }} transition={{ duration: 0.9, delay: i * 0.1 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-7 pt-5 border-t border-[#dbe7f5] flex items-center gap-3 text-[10.5px] text-[#5a6b85]">
          <span className="w-2 h-2 bg-[#f2a91c]" />Items flagged for additional review
          <span className="ml-auto flex items-center gap-1">{[0, 1, 2].map((k) => <motion.span key={k} className="block w-1.5 h-1.5 rounded-full bg-[#1e56b8]" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: k * 0.2 }} />)}</span>
        </div>
      </div>
    </div>
  );
};

/* Ongoing: evolving review cycle (parametrized: words, center, sub, ink) */
const CYCLE = ["REVIEW", "UPDATE", "DOCUMENT", "ESCALATE"];
export const CycleMotion = ({ className = "", words = CYCLE, center = "AI", sub = "GOVERNANCE", ink = "#ffffff" }) => (
  <svg viewBox="0 0 320 320" className={className} aria-hidden="true" data-testid="cycle-motion">
    <circle cx="160" cy="160" r="110" fill="none" stroke={ink} strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 8" className="pm-wire" />
    <circle cx="160" cy="160" r="72" fill="none" stroke={ink} strokeOpacity="0.18" strokeWidth="1" className="pm-breathe" />
    <g><animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="14s" repeatCount="indefinite" /><circle cx="160" cy="50" r="6" fill={C.gold} /></g>
    {words.map((w, i) => {
      const a = (i / words.length) * Math.PI * 2 - Math.PI / 2;
      const x = 160 + Math.cos(a) * 110, y = 160 + Math.sin(a) * 110;
      return (
        <g key={w}>
          <circle cx={x} cy={y} r="22" fill={ink} fillOpacity="0.12" stroke={ink} strokeOpacity="0.5" strokeWidth="1.5" className="pm-pulse-node" style={{ animationDelay: `${i * 0.5}s` }} />
          <text x={x} y={y + 3} textAnchor="middle" className="perim-label" fill={ink} style={{ fontSize: w.length > 7 ? 6.2 : 8, letterSpacing: w.length > 7 ? "0.8px" : "1.4px" }}>{w}</text>
        </g>
      );
    })}
    <text x="160" y="156" textAnchor="middle" fill={ink} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22 }}>{center}</text>
    <text x="160" y="176" textAnchor="middle" className="perim-label" fill={ink} fillOpacity="0.85" style={{ fontSize: 9, letterSpacing: "2px" }}>{sub}</text>
  </svg>
);
