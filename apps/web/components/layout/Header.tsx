"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-orange-500 via-[#FF6347] to-orange-500 backdrop-blur-lg border-b border-orange-600/30 sticky top-0 z-50 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-sm">
              <span className="bg-white text-orange-600 flex items-center justify-center w-8 h-8 rounded-full text-lg shadow-md pb-0.5">ॐ</span>
              <span className="inline">Vedanga Jyotish</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-6">
            <Link href="/" className="px-3 lg:px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">Home</Link>
            <Link href="/panchang" className="px-3 lg:px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">Panchang</Link>
            <Link href="/learn" className="px-3 lg:px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">Learn Astrology</Link>
            <Link href="/about" className="px-3 lg:px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">About</Link>
            <Link href="/chart/create" className="px-3 lg:px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase bg-white/20 text-white hover:bg-white/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">+ New Chart</Link>
          </nav>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-gray-200 focus:outline-none p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#FF6347] border-t border-orange-600/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-inner">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-colors">Home</Link>
            <Link href="/panchang" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-colors">Panchang</Link>
            <Link href="/learn" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-colors">Learn Astrology</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-colors">About</Link>
            <Link href="/chart/create" onClick={() => setIsMenuOpen(false)} className="block mt-1 px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest bg-white/10 text-white hover:bg-white/20 transition-colors">+ New Chart</Link>
          </div>
        </div>
      )}
    </header>
  );
}