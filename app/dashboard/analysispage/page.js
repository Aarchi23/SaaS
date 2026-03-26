'use client';

import React from 'react';
import { Search, Filter, ChevronRight, ArrowUpRight } from 'lucide-react';

const AnalysisPage = () => {
  const transactions = [
    { date: '2023-07-24', time: '14:02', merchant: 'Amazon Web Services', category: 'SaaS / Infrastructure', ref: 'TXN-94621-BBX', status: 'CLEARED', amount: '$42,801.12', type: 'blue' },
    { date: '2023-07-24', time: '12:45', merchant: 'Unknown Entity: HK_PAY_001', category: 'Uncategorized', ref: 'TXN-94618-ERR', status: 'FLAGGED', amount: '$15,000.00', type: 'red' },
    { date: '2023-07-23', time: '09:15', merchant: 'WeWork Manhattan', category: 'Facility / Rent', ref: 'TXN-93992-NYK', status: 'CLEARED', amount: '$8,450.00', type: 'blue' },
    { date: '2023-07-22', time: '18:30', merchant: 'Corporate Catering Inc.', category: 'T&E / Meals', ref: 'TXN-93881-CAT', status: 'CLEARED', amount: '$1,244.50', type: 'blue' },
    { date: '2023-07-22', time: '11:00', merchant: 'Delta Air Lines', category: 'T&E / Travel', ref: 'TXN-93875-DAL', status: 'PENDING', amount: '$3,120.20', type: 'blue' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Analysis Specific Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Transaction Volume</p>
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">$14,292,840.42</h3>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
            <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">+12.4% vs prev. month</span>
            <span className="text-slate-400 self-center">Last calculation 4m ago</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Flagged for Review</p>
          <h3 className="text-4xl font-bold text-slate-800">42</h3>
          <div className="mt-4">
            <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Critical Priority</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg. Ticket Size</p>
          <h3 className="text-4xl font-bold text-slate-800">$2,842.11</h3>
          <div className="mt-4 flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <ArrowUpRight className="w-3.5 h-3.5" /> Stabilizing
          </div>
        </div>
      </div>

      {/* 2. Main Transaction Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Filters Header */}
        <div className="p-4 lg:p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Merchant or Reference ID..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
                <button className="bg-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm">ALL TRANSACTIONS</button>
                <button className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition">PENDING</button>
                <button className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition">CLEARED</button>
              </div>
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-[10px] font-bold text-slate-600 transition uppercase">
                <Filter className="w-3 h-3" /> Advanced Filters
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Merchant / Entity</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Reference ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t, i) => (
                <tr key={i} className={`hover:bg-slate-50/80 transition-colors ${t.status === 'FLAGGED' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm">
                    <p className="font-semibold text-slate-600">{t.date}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t.time}</p>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${t.type === 'red' ? 'bg-red-100' : 'bg-blue-100'} flex items-center justify-center shrink-0`}>
                       <div className={`w-3.5 h-3.5 rounded-sm ${t.type === 'red' ? 'bg-red-500 shadow-sm shadow-red-200' : 'bg-blue-500 shadow-sm shadow-blue-200'}`} />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{t.merchant}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-slate-200/50">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono text-slate-400 font-bold tracking-tight">{t.ref}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${t.type === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${t.type === 'red' ? 'text-red-600' : 'text-slate-600'}`}>{t.status}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold text-sm tabular-nums ${t.type === 'red' ? 'text-red-600' : 'text-slate-800'}`}>
                    {t.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30">
          <p>Showing 1-25 of 12,402 transactions</p>
          <div className="flex items-center gap-2 text-slate-700">
            <button className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:text-blue-600">2</button>
            <button className="w-8 h-8 flex items-center justify-center hover:text-blue-600">3</button>
            <span className="px-1 text-slate-300">...</span>
            <button className="w-8 h-8 flex items-center justify-center hover:text-blue-600">497</button>
            <ChevronRight className="w-4 h-4 ml-1 cursor-pointer hover:text-blue-600" />
          </div>
        </div>
      </div>

      {/* 3. Global Footer Stats */}
      <footer className="pt-4 flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
        <div className="flex gap-10">
          <p>Ledger Status: <span className="text-emerald-500 ml-1">Synced</span></p>
          <p>System Latency: <span className="text-slate-600 ml-1">42ms</span></p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-600">Data Protocol</a>
        </div>
      </footer>
    </div>
  );
};

export default AnalysisPage;