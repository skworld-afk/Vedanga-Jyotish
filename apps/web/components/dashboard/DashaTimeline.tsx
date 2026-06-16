"use client";

import { useState, useRef, useEffect } from "react";
import { DashaNode } from "@/lib/astrology/dashboardMapper";

const formatDate = (dateValue: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
};

function DashaLevel({ nodes, level, selectedNode, onSelect, title }: { 
  nodes: DashaNode[]; 
  level: number; 
  selectedNode?: DashaNode; 
  onSelect: (node: DashaNode, level: number) => void;
  title: string;
}) {
  return (
    <div className="flex flex-col w-72 h-[520px] flex-shrink-0 animate-in fade-in slide-in-from-left-8 duration-500 bg-slate-50/50 rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5 px-1 border-b border-slate-200 pb-4">
        <h3 className="font-bold text-slate-800 text-base tracking-tight">{title}</h3>
        <span className="text-xs font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-600 shadow-sm">{nodes?.length || 0}</span>
      </div>
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        {!nodes || nodes.length === 0 ? (
          <div className="text-center text-slate-400 text-sm font-medium mt-10 p-4 border border-dashed border-slate-200 rounded-xl">No further data</div>
        ) : (
          nodes.map((d, index) => {
            const isActive = selectedNode?.lord === d.lord;
            return (
              <button
                key={index}
                onClick={() => onSelect(d, level)}
                className={`w-full group text-left relative overflow-hidden transition-all duration-200 rounded-xl border p-3.5 ${
                  isActive
                    ? "bg-indigo-50 border-indigo-300 shadow-sm text-indigo-900 ring-1 ring-indigo-500"
                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                  }`}>
                    {d.lord.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="font-semibold text-sm tracking-tight truncate">{d.lord}</div>
                    <div className={`text-[11px] mt-0.5 truncate font-medium ${isActive ? "text-indigo-700/80" : "text-slate-500 group-hover:text-indigo-600/70"}`}>
                      {formatDate(d.start)} - {formatDate(d.end)}
                    </div>
                  </div>
                </div>
              </button>
              );
          })
        )}
      </div>
    </div>
  );
}

export default function DashaTimeline({ dasha }: { dasha: DashaNode[] }) {
  const [selectedPath, setSelectedPath] = useState<DashaNode[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selectedPath]);

  const handleSelect = (node: DashaNode, level: number) => {
    const newPath = selectedPath.slice(0, level);
    if (selectedPath[level]?.lord === node.lord) {
      // Toggle off if clicking the same node
      setSelectedPath(newPath);
    } else {
      setSelectedPath([...newPath, node]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-5">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-lg border border-slate-200 shadow-sm">⏳</div>
        <h2 className="font-bold text-lg text-slate-800">Vimshottari Dasha</h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-2 px-2 -mx-2 scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {/* Level 0: Mahadasha */}
        <DashaLevel 
          nodes={dasha} 
          level={0} 
          selectedNode={selectedPath[0]} 
          onSelect={handleSelect} 
          title="Mahadasha"
        />

        {/* Level 1: Antardasha */}
        {selectedPath[0] && (
          <DashaLevel 
            nodes={selectedPath[0].subDashas || []} 
            level={1} 
            selectedNode={selectedPath[1]} 
            onSelect={handleSelect} 
            title={`Antardasha (${selectedPath[0].lord})`}
          />
        )}

        {/* Level 2: Pratyantar Dasha */}
        {selectedPath[1] && (
          <DashaLevel 
            nodes={selectedPath[1].subDashas || []} 
            level={2} 
            selectedNode={selectedPath[2]} 
            onSelect={handleSelect} 
            title={`Pratyantar (${selectedPath[1].lord})`}
          />
        )}

        {/* Level 3: Sookshma Dasha */}
        {selectedPath[2] && (
          <DashaLevel 
            nodes={selectedPath[2].subDashas || []} 
            level={3} 
            selectedNode={selectedPath[3]} 
            onSelect={handleSelect} 
            title={`Sookshma (${selectedPath[2].lord})`}
          />
        )}
      </div>
    </div>
  );
}