"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  DollarSign,
  Percent,
  GripVertical,
  Maximize2,
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useDashboardStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { generateAllMockData } from '@/lib/mockData';

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- DRAGGABLE & RESIZABLE WRAPPER ---

const SortableWidget = ({ id, children, isFullWidth, onResize }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-500 ease-in-out",
        isFullWidth ? "lg:col-span-2" : "lg:col-span-1",
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
          {...attributes}
          {...listeners}
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
      <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">
        {label}
      </p>
      <Icon className="w-4 h-4 text-muted-foreground/30" />
    </div>
    <p className="text-2xl font-bold text-card-foreground tracking-tight">
      {value}
    </p>
  </div>
);

const RevenueChart = ({ data }) => {
  return (
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm h-full flex flex-col min-h-[400px] relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-card-foreground text-lg tracking-tight">Annual Recurring Revenue</h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">YoY growth performance tracking</p>
        </div>
        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wider border border-emerald-500/20">
          <ArrowUpRight className="w-3 h-3" /> 22.4%
        </span>
      </div>
      <div className="flex-1 w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} 
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-foreground text-background px-3 py-2 rounded-lg shadow-xl border border-border text-[10px] font-black">
                      ${payload[0].value}M ARR
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MarginChart = ({ value }) => {
  const chartData = [
    { name: 'Margin', value: parseInt(value) },
    { name: 'Remainder', value: 100 - parseInt(value) },
  ];
  return (
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm h-full flex flex-col items-center min-h-[400px]">
      <div className="self-start mb-4">
        <h3 className="font-bold text-card-foreground text-lg tracking-tight">Operating Margin</h3>
        <p className="text-xs text-muted-foreground mt-1 font-medium">Resource allocation efficiency</p>
      </div>
      <div className="flex-1 w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={240}>
          <RePieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="hsl(var(--primary))" />
              <Cell fill="hsl(var(--secondary))" />
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-4xl font-black text-card-foreground">{value}<span className="text-xl">%</span></p>
          <p className="text-[9px] text-muted-foreground font-black tracking-[0.2em] uppercase mt-1">Optimal</p>
        </div>
      </div>
      <div className="w-full space-y-3 mt-4">
        <div className="flex justify-between items-center text-[11px] font-bold">
          <span className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-primary" /> Core Ops
          </span>
          <span className="text-card-foreground font-black">$420M</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold">
          <span className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-secondary" /> R&D
          </span>
          <span className="text-muted-foreground">$112M</span>
        </div>
      </div>
    </div>
  );
};

const AuditPipeline = ({ data }) => (
  <div className="bg-card p-8 rounded-2xl border border-border shadow-sm h-full flex flex-col min-h-[300px]">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-card-foreground text-lg">
        Active Audit Pipeline
      </h3>
      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
        View All
      </button>
    </div>
    <div className="space-y-2 flex-1">
      {data.map((t, i) => (
        <div
          key={t.id}
          className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-card transition-colors">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="overflow-hidden max-w-[120px]">
              <p className="text-sm font-black text-card-foreground uppercase tracking-tight truncate">
                {t.merchant}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 truncate">
                {t.ref}
              </p>
            </div>
          </div>
          <div className="text-right font-black">
            <p className="text-sm text-card-foreground tracking-tighter tabular-nums">
              {t.amountFmt}
            </p>
            <p className="text-[9px] text-emerald-500 uppercase tracking-widest mt-0.5">
              Verified
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GrowthForecast = ({ data, growthRate }) => (
  <div className="bg-foreground p-8 rounded-2xl shadow-2xl h-full flex flex-col justify-between overflow-hidden relative group border border-border min-h-[300px]">
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
      <TrendingUp className="w-32 h-32 text-background" />
    </div>
    <div className="relative z-10">
      <h3 className="font-bold text-background text-xl mb-1 tracking-tight">Growth Forecast</h3>
      <p className="text-xs text-muted-foreground font-medium">Projected Monthly Momentum</p>
    </div>
    <div className="flex-1 w-full h-32 relative z-10 mt-6 -mx-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data?.slice(-12) || []}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorGrowth)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="pt-6 border-t border-muted/20 flex justify-between items-end relative z-10">
      <div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Avg Rate</p>
        <p className="text-3xl font-black text-background tracking-tighter">{growthRate}</p>
      </div>
      <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest">+2.4%</div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function OverviewPage() {
  const { items, setItems, sizes, toggleResize } = useDashboardStore();
  const [data] = useState(() => generateAllMockData());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const renderWidget = (id) => {
    if (!data) return null;
    switch (id) {
      case "revenue":
        return <RevenueChart data={data.revenueData} />;
      case "margin":
        return <MarginChart value={data.stats.margin} />;
      case "audit":
        return <AuditPipeline data={data.recentTransactions.slice(0, 3)} />;
      case "growth":
        return <GrowthForecast data={data.chartData} growthRate={data.stats.growth} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-10 pb-20"
    >
      {/* 1. Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.38 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
      >
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
            Finance Hub v2.0
          </p>
          <h2 className="text-4xl font-black text-foreground tracking-tight">
            CFO Overview
          </h2>
        </div>
        <motion.div
          className="flex gap-4 w-full md:w-auto overflow-x-auto pb-4"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.09 } } }}
        >
          {[
            { label: "Total Assets", value: data?.stats.assets || "$1.24B", icon: DollarSign },
            { label: "Liquidity", value: data?.stats.liquidity || "4.2x", icon: Activity },
            { label: "Margin", value: `${data?.stats.margin}%` || "74%", icon: Percent },
          ].map(({ label, value, icon }) => (
            <motion.div
              key={label}
              variants={{
                initial: { opacity: 0, y: 14 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.32 } },
              }}
            >
              <StatCard label={label} value={value} icon={icon} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* 2. Drag & Drop Builder Canvas */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-wrap gap-10 py-8 border-t border-border"
      >
        <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--brand-primary))] animate-pulse shadow-lg shadow-[hsl(var(--brand-primary-light))]" />
          <span>Engine: V4.2 Optimal</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          <Activity className="w-4 h-4 text-muted-foreground/40" />
          <span>Last Reconciliation: 08:42 AM</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
