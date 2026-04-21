'use client';

import React from 'react';
import { Moon, Sun, Download } from 'lucide-react';
import { useTheme } from '@/component/theme-provider';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8 flex-shrink-0 transition-colors">
      <div className="flex items-center gap-8">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search data points..."
            className="pl-8 pr-4 py-1.5 bg-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 text-foreground placeholder:text-muted-foreground border border-border transition-colors"
          />
          <div className="absolute left-2.5 top-2 w-3.5 h-3.5 border-2 border-muted-foreground rounded-full" />
        </div>

        {/* Nav links */}
        <nav className="flex gap-6 text-sm font-medium text-muted-foreground h-16">
          <a href="#" className="text-primary border-b-2 border-primary flex items-center pt-0.5 transition-colors">Q3 Forecast</a>
          <a href="#" className="flex items-center hover:text-foreground transition-colors">Global Cash</a>
          <a href="#" className="flex items-center hover:text-foreground transition-colors">Risk Matrix</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground font-medium hover:text-foreground cursor-pointer transition-colors">
          Audit Trail
        </span>

        <button className="bg-secondary hover:bg-border text-foreground px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 border border-border">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-md flex items-center justify-center bg-secondary border border-border hover:bg-border transition-colors"
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4 text-foreground" />
            : <Moon className="w-4 h-4 text-foreground" />
          }
        </button>
      </div>
    </header>
  );
};

export default Header;