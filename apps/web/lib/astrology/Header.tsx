import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#FDFBF7]/80 backdrop-blur-lg border-b border-[#DEB887]/30 sticky top-0 z-50 shadow-[0_4px_20px_-10px_rgba(139,69,19,0.1)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="w-1/4 flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-[#8B4513] tracking-tight flex items-center gap-2">
              <span className="bg-[#8B4513] text-white flex items-center justify-center w-8 h-8 rounded-full text-lg shadow-md pb-0.5">ॐ</span>
              <span className="hidden lg:inline">Vedanga Jyotish</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-6">
            <Link href="/" className="px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-[#5D4037]/70 hover:text-[#8B4513] hover:bg-[#DEB887]/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
              Home
            </Link>
            <Link href="/panchang" className="px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-[#5D4037]/70 hover:text-[#8B4513] hover:bg-[#DEB887]/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
              Panchang
            </Link>
            <Link href="/learn" className="px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-[#5D4037]/70 hover:text-[#8B4513] hover:bg-[#DEB887]/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
              Learn Astrology
            </Link>
            <Link href="/about" className="px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-widest uppercase text-[#5D4037]/70 hover:text-[#8B4513] hover:bg-[#DEB887]/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
              About
            </Link>
          </nav>

          <div className="w-1/4 flex justify-end"></div>
        </div>
      </div>
    </header>
  );
}