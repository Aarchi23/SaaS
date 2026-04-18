'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ChevronUp, ChevronDown, ChevronsUpDown,
  BadgeCheck, ShieldAlert, Clock, SlidersHorizontal,
  Download, RefreshCw, TrendingUp, TrendingDown, DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateTransactions } from '@/lib/mockData';

// ─── Generate 10,000 records once at module level — never re-created ──────────
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
  { key: 'date',     label: 'Date',     cls: 'w-[110px] flex-shrink-0'            },
  { key: 'merchant', label: 'Merchant', cls: 'flex-1 min-w-0'                     },
  { key: 'category', label: 'Category', cls: 'w-[160px] flex-shrink-0'            },
  { key: 'type',     label: 'Type',     cls: 'w-[140px] flex-shrink-0'            },
  { key: 'status',   label: 'Status',   cls: 'w-[115px] flex-shrink-0'            },
  { key: 'amount',   label: 'Amount',   cls: 'w-[140px] flex-shrink-0 text-right' },
];

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// ─── Sub-components ───────────────────────────────────────────────────────────

const SortIcon = ({ colKey, sortField, sortOrder }) => {
  if (sortField !== colKey) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/40" />;
  return sortOrder === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary" />
    : <ChevronDown className="w-3 h-3 text-primary" />;
};

const StatusBadge = ({ status }) => {
  const map = {
    CLEARED: { icon: BadgeCheck,  cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' },
    FLAGGED: { icon: ShieldAlert, cls: 'bg-destructive/10 text-destructive border-destructive/20'                       },
    PENDING: { icon: Clock,       cls: 'bg-secondary text-muted-foreground border-border'                               },
  };
  const { icon: Icon, cls } = map[status] ?? map.PENDING;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border', cls)}>
      <Icon className="w-2.5 h-2.5" />{status}
    </span>
  );
};

const MetricCard = ({ label, value, subtext, icon: Icon, trend, variant }) => (
  <div className={cn(
    'bg-card border border-border rounded-2xl p-5 shadow-sm transition-colors',
    variant === 'destructive' && 'border-destructive/30 bg-destructive/5',
  )}>
    <div className="flex justify-between items-start mb-3">
      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{label}</p>
      {Icon && <Icon className="w-4 h-4 text-muted-foreground/30" />}
    </div>
    <p className={cn(
      'text-2xl font-black tracking-tight',
      variant === 'destructive' ? 'text-destructive' : 'text-foreground',
    )}>{value}</p>
    <div className="flex items-center gap-2 mt-1">
      {trend && (
        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" />{trend}
        </span>
      )}
      <p className="text-[10px] text-muted-foreground font-medium">{subtext}</p>
    </div>
  </div>
);

