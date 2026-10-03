import React from "react";
import { motion } from "framer-motion";

const CROSSES = [[395, 135], [760, 265], [330, 675], [700, 855]];
const MASK = "linear-gradient(90deg, transparent 0%, #000 22%)";

const HomeHeroMotion = () => (
  <motion.div
    className="pointer-events-none absolute top-[var(--nav-h)] bottom-0 right-0 h-[calc(100%-68px)] aspect-[852/941] hidden md:block hh-motion"
    style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
    data-testid="home-hero-visual"
  >
    <motion.img
      src="/images/home-hero-weave-navy.webp" alt="" aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      animate={{ scale: [1, 1.035, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    <svg viewBox="0 0 852 941" className="absolute inset-0 w-full h-full" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hhGold"><stop offset="0" stopColor="#ffd27a" stopOpacity="0.9" /><stop offset="1" stopColor="#f2a91c" stopOpacity="0" /></radialGradient>
        <linearGradient id="hhStreak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0.85" /></linearGradient>
      </defs>
      {[0, 2.6].map((b) => (
        <circle key={b} r="4" fill="#ffffff" opacity="0" className="hh-packet">
          <animateMotion dur="5.2s" begin={`${b}s`} repeatCount="indefinite" path="M281 -10 V575 H540" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.45 0 0.25 1" />
          <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.06;0.92;1" dur="5.2s" begin={`${b}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <circle r="3" fill="#cfe3ff" opacity="0">
        <animateMotion dur="7s" begin="1.2s" repeatCount="indefinite" path="M0 940 L205 520 L355 520 L560 210" calcMode="linear" />
        <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.05;0.93;1" dur="7s" begin="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="556" cy="581" r="40" fill="url(#hhGold)" className="hh-gold" />
      {CROSSES.map(([x, y], i) => (
        <g key={i} className="hh-cross" style={{ "--i": i }}>
          <line x1={x - 14} y1={y} x2={x + 14} y2={y} stroke="#ffffff" strokeWidth="1.2" />
          <line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke="#ffffff" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  </motion.div>
);

export default HomeHeroMotion;
