import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

const DATA = [
  { t: 0, in: 2.0, out: 1.0 }, { t: 1, in: 1.6, out: 1.35 }, { t: 2, in: 1.4, out: 1.4 },
  { t: 3, in: 1.35, out: 1.25 }, { t: 4, in: 1.5, out: 1.4 }, { t: 5, in: 1.4, out: 1.3 },
  { t: 6, in: 1.35, out: 1.0 }, { t: 7, in: 1.9, out: 1.5 }, { t: 8, in: 2.05, out: 1.65 },
  { t: 9, in: 1.85, out: 1.6 }, { t: 10, in: 1.8, out: 1.35 }, { t: 11, in: 2.0, out: 1.4 },
  { t: 12, in: 2.25, out: 1.5 }, { t: 13, in: 2.15, out: 1.4 }, { t: 14, in: 2.05, out: 1.35 },
  { t: 15, in: 2.0, out: 1.4 }, { t: 16, in: 2.05, out: 1.45 }, { t: 17, in: 2.15, out: 1.5 },
  { t: 18, in: 2.35, out: 1.7 }, { t: 19, in: 2.65, out: 1.85 }, { t: 20, in: 2.75, out: 1.95 },
  { t: 21, in: 2.7, out: 1.85 }, { t: 22, in: 2.8, out: 1.75 }, { t: 23, in: 3.0, out: 1.9 },
];
const TICKS = { 0: "12 AM", 6: "6 AM", 12: "12 PM", 18: "6 PM" };

const Stat = ({ label, value, delta, up, good }) => (
  <div className="px-5 py-5" data-testid={`netperf-stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
    <p className="text-[13px] text-slate-500">{label}</p>
    <p className="font-serif text-[30px] leading-none text-midnight font-bold mt-2">{value}</p>
    {delta ? (
      <p className={`text-[13px] font-semibold mt-2 inline-flex items-center gap-1 ${good ? "text-emerald-600" : "text-red-500"}`}>
        {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{delta}
      </p>
    ) : <p className="text-[13px] text-slate-400 mt-2">Online</p>}
  </div>
);

export const NetworkPerformance = () => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-[0_20px_50px_-20px_rgba(15,42,82,0.25)] overflow-hidden" data-testid="network-performance">
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
      <h3 className="font-serif text-[22px] text-midnight font-bold">Network Performance</h3>
      <span className="inline-flex items-center gap-2 text-[13px] text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5">Last 24 Hours <ChevronDown size={14} /></span>
    </div>
    <div className="grid grid-cols-2 xl:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
      <Stat label="Total Devices" value="48" />
      <Stat label="Uptime" value="99.9%" delta="+0.1%" up good />
      <Stat label="Latency" value="12 ms" delta="-18%" up={false} good />
      <Stat label="Bandwidth" value="2.4 Gbps" delta="+12%" up good={false} />
    </div>
    <div className="px-4 pt-5 pb-2">
      <div className="flex items-center justify-center gap-6 mb-3 text-[13px] font-medium">
        <span className="inline-flex items-center gap-2 text-slate-700"><span className="w-3.5 h-3.5 rounded-sm bg-[#2563eb]" />Inbound</span>
        <span className="inline-flex items-center gap-2 text-slate-700"><span className="w-3.5 h-3.5 rounded-sm bg-[#f59e0b]" />Outbound</span>
      </div>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="inFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="outFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#e8edf3" vertical={false} />
            <XAxis dataKey="t" type="number" domain={[0, 23]} ticks={[0, 6, 12, 18]} tickFormatter={(t) => TICKS[t] || ""} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tickFormatter={(v) => (v === 0 ? "0" : `${v} Gbps`)} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={64} />
            <Area type="monotone" dataKey="out" stroke="#f59e0b" strokeWidth={2.5} fill="url(#outFill)" isAnimationActive={false} />
            <Area type="monotone" dataKey="in" stroke="#2563eb" strokeWidth={2.5} fill="url(#inFill)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);