const FilterDropdown = ({ label, options, selected, onToggle, onClear }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors',
          selected.length > 0
            ? 'bg-primary/10 text-primary border-primary/30'
            : 'bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground',
        )}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        {label}
        {selected.length > 0 && (
          <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">
            {selected.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 min-w-[200px] overflow-hidden"
          >
            <div className="p-2 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">{label}</span>
              {selected.length > 0 && (
                <button onClick={onClear} className="text-[10px] font-bold text-primary hover:underline px-1">
                  Clear
                </button>
              )}
            </div>
            <div className="p-1 max-h-64 overflow-y-auto">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => onToggle(opt)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors',
                    selected.includes(opt)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-secondary',
                  )}
                >
                  <div className={cn(
                    'w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center',
                    selected.includes(opt) ? 'bg-primary border-primary' : 'border-border',
                  )}>
                    {selected.includes(opt) && <div className="w-1.5 h-1.5 bg-primary-foreground rounded-sm" />}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LedgerPage() {

  // nuqs — all filter + sort state synced to the URL
  const [search,          setSearch]          = useQueryState('q',      parseAsString.withDefault(''));
  const [statusFilters,   setStatusFilters]   = useQueryState('status', parseAsArrayOf(parseAsString).withDefault([]));
  const [categoryFilters, setCategoryFilters] = useQueryState('cat',    parseAsArrayOf(parseAsString).withDefault([]));
  const [sortField,       setSortField]       = useQueryState('sort',   parseAsString.withDefault('date'));
  const [sortOrder,       setSortOrder]       = useQueryState('order',  parseAsString.withDefault('desc'));

  // Filtered + sorted — memoized, only recalculates when deps change
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

  // Live metrics from filtered set
  const metrics = useMemo(() => {
    const total   = filteredTransactions.reduce((s, t) => s + t.amount, 0);
    const flagged = filteredTransactions.filter(t => t.status === 'FLAGGED').length;
    const cleared = filteredTransactions.filter(t => t.status === 'CLEARED').length;
    const avg     = filteredTransactions.length > 0 ? total / filteredTransactions.length : 0;
    return { total, flagged, cleared, avg, count: filteredTransactions.length };
  }, [filteredTransactions]);

  // @tanstack/react-virtual — 60fps row virtualizer
  const scrollContainerRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count:            filteredTransactions.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize:     () => 64,
    overscan:         20,
  });

  // Handlers — all useCallback to prevent unnecessary child re-renders
  const handleSort = useCallback((field) => {
    if (sortField === field) setSortOrder(p => p === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  }, [sortField, setSortField, setSortOrder]);

  const toggleStatus   = useCallback(s => setStatusFilters(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]), [setStatusFilters]);
  const toggleCategory = useCallback(c => setCategoryFilters(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]), [setCategoryFilters]);
  const clearAll = useCallback(() => {
    setSearch(null); setStatusFilters([]); setCategoryFilters([]);
    setSortField('date'); setSortOrder('desc');
  }, [setSearch, setStatusFilters, setCategoryFilters, setSortField, setSortOrder]);

  const hasActiveFilters = !!(search || statusFilters.length > 0 || categoryFilters.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-8 pb-20"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Phase 3 · Transaction Ledger</p>
          <h2 className="text-4xl font-black text-foreground tracking-tighter">Transaction Ledger</h2>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            {ALL_TRANSACTIONS.length.toLocaleString()} records · virtualized for 60fps · URL-synced filters
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-sm font-semibold text-foreground hover:bg-border transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-5"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
      >
        {[
          { label: 'Filtered Volume',  value: fmt(metrics.total),             subtext: `${metrics.count.toLocaleString()} records`, icon: DollarSign, trend: metrics.count < ALL_TRANSACTIONS.length ? undefined : '+12.4%' },
          { label: 'Flagged',          value: metrics.flagged.toLocaleString(), subtext: 'Require action',                           icon: ShieldAlert, variant: 'destructive' },
          { label: 'Cleared',          value: metrics.cleared.toLocaleString(), subtext: 'Verified clean',                           icon: BadgeCheck  },
          { label: 'Avg Ticket',       value: fmt(metrics.avg),               subtext: 'Per transaction',                           icon: TrendingUp  },
        ].map(card => (
          <motion.div
            key={card.label}
            variants={{ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.32 } } }}
          >
            <MetricCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Ledger Table ── */}
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
                className="w-full bg-background border border-border rounded-xl pl-10 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
              {search && (
                <button onClick={() => setSearch(null)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <FilterDropdown label="Status"   options={STATUSES}    selected={statusFilters}   onToggle={toggleStatus}   onClear={() => setStatusFilters([])}   />
            <FilterDropdown label="Category" options={CATEGORIES}  selected={categoryFilters} onToggle={toggleCategory} onClear={() => setCategoryFilters([])} />

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
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full cursor-pointer hover:bg-primary/20 transition-colors select-none border border-primary/20">
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

        {/* Results count bar */}
        <div className="px-6 py-2.5 bg-secondary/5 border-b border-border flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {filteredTransactions.length.toLocaleString()} of {ALL_TRANSACTIONS.length.toLocaleString()} records
          </span>
          {hasActiveFilters && <span className="text-[10px] font-bold text-primary">Filters active · URL synced</span>}
        </div>

        {/* Sortable column headers */}
        <div className="flex items-center px-6 py-3 bg-secondary/30 border-b border-border sticky top-0 z-10">
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

        {/* Virtualized scroll area — 60fps */}
        <div ref={scrollContainerRef} style={{ height: '560px', overflowY: 'auto' }}>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <Search className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-sm font-bold text-muted-foreground">No records match your filters</p>
              <button onClick={clearAll} className="text-xs font-bold text-primary hover:underline">Clear all filters</button>
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
                      'flex items-center px-6 border-b border-border/50 hover:bg-primary/5 transition-colors cursor-pointer group',
                      virtualRow.index % 2 === 0 ? 'bg-card' : 'bg-secondary/5',
                    )}
                  >
                    <div className="w-[110px] flex-shrink-0 text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      {t.date}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-sm text-foreground truncate">{t.merchant}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{t.ref}</p>
                    </div>
                    <div className="w-[160px] flex-shrink-0 pr-2">
                      <span className="inline-block bg-secondary px-2 py-0.5 rounded text-[9px] font-bold text-muted-foreground border border-border uppercase tracking-wide truncate max-w-full">
                        {t.category}
                      </span>
                    </div>
                    <div className="w-[140px] flex-shrink-0 text-[10px] text-muted-foreground font-medium truncate pr-4">
                      {t.type}
                    </div>
                    <div className="w-[115px] flex-shrink-0">
                      <StatusBadge status={t.status} />
                    </div>
                    <div className={cn(
                      'w-[140px] flex-shrink-0 text-right font-black text-sm tabular-nums',
                      t.status === 'FLAGGED' ? 'text-destructive' : 'text-foreground',
                    )}>
                      {t.amountFmt}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer System Bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-wrap gap-8 py-6 border-t border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
          Virtualized · 60fps target
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          URL-synced via nuqs
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
          {ALL_TRANSACTIONS.length.toLocaleString()} total records
        </div>
      </motion.div>
    </motion.div>
  );
}
