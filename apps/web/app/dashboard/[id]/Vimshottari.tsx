"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DashaPeriod } from "@/lib/astrology/dasha";

const LEVELS = [
  "Mahadasha",
  "Antardasha",
  "Pratyantardasha",
  "Sookshmadasha",
  "Pranadasha",
];

// Vibrant, sophisticated planetary color themes mapped to a classy UI
const PLANET_THEMES: Record<string, { bg: string; text: string; border: string; active: string }> = {
  Sun: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", active: "from-amber-600 to-orange-600" },
  Moon: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20", active: "from-sky-600 to-indigo-600" },
  Mars: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", active: "from-rose-600 to-red-600" },
  Rahu: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", active: "from-emerald-600 to-teal-600" },
  Jupiter: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20", active: "from-yellow-500 to-amber-600" },
  Saturn: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", active: "from-indigo-600 to-violet-700" },
  Mercury: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20", active: "from-teal-600 to-cyan-600" },
  Ketu: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", active: "from-purple-600 to-fuchsia-600" },
  Venus: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20", active: "from-pink-600 to-rose-500" },
};

const DEFAULT_THEME = { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", active: "from-indigo-600 to-violet-700" };

export function Vimshottari({
  dasha,
}: {
  dasha: DashaPeriod[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<(DashaPeriod | null)[]>(() => {
    const now = new Date().getTime();
    const initial: (DashaPeriod | null)[] = [null, null, null, null, null];
    let currentLevel = dasha;
    
    for (let i = 0; i < 5; i++) {
      if (!currentLevel?.length) break;
      const active = currentLevel.find(
        (p) => now >= new Date(p.start).getTime() && now <= new Date(p.end).getTime()
      );
      if (active) {
        initial[i] = active;
        currentLevel = active.subDashas || [];
      } else {
        break;
      }
    }
    return initial;
  });

  const handleSelect = (
    period: DashaPeriod,
    level: number
  ) => {
    const next = [...selected];

    next[level] = period;

    for (let i = level + 1; i < 5; i++) {
      next[i] = null;
    }

    setSelected(next);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      left: containerRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [selected]);

  const formatBalance = (balance?: number) => {
    if (balance == null) return null;

    const years = Math.floor(balance);
    const monthsDecimal = (balance - years) * 12;
    const months = Math.floor(monthsDecimal);
    const days = Math.floor(
      (monthsDecimal - months) * 30
    );

    return `${years}y ${months}m ${days}d`;
  };

  const birthBalance =
    dasha?.length > 0 ? dasha[0]?.balanceYears : null;

  const firstLord =
    dasha?.length > 0 ? dasha[0]?.lord : "";

  const columns = useMemo(() => {
    const result: {
      level: number;
      items: DashaPeriod[];
    }[] = [];

    if (!dasha?.length) return result;

    result.push({
      level: 0,
      items: dasha,
    });

    for (let level = 0; level < 4; level++) {
      const current = selected[level];

      if (
        current?.subDashas &&
        current.subDashas.length > 0
      ) {
        result.push({
          level: level + 1,
          items: current.subDashas,
        });
      } else {
        break;
      }
    }

    return result;
  }, [dasha, selected]);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="relative overflow-hidden rounded-none border border-indigo-900/30 bg-black shadow-[0_32px_64px_-16px_rgba(0,0,0,0.40)]">
      {/* Subtle Premium Background Glows */}
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 bg-indigo-950/30 border-b border-indigo-900/30 px-6 py-5 sm:px-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-none bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
             <span className="text-2xl">⏳</span>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-indigo-400 to-purple-400">
              Vimshottari Dasha
            </h2>
          
          </div>
        </div>

        {birthBalance && (
          <div className="flex items-center gap-3 bg-indigo-950/40 backdrop-blur-md border border-indigo-900/50 px-4 py-2 rounded-none shadow-inner">
            <div className="h-7 w-7 rounded-none bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <span className="text-xs font-semibold text-indigo-400">✨</span>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Balance At Birth: <span className="text-slate-200 font-mono font-bold ml-1">{formatBalance(birthBalance)}</span>
              </div>
              <div className="text-[10px] text-indigo-300 font-medium mt-0.5">
                Initial Primary Lord: <span className="font-bold text-indigo-400">{firstLord}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Column Viewport wrapper */}
      <div className="relative z-10 w-full p-6 sm:p-8 md:p-10">
        <div
          ref={containerRef}
          className="flex w-full gap-1 sm:gap-2 lg:gap-4 h-[450px]"
        >
          {columns.map((column) => (
            <div
              key={column.level}
              className="flex-1 min-w-0 rounded-none border border-slate-800/80 bg-slate-900/50 backdrop-blur-md p-1.5 sm:p-2 lg:p-3 flex flex-col shadow-2xl transition-all duration-300 hover:border-slate-800"
            >
              {/* Sticky Column Header */}
              <div className="sticky top-0 z-10 bg-slate-800/70 backdrop-blur-md rounded-none p-1.5 sm:p-2 lg:p-3 mb-2 lg:mb-3 border border-slate-800 flex flex-col xl:flex-row items-center justify-between shadow-md gap-1">
                <span className="text-[8px] sm:text-[10px] lg:text-xs font-bold tracking-wider uppercase text-slate-200 truncate w-full text-center xl:text-left">
                  {LEVELS[column.level]}
                </span>
                <span className="text-[7px] sm:text-[9px] lg:text-[10px] bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-none text-indigo-300 font-mono font-bold whitespace-nowrap">
                  Lvl {column.level + 1}
                </span>
              </div>

              {/* Scrollable list container */}
              <div className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 pr-1" style={{ scrollbarWidth: 'none' }}>
                {column.items.map((item, index) => {
                  const isSelected =
                    selected[column.level]?.lord === item.lord &&
                    selected[column.level]?.start === item.start &&
                    selected[column.level]?.end === item.end;

                  const theme = PLANET_THEMES[item.lord] || DEFAULT_THEME;

                  return (
                    <button
                      key={`${column.level}-${index}-${item.start}`}
                      onClick={() => handleSelect(item, column.level)}
                      className={`w-full text-left rounded-none p-1.5 sm:p-2 lg:p-3 transition-all duration-300 relative group overflow-hidden border ${
                        isSelected
                          ? `bg-gradient-to-r ${theme.active} text-white border-transparent shadow-[0_12px_24px_-8px_rgba(0,0,0,0.5)] transform -translate-y-[1px]`
                          : `bg-slate-950/50 border-slate-800/60 text-slate-300 hover:bg-slate-900/70 hover:-translate-y-[2px] shadow-sm`
                      }`}
                    >
                      {/* Premium colorful theme subtle indicator when not selected */}
                      {!isSelected && (
                        <div className={`absolute top-0 left-0 w-[3px] h-full ${theme.bg.replace('/10', '')}`} />
                      )}

                      <div className="flex items-center justify-between relative z-10">
                        <span className={`text-[10px] sm:text-xs lg:text-[15px] font-semibold tracking-wide truncate ${
                          isSelected ? "text-white" : "text-slate-100"
                        }`}>
                          {item.lord}
                        </span>
                        
                        {item.subDashas?.length ? (
                          <span className={`text-[8px] sm:text-[10px] lg:text-xs transition-transform duration-300 group-hover:translate-x-0.5 ml-1 flex-shrink-0 ${
                            isSelected ? "text-white" : theme.text
                          }`}>
                            ➔
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1 sm:mt-1.5 lg:mt-2 relative z-10">
                        <div className={`text-[7px] sm:text-[9px] lg:text-[11px] text-center font-medium flex flex-col 2xl:flex-row items-center justify-center gap-0.5 2xl:gap-1.5 ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                          <span className={isSelected ? "text-white" : "text-slate-300 font-mono"}>{formatDate(item.start)}</span>
                          <span className="hidden 2xl:inline">-</span>
                          <span className={isSelected ? "text-white" : "text-slate-300 font-mono"}>{formatDate(item.end)}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}