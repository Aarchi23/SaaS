'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import CompanyLogo from '@/components/ui/company-logo';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', path: '/dashboard/overview' },
    { label: 'Transactions', path: '/dashboard/transactions' },
    { label: 'Create Report', path: '/dashboard/reports/create' },
  ];

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-border bg-card/60 backdrop-blur">
      <div className="border-b border-border px-6 py-6">
        <CompanyLogo companyName="FinDash" />
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Analytics</p>
      </div>

      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <span className={cn('h-2.5 w-2.5 rounded-full', isActive ? 'bg-primary' : 'bg-muted-foreground/40')} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/dashboard/reports/create"
          className="mb-6 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:opacity-90"
        >
          + New Report
        </Link>

        <div className="space-y-4 px-2 text-sm font-medium text-muted-foreground">
          <div className="flex cursor-pointer items-center gap-3 hover:text-foreground">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-current text-[10px]">?</span>
            Support
          </div>
          <div className="flex cursor-pointer items-center gap-3 hover:text-foreground">
            <div className="h-4 w-4 rotate-45 rounded-sm border-2 border-current border-r-0 border-t-0" />
            Logout
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 px-2">
          <div className="h-9 w-9 shrink-0 rounded-full bg-orange-200" />
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold text-foreground">Marcus Sterling</p>
            <p className="truncate text-[10px] text-muted-foreground">Chief Financial Officer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}