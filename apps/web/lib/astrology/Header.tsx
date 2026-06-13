import Link from "next/link";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-[#FDFBF7] to-white border-b border-[#DEB887]/40 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-[#8B4513] tracking-tight flex items-center gap-2">
              <span className="bg-[#8B4513] text-white flex items-center justify-center w-8 h-8 rounded-full text-lg shadow-md pb-0.5">ॐ</span>
              Vedanga Jyotish
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#8B4513] px-3 py-2 font-semibold transition-all hover:bg-[#DEB887]/10 rounded-md">Home</Link>
            <Link href="/panchang" className="text-gray-700 hover:text-[#8B4513] px-3 py-2 font-semibold transition-all hover:bg-[#DEB887]/10 rounded-md">Today Panchang</Link>
            <Link href="/learn" className="text-gray-700 hover:text-[#8B4513] px-3 py-2 font-semibold transition-all hover:bg-[#DEB887]/10 rounded-md">Learn Astrology</Link>
            <Link href="/about" className="text-gray-700 hover:text-[#8B4513] px-3 py-2 font-semibold transition-all hover:bg-[#DEB887]/10 rounded-md">About</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}