import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Users, Inbox, FileUser, Eye, ArrowRight, ArrowUpRight, RefreshCw, MousePointer2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { api, errMsg } from '../../lib/api';
import { Donut, Legend, HBars } from './AdminCharts';

const BLUE = '#2f6fd0', NAVY = '#0b3f95', AMBER = '#f2a91c', GRAY = '#9fb0c4', LIGHT = '#d4dde8';
const number = n => n.toLocaleString();
const dateLabel = date => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const STATS = [
  ['visitors', 'Visitors', Users, 'Unique browsers'],
  ['inquiries', 'Inquiries', Inbox, 'Contact & assessments'],
  ['applications', 'Applications', FileUser, 'Candidates received'],
  ['pageviews', 'Page views', Eye, 'Public pages viewed'],
];

const Card = ({ title, sub, aside, className = '', testId, children }) => <section className={`ad-card ${className}`} data-testid={testId}>
  <header className="ad-card-head"><div><h2>{title}</h2><p>{sub}</p></div>{aside}</header>
  {children}
</section>;

const SubmissionStatus = ({ data, onSelect }) => {
  const types = data.by_type || {};
  const items = [
    { label: 'Contact inquiries', value: types.contact || 0, color: AMBER },
    { label: 'Assessment requests', value: types.assessment || 0, color: BLUE },
    { label: 'Job applications', value: types.application || 0, color: GRAY },
  ];
  const total = items.reduce((s, i) => s + i.value, 0);
  return <Card title="Submission Status" sub="Current period" testId="submissions-chart">
    <div className="ad-card-split">
      <Donut segments={total ? items : [{ label: 'none', value: 1, color: LIGHT }]} center={number(total)} sub="Submissions" testId="submissions-donut" />
      <Legend items={items} testId="submissions-legend" />
    </div>
    <button className="ad-card-link" onClick={() => onSelect('inquiries')} data-testid="overview-all-inquiries">View Inquiries <ArrowRight size={16} /></button>
  </Card>;
};

const TrafficHealth = ({ data, onSelect }) => {
  const { visitors, pageviews } = data.totals;
  const repeat = Math.max(0, pageviews - visitors);
  const items = [
    { label: 'Unique visitors', value: visitors, color: BLUE },
    { label: 'Repeat page views', value: repeat, color: AMBER },
    { label: 'Pages tracked', value: data.top_pages.length, color: GRAY },
  ];
  return <Card title="Traffic Health" sub="Website wide" testId="visitors-chart">
    <div className="ad-card-split">
      <Donut segments={pageviews ? items.slice(0, 2) : [{ label: 'none', value: 1, color: LIGHT }]} center={number(pageviews)} sub="Page views" testId="traffic-donut" />
      <Legend items={items} testId="traffic-legend" />
    </div>
    <button className="ad-card-link" onClick={() => document.getElementById('ad-top-pages')?.scrollIntoView({ behavior: 'smooth' })} data-testid="overview-view-pages">View Pages <ArrowRight size={16} /></button>
  </Card>;
};

const ActivityTooltip = ({ active, payload, label }) => active && payload?.length ? <div className="ad-chart-tooltip"><strong>{dateLabel(label)}</strong>{payload.map(item => <p key={item.dataKey}><span style={{ background: item.color }} />{item.name}<b>{number(item.value)}</b></p>)}</div> : null;

const Activity = ({ data, onSelect }) => {
  const series = data.series.map(d => ({ ...d, submissions: d.inquiries + d.applications }));
  const legend = <Legend items={[{ label: 'Visitors', color: BLUE }, { label: 'Submissions', color: AMBER }]} testId="activity-legend" />;
  return <Card title="Website Activity" sub="Visitors and submissions" aside={legend} className="ad-card-activity" testId="activity-chart">
    <div className="ad-activity-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={series} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="28%">
      <XAxis dataKey="date" tickFormatter={dateLabel} tickLine={false} axisLine={false} minTickGap={40} tick={{ fill: '#9aa7b8', fontSize: 10 }} dy={6} />
      <Tooltip content={<ActivityTooltip />} cursor={{ fill: '#f1f5f9' }} />
      <Bar name="Visitors" dataKey="visitors" stackId="a" fill={BLUE} radius={[0, 0, 2, 2]} animationDuration={900} animationEasing="ease-out" />
      <Bar name="Submissions" dataKey="submissions" stackId="a" fill={AMBER} radius={[3, 3, 0, 0]} animationDuration={900} animationBegin={200} animationEasing="ease-out" />
    </BarChart></ResponsiveContainer></div>
    <div className="ad-ministats">{STATS.map(([key, label, Icon, sub]) => <button key={key} className="ad-ministat" data-testid={`kpi-${key}`} onClick={() => ['inquiries', 'applications'].includes(key) && onSelect(key)}>
      <Icon size={18} /><div><strong><span data-testid={`metric-value-${key}`}>{number(data.totals[key])}</span> {label}</strong><small>{sub}</small></div>
    </button>)}</div>
  </Card>;
};

