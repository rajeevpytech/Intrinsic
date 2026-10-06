import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";
import { Search, LayoutGrid, ShieldAlert, MonitorSmartphone, Radar, Bug, Fingerprint, ClipboardCheck, FileBarChart, Settings, ArrowRight, Activity, AlertTriangle, Share2 } from "lucide-react";
import logoWhite from "../../assets/logo-white.png";

const NAV = [
  { Icon: LayoutGrid, l: "Overview", on: true }, { Icon: ShieldAlert, l: "Threats" }, { Icon: MonitorSmartphone, l: "Endpoints" },
  { Icon: Radar, l: "Detections" }, { Icon: Bug, l: "Vulnerabilities" }, { Icon: Fingerprint, l: "Identity" },
  { Icon: ClipboardCheck, l: "Compliance" }, { Icon: FileBarChart, l: "Reports" }, { Icon: Settings, l: "Settings" },
];
const THREAT = [{ n: "Active", v: 8, c: "#f2a91c" }, { n: "Investigating", v: 5, c: "#2f6fd0" }, { n: "Contained", v: 3, c: "#8aa0b8" }, { n: "Resolved", v: 2, c: "#d4dde8" }];
const ENDPOINT = [{ n: "Healthy", v: 82, c: "#2f6fd0" }, { n: "Attention Required", v: 9, c: "#f2a91c" }, { n: "Isolated", v: 4, c: "#8aa0b8" }, { n: "Offline", v: 5, c: "#d4dde8" }];
const TYPES = [{ n: "Malware", v: 34, c: "#0b3f95" }, { n: "Ransomware", v: 22, c: "#2f6fd0" }, { n: "Phishing", v: 18, c: "#5b8ad6" }, { n: "Exploit", v: 12, c: "#8aa0b8" }, { n: "Insider Risk", v: 8, c: "#f2a91c" }, { n: "Other", v: 6, c: "#d4dde8" }];
const SOURCES = [["Endpoint Protection", 100, "#0b3f95"], ["Cloud Security", 80, "#2f6fd0"], ["Email Security", 62, "#5b8ad6"], ["Identity & Access", 46, "#7ea4e6"], ["Network Security", 34, "#a9bfe0"], ["Vulnerability Mgmt", 24, "#c3cfdf"], ["Other", 14, "#dbe3ee"]];
const CHIPS = [[Activity, "Monitoring", "Continuous"], [AlertTriangle, "Threats", "Triaged"], [Share2, "Incidents", "Under Review"], [Settings, "Response", "Operational"]];
const HOURS = ["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"];

const seed = () => Array.from({ length: 24 }, (_, i) => ({ h: i, d: 12 + Math.round(18 * Math.abs(Math.sin(i / 3.2)) + Math.random() * 8), e: 2 + Math.round(Math.random() * 6) }));

const Donut = ({ data, label, sub }) => (
  <div className="relative w-[124px] h-[124px] shrink-0">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="v" innerRadius={39} outerRadius={56} startAngle={90} endAngle={-270} paddingAngle={2} stroke="none">
          {data.map((d, i) => <Cell key={i} fill={d.c} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
      <span className="text-[11px] font-semibold text-midnight leading-tight">{label}</span>
      <span className="text-[9px] text-slate-400">{sub}</span>
    </div>
  </div>
);
const Legend = ({ data }) => (
  <ul className="space-y-1.5 text-[11px]">
    {data.map((d) => <li key={d.n} className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.c }} />{d.n}</li>)}
  </ul>
);
const Card = ({ title, sub, children, link, className = "" }) => (
  <div className={`border border-slate-100 rounded-lg p-3.5 flex flex-col ${className}`}>
    <p className="text-[12px] font-semibold text-[#0b3f95]">{title}</p>
    <p className="text-[9px] uppercase tracking-wider text-slate-400 mb-1">{sub}</p>
    {children}
    {link && <p className="mt-auto pt-2 text-right text-[11px] font-semibold text-[#0b3f95] inline-flex items-center justify-end gap-1">{link} <ArrowRight size={11} /></p>}
  </div>
);

