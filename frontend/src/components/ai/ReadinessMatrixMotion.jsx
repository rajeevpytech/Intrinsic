import React from "react";

const P = "#c9d9f2", M = "#a6c0ea", D = "#6c8fcf", N = "#00388e", O = "#f2a91c";
const ROWS = [
  { t: ["BUSINESS &", "USE CASES"], bars: [[[465, 72, P], [537, 52, N], [665, 100, P], [765, 105, M]], [[665, 205, P]], [[465, 70, D], [665, 205, P]]] },
  { t: ["TECHNOLOGY", "ENVIRONMENT"], bars: [[[465, 108, D], [573, 20, N]], [[465, 200, P], [665, 105, D], [770, 100, P]], [[465, 108, M], [573, 90, N]]] },
  { t: ["DATA &", "INFORMATION"], bars: [[[465, 200, P], [665, 110, O]], [[465, 100, D], [565, 100, N]], [[465, 100, M], [565, 100, P]]] },
  { t: ["IDENTITY, ACCESS", "& SECURITY"], bars: [[[465, 100, M], [565, 100, P], [665, 105, M], [770, 100, P]], [[465, 100, P], [565, 100, P], [665, 105, N], [770, 100, P]], [[465, 100, M], [565, 100, P]]] },
  { t: ["GOVERNANCE &", "RISK"], bars: [[[465, 200, P], [665, 205, O]], [[465, 100, M], [565, 100, P]]] },
  { t: ["ORGANIZATIONAL", "READINESS"], bars: [[[465, 100, M], [565, 200, P], [765, 105, P]], [], [[465, 100, D], [565, 100, N], [665, 205, P]]] },
];
const PITCH = 150, TOP = 14, BH = 24, GAP = 8, H = TOP * 2 + PITCH * ROWS.length;

export const ReadinessMatrixMotion = () => (
  <svg viewBox={`0 0 1024 ${H}`} className="w-full h-auto lg:absolute lg:inset-0 lg:h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-testid="readiness-matrix-motion">
    <rect x="0" y="0" width="1024" height={H} fill="#e9f0fa" />
    <rect x="450" y="0" width="215" height={H} fill="#dae5f4" />
    <rect x="665" y="0" width="207" height={H} fill="#eef2f8" />
    <rect x="872" y="0" width="152" height={H} fill={N} />
    <line x1="150" y1="0" x2="150" y2={H} stroke="#c9d6ea" strokeWidth="1.5" />
    {ROWS.map((r, i) => {
      const cy = TOP + PITCH * i + PITCH / 2;
      const rows = r.bars.filter((b) => b.length || true);
      const total = rows.length * BH + (rows.length - 1) * GAP;
      return (
        <g key={i} data-testid={`air-row-${i}`}>
          {i > 0 && <line x1="30" y1={TOP + PITCH * i} x2="872" y2={TOP + PITCH * i} stroke="#c9d6ea" strokeWidth="1.5" />}
          <text x="62" y={cy + 16} fill="#1c3f8f" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40 }}>{`0${i + 1}`}</text>
          {r.t.map((line, k) => <text key={k} x="176" y={cy - 2 + k * 36} fill="#1c3f8f" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", fontSize: 26, fontWeight: 500, letterSpacing: "0.5px" }}>{line}</text>)}
          {rows.map((bar, k) => bar.map(([x, w, c], j) => (
            <rect key={`${k}-${j}`} x={x} y={cy - total / 2 + k * (BH + GAP)} width={w} height={BH} fill={c} className={`ai-block ${c === O ? "pm-blink" : ""}`} style={{ "--i": i * 3 + k, animationDelay: c === O ? `${i * 0.5}s` : undefined }} />
          )))}
        </g>
      );
    })}
  </svg>
);
