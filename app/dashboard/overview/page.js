'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  MoreHorizontal,
  DollarSign,
  Percent
} from 'lucide-react';

// --- INTERNAL UI COMPONENTS ---

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex-1 min-w-[200px]">
    <div className="flex justify-between items-start mb-2">
      <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">{label}</p>
      <Icon className="w-4 h-4 text-slate-300" />
    </div>
    <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
  </div>
);

const RevenueChart = () => {
  const data = [
    { label: 'JAN', value: 30 }, { label: 'MAR', value: 40 },
    { label: 'MAY', value: 35 }, { label: 'JUL', value: 55 },
    { label: 'SEP', value: 75 }, { label: 'NOV', value: 100 },
  ];
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Annual Recurring Revenue</h3>
          <p className="text-xs text-slate-400 mt-1">YoY growth performance tracking</p>
        </div>
        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
          <ArrowUpRight className="w-3 h-3" /> 22.4%
        </span>
      </div>
      <div className="flex-1 flex items-end gap-3 sm:gap-6 mt-auto min-h-[200px]">
        {data.map((col, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
            <div 
              style={{ height: `${col.value}%` }} 
              className={`w-full rounded-t-md transition-all duration-500 ${
                i === data.length - 1 ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-100 group-hover:bg-slate-200'
              }`}
            />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{col.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarginChart = () => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col items-center">
    <div className="self-start mb-8">
      <h3 className="font-bold text-slate-800 text-lg">Operating Margin</h3>
      <p className="text-xs text-slate-400 mt-1">Resource allocation efficiency</p>
    </div>
    <div className="relative w-44 h-44 flex items-center justify-center my-6">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="64" fill="none" stroke="#f8fafc" strokeWidth="14" />
        <circle 
          cx="80" cy="80" r="64" fill="none" stroke="#2563eb" strokeWidth="14" 
          strokeDasharray="402" strokeDashoffset="104" strokeLinecap="round" 
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-black text-slate-800">74<span className="text-xl">%</span></p>
        <p className="text-[9px] text-slate-400 font-black tracking-[0.2em] uppercase mt-1">Optimal</p>
      </div>
    </div>
    <div className="w-full mt-auto space-y-4">
      <div className="flex justify-between items-center text-[11px] font-bold">
        <span className="flex items-center gap-2 text-slate-600 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-blue-600" /> Core Ops
        </span>
        <span className="text-slate-800">$420M</span>
      </div>
      <div className="flex justify-between items-center text-[11px] font-bold">
        <span className="flex items-center gap-2 text-slate-400 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-slate-100" /> R&D
        </span>
        <span className="text-slate-500">$112M</span>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function OverviewPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Finance Hub v2.0</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">CFO Overview</h2>
        </div>
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-4">
          <StatCard label="Total Assets" value="$1.24B" icon={DollarSign} />
          <StatCard label="Liquidity" value="4.2x" icon={Activity} />
          <StatCard label="Margin" value="74%" icon={Percent} />
        </div>
      </div>

      {/* 2. Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-h-[450px]">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1 min-h-[450px]">
          <MarginChart />
        </div>

        {/* Audit Queue Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Active Audit Pipeline</h3>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-2">
             {[1,2,3].map((i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Batch #092-{i}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Awaiting Verification</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-800 tracking-tighter">$124,000.00</p>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Internal Audit</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Growth Stats Card */}
        <div className="lg:col-span-1 bg-slate-900 p-8 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-white text-xl mb-1">Growth Forecast</h3>
            <p className="text-xs text-slate-500 font-medium">Projected Monthly Momentum</p>
          </div>
          <div className="h-32 flex items-end gap-3 px-2 my-8 relative z-10">
            {[30, 50, 40, 80, 50, 90].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-md transition-all duration-500 ${i === 5 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            ))}
          </div>
          <div className="pt-6 border-t border-slate-800 flex justify-between items-end relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Avg Rate</p>
              <p className="text-3xl font-black text-white tracking-tighter">14.2%</p>
            </div>
            <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest">+2.4%</div>
          </div>
        </div>
      </div>

      {/* 4. Footer System Bar */}
      <div className="flex flex-wrap gap-10 py-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Engine: V4.2 Optimal</span>
        </div>
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-slate-300" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Reconciliation: 08:42 AM</span>
        </div>
      </div>
    </div>
  );
}