export const SocDashboardLive = ({ className = "" }) => {
  const [clock, setClock] = useState("");
  const [act, setAct] = useState(seed);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const c = setInterval(tick, 1000);
    const a = setInterval(() => setAct((p) => p.map((x, i) => (i === Math.floor(Math.random() * 24) ? { ...x, d: 10 + Math.round(Math.random() * 28), e: 1 + Math.round(Math.random() * 7) } : x))), 1400);
    return () => { clearInterval(c); clearInterval(a); };
  }, []);

  return (
    <div className={`rounded-xl overflow-hidden border border-powder shadow-[0_30px_70px_-30px_rgba(9,26,54,0.45)] bg-white flex ${className}`} data-testid="soc-dashboard-live">
      <aside className="hidden md:flex flex-col w-[150px] shrink-0 text-white/85 py-4" style={{ background: "#1e4fd8" }}>
        <div className="px-5 mb-5"><img src={logoWhite} alt="Intrinsic" className="h-6 w-auto" /></div>
        {NAV.map(({ Icon, l, on }) => (
          <div key={l} className={`flex items-center gap-2.5 px-5 py-[7px] text-[11.5px] ${on ? "bg-white/15 text-white border-l-[3px] border-[#f2a91c]" : "hover:text-white"}`}><Icon size={13} />{l}</div>
        ))}
        <p className="mt-auto px-5 pt-4 text-[9px] font-bold tracking-[0.16em] text-white/70 leading-[1.7]">SECURITY<br />BUILT FOR<br />WHAT'S NEXT</p>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 max-w-[280px]"><Search size={13} />Search threats, endpoints, or users…</div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500 pm-blink" />LIVE</span>
            <span className="text-slate-500 hidden sm:inline">Security Operations Center</span>
            <span className="font-mono text-slate-600 tabular-nums">{clock}</span>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card title="Threat Status" sub="Current Status" link="View Threats">
            <div className="flex items-center gap-3"><Donut data={THREAT} label="Monitoring" sub="Active" /><Legend data={THREAT} /></div>
          </Card>
          <Card title="Endpoint Health" sub="Organization Wide" link="View Endpoints">
            <div className="flex items-center gap-3"><Donut data={ENDPOINT} label="Endpoints" sub="Protected" /><Legend data={ENDPOINT} /></div>
          </Card>
          <div className="border border-slate-100 rounded-lg p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div><p className="text-[12px] font-semibold text-[#0b3f95]">Security Activity</p><p className="text-[9px] uppercase tracking-wider text-slate-400">Detections and Escalations</p></div>
              <div className="flex items-center gap-3 text-[9.5px] text-slate-500 whitespace-nowrap"><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0b3f95]" />Detections</span><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f2a91c]" />Escalations</span></div>
            </div>
            <div className="h-[84px] -mx-1 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={act} margin={{ top: 4, right: 2, left: 2, bottom: 0 }} barCategoryGap={2}>
                  <XAxis dataKey="h" tickLine={false} axisLine={false} interval={3} tickFormatter={(h) => HOURS[h / 4] || ""} tick={{ fontSize: 8, fill: "#94a3b8" }} height={12} />
                  <Bar dataKey="d" stackId="a" fill="#2f6fd0" isAnimationActive={false} />
                  <Bar dataKey="e" stackId="a" fill="#f2a91c" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
              {CHIPS.map(([Icon, t, s]) => (
                <div key={t} className="flex items-center gap-1.5 min-w-0">
                  <Icon size={13} className="text-[#0b3f95] shrink-0" />
                  <div className="leading-tight min-w-0"><p className="text-[9.5px] font-semibold text-slate-700 truncate">{t}</p><p className="text-[7.5px] uppercase tracking-wide text-slate-400 truncate">{s}</p></div>
                </div>
              ))}
            </div>
          </div>

          <Card title="Threats by Detection Source" sub="Relative Activity">
            <div className="space-y-2 mt-1.5">
              {SOURCES.map(([l, w, c]) => (
                <div key={l} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-[104px] shrink-0 truncate text-right">{l}</span>
                  <div className="flex-1 h-2.5 rounded-sm bg-slate-100 overflow-hidden"><div className="h-full rounded-sm transition-all duration-700" style={{ width: `${w}%`, background: c }} /></div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Threats by Type" sub="Relative Distribution">
            <div className="flex items-center gap-3"><Donut data={TYPES} label="Threats" sub="Detected" /><Legend data={TYPES} /></div>
          </Card>
          <div className="rounded-lg p-5 flex flex-col justify-center text-white" style={{ background: "#6b8a7e" }} data-testid="soc-quote-card">
            <span className="block w-8 h-[3px] bg-[#f2a91c] mb-4" />
            <p className="font-serif text-[20px] leading-[1.25] font-semibold">Proactive Monitoring.<br />Faster Response.<br />Greater Resilience.</p>
            <p className="text-[9.5px] font-bold tracking-[0.18em] text-white/75 mt-5">BUILT FOR WHAT'S NEXT</p>
          </div>
        </div>
      </div>
    </div>
  );
};
