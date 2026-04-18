'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview',         path: '/dashboard/overview'      },
    { label: 'Transaction Ledger', path: '/dashboard/ledger'       },
    { label: 'Analytics',        path: '/dashboard/analysispage'  },
    { label: 'Reports',          path: '/dashboard/reportpage'    },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col h-full shrink-0 transition-colors">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">
          FinDash <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Analytics</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors cursor-pointer mb-1 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className={`w-4 h-4 rounded-sm transition-colors ${
                  isActive ? 'bg-primary' : 'bg-border'
                }`} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border">
        <Link href="/dashboard/newreportpage">
          <div className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2 mb-6 text-sm font-medium transition-colors cursor-pointer">
            <span>+ New Report</span>
          </div>
        </Link>

        <div className="space-y-4 text-sm text-muted-foreground font-medium px-2">
          <div className="flex items-center gap-3 cursor-pointer hover:text-foreground transition-colors">
            <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">?</span>
            Support
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:text-foreground transition-colors">
            <div className="w-4 h-4 border-2 border-current rounded-sm border-r-0 border-t-0 transform rotate-45" />
            Logout
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-[hsl(var(--brand-accent))] rounded-full flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-foreground truncate">Marcus Sterling</p>
            <p className="text-[10px] text-muted-foreground truncate">Chief Financial Officer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;