import React from 'react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
      <div className="flex items-center gap-8">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search data points..." 
            className="pl-8 pr-4 py-1.5 bg-[hsl(var(--neutral-100))] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64 text-[hsl(var(--neutral-700))]"
          />
          <div className="absolute left-2.5 top-2 w-3.5 h-3.5 border-2 border-[hsl(var(--neutral-400))] rounded-full" />
        </div>
        <nav className="flex gap-6 text-sm font-medium text-[hsl(var(--neutral-500))] h-16">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 flex items-center pt-0.5">Q3 Forecast</a>
          <a href="#" className="flex items-center hover:text-slate-800">Global Cash</a>
          <a href="#" className="flex items-center hover:text-slate-800">Risk Matrix</a>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-[hsl(var(--neutral-600))] font-medium hover:text-[hsl(var(--neutral-800))] cursor-pointer">Audit Trail</span>
        <button className="bg-[hsl(var(--neutral-100))] hover:bg-[hsl(var(--neutral-200))] text-[hsl(var(--neutral-700))] px-4 py-1.5 rounded-md text-sm font-semibold transition-colors">
          Export Data
        </button>
      </div>
    </header>
  );
};

export default Header;