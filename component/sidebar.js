"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, ListOrdered, BarChart2, FileText, 
  HelpCircle, LogOut, Plus 
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview",     path: "/dashboard/overview",     icon: LayoutDashboard },
    { label: "Transactions", path: "/dashboard/transactions", icon: ListOrdered      },
    { label: "Analytics",    path: "/dashboard/analysispage", icon: BarChart2      },
    { label: "Reports",      path: "/dashboard/reportpage",   icon: FileText       },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full shrink-0 transition-all duration-300 relative z-20 shadow-xl shadow-black/5">
      <div className="p-8">
        <h1 className="text-2xl font-black text-foreground tracking-tighter flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
          </div>
          FinDash
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mt-1 ml-9">Advanced Analytics</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer group overflow-hidden",
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground/70 hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 border-l-4 border-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-4 h-4 transition-colors relative z-10", isActive ? "text-primary" : "text-muted-foreground/40 group-hover:text-foreground")} />
                <span className="relative z-10">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border bg-secondary/5">
        <Link href="/dashboard/newreportpage">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-8 text-sm font-black transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </motion.div>
        </Link>

        <div className="space-y-4 px-2">
          <div className="flex items-center gap-3 text-xs font-black text-muted-foreground/60 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors group">
            <HelpCircle className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary" />
            Support
          </div>
          <div className="flex items-center gap-3 text-xs font-black text-muted-foreground/60 uppercase tracking-widest cursor-pointer hover:text-destructive transition-colors group">
            <LogOut className="w-4 h-4 text-muted-foreground/30 group-hover:text-destructive" />
            Logout
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-border/50">
          <div className="w-10 h-10 bg-[hsl(var(--brand-accent))] rounded-xl flex-shrink-0 shadow-lg shadow-orange-500/10 flex items-center justify-center text-orange-950 font-black">
            MS
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-foreground truncate uppercase tracking-tighter">M. Sterling</p>
            <p className="text-[10px] text-muted-foreground font-bold truncate uppercase tracking-widest opacity-60">Finance Chief</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
