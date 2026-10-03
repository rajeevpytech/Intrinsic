import React from "react";
import { motion } from "framer-motion";

const Packet = ({ d, dur, begin, r = 4, c = "#f2a91c" }) => (
  <circle r={r} fill={c} opacity="0">
    <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} />
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.94;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
  </circle>
);

/* Animated overlay for /images/home-blueprint.png (1100 x 650) */
const ROUTES = [
  "M275 108 V190 L325 240 H505 L520 268 H690 V265 H840 V108",
  "M225 357 H500 L575 397 H690 H797",
  "M312 357 V510", "M690 265 V545", "M505 240 V160",
];
const NODES = [[505, 240], [312, 357], [797, 397]];
export const BlueprintMotion = ({ className = "" }) => (
  <div className={`relative ${className}`} data-testid="home-blueprint-motion">
    <motion.img src="/images/home-blueprint.png" alt="Security blueprint integrated across the technology environment" className="w-full h-auto" animate={{ y: [0, -8, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} data-testid="home-blueprint" />
    <svg viewBox="0 0 1100 650" className="absolute inset-0 w-full h-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bpScan" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ffffff" stopOpacity="0" /><stop offset="50%" stopColor="#dff3ea" stopOpacity="0.14" /><stop offset="100%" stopColor="#ffffff" stopOpacity="0" /></linearGradient>
        <clipPath id="bpClip"><rect x="70" y="30" width="950" height="590" /></clipPath>
        <radialGradient id="bpGlow"><stop offset="0%" stopColor="#f2a91c" stopOpacity="0.7" /><stop offset="100%" stopColor="#f2a91c" stopOpacity="0" /></radialGradient>
      </defs>
      <g clipPath="url(#bpClip)"><rect x="-120" y="40" width="120" height="540" fill="url(#bpScan)"><animate attributeName="x" values="-120;1100" dur="7s" repeatCount="indefinite" /></rect></g>
      {ROUTES.map((d, i) => <path key={i} d={d} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.6" strokeDasharray="5 22" className="pm-wire" style={{ animationDelay: `${-i * 0.6}s` }} />)}
      {ROUTES.map((d, i) => <Packet key={`p${i}`} d={d} dur={4.5 + i * 0.6} begin={i * 0.8} r={i < 2 ? 4.5 : 3} c={i % 2 ? "#ffffff" : "#f2a91c"} />)}
      {NODES.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="30" fill="url(#bpGlow)" className="pm-breathe" style={{ animationDelay: `${i * 0.7}s` }} />
          <circle cx={x} cy={y} r="18" fill="none" stroke="#f2a91c" strokeOpacity="0.9" strokeWidth="1.6" className="pm-ring" style={{ animationDelay: `${i * 0.7}s` }} />
        </g>
      ))}
    </svg>
  </div>
);

/* Continuity / Expertise / Accountability — pure SVG traced from the client mockup (691 x 312 @2x) */
const VENN = { cy: 295, r: 241, cx: [306, 646, 992] };
const VENN_STROKE = "#0a3af5", VENN_TEXT = "#0b46f2", VENN_GOLD = "#f2a91c";
const ring = (cx, cy, r) => `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r}`;
const drawIn = (i) => ({ initial: { pathLength: 0, opacity: 0 }, whileInView: { pathLength: 1, opacity: 1 }, viewport: { once: true }, transition: { duration: 1.6, delay: 0.15 + i * 0.3, ease: "easeInOut" } });
const fadeIn = (d) => ({ initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7, delay: d, ease: "easeOut" } });
const popIn = (d) => ({ initial: { scale: 0, opacity: 0 }, whileInView: { scale: 1, opacity: 1 }, viewport: { once: true }, transition: { duration: 0.5, delay: d, type: "spring", stiffness: 260, damping: 18 } });

export const VennMotion = ({ className = "" }) => (
  <div className={`relative ${className}`} data-testid="home-continuity-motion">
    <svg viewBox="0 0 1382 624" className="w-full h-auto" fill="none" role="img" aria-label="Continuity, Expertise, Accountability" data-testid="home-continuity-image">
      <motion.circle cx="520" cy="295" r="690" stroke="#9aa3ad" strokeOpacity="0.45" strokeWidth="1.5" {...fadeIn(1.4)} />
      {VENN.cx.map((cx, i) => (
        <motion.circle key={i} cx={cx} cy={VENN.cy} r={VENN.r} stroke={VENN_STROKE} strokeWidth="2.4" strokeLinecap="round" style={{ transformOrigin: `${cx}px ${VENN.cy}px`, rotate: -90 }} {...drawIn(i)} />
      ))}
      <motion.text x="247" y="311" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontWeight="700" fontSize="44" fill={VENN_TEXT} {...fadeIn(0.9)}>Continuity</motion.text>
      <motion.text x="644" y="311" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontWeight="700" fontSize="44" fill={VENN_TEXT} {...fadeIn(1.15)}>Expertise</motion.text>
      <motion.text x="1060" y="311" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontWeight="700" fontSize="44" fill={VENN_TEXT} {...fadeIn(1.4)}>Accountability</motion.text>
      {[410, 880].map((x, i) => (
        <motion.circle key={`g${i}`} cx={x} cy="299" r="22" fill={VENN_GOLD} style={{ transformOrigin: `${x}px 299px` }} {...popIn(1.3 + i * 0.25)} />
      ))}
      <circle r="8" fill={VENN_STROKE}>
        <animateMotion dur="16s" begin="-4s" repeatCount="indefinite" path={ring(VENN.cx[0], VENN.cy, VENN.r)} />
      </circle>
    </svg>
  </div>
);
