'use client';

import React, { useState } from 'react';
import {
  Search,
  ShieldAlert, BadgeCheck, Clock, GripVertical
} from 'lucide-react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@/lib/utils';

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
        {...attributes}
        {...listeners}
        className="absolute top-4 right-4 z-30 cursor-grab active:grabbing p-1.5 bg-secondary border border-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
};

const MetricCard = ({ label, value, subtext, trend, variant = 'default' }) => (
  <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-full">
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
    <h3 className={cn(
      "text-3xl font-bold tracking-tight",
      variant === 'destructive' ? 'text-destructive' : 'text-card-foreground'
    )}>{value}</h3>
    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
      {trend && (
        <span className={cn(
          "px-2 py-1 rounded-full",
          variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
        )}>
          {trend}
        </span>
      )}
      <span className="text-muted-foreground">{subtext}</span>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    CLEARED: 'bg-primary/10 text-primary border-primary/20',
    FLAGGED: 'bg-destructive/10 text-destructive border-destructive/20',
    PENDING: 'bg-secondary text-muted-foreground border-border',
  };
  const Icons = { CLEARED: BadgeCheck, FLAGGED: ShieldAlert, PENDING: Clock };
  const Icon = Icons[status] || Clock;

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest", styles[status])}>
      <Icon className="w-3 h-3" />
      {status}
    </div>
  );
};

export default function TransactionsPage() {
  const [widgetOrder, setWidgetOrder] = useState(['metrics', 'table']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWidgetOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const transactions = [
    { id: '1', date: '2023-07-24', merchant: 'Amazon Web Services', category: 'Infrastructure', ref: 'TXN-94621', status: 'CLEARED', amount: '$42,801.12' },
    { id: '2', date: '2023-07-24', merchant: 'HK_PAY_001', category: 'Uncategorized', ref: 'TXN-94618', status: 'FLAGGED', amount: '$15,000.00' },
    { id: '3', date: '2023-07-23', merchant: 'WeWork Manhattan', category: 'Rent', ref: 'TXN-93992', status: 'CLEARED', amount: '$8,450.00' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter">Transactions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Review, filter, and reorder operational transaction widgets.</p>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgetOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-8">
            {widgetOrder.map((id) => (
              <SortableWidget key={id} id={id}>
                {id === 'metrics' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard label="Total Volume" value="$14.2M" trend="+12.4%" subtext="vs prev" />
                    <MetricCard label="Flagged" value="42" variant="destructive" subtext="Action Required" />
                    <MetricCard label="Avg Ticket" value="$2,842" subtext="Steady" />
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border bg-secondary/10 flex justify-between gap-4">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input placeholder="Search records..." className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <button className="bg-background border border-border px-4 py-2 rounded-xl text-xs font-bold hover:bg-secondary">Filters</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-secondary/30">
                          <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                            <th className="px-8 py-5">Merchant</th>
                            <th className="px-8 py-5">Category</th>
                            <th className="px-8 py-5 text-center">Status</th>
                            <th className="px-8 py-5 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-secondary/20 transition-all">
                              <td className="px-8 py-5">
                                <p className="font-bold text-sm text-foreground">{t.merchant}</p>
                                <p className="text-[10px] text-muted-foreground font-mono">{t.ref}</p>
                              </td>
                              <td className="px-8 py-5">
                                <span className="bg-secondary px-2 py-1 rounded text-[9px] font-bold text-muted-foreground border border-border">
                                  {t.category}
                                </span>
                              </td>
                              <td className="px-8 py-5 flex justify-center">
                                <StatusBadge status={t.status} />
                              </td>
                              <td className={cn("px-8 py-5 text-right font-bold text-sm tabular-nums", t.status === 'FLAGGED' ? 'text-destructive' : 'text-foreground')}>
                                {t.amount}
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
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}