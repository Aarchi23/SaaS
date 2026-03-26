'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  // Define your nav items with their display labels and folder names
  const navItems = [
    { label: 'Overview', path: '/dashboard/overview' },
    { label: 'Analytics', path: '/dashboard/analysispage' },
    // { label: 'Treasury', path: '/dashboard/treasury' },
    // { label: 'Audit', path: '/dashboard/audit' },
    { label: 'Reports', path: '/dashboard/reportpage' },
    // { label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-800">
          FinDash <span className="block text-[10px] uppercase tracking-widest text-slate-400 mt-1">Analytics</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          // This check highlights the button based on the current URL
          const isActive = pathname === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div 
                className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors cursor-pointer mb-1 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {/* Icon Placeholder */}
                <div className={`w-4 h-4 rounded-sm transition-colors ${
                  isActive ? 'bg-blue-600' : 'bg-slate-300'
                }`} />
                
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100">
        <Link href="/dashboard/newreportpage">
            <div className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg shadow-sm shadow-blue-200 flex items-center justify-center gap-2 mb-6 text-sm font-medium transition-colors cursor-pointer">
               <span>+ New Report</span>
            </div>
        </Link>
        
        <div className="space-y-4 text-sm text-slate-500 font-medium px-2">
          <div className="flex items-center gap-3 cursor-pointer hover:text-slate-800">
            <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">?</span> 
            Support
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:text-slate-800">
            <div className="w-4 h-4 border-2 border-current rounded-sm border-r-0 border-t-0 transform rotate-45" /> 
            Logout
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-orange-200 rounded-full flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">Marcus Sterling</p>
            <p className="text-[10px] text-slate-400 truncate">Chief Financial Officer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;