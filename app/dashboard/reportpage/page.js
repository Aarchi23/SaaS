'use client';

import React, { useState } from 'react';
import { 
  FileText, BarChart, PieChart, Activity, 
  Download, Plus, Mail, MoreVertical, 
  CheckCircle, Clock, Calendar, Filter, GripVertical
} from 'lucide-react';

// dnd-kit for Phase 2 "Dashboard Builder"
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@/lib/utils';

// --- DRAGGABLE WRAPPER ---
const SortableWidget = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div 
        {...attributes} {...listeners} 
        className="absolute top-4 right-4 z-30 cursor-grab active:grabbing p-1.5 bg-secondary border border-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
};

export default function ReportsPage() {
  const [layoutOrder, setLayoutOrder] = useState(['chart', 'table']);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLayoutOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const quickActions = [
    { title: 'P&L Statement', sub: 'Profit and loss analysis', icon: BarChart },
    { title: 'Balance Sheet', sub: 'Asset & liability overview', icon: Activity },
    { title: 'Cash Flow', sub: 'Operating cash movements', icon: PieChart },
    { title: 'SaaS Metrics', sub: 'MRR, Churn, LTV data', icon: Activity },
  ];

  const recentReports = [
    { name: 'Q3 FY26 Performance Summary', type: 'Financial Summary', date: 'Apr 01, 2026', status: 'FINALIZED', formats: ['pdf', 'xls'] },
    { name: 'March Operating Expenses', type: 'Expense Audit', date: 'Mar 28, 2026', status: 'DRAFT', formats: ['pdf'] },
    { name: 'Annual SaaS Unit Economics', type: 'SaaS Metrics', date: 'Mar 15, 2026', status: 'ARCHIVED', formats: ['pdf', 'xls'] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Header (Dynamic Navigation) */}
      <div className="flex justify-between items-center">
        <div>
          {/* <nav className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex gap-2">
            <span>HOME</span> <span>{'>'}</span> <span className="text-primary">REPORTS</span>
          </nav> */}
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Financial Reports</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-bold text-muted-foreground shadow-sm hover:bg-secondary transition">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      {/* 2. Quick Action Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <div key={i} className="bg-card p-5 rounded-xl border border-border shadow-sm hover:border-primary/50 transition cursor-pointer group">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
              <action.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-bold text-card-foreground text-sm group-hover:text-primary transition">{action.title}</h3>
            <p className="text-[10px] text-muted-foreground font-medium">{action.sub}</p>
          </div>
        ))}
      </div>

      {/* 3. Draggable Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layoutOrder} strategy={verticalListSortingStrategy}>
              {layoutOrder.map((id) => (
                <SortableWidget key={id} id={id}>
                  {id === 'chart' ? (
                    /* REVENUE CHART WIDGET */
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="font-bold text-foreground">Revenue vs. Expenses</h3>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Fiscal year performance tracking</p>
                        </div>
                        <div className="flex bg-secondary p-1 rounded-lg">
                          <button className="px-3 py-1 bg-card rounded text-[10px] font-bold shadow-sm">MONTHLY</button>
                          <button className="px-3 py-1 text-[10px] font-bold text-muted-foreground">QUARTERLY</button>
                        </div>
                      </div>
                      <div className="h-48 w-full relative">
                        {/* Dynamic SVG using primary variable */}
                        <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                          <path d="M0,80 Q100,60 200,90 T400,50 T500,70" fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" />
                          <path d="M0,110 Q100,100 200,120 T400,90 T500,105" fill="none" stroke="currentColor" className="text-destructive" strokeWidth="3" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    /* RECENT REPORTS TABLE WIDGET */
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="p-6 flex justify-between items-center border-b border-border">
                        <h3 className="font-bold text-foreground">Generated Reports</h3>
                        <button className="text-primary text-[10px] font-bold uppercase hover:underline">View Archive</button>
                      </div>
                      <div className="overflow-x-auto text-sm">
                        <table className="w-full text-left">
                          <thead className="bg-secondary/30 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            <tr>
                              <th className="px-6 py-4">Report</th>
                              <th className="px-6 py-4">Type</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Formats</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {recentReports.map((report, idx) => (
                              <tr key={idx} className="hover:bg-secondary/20 transition group">
                                <td className="px-6 py-4 font-bold text-foreground">{report.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{report.type}</td>
                                <td className="px-6 py-4 text-muted-foreground tabular-nums">{report.date}</td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Download className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </SortableWidget>
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* 4. Fixed Side Column (Scheduled & Health) */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-foreground">Scheduled</h3>
              <Plus className="w-5 h-5 text-primary cursor-pointer bg-primary/10 rounded-full p-1" />
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                <span className="text-[8px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded uppercase mb-2 inline-block">Weekly</span>
                <h4 className="text-xs font-bold text-foreground">Executive Summary</h4>
                <p className="text-[10px] text-muted-foreground mt-1">CFO@virtusfinance.tech</p>
              </div>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20 text-primary-foreground relative overflow-hidden">
             <div className="relative z-10">
               <CheckCircle className="w-6 h-6 mb-4 opacity-80" />
               <h3 className="text-xl font-bold mb-1">Data Health: 99.8%</h3>
               <p className="text-[10px] opacity-70 leading-relaxed mb-6">Verified and synchronized with ERP.</p>
               <button className="w-full py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 transition rounded text-[10px] font-bold uppercase tracking-widest border border-primary-foreground/20">
                 Integrity Report
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}