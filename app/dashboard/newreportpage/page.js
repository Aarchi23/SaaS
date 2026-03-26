'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, Calendar, CheckCircle2, ChevronDown, 
  ArrowUp, Download, Mail, FileSpreadsheet,
  Info, BarChart3, PieChart, Activity, ChevronRight
} from 'lucide-react';

export default function NewReportOnePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('pl');
  const [granularity, setGranularity] = useState('Weekly');
  const [departments, setDepartments] = useState(['Marketing', 'Engineering']);

  const step2Ref = useRef(null);
  const step3Ref = useRef(null);

  const scrollTo = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const templates = [
    { id: 'pl', title: 'P&L Statement', icon: BarChart3, desc: 'Detailed breakdown of revenues, costs, and expenses.' },
    { id: 'bs', title: 'Balance Sheet', icon: PieChart, desc: 'Snapshot of assets, liabilities, and equity.' },
    { id: 'cf', title: 'Cash Flow', icon: Activity, desc: 'Track the flow of cash in and out of business.' },
    { id: 'saas', title: 'SaaS Unit Economics', icon: FileText, desc: 'LTV, CAC, Churn, and ARPU metrics.' },
  ];

  const activeTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  // --- REUSABLE SIDEBAR COMPONENT ---
  const LiveSummarySidebar = ({ isComplete = false }) => (
    <div className="hidden lg:block">
      <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Summary</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Template</p>
            <div className="flex items-center gap-2">
              <activeTemplate.icon className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-sm font-bold text-slate-800 uppercase">{activeTemplate.title}</span>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-slate-50 text-xs font-bold">
            <div className="flex justify-between"><span className="text-slate-400">Interval</span><span className="text-slate-800">{granularity}</span></div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className={isComplete ? "text-emerald-500" : "text-orange-500 italic"}>
                {isComplete ? "Ready to Export" : "Incomplete"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-32 pt-8 px-4 lg:px-0">
      
      {/* --- STEP 1: CHOOSE TEMPLATE --- */}
      <section id="step1" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
             <h2 className="text-xl font-bold text-slate-800">Choose Report Template</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((t) => (
              <div key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-white relative ${selectedTemplate === t.id ? 'border-blue-500 shadow-lg shadow-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4"><t.icon className="w-5 h-5 text-blue-600" /></div>
                <h3 className="font-bold text-slate-800 text-sm">{t.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
                {selectedTemplate === t.id && <CheckCircle2 className="w-5 h-5 text-blue-600 absolute top-4 right-4" />}
              </div>
            ))}
          </div>
          <button onClick={() => scrollTo(step2Ref)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
            Configure Parameters <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <LiveSummarySidebar />
      </section>

      {/* --- STEP 2: CONFIGURATION (Color matched to Step 1/3) --- */}
      <section ref={step2Ref} className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24 pt-12 border-t border-slate-200">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
             <h2 className="text-xl font-bold text-slate-800">Fine-tune Parameters</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Date</label>
                <input type="date" className="w-full bg-slate-50 border p-3 rounded-xl text-sm outline-none" defaultValue="2023-10-01" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Date</label>
                <input type="date" className="w-full bg-slate-50 border p-3 rounded-xl text-sm outline-none" defaultValue="2023-10-31" />
              </div>
            </div>
          </div>
          {/* MATCHED BUTTON COLOR: Now using bg-slate-900 like Step 1 */}
          <button onClick={() => scrollTo(step3Ref)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
            Review & Export <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        
        {/* RIGHT SIDEBAR FOR STEP 2 (Granularity) */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Granularity</h3>
              <div className="space-y-2">
                {['Daily', 'Weekly', 'Monthly'].map(g => (
                  <div key={g} onClick={() => setGranularity(g)} className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer ${granularity === g ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100'}`}>
                    <span className="text-xs font-bold text-slate-700">{g}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${granularity === g ? 'border-blue-600' : 'border-slate-300'}`}>
                       {granularity === g && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* --- STEP 3: EXPORT (Now Left-Aligned & Includes Sidebar) --- */}
      <section ref={step3Ref} className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24 pt-12 border-t border-slate-200">
         <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                   <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Report Ready for Export</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary Detail</h3>
                   <div className="space-y-4 text-xs font-bold">
                      <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-400">Reference</span><span className="text-slate-800">#FIN-2023-089-Q3</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-400">Engine</span><span className="text-slate-800">V4.2 Auditor</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Time</span><span className="text-blue-600">14.2s</span></div>
                   </div>
                   <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 border border-blue-100">
                      <Info className="w-4 h-4 text-blue-500 shrink-0" />
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">AUDIT TRAIL ACTIVE: Cryptographic hash verified.</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</h3>
                   {[
                     { title: 'Document PDF', icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
                     { title: 'Data Spreadsheet', icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                   ].map(act => (
                     <div key={act.title} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between hover:shadow-md cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 ${act.bg} rounded-lg flex items-center justify-center`}><act.icon className={`w-5 h-5 ${act.color}`} /></div>
                           <p className="text-xs font-bold text-slate-800">{act.title}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                     </div>
                  ))}
                  <button className="w-full py-4 mt-4 bg-slate-900 text-white rounded-xl font-bold active:scale-95 transition-all text-sm">
                    Return to Dashboard
                  </button>
                </div>
            </div>
         </div>
         {/* Moving Live Summary here as requested */}
         <LiveSummarySidebar isComplete={true} />
      </section>
    </div>
  );
}