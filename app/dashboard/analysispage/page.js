'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ChevronUp, ChevronDown, ChevronsUpDown,
  BadgeCheck, ShieldAlert, Clock, GripVertical, SlidersHorizontal,
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { generateTransactions } from '@/lib/mockData';

// ─── Generate data ONCE at module level — never re-created on re-render ───────
const ALL_TRANSACTIONS = generateTransactions(10000);

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUSES = ['CLEARED', 'FLAGGED', 'PENDING'];

const CATEGORIES = [
  'Infrastructure', 'SaaS Subscriptions', 'Payroll', 'Marketing',
  'Legal & Compliance', 'R&D', 'Office & Facilities', 'Travel & Expenses',
  'Consulting', 'Vendor Payments', 'Tax Payments', 'Insurance',
  'Utilities', 'Uncategorized',
];

const COLUMNS = [
  { key: 'date',     label: 'Date',     cls: 'w-[110px] flex-shrink-0'             },
  { key: 'merchant', label: 'Merchant', cls: 'flex-1 min-w-0'                      },
  { key: 'category', label: 'Category', cls: 'w-[150px] flex-shrink-0'             },
  { key: 'type',     label: 'Type',     cls: 'w-[150px] flex-shrink-0'             },
  { key: 'status',   label: 'Status',   cls: 'w-[115px] flex-shrink-0'             },
  { key: 'amount',   label: 'Amount',   cls: 'w-[140px] flex-shrink-0 text-right'  },
];

// ─── Framer Motion variants ───────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n);

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    CLEARED: { cls: 'bg-primary/10 text-primary border-primary/20',            Icon: BadgeCheck  },
    FLAGGED: { cls: 'bg-destructive/10 text-destructive border-destructive/20', Icon: ShieldAlert },
    PENDING: { cls: 'bg-secondary text-muted-foreground border-border',         Icon: Clock       },
  };
  const { cls, Icon } = map[status] || map.PENDING;
  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest', cls)}>
      <Icon className="w-3 h-3" />{status}
    </div>
  );
};

// ─── MetricCard ───────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, subtext, trend, variant = 'default' }) => (
  <motion.div variants={staggerItem} className="bg-card p-6 rounded-xl border border-border shadow-sm h-full">
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
    <h3 className={cn('text-3xl font-bold tracking-tight', variant === 'destructive' ? 'text-destructive' : 'text-card-foreground')}>
      {value}
    </h3>
    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
      {trend && (
        <span className={cn('px-2 py-1 rounded-full', variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')}>
          {trend}
        </span>
      )}
      <span className="text-muted-foreground">{subtext}</span>
    </div>
  </motion.div>
);

// ─── SortableWidget (dnd-kit — original logic preserved) ─────────────────────
const SortableWidget = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto', opacity: isDragging ? 0.6 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div {...attributes} {...listeners} className="absolute top-4 right-4 z-30 cursor-grab active:cursor-grabbing p-1.5 bg-secondary border border-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
};

// ─── Multi-select Filter Dropdown ─────────────────────────────────────────────
const FilterDropdown = ({ label, options, selected, onToggle, onClear }) => {
  const [open, setOpen] = useState(false);
  const has = selected.length > 0;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all',
          has
            ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
            : 'bg-background border-border hover:bg-secondary text-muted-foreground'
        )}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        {label}
        {has && <span className="bg-white/20 rounded-full px-1.5 text-[9px] font-black">{selected.length}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, y: 4, scale: 0.96, transition: { duration: 0.1 } }}
            className="absolute top-full mt-2 left-0 z-50 bg-card border border-border rounded-xl shadow-xl p-2 min-w-[190px] max-h-64 overflow-y-auto"
          >
            {has && (
              <button onClick={onClear} className="w-full text-left px-3 py-1.5 text-[10px] font-black text-destructive uppercase tracking-widest hover:bg-secondary rounded-lg mb-1 transition-colors">
                Clear All
              </button>
            )}
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left',
                  selected.includes(opt) ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-card-foreground'
                )}
              >
                <div className={cn('w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors', selected.includes(opt) ? 'bg-primary border-primary' : 'border-border')}>
                  {selected.includes(opt) && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                </div>
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
};

// ─── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ colKey, sortField, sortOrder }) => {
  if (sortField !== colKey) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/40" />;
  return sortOrder === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary" />
    : <ChevronDown className="w-3 h-3 text-primary" />;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalysisPage() {

  // nuqs — all filter + sort state synced to the URL
  const [search,          setSearch]          = useQueryState('q',      parseAsString.withDefault(''));
  const [statusFilters,   setStatusFilters]   = useQueryState('status', parseAsArrayOf(parseAsString).withDefault([]));
  const [categoryFilters, setCategoryFilters] = useQueryState('cat',    parseAsArrayOf(parseAsString).withDefault([]));
  const [sortField,       setSortField]       = useQueryState('sort',   parseAsString.withDefault('date'));
  const [sortOrder,       setSortOrder]       = useQueryState('order',  parseAsString.withDefault('desc'));

  // dnd-kit widget order (original logic preserved, null-check added on over)
  const [widgetOrder, setWidgetOrder] = useState(['metrics', 'table']);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setWidgetOrder(items => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Filtered + sorted — memoized so it only recalculates when deps change
  const filteredTransactions = useMemo(() => {
    let data = ALL_TRANSACTIONS;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(t =>
        t.merchant.toLowerCase().includes(q) ||
        t.ref.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q)
      );
    }
    if (statusFilters.length > 0)   data = data.filter(t => statusFilters.includes(t.status));
    if (categoryFilters.length > 0) data = data.filter(t => categoryFilters.includes(t.category));

    return [...data].sort((a, b) => {
      const aVal = a[sortField], bVal = b[sortField];
      if (sortField === 'amount') return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [search, statusFilters, categoryFilters, sortField, sortOrder]);

  // Live metrics derived from filtered set
  const metrics = useMemo(() => {
    const total   = filteredTransactions.reduce((s, t) => s + t.amount, 0);
    const flagged = filteredTransactions.filter(t => t.status === 'FLAGGED').length;
    const avg     = filteredTransactions.length > 0 ? total / filteredTransactions.length : 0;
    return { total, flagged, avg, count: filteredTransactions.length };
  }, [filteredTransactions]);

  // @tanstack/react-virtual — 60fps virtualizer
  const scrollContainerRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count:            filteredTransactions.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize:     () => 64,
    overscan:         20,
  });

  // Handlers
  const handleSort = useCallback((field) => {
    if (sortField === field) setSortOrder(p => p === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  }, [sortField, setSortField, setSortOrder]);

  const toggleStatus   = useCallback(s => setStatusFilters(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]), [setStatusFilters]);
  const toggleCategory = useCallback(c => setCategoryFilters(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]), [setCategoryFilters]);
  const clearAll = useCallback(() => {
    setSearch(null); setStatusFilters([]); setCategoryFilters([]); setSortField('date'); setSortOrder('desc');
  }, [setSearch, setStatusFilters, setCategoryFilters, setSortField, setSortOrder]);

  const hasActiveFilters = !!(search || statusFilters.length > 0 || categoryFilters.length > 0);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-10 pb-20">

      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter">Analysis Engine</h2>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            {ALL_TRANSACTIONS.length.toLocaleString()} records · virtualized for 60fps
          </p>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgetOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-8">
            {widgetOrder.map(id => (
              <SortableWidget key={id} id={id}>

                {/* ── Metrics Widget ── */}
                {id === 'metrics' ? (
                  <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={staggerContainer} initial="initial" animate="animate">
                    <MetricCard label="Filtered Volume" value={fmt(metrics.total)} trend={metrics.count < ALL_TRANSACTIONS.length ? `${metrics.count.toLocaleString()} rows` : '+12.4%'} subtext="matching records" />
                    <MetricCard label="Flagged" value={metrics.flagged.toLocaleString()} variant="destructive" subtext="Action Required" />
                    <MetricCard label="Avg Ticket" value={fmt(metrics.avg)} subtext="Per transaction" />
                  </motion.div>

                ) : (

                  /* ── Virtualized Ledger Widget ── */
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

                    {/* Filter Bar */}
                    <div className="p-5 border-b border-border bg-secondary/10 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[220px] max-w-sm">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            value={search}
                            onChange={e => setSearch(e.target.value || null)}
                            placeholder="Search merchant, ref, category..."
                            className="w-full bg-background border border-border rounded-xl pl-10 pr-8 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition"
                          />
                          {search && (
                            <button onClick={() => setSearch(null)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <FilterDropdown label="Status" options={STATUSES} selected={statusFilters} onToggle={toggleStatus} onClear={() => setStatusFilters([])} />
                        <FilterDropdown label="Category" options={CATEGORIES} selected={categoryFilters} onToggle={toggleCategory} onClear={() => setCategoryFilters([])} />

                        <AnimatePresence>
                          {hasActiveFilters && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              onClick={clearAll}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-border transition-colors"
                            >
                              <X className="w-3.5 h-3.5" /> Clear All
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Active filter chips */}
                      <AnimatePresence>
                        {(statusFilters.length > 0 || categoryFilters.length > 0) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-2 overflow-hidden"
                          >
                            {statusFilters.map(s => (
                              <motion.span key={s} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                                onClick={() => toggleStatus(s)}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full cursor-pointer hover:bg-primary/20 transition-colors select-none">
                                {s} <X className="w-2.5 h-2.5" />
                              </motion.span>
                            ))}
                            {categoryFilters.map(c => (
                              <motion.span key={c} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                                onClick={() => toggleCategory(c)}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-full cursor-pointer hover:bg-border transition-colors border border-border select-none">
                                {c} <X className="w-2.5 h-2.5" />
                              </motion.span>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Results count */}
                    <div className="px-6 py-2.5 bg-secondary/5 border-b border-border flex items-center justify-between">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {filteredTransactions.length.toLocaleString()} of {ALL_TRANSACTIONS.length.toLocaleString()} records
                      </span>
                      {hasActiveFilters && <span className="text-[10px] font-bold text-primary">Filters active</span>}
                    </div>

                    {/* Sortable column headers */}
                    <div className="flex items-center px-6 py-3 bg-secondary/30 border-b border-border">
                      {COLUMNS.map(col => (
                        <button
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          className={cn('flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors', col.cls)}
                        >
                          {col.label}
                          <SortIcon colKey={col.key} sortField={sortField} sortOrder={sortOrder} />
                        </button>
                      ))}
                    </div>

                    {/* Virtualized scroll area */}
                    <div ref={scrollContainerRef} style={{ height: '540px', overflowY: 'auto' }}>
                      {filteredTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <p className="text-sm font-bold text-muted-foreground">No records match your filters</p>
                          <button onClick={clearAll} className="mt-3 text-xs font-bold text-primary hover:underline">Clear all filters</button>
                        </div>
                      ) : (
                        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                          {rowVirtualizer.getVirtualItems().map(virtualRow => {
                            const t = filteredTransactions[virtualRow.index];
                            return (
                              <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                ref={rowVirtualizer.measureElement}
                                style={{
                                  position: 'absolute', top: 0, left: 0, width: '100%',
                                  height: `${virtualRow.size}px`,
                                  transform: `translateY(${virtualRow.start}px)`,
                                }}
                                className={cn(
                                  'flex items-center px-6 border-b border-border/50 hover:bg-secondary/30 transition-colors',
                                  virtualRow.index % 2 === 0 ? 'bg-card' : 'bg-secondary/5'
                                )}
                              >
                                <div className="w-[110px] flex-shrink-0 text-[11px] font-mono text-muted-foreground">{t.date}</div>
                                <div className="flex-1 min-w-0 pr-4">
                                  <p className="font-bold text-sm text-foreground truncate">{t.merchant}</p>
                                  <p className="text-[10px] font-mono text-muted-foreground">{t.ref}</p>
                                </div>
                                <div className="w-[150px] flex-shrink-0 pr-2">
                                  <span className="inline-block bg-secondary px-2 py-0.5 rounded text-[9px] font-bold text-muted-foreground border border-border uppercase tracking-wide truncate max-w-full">
                                    {t.category}
                                  </span>
                                </div>
                                <div className="w-[150px] flex-shrink-0 text-[10px] text-muted-foreground font-medium truncate pr-4">{t.type}</div>
                                <div className="w-[115px] flex-shrink-0"><StatusBadge status={t.status} /></div>
                                <div className={cn('w-[140px] flex-shrink-0 text-right font-bold text-sm tabular-nums', t.status === 'FLAGGED' ? 'text-destructive' : 'text-foreground')}>
                                  {t.amountFmt}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </motion.div>
  );
}
