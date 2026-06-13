"use client";

import React, { useState } from "react";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  // Starts hidden initially
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex relative h-full shrink-0">
      <div 
        className={`transition-all duration-300 ease-in-out h-full overflow-hidden ${
          isCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'
        }`}
      >
        <div className="w-64 h-full border-r border-gray-200">
          {children}
        </div>
      </div>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute z-50 -right-4 top-6 bg-white border border-gray-200 shadow-md p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-gray-50 focus:outline-none"
        title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isCollapsed ? (
            <polyline points="9 18 15 12 9 6" />
          ) : (
            <polyline points="15 18 9 12 15 6" />
          )}
        </svg>
      </button>
    </div>
  );
}