const TopPages = ({ pages }) => {
  const max = pages[0]?.views || 0;
  const rows = pages.map((p, i) => ({ label: p.path === '/' ? 'Homepage' : p.path.replace(/^\/(services|industries)\//, ''), value: p.views, color: i === 0 ? NAVY : i < 3 ? BLUE : GRAY }));
  return <div id="ad-top-pages"><Card title="Traffic by Page" sub="Relative activity" testId="top-pages">
    {rows.length ? <HBars rows={rows} max={max} testId="top-page" /> : <div className="ad-empty" data-testid="top-pages-empty"><Eye size={26} /><strong>A little more traffic, a little more insight</strong><p>Your most-viewed pages will appear here.</p></div>}
  </Card></div>;
};

const Recent = ({ items, onSelect }) => <Card title="Recent Submissions" sub="Latest conversations" testId="recent-submissions">
  {!items.length ? <div className="ad-empty" data-testid="recent-submissions-empty"><Inbox size={26} /><strong>Your next conversation starts here</strong><p>New inquiries and applications will appear as they arrive.</p></div>
    : <ul className="ad-recent">{items.slice(0, 5).map(item => <li key={item.id} data-testid={`recent-${item.id}`}>
      <span className="ad-recent-dot" style={{ background: item.type === 'application' ? GRAY : item.type === 'assessment' ? BLUE : AMBER }} />
      <div><strong>{item.name}</strong><small>{item.context || item.email}</small></div>
      <em>{dateLabel(item.created_at.slice(0, 10))}</em>
      <button className="ad-row-open" data-testid={`recent-open-${item.id}`} aria-label={`View submission from ${item.name}`} onClick={() => onSelect(item.type === 'application' ? 'applications' : 'inquiries')}><ArrowUpRight size={16} /></button>
    </li>)}</ul>}
  <button className="ad-card-link" onClick={() => onSelect('applications')} data-testid="overview-all-applications">View Applications <ArrowRight size={16} /></button>
</Card>;

const Promo = () => <a href="/services/security-governance-compliance?edit=1" className="ad-promo" data-testid="overview-open-editor">
  <span className="ad-promo-rule" />
  <h3>Keep your website moving forward.</h3>
  <p>Update a headline, refine your content, or make a quick edit — right on the page.</p>
  <span className="ad-promo-action"><MousePointer2 size={16} />Open visual editor<ArrowRight size={16} /></span>
</a>;

export const AdminOverview = ({ onSelect }) => {
  const [days, setDays] = useState(30);
  const [version, setVersion] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    api.get('/analytics/overview', { params: { days }, signal: controller.signal })
      .then(res => setData(res.data)).catch(err => { if (!controller.signal.aborted) setError(errMsg(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [days, version]);
  return <div className="ad-overview" data-testid="admin-overview">
    <div className="ad-overview-bar">
      <div>
        <h1>Overview</h1>
        {data && <p className="ad-period" data-testid="overview-period">{dateLabel(data.from.slice(0, 10))} – {dateLabel(data.to.slice(0, 10))} <span className="ad-utc">UTC</span></p>}
      </div>
      <div className="ad-overview-tools">
        <div className="ad-range" aria-label="Date range">{[7, 30, 90].map(n => <button key={n} aria-pressed={days === n} data-testid={`time-range-${n}d`} onClick={() => setDays(n)} className={n === days ? 'is-selected' : ''}>{n}d</button>)}</div>
        <Button variant="outline" size="icon" data-testid="overview-refresh" aria-label="Refresh dashboard" disabled={loading} onClick={() => setVersion(v => v + 1)}><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></Button>
      </div>
    </div>
    {error ? <div className="ad-error" role="alert" data-testid="overview-error"><AlertCircle size={20} /><div><strong>We couldn’t load your overview.</strong><p>{error}</p></div><Button variant="outline" data-testid="overview-retry" onClick={() => setVersion(v => v + 1)}>Try again</Button></div>
      : loading ? <div className="ad-loading" role="status" data-testid="overview-loading"><RefreshCw size={22} className="animate-spin" /><p>Gathering your website activity…</p></div>
      : data && <>
        <div className="ad-grid" key={`${days}-${version}`}>
          <SubmissionStatus data={data} onSelect={onSelect} />
          <TrafficHealth data={data} onSelect={onSelect} />
          <Activity data={data} onSelect={onSelect} />
          <TopPages pages={data.top_pages} />
          <Recent items={data.recent} onSelect={onSelect} />
          <Promo />
        </div>
        <p className="ad-tracking-note" data-testid="visitor-tracking-note">Visitor tracking {data.tracking_since ? `started ${dateLabel(data.tracking_since.slice(0, 10))}` : 'starts with the first visit'}. Visitors are unique browsers; admin and editor visits are excluded.</p>
      </>}
  </div>;
};
