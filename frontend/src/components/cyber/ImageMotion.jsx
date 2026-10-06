import React from "react";

const GOLD = "#f2a41c";

/* Static illustration + SVG overlay of travelling packets and pulsing rings, in the image's own pixel coordinates */
export const ImageMotion = ({ src, alt, w, h, paths = [], pulses = [], writes = [], pulseR = 12, max, className = "", imgClassName = "", style, testId }) => (
  <div className={`relative ${className}`} style={{ maxWidth: max, ...style }} data-testid={testId}>
    <img src={src} alt={alt} width={w} height={h} className={`w-full h-auto block ${imgClassName}`} />
    <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" data-testid={testId ? `${testId}-overlay` : undefined}>
      {writes.map(({ x1, x2, y, w: sw = 8, delay = 0, dur = 4, color = "#6d8fce" }, i) => {
        const L = Math.abs(x2 - x1);
        return (
          <line key={`w${i}`} x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={L} className="im-write">
            <animate attributeName="stroke-dashoffset" values={`${L};0;0;0;${L}`} keyTimes="0;0.35;0.72;0.86;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
          </line>
        );
      })}
      {pulses.map(([x, y], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r={pulseR} fill="none" stroke={GOLD} strokeWidth="2.5" className="im-pulse" style={{ animationDelay: `${(i % 5) * 0.55}s` }} />
      ))}
      {paths.map(({ d, dur = 4.5, delay = 0, r = 7, color = GOLD }, i) => (
        <circle key={`d${i}`} r={r} fill={color} opacity="0" className="im-packet">
          <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.94;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  </div>
);
