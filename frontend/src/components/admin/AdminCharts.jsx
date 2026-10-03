import React, { useEffect, useState } from 'react';

const R = 54, C = 2 * Math.PI * R;
const useMounted = () => { const [on, setOn] = useState(false); useEffect(() => { const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []); return on; };

export const Donut = ({ segments, center, sub, testId }) => {
  const on = useMounted();
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;
  return <div className="ad-donut" data-testid={testId}>
    <svg viewBox="0 0 140 140" role="img" aria-label={`${center} ${sub}`}>
      <circle cx="70" cy="70" r={R} fill="none" stroke="#eef2f7" strokeWidth="18" />
      {segments.map(s => {
        const len = s.value / total * C, start = offset; offset += len;
        return <circle key={s.label} cx="70" cy="70" r={R} fill="none" stroke={s.color} strokeWidth="18" strokeLinecap="butt" transform="rotate(-90 70 70)"
          strokeDasharray={`${on ? len : 0} ${C}`} strokeDashoffset={-start} style={{ transition: 'stroke-dasharray 1.1s cubic-bezier(.22,1,.36,1)' }} />;
      })}
    </svg>
    <div className="ad-donut-center"><strong>{center}</strong><span>{sub}</span></div>
  </div>;
};

export const Legend = ({ items, testId }) => <ul className="ad-legend" data-testid={testId}>
  {items.map(i => <li key={i.label}><i style={{ background: i.color }} /><span>{i.label}</span>{i.value !== undefined && <b>{i.value.toLocaleString()}</b>}</li>)}
</ul>;

export const HBars = ({ rows, max, testId }) => {
  const on = useMounted();
  return <div className="ad-hbars" data-testid={testId}>
    {rows.map((r, i) => <div className="ad-hbar" key={r.label} data-testid={`${testId}-${i}`}>
      <span title={r.label}>{r.label}</span>
      <div className="ad-hbar-track"><span style={{ width: `${on ? Math.max(4, r.value / (max || 1) * 100) : 0}%`, background: r.color, transitionDelay: `${i * 90}ms` }} /></div>
      <b>{r.value.toLocaleString()}</b>
    </div>)}
  </div>;
};
