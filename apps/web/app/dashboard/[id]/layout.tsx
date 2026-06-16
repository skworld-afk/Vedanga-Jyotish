import React, { use } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Upgraded navigational elements packed with multi-colored tactical vector configurations
  const navItems = [
    { 
      name: "Overview", 
      href: `/dashboard/${id}#overview`,
      activeColor: "text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]",
      borderColor: "group-hover:border-cyan-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10h14V10" />
          <path d="M9 21v-6h6v6" strokeWidth={1.25} strokeDasharray="1 1" />
        </svg>
      )
    },
    { 
      name: "Planetary", 
      href: `/dashboard/${id}#planetary`,
      activeColor: "text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]",
      borderColor: "group-hover:border-amber-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" strokeWidth={1.5} />
          <circle cx="12" cy="12" r="3" strokeWidth={1.25} />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeWidth={1} opacity="0.6" />
        </svg>
      )
    },
    { 
      name: "Divisional charts", 
      href: `/dashboard/${id}#divisional`,
      activeColor: "text-sky-400 group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]",
      borderColor: "group-hover:border-sky-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" strokeWidth={1.5} />
          <path d="M3 3l18 18M21 3L3 21M3 12h18M12 3v18" strokeWidth={1} opacity="0.4" />
        </svg>
      )
    },
    { 
      name: "Transit & panchang", 
      href: `/dashboard/${id}#transit`,
      activeColor: "text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]",
      borderColor: "group-hover:border-purple-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeWidth={1.5} d="M12 3a9 9 0 109 9 7 7 0 01-9-9z" />
          <circle cx="8" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      )
    },
    { 
      name: "Dasha", 
      href: `/dashboard/${id}#dasha`,
      activeColor: "text-indigo-400 group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]",
      borderColor: "group-hover:border-indigo-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
          <path strokeLinecap="square" d="M12 6v6l4 2" strokeWidth="1.5" />
          <path d="M12 2v1.5M12 20.5V22M2 12h1.5M20.5 12H22" strokeWidth={1} opacity="0.5" />
        </svg>
      )
    },
    { 
      name: "Yoga", 
      href: `/dashboard/${id}#yoga`,
      activeColor: "text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]",
      borderColor: "group-hover:border-emerald-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 2l2.5 5.5L20 10l-4.5 4.5L17 22l-5-4-5 4 1.5-7.5L3 10l5.5-2.5z" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    { 
      name: "Dosha", 
      href: `/dashboard/${id}#dosha`,
      activeColor: "text-rose-400 group-hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]",
      borderColor: "group-hover:border-rose-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 9v4m0 4h.01M2.2 20h19.6L12 4z" />
          <path d="M12 7v1" strokeWidth={2} strokeLinecap="square" />
        </svg>
      )
    },
    { 
      name: "Ashtakavarga", 
      href: `/dashboard/${id}#ashtakavarga`,
      activeColor: "text-teal-400 group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]",
      borderColor: "group-hover:border-teal-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeWidth={1.5} d="M4 20h16M7 16h2v4H7zm4-5h2v9h-2zm4-4h2v13h-2z" />
          <path d="M4 4l6 6 4-3 6 5" strokeWidth={1} strokeDasharray="1 1" opacity="0.6" />
        </svg>
      )
    },
    { 
      name: "Sarvatobhadra", 
      href: `/dashboard/${id}#sarvatobhadra`,
      activeColor: "text-fuchsia-400 group-hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.6)]",
      borderColor: "group-hover:border-fuchsia-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" strokeWidth="1.5" />
          <path d="M9 4v16M15 4v16M4 9h16M4 15h16" strokeWidth={1} strokeDasharray="2 2" opacity="0.4" />
          <circle cx="12" cy="12" r="2" strokeWidth="1" />
        </svg>
      )
    },
    { 
      name: "Reports", 
      href: `/dashboard/${id}#reports`,
      activeColor: "text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]",
      borderColor: "group-hover:border-pink-500/40",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5L19 7.5V19a2 2 0 01-2 2z" />
          <path d="M14 3v5h5" strokeWidth={1} />
        </svg>
      )
    },
  ];

  return (
    <div className="flex h-screen bg-slate-950 font-mono text-slate-300 rounded-none antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Sidebar - Sharp Interface Module */}
      <aside className="w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col shadow-2xl hidden md:flex rounded-none relative z-30">
        {/* Sidebar Header Brand Strip */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-slate-900/20 rounded-none">
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-black text-base shadow-inner rounded-none">
              ω
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 tracking-widest leading-none">
                Vedanga Jyotish
              </h1>
              <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] mt-1">
                vedic platform engine
              </p>
            </div>
          </div>
        </div>

        {/* Tactical Navigation Deck */}
        <nav className="flex-1 overflow-y-auto p-4 py-6 space-y-2 rounded-none custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 border border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 ${item.borderColor} transition-all duration-300 group rounded-none relative`}
            >
              {/* Sidebar left active line */}
              <div className="absolute left-0 top-1/4 w-[2px] h-1/2 bg-slate-800 group-hover:bg-current transition-colors" />
              
              {/* Highly Colorful Vector Icon Matrix */}
              <span className={`transition-all duration-300 ${item.activeColor}`}>
                {item.icon}
              </span>
              <span className="text-xs font-bold tracking-wider">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Processing Core */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative rounded-none">
        
        {/* Top Instrumentation Header */}
        <header className="h-16 bg-slate-950/40 backdrop-blur-md border-b border-slate-800/80 px-6 md:px-8 flex items-center justify-between sticky top-0 z-20 rounded-none">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-none animate-pulse" />
            <span className="text-[20px] font-bold text-slate-500 tracking-widest">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400 tracking-tight hover:border-indigo-500/40 hover:text-white transition-all duration-200 cursor-pointer rounded-none shadow-inner">
               
            </div>
          </div>
        </header>

        {/* Main Viewport Stage - Space Expansion applied via padding gaps */}
        <div 
          className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10 scroll-smooth rounded-none" 
          style={{ scrollPaddingTop: "6rem", scrollbarWidth: 'thin', scrollbarColor: 'rgba(51, 65, 85, 0.5) transparent' }}
        >
          {/* Section Gap Spacing Configuration */}
          <div className="max-w-7xl mx-auto space-y-12 rounded-none pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
