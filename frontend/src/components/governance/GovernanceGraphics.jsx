import React from "react";

/* ============================================================
   Governance "Portal" — animated SVG motion graphic
   Layered translucent glass slabs receding in perspective with
   one glowing orange panel (light through the doorway), radiating
   connector lines and pulsing amber nodes. Two tones:
   - "light"  → sits on the cream hero background
   - "dark"   → sits on the deep-blue practices section
   ============================================================ */

const SLABS = [
  { x: 26, y: 66, w: 80, h: 300, d: 0 },
  { x: 90, y: 96, w: 66, h: 250, d: 0.12 },
  { x: 148, y: 56, w: 60, h: 326, d: 0.28 },
  { x: 198, y: 84, w: 78, h: 300, orange: true, d: 0.4 },
  { x: 270, y: 120, w: 48, h: 214, d: 0.52 },
];

const DOTS = [
  { cx: 20, cy: 130 },
  { cx: 336, cy: 96 },
  { cx: 320, cy: 350 },
];

export const Portal = ({ tone = "light", className = "", id = "gp" }) => {
  const dark = tone === "dark";
  const blueA = dark ? "rgba(150,190,250,0.20)" : "rgba(26,95,168,0.16)";
  const blueB = dark ? "rgba(120,170,240,0.30)" : "rgba(16,132,116,0.20)";
  const glass = dark ? "rgba(210,230,255,0.14)" : "rgba(255,255,255,0.42)";
  const stroke = dark ? "rgba(200,225,255,0.45)" : "rgba(26,95,168,0.35)";
  const orange = "#f3a458";
  const orangeTop = "#ffce9a";
  const line = dark ? "rgba(180,210,255,0.35)" : "rgba(120,140,165,0.4)";
  const dotFill = dark ? "#faaf6a" : "#f0932f";

  const slabFill = (s, i) => (s.orange ? `url(#${id}-og)` : i % 2 === 0 ? `url(#${id}-bg1)` : `url(#${id}-bg2)`);

  return (
    <div className={`relative ${className}`} aria-hidden="true" data-testid="governance-portal">
      <svg viewBox="0 0 360 430" className="w-full h-auto overflow-visible" role="img">
        <defs>
          <linearGradient id={`${id}-bg1`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={glass} />
            <stop offset="1" stopColor={blueA} />
          </linearGradient>
          <linearGradient id={`${id}-bg2`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={glass} />
            <stop offset="1" stopColor={blueB} />
          </linearGradient>
          <linearGradient id={`${id}-og`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={orangeTop} />
            <stop offset="0.55" stopColor={orange} />
            <stop offset="1" stopColor="#e07f2f" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* radiating connector lines */}
        <g className="gp-lines">
          <path className="gp-line" d="M8 150 C 120 90, 230 120, 352 70" fill="none" stroke={line} strokeWidth="1" />
          <path className="gp-line" d="M4 300 C 120 320, 240 300, 356 356" fill="none" stroke={line} strokeWidth="1" style={{ animationDelay: "-6s" }} />
          <path className="gp-line" d="M180 8 C 150 140, 210 260, 180 420" fill="none" stroke={line} strokeWidth="1" style={{ animationDelay: "-11s" }} />
        </g>

        {/* faint outer doorway frame */}
        <rect className="gp-group" x="34" y="46" width="300" height="344" rx="4" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="2 8" opacity="0.5" />

        <g className="gp-group">
          <g transform="translate(30 0) skewX(-8)">
            {SLABS.map((s, i) => (
              <g key={i}>
                <rect
                  className={s.orange ? "gp-core" : "gp-frame"}
                  x={s.x}
                  y={s.y}
                  width={s.w}
                  height={s.h}
                  rx="6"
                  fill={slabFill(s, i)}
                  stroke={s.orange ? "rgba(255,190,120,0.7)" : stroke}
                  strokeWidth="1"
                  style={{ animationDelay: `${s.d}s`, filter: s.orange ? `url(#${id}-glow)` : "none" }}
                />
                {s.orange && (
                  <rect className="gp-sweepbar" x={s.x + 6} y={s.y} width="10" height={s.h} rx="5" fill="rgba(255,255,255,0.55)" />
                )}
              </g>
            ))}
          </g>
        </g>

        {/* pulsing amber nodes */}
        {DOTS.map((d, i) => (
          <circle key={i} className="gp-dot" cx={d.cx} cy={d.cy} r="4" fill={dotFill} style={{ animationDelay: `${i * 0.9}s` }} />
        ))}
      </svg>
    </div>
  );
};

/* Hero backdrop — traced from the reference: bottom-left circle arc, hairlines, right-hand sweeping arcs (1269x600 design space) */
export const GovHeroBackdrop = () => (
  <>
    <svg className="pointer-events-none absolute inset-0 w-full h-full" viewBox="0 0 1269 600" preserveAspectRatio="none" aria-hidden="true" data-testid="gc-hero-backdrop">
      <g fill="none" stroke="#3c4658" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <g className="gp-arcs" strokeOpacity="0.28">
          <circle cx="-100" cy="640" r="410" vectorEffect="non-scaling-stroke" />
          <circle cx="-100" cy="640" r="470" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
        </g>
        <line x1="0" y1="406" x2="300" y2="406" strokeOpacity="0.32" vectorEffect="non-scaling-stroke" />
        <line x1="255" y1="0" x2="255" y2="600" strokeOpacity="0.16" vectorEffect="non-scaling-stroke" />
        <path d="M 880 322 Q 1090 262 1269 204" strokeOpacity="0.34" vectorEffect="non-scaling-stroke" />
        <path d="M 930 190 C 1040 232, 1150 288, 1269 322" strokeOpacity="0.22" vectorEffect="non-scaling-stroke" />
        <path d="M 930 48 L 1269 58" strokeOpacity="0.16" vectorEffect="non-scaling-stroke" />
        <line x1="1177" y1="0" x2="1177" y2="600" strokeOpacity="0.14" vectorEffect="non-scaling-stroke" />
      </g>
      {/* comets travelling along the arcs */}
      <g className="gc-comets">
        <circle r="3.5" fill="#f2a91c">
          <animateMotion dur="9s" repeatCount="indefinite" path="M 880 322 Q 1090 262 1269 204" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.6 1" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="#f2a91c">
          <animateMotion dur="14s" begin="3s" repeatCount="indefinite" path="M 0 245 A 410 410 0 0 1 300 600" />
          <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.08;0.92;1" dur="14s" begin="3s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="#3c4658" opacity="0.5">
          <animateMotion dur="12s" begin="6s" repeatCount="indefinite" path="M 930 190 C 1040 232, 1150 288, 1269 322" />
        </circle>
      </g>
    </svg>
    <span className="gc-node gp-dot hidden lg:block" style={{ left: "20.1%", top: "68.6%" }} />
    <span className="gc-node gp-dot hidden lg:block" style={{ left: "92.75%", top: "39%", animationDelay: "1.4s" }} />
  </>
);

/* Hero panels — traced 1:1 from the reference: gold slab, dark + mid receding planes, wide lower plane, faint far plane, hairlines */
export const GovHeroPanels = ({ className = "" }) => (
  <div className={className} aria-hidden="true" data-testid="gc-hero-panels">
    <svg viewBox="0 0 300 560" className="w-full h-full overflow-visible" preserveAspectRatio="xMaxYMin meet">
      <defs>
        <linearGradient id="gch-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fcbd5c" />
          <stop offset="0.55" stopColor="#f8b545" />
          <stop offset="0.74" stopColor="#f6b446" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f3efe8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gch-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#56645a" />
          <stop offset="0.7" stopColor="#6c7a70" />
          <stop offset="1" stopColor="#8e9a91" />
        </linearGradient>
        <linearGradient id="gch-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#97a399" />
          <stop offset="1" stopColor="#aab4aa" />
        </linearGradient>
        <linearGradient id="gch-wide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa69c" stopOpacity="0.92" />
          <stop offset="1" stopColor="#b3bcb3" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="gch-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9c1b7" stopOpacity="0.32" />
          <stop offset="1" stopColor="#c9cfc6" stopOpacity="0.08" />
        </linearGradient>
        <filter id="gch-blur" x="-40%" y="-20%" width="180%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
        <linearGradient id="gch-pulse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2a91c" stopOpacity="0" />
          <stop offset="1" stopColor="#f2a91c" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="gch-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="gch-clip">
          <polygon points="24,60 80,22 80,272 24,272" />
          <polygon points="82,24 110,4 110,262 82,262" />
          <polygon points="112,70 156,48 156,262 112,262" />
          <polygon points="84,256 200,266 200,475 84,322" />
          <polygon points="200,266 280,290 280,505 200,475" />
        </clipPath>
      </defs>
      {/* vertical hairlines */}
      <g stroke="#3c4658" strokeWidth="0.75" fill="none">
        {[7, 25, 45, 111, 150, 175, 200, 260, 280, 296].map((x, i) => (
          <line key={x} x1={x} y1="0" x2={x} y2="560" strokeOpacity={i % 3 === 0 ? 0.16 : 0.09} />
        ))}
      </g>
      {/* data pulses running down the hairlines */}
      <g strokeWidth="1.5" strokeLinecap="round">
        {[{ x: 25, d: "0s", t: "7s" }, { x: 150, d: "2.4s", t: "9s" }, { x: 260, d: "4.8s", t: "8s" }, { x: 296, d: "1.2s", t: "11s" }].map((l) => (
          <line key={l.x} className="gch-pulse" x1={l.x} y1="0" x2={l.x} y2="46" stroke="url(#gch-pulse)" style={{ animationDelay: l.d, animationDuration: l.t }} />
        ))}
      </g>
      <g className="gp-group">
        <polygon className="gch-glow" points="8,70 80,22 80,240 8,240" fill="#fcbd5c" fillOpacity="0.35" filter="url(#gch-blur)" />
        <g className="gch-float" style={{ animationDuration: "9s" }}>
          <polygon className="gch-plane" points="24,60 80,22 80,272 24,272" fill="url(#gch-gold)" style={{ animationDelay: "0s" }} />
        </g>
        <g className="gch-float" style={{ animationDuration: "11s", animationDelay: "-3s" }}>
          <polygon className="gch-plane" points="82,24 110,4 110,262 82,262" fill="url(#gch-dark)" style={{ animationDelay: "0.12s" }} />
        </g>
        <g className="gch-float" style={{ animationDuration: "8s", animationDelay: "-5s" }}>
          <polygon className="gch-plane" points="112,70 156,48 156,262 112,262" fill="url(#gch-mid)" style={{ animationDelay: "0.24s" }} />
        </g>
        <g className="gch-float" style={{ animationDuration: "12s", animationDelay: "-2s" }}>
          <polygon className="gch-plane" points="84,256 200,266 200,475 84,322" fill="url(#gch-wide)" style={{ animationDelay: "0.36s" }} />
        </g>
        <g className="gch-float" style={{ animationDuration: "10s", animationDelay: "-7s" }}>
          <polygon className="gch-plane" points="200,266 280,290 280,505 200,475" fill="url(#gch-far)" style={{ animationDelay: "0.48s" }} />
        </g>
        <polygon className="gch-sheen" points="30,58 38,52 38,200 30,200" fill="rgba(255,255,255,0.5)" />
        {/* light sweep travelling across all planes */}
        <g clipPath="url(#gch-clip)">
          <rect className="gch-sweep" x="-140" y="-40" width="70" height="640" fill="url(#gch-sweep)" transform="skewX(-18)" />
        </g>
      </g>
      {/* drifting motes */}
      <g fill="#f2a91c">
        {[{ x: 60, y: 300, d: "0s", t: "9s", r: 1.6 }, { x: 140, y: 420, d: "-3s", t: "12s", r: 1.3 }, { x: 230, y: 240, d: "-6s", t: "10s", r: 1.8 }, { x: 96, y: 500, d: "-8s", t: "13s", r: 1.2 }].map((m, i) => (
          <circle key={i} className="gch-mote" cx={m.x} cy={m.y} r={m.r} style={{ animationDelay: m.d, animationDuration: m.t }} />
        ))}
      </g>
    </svg>
  </div>
);

/* Practice panes — three translucent glass-pane motifs on the deep-blue section (IT / Security / AI) */
const PANES = {
  it: [
    { x: 12, y: 45, w: 22, h: 60, f: "#ffffff", o: 0.16 },
    { x: 30, y: 35, w: 22, h: 72, f: "#ffffff", o: 0.24 },
    { x: 52, y: 22, w: 30, h: 88, f: "#ffffff", o: 0.34 },
    { x: 66, y: 12, w: 36, h: 100, f: "#ffffff", o: 0.5 },
    { x: 100, y: 35, w: 26, h: 72, f: "#d9d0b8", o: 0.78 },
    { x: 101, y: 50, w: 10, h: 44, f: "#f2a91c", o: 0.95, glow: true },
    { x: 120, y: 25, w: 22, h: 80, f: "#ffffff", o: 0.26 },
    { x: 138, y: 32, w: 14, h: 66, f: "#ffffff", o: 0.16 },
  ],
  sec: [
    { x: 12, y: 40, w: 20, h: 65, f: "#ffffff", o: 0.14 },
    { x: 28, y: 25, w: 24, h: 85, f: "#ffffff", o: 0.22 },
    { x: 46, y: 25, w: 30, h: 90, f: "#a9b8a4", o: 0.6 },
    { x: 56, y: 40, w: 20, h: 55, f: "#6f8a72", o: 0.75 },
    { x: 70, y: 12, w: 34, h: 105, f: "#ffffff", o: 0.5 },
    { x: 108, y: 20, w: 26, h: 88, f: "#ffffff", o: 0.28 },
    { x: 128, y: 30, w: 20, h: 70, f: "#ffffff", o: 0.16 },
  ],
  ai: [
    { x: 14, y: 25, w: 20, h: 90, f: "#ffffff", o: 0.18 },
    { x: 32, y: 35, w: 16, h: 80, f: "#ffffff", o: 0.24 },
    { x: 46, y: 40, w: 28, h: 80, f: "#f2a91c", o: 0.9, glow: true },
    { x: 60, y: 45, w: 16, h: 70, f: "#ffd27a", o: 0.7 },
    { x: 76, y: 15, w: 24, h: 100, f: "#ffffff", o: 0.34 },
    { x: 96, y: 20, w: 24, h: 95, f: "#ffffff", o: 0.24 },
    { x: 118, y: 35, w: 18, h: 75, f: "#ffffff", o: 0.14 },
  ],
};
const PANE_LINE = { it: { x2: 95, y: 62, c: "#ffffff", o: 0.5 }, sec: { x2: 110, y: 64, c: "#f2a91c", o: 0.85 }, ai: { x2: 60, y: 66, c: "#f2a91c", o: 0.6 } };

export const PracticePanes = ({ variant = "it", className = "" }) => {
  const line = PANE_LINE[variant];
  return (
    <div className={className} aria-hidden="true" data-testid={`practice-panes-${variant}`}>
      <svg viewBox="0 0 160 130" className="w-full h-auto overflow-visible">
        <defs>
          <filter id={`pp-glow-${variant}`} x="-60%" y="-40%" width="220%" height="180%"><feGaussianBlur stdDeviation="5" /></filter>
          <linearGradient id={`pp-glass-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.5" stopColor="#dfe9ff" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <line className="pp-line" x1="2" y1={line.y} x2={line.x2} y2={line.y} stroke={line.c} strokeOpacity={line.o} strokeWidth="1" />
        <line className="pp-runner" x1="2" y1={line.y} x2="16" y2={line.y} stroke="#f2a91c" strokeWidth="1.5" strokeLinecap="round" style={{ "--len": `${line.x2 - 14}px` }} />
        <g transform="skewY(-8)" style={{ transformOrigin: "80px 65px" }}>
          {PANES[variant].map((r, i) => (
            <g key={i}>
              {r.glow && <rect x={r.x - 6} y={r.y - 6} width={r.w + 12} height={r.h + 12} fill={r.f} opacity="0.45" filter={`url(#pp-glow-${variant})`} className="pp-glow" />}
              <rect className="pp-pane" x={r.x} y={r.y} width={r.w} height={r.h} fill={r.f === "#ffffff" ? `url(#pp-glass-${variant})` : r.f} fillOpacity={r.o} style={{ "--i": i, "--d": `${(i * 0.9) % 4}s` }} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

/* Ongoing Governance backdrop — large arcs sweeping in from the bottom-right, gold node, travelling comet */
export const GovOngoingArcs = () => (
  <>
    <svg className="pointer-events-none absolute inset-0 w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true" data-testid="gc-ongoing-arcs">
      <g fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.22">
        <circle className="go-arc" cx="1180" cy="330" r="240" vectorEffect="non-scaling-stroke" />
        <circle className="go-arc" cx="1180" cy="330" r="320" vectorEffect="non-scaling-stroke" style={{ animationDelay: "-6s" }} />
        <circle className="go-arc" cx="1180" cy="330" r="400" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" style={{ animationDelay: "-12s" }} />
        <line x1="1020" y1="0" x2="1020" y2="300" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
      </g>
      <circle r="3" fill="#f2a91c" className="gc-comets">
        <animateMotion dur="10s" repeatCount="indefinite" path="M 940 300 A 320 320 0 0 1 1200 10" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="10s" repeatCount="indefinite" />
      </circle>
    </svg>
    <span className="gc-node gp-dot hidden lg:block" style={{ left: "85%", top: "32%" }} />
  </>
);

/* Decorative sweeping arc lines for the cream hero + forest CTA backgrounds */
export const GovArcs = ({ tone = "light", className = "" }) => {
  const dark = tone === "dark";
  const stroke = dark ? "rgba(180,210,195,0.16)" : "rgba(120,130,140,0.14)";
  const dot = dark ? "#f3a458" : "#f0932f";
  return (
    <svg className={`pointer-events-none absolute inset-0 w-full h-full ${className}`} viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="gp-arcs" fill="none" stroke={stroke} strokeWidth="1">
        <circle cx="140" cy="330" r="560" />
        <circle cx="140" cy="330" r="400" />
        <circle cx="1080" cy="120" r="360" />
      </g>
      <circle className="gp-dot" cx="230" cy="318" r="5" fill={dot} />
      <circle className="gp-dot" cx="1000" cy="205" r="5" fill={dot} style={{ animationDelay: "1.2s" }} />
    </svg>
  );
};
