'use client';

import React, { useState, useRef } from 'react';
import {
  FileText, CheckCircle2, ChevronDown,
  FileSpreadsheet, Info, BarChart3,
  PieChart, Activity, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LiveSummarySidebar = ({ activeTemplate, granularity, isComplete = false }) => (
  <div className="hidden lg:block">
    <div className="sticky top-24 bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
      <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Summary</h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Template</p>
          <div className="flex items-center gap-2">
            <activeTemplate.icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-bold text-card-foreground uppercase">{activeTemplate.title}</span>
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-border text-xs font-bold">
          <div className="flex justify-between"><span className="text-muted-foreground">Interval</span><span className="text-foreground">{granularity}</span></div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className={isComplete ? 'text-emerald-500' : 'text-orange-500 italic'}>
              {isComplete ? 'Ready to Export' : 'Incomplete'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function CreateReportPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('pl');
  const [granularity, setGranularity] = useState('Weekly');

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

  const activeTemplate = templates.find((t) => t.id === selectedTemplate) || templates[0];

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-32 pt-8 px-4 lg:px-0 animate-in fade-in duration-700">
      <section id="step1" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
            <h2 className="text-xl font-bold text-foreground">Choose Report Template</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={cn(
                  'p-6 rounded-xl border-2 transition-all cursor-pointer bg-card relative',
                  selectedTemplate === t.id ? 'border-primary shadow-lg shadow-primary/10' : 'border-border hover:border-muted-foreground/20'
                )}
              >
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <t.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-sm">{t.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                {selectedTemplate === t.id && <CheckCircle2 className="w-5 h-5 text-primary absolute top-4 right-4" />}
              </div>
            ))}
          </div>
          <button onClick={() => scrollTo(step2Ref)} className="w-full py-4 bg-foreground text-background rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            Configure Parameters <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <LiveSummarySidebar activeTemplate={activeTemplate} granularity={granularity} />
      </section>

      <section ref={step2Ref} className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24 pt-12 border-t border-border">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
            <h2 className="text-xl font-bold text-foreground">Fine-tune Parameters</h2>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Start Date</label>
                <input type="date" className="w-full bg-secondary border border-border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" defaultValue="2023-10-01" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">End Date</label>
                <input type="date" className="w-full bg-secondary border border-border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" defaultValue="2023-10-31" />
              </div>
            </div>
          </div>
          <button onClick={() => scrollTo(step3Ref)} className="w-full py-4 bg-foreground text-background rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            Review & Export <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border space-y-6">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Granularity</h3>
            <div className="space-y-2">
              {['Daily', 'Weekly', 'Monthly'].map((g) => (
                <div
                  key={g}
                  onClick={() => setGranularity(g)}
                  className={cn(
                    'p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-colors',
                    granularity === g ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'
                  )}
                >
                  <span className="text-xs font-bold text-foreground/80">{g}</span>
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    granularity === g ? 'border-primary' : 'border-muted-foreground/30'
                  )}>
                    {granularity === g && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={step3Ref} className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24 pt-12 border-t border-border">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Report Ready for Export</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Summary Detail</h3>
              <div className="space-y-4 text-xs font-bold">
                <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Reference</span><span className="text-foreground">#FIN-2023-089-Q3</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Engine</span><span className="text-foreground">V4.2 Auditor</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-primary font-black">14.2s</span></div>
              </div>
              <div className="bg-primary/5 p-4 rounded-xl flex gap-3 border border-primary/10">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">AUDIT TRAIL ACTIVE: Cryptographic hash verified.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Actions</h3>
              {[
                { title: 'Document PDF', icon: FileText, variant: 'destructive' },
                { title: 'Data Spreadsheet', icon: FileSpreadsheet, variant: 'success' },
              ].map((act) => (
                <div key={act.title} className="p-4 bg-card border border-border rounded-xl flex items-center justify-between hover:shadow-md cursor-pointer group transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      act.variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-500'
                    )}>
                      <act.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-foreground">{act.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
                </div>
              ))}
              <button className="w-full py-4 mt-4 bg-foreground text-background rounded-xl font-bold active:scale-95 transition-all text-sm">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
        <LiveSummarySidebar activeTemplate={activeTemplate} granularity={granularity} isComplete />
      </section>
    </div>
  );
}