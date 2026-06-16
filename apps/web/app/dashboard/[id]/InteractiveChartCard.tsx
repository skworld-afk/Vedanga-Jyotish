"use client";

import { useState } from "react";
import { NorthIndianChart } from "./NorthIndianChart";

export default function InteractiveChartCard({ title, planets, ascLon, isPending = false }: { title: string; planets?: Record<string, number>; ascLon?: number; isPending?: boolean }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chartContent = isPending ? (
    <div className="flex flex-col items-center gap-3">
      {/* Modern crisp loader */}
      <div className="w-6 h-6 border border-slate-800 border-t-sky-400 rounded-none animate-spin"></div>
      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Calculating {title}...</span>
    </div>
  ) : Object.keys(planets || {}).length > 0 ? (
    <NorthIndianChart planets={planets!} ascLon={ascLon!} title="" />
  ) : (
    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Data unavailable</span>
  );

  return (
    <>
      <div 
        onDoubleClick={() => !isPending && setIsFullscreen(true)}
        className="group relative bg-slate-950 border border-slate-800 flex flex-col shadow-md hover:border-sky-500/40 transition-all duration-300 cursor-pointer backdrop-blur-md rounded-none"
      >
        {/* Sky Blue / Slate Clean Top Border Accent on Hover */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/30 rounded-none">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{title}</h3>
          <button 
            onClick={() => !isPending && setIsFullscreen(true)} 
            className="text-slate-500 hover:text-sky-400 transition-colors" 
            title="Double click to expand"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 sm:p-6 flex-grow flex items-center justify-center min-h-[260px] bg-slate-900/10">
          {chartContent}
        </div>
        
        {/* Structured Dashboard Footer Hint */}
        <div className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-sky-400 font-bold tracking-widest uppercase">
          DOUBLE CLICK TO ZOOM
        </div>
      </div>

      {/* Fullscreen Overlay System */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-10 animate-in fade-in duration-200 rounded-none">
          {/* Sharp-Corner Dismiss Module */}
          <button 
            onClick={() => setIsFullscreen(false)} 
            className="absolute top-6 right-6 p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors z-50 shadow-2xl rounded-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-full max-w-4xl max-h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-white mb-8 tracking-widest uppercase">{title}</h2>
            <div className="w-full max-w-[85vh] aspect-square shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] bg-slate-950 border border-slate-800 flex items-center justify-center p-4 rounded-none">
              {chartContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
