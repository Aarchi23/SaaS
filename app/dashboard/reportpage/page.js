'use client';

import React from 'react';
import { 
  FileText, BarChart, PieChart, Activity, 
  Download, Plus, Mail, MoreVertical, 
  CheckCircle, Clock, Calendar
} from 'lucide-react';

export default function ReportsPage() {
  const quickActions = [
    { title: 'P&L Statement', sub: 'Profit and loss analysis', icon: BarChart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Balance Sheet', sub: 'Asset & liability overview', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Cash Flow', sub: 'Operating cash movements', icon: PieChart, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'SaaS Metrics', sub: 'MRR, Churn, LTV data', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const recentReports = [
    { name: 'Q3 FY24 Performance Summary', type: 'Financial Summary', date: 'Oct 12, 2024', status: 'FINALIZED', formats: ['pdf', 'xls'] },
    { name: 'September Operating Expenses', type: 'Expense Audit', date: 'Oct 02, 2024', status: 'DRAFT', formats: ['pdf'] },
    { name: 'Annual SaaS Unit Economics', type: 'SaaS Metrics', date: 'Sep 28, 2024', status: 'ARCHIVED', formats: ['pdf', 'xls'] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <nav className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex gap-2">
            <span>HOME</span> <span>{'>'}</span> <span className="text-blue-600">REPORTS</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-800">Financial Reports</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition">
            <FilterIcon /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group">
            <div className={`w-10 h-10 ${action.bg} rounded-lg flex items-center justify-center mb-4`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">{action.title}</h3>
            <p className="text-[10px] text-slate-400 font-medium">{action.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts and Tables */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue vs Expenses Chart Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-slate-800">Revenue vs. Expenses</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Comparative analysis of fiscal year performance</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1 bg-white rounded text-[10px] font-bold shadow-sm">MONTHLY</button>
                <button className="px-3 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600">QUARTERLY</button>
              </div>
            </div>
            {/* Visual Placeholder for the Line Chart */}
            <div className="h-64 w-full relative">
               <svg viewBox="0 0 500 150" className="w-full h-full">
                  <path d="M0,80 Q100,60 200,90 T400,50 T500,70" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <path d="M0,110 Q100,100 200,120 T400,90 T500,105" fill="none" stroke="#ef4444" strokeWidth="3" />
               </svg>
               <div className="absolute top-0 right-0 flex gap-4 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> REVENUE</span>
                  <span className="items-center gap-1.5 flex"><div className="w-2 h-2 rounded-full bg-red-500" /> EXPENSES</span>
               </div>
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <h3 className="font-bold text-slate-800">Recent Generated Reports</h3>
              <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline">View Archive</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Report Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Date Generated</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Formats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentReports.map((report, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-300" />
                          <span className="text-xs font-bold text-slate-700">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-medium text-slate-500">{report.type}</td>
                      <td className="px-6 py-4 text-[10px] font-medium text-slate-500">{report.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-tight ${
                          report.status === 'FINALIZED' ? 'bg-blue-50 text-blue-600' : 
                          report.status === 'DRAFT' ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                           <Download className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-600" />
                           {report.formats.length > 1 && <FileText className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-600" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Scheduled Reports & System Health */}
        <div className="space-y-6">
          
          {/* Scheduled Reports Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800">Scheduled Reports</h3>
               <Plus className="w-5 h-5 text-blue-600 cursor-pointer bg-blue-50 rounded-full p-1" />
            </div>
            
            <div className="space-y-4">
               {/* Scheduled Item 1 */}
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
                  <span className="text-[8px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase mb-2 inline-block">Weekly</span>
                  <h4 className="text-xs font-bold text-slate-700">Weekly Executive Summary</h4>
                  <div className="flex items-center gap-1.5 mt-1 mb-4">
                     <Mail className="w-3 h-3 text-slate-400" />
                     <span className="text-[10px] text-slate-400">CFO@findash.com</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Next Run: Monday</span>
                     <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-200 border-2 border-white" />
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white" />
                     </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-slate-300 absolute top-4 right-3 cursor-pointer" />
               </div>

               {/* Scheduled Item 2 */}
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 relative">
                  <span className="text-[8px] font-bold bg-white text-blue-500 border border-blue-100 px-1.5 py-0.5 rounded uppercase mb-2 inline-block">Monthly</span>
                  <h4 className="text-xs font-bold text-slate-700">Board Meeting Deck Prep</h4>
                  <div className="flex items-center gap-1.5 mt-1 mb-4 text-[10px] text-slate-400">
                     <Mail className="w-3 h-3" /> board@findash.com
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Next Run: Oct 31</span>
                     <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-white" />
                  </div>
               </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 border border-dashed border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-lg hover:border-blue-400 hover:text-blue-600 transition">
               Manage All Schedules
            </button>
          </div>

          {/* Data Health Card */}
          <div className="bg-[#3b5998] p-6 rounded-xl shadow-lg shadow-blue-100 text-white">
             <CheckCircle className="w-5 h-5 mb-4 text-blue-200 opacity-80" />
             <h3 className="text-xl font-bold mb-1">Data Health: 99.8%</h3>
             <p className="text-[10px] text-blue-100 opacity-80 leading-relaxed mb-6">
                All financial streams are verified and synchronized. Last bank reconciliation: 14m ago.
             </p>
             <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition rounded text-[10px] font-bold uppercase tracking-widest border border-white/20">
                View Integrity Report
             </button>
          </div>

          {/* System Activity Feed */}
          <div className="space-y-4 px-2">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Activity</p>
             <div className="relative pl-6 space-y-6">
                <div className="absolute left-1.5 top-1 bottom-1 w-px bg-slate-200" />
                <div className="relative">
                   <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white" />
                   <h5 className="text-[11px] font-bold text-slate-700">ERP Data Synced</h5>
                   <p className="text-[9px] text-slate-400">Automated sync completed for 12 entities</p>
                   <span className="text-[8px] font-bold text-slate-300">2:15 PM</span>
                </div>
                <div className="relative">
                   <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white" />
                   <h5 className="text-[11px] font-bold text-slate-700">Tax Report Generated</h5>
                   <p className="text-[9px] text-slate-400">Prepared by System Agent (Workflow #882)</p>
                   <span className="text-[8px] font-bold text-slate-300">1:24 PM</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple Helper for the Filter Icon
function FilterIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}