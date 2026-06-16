import Link from "next/link";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-500 via-[#FF6347] to-orange-500 backdrop-blur-lg border-b border-orange-600/30 sticky top-0 z-50 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="w-1/4 flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-sm">
              <span className="bg-white text-orange-600 flex items-center justify-center w-8 h-8 rounded-full text-lg shadow-md pb-0.5">ॐ</span>
              <span className="hidden lg:inline">Vedanga Jyotish</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-6">
            <Link href="/" className="px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">
              Home
            </Link>
            <Link href="/panchang" className="px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">
              Panchang
            </Link>
            <Link href="/learn" className="px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">
              Learn Astrology
            </Link>
            <Link href="/about" className="px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 drop-shadow-sm">
              About
            </Link>
          </nav>

          <div className="w-1/4 flex justify-end"></div>
        </div>
      </div>
    </header>
  );
}