'use client';

import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, ShieldCheck, Activity, 
  ArrowUpRight, DollarSign, Percent, GripVertical, Maximize2 
} from 'lucide-react';

// dnd-kit imports
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@/lib/utils';

// --- DRAGGABLE & RESIZABLE WRAPPER ---

const SortableWidget = ({ id, children, isFullWidth, onResize }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative group transition-all duration-500 ease-in-out",
        isFullWidth ? "lg:col-span-2" : "lg:col-span-1"
      )}
    >
      {/* Toolbelt: Drag & Resize */}
      <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onResize}
          className="p-1.5 bg-secondary border border-border rounded-md hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
          title="Toggle Container Size"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <div 
          {...attributes} {...listeners} 
          className="p-1.5 bg-secondary border border-border rounded-md cursor-grab active:grabbing shadow-sm"
        >
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>
      {children}
    </div>
  );
};

// --- INTERNAL UI COMPONENTS (WHITE-LABEL READY) ---

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-card px-5 py-4 rounded-2xl border border-border shadow-sm flex-1 min-w-[200px] hover:border-primary/20 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">{label}</p>
      <Icon className="w-4 h-4 text-muted-foreground/30" />
    </div>
    <p className="text-2xl font-bold text-card-foreground tracking-tight">{value}</p>
  </div>
);

const RevenueChart = () => {
  const data = [
    { label: 'JAN', value: 30 }, { label: 'MAR', value: 40 },
    { label: 'MAY', value: 35 }, { label: 'JUL', value: 55 },
    { label: 'SEP', value: 75 }, { label: 'NOV', value: 100 },
  ];
  return (
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm h-full flex flex-col min-h-[400px]">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="font-bold text-card-foreground text-lg">Annual Recurring Revenue</h3>
          <p className="text-xs text-muted-foreground mt-1">YoY growth performance tracking</p>
        </div>
        <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
          <ArrowUpRight className="w-3 h-3" /> 22.4%
        </span>
      </div>
      <div className="flex-1 flex items-end gap-3 sm:gap-6 mt-auto">
        {data.map((col, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
            <div 
              style={{ height: `${col.value}%` }} 
              className={cn(
                "w-full rounded-t-md transition-all duration-500",
                i === data.length - 1 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-secondary group-hover:bg-muted'
              )}
            />
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{col.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarginChart = () => (
  <div className="bg-card p-8 rounded-2xl border border-border shadow-sm h-full flex flex-col items-center min-h-[400px]">
    <div className="self-start mb-8">
      <h3 className="font-bold text-card-foreground text-lg">Operating Margin</h3>
      <p className="text-xs text-muted-foreground mt-1">Resource allocation efficiency</p>
    </div>
    <div className="relative w-44 h-44 flex items-center justify-center my-6">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="64" fill="none" stroke="hsl(var(--secondary))" strokeWidth="14" />
        <circle 
          cx="80" cy="80" r="64" fill="none" stroke="hsl(var(--primary))" strokeWidth="14" 
          strokeDasharray="402" strokeDashoffset="104" strokeLinecap="round" 
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-black text-card-foreground">74<span className="text-xl">%</span></p>
        <p className="text-[9px] text-muted-foreground font-black tracking-[0.2em] uppercase mt-1">Optimal</p>
      </div>
    </div>
    <div className="w-full mt-auto space-y-4">
      <div className="flex justify-between items-center text-[11px] font-bold">
        <span className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-primary" /> Core Ops
        </span>
        <span className="text-card-foreground font-black">$420M</span>
      </div>
      <div className="flex justify-between items-center text-[11px] font-bold">
        <span className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-secondary" /> R&D
        </span>
        <span className="text-muted-foreground">$112M</span>
      </div>
    </div>
  </div>
);

const AuditPipeline = () => (
  <div className="bg-card p-8 rounded-2xl border border-border shadow-sm h-full flex flex-col min-h-[300px]">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-card-foreground text-lg">Active Audit Pipeline</h3>
      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
    </div>
    <div className="space-y-2 flex-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-card transition-colors">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black text-card-foreground uppercase tracking-tight">Batch #092-{i}</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Awaiting Verification</p>
            </div>
          </div>
          <div className="text-right font-black">
            <p className="text-sm text-card-foreground tracking-tighter tabular-nums">$124,000.00</p>
            <p className="text-[9px] text-emerald-500 uppercase tracking-widest mt-0.5">Internal Audit</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GrowthForecast = () => (
  <div className="bg-foreground p-8 rounded-2xl shadow-2xl h-full flex flex-col justify-between overflow-hidden relative group border border-border min-h-[300px]">
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
      <TrendingUp className="w-32 h-32 text-background" />
    </div>
    <div className="relative z-10">
      <h3 className="font-bold text-background text-xl mb-1">Growth Forecast</h3>
      <p className="text-xs text-muted-foreground font-medium">Projected Monthly Momentum</p>
    </div>
    <div className="h-32 flex items-end gap-3 px-2 my-8 relative z-10">
      {[30, 50, 40, 80, 50, 90].map((h, i) => (
        <div key={i} style={{ height: `${h}%` }} className={cn("flex-1 rounded-t-md transition-all duration-500", i === 5 ? "bg-primary" : "bg-muted/20")} />
      ))}
    </div>
    <div className="pt-6 border-t border-muted/20 flex justify-between items-end relative z-10">
      <div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Avg Rate</p>
        <p className="text-3xl font-black text-background tracking-tighter">14.2%</p>
      </div>
      <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest">+2.4%</div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function OverviewPage() {
  // Widget Order & Resize States
  const [items, setItems] = useState(['revenue', 'margin', 'audit', 'growth']);
  const [sizes, setSizes] = useState({ revenue: true, audit: true, margin: false, growth: false });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleResize = (id) => {
    setSizes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const renderWidget = (id) => {
    switch(id) {
      case 'revenue': return <RevenueChart />;
      case 'margin': return <MarginChart />;
      case 'audit': return <AuditPipeline />;
      case 'growth': return <GrowthForecast />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* 1. Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Finance Hub v2.0</p>
          <h2 className="text-4xl font-black text-foreground tracking-tight">CFO Overview</h2>
        </div>
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-4">
          <StatCard label="Total Assets" value="$1.24B" icon={DollarSign} />
          <StatCard label="Liquidity" value="4.2x" icon={Activity} />
          <StatCard label="Margin" value="74%" icon={Percent} />
        </div>
      </div>

      {/* 2. Drag & Drop Builder Canvas */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {items.map((id) => (
              <SortableWidget 
                key={id} 
                id={id} 
                isFullWidth={sizes[id]} 
                onResize={() => toggleResize(id)}
              >
                {renderWidget(id)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* 3. Footer System Bar */}
      <div className="flex flex-wrap gap-10 py-8 border-t border-border">
        <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200" />
          <span>Engine: V4.2 Optimal</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          <Activity className="w-4 h-4 text-muted-foreground/40" />
          <span>Last Reconciliation: 08:42 AM</span>
        </div>
      </div>
    </div>
  );
}