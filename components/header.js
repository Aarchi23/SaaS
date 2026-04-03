'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard/overview' },
    { label: 'Transactions', href: '/dashboard/transactions' },
    { label: 'Create Report', href: '/dashboard/reports/create' },
  ];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur">
      <div className="flex items-center gap-8">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search data points..."
            className="w-64 rounded-md border border-border bg-secondary/60 py-1.5 pl-8 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="absolute left-2.5 top-2 h-3.5 w-3.5 rounded-full border-2 border-muted-foreground" />
        </div>

        <nav className="flex h-16 gap-6 text-sm font-medium text-muted-foreground">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center border-b-2 pt-0.5 transition-colors',
                  isActive ? 'border-primary text-primary' : 'border-transparent hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <span className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">Audit Trail</span>
        <button className="rounded-md bg-secondary px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80">
          Export Data
        </button>
      </div>
    </header>
  );
}