import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#DEB887]/50 bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm font-serif">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col justify-center hover:opacity-90 transition-opacity">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#8B4513]">
            Jyotish Vidya
          </h1>
          <p className="text-xs text-[#5D4037] font-medium tracking-wide uppercase mt-0.5">
            Brihat Parashara Hora Shastra Based
          </p>
        </Link>

        <Link
          href="/chart/create"
          className="bg-gradient-to-br from-[#8B4513] to-[#5D4037] hover:from-[#5D4037] hover:to-[#3E2723] text-[#FFFDF8] px-6 py-2.5 rounded shadow hover:shadow-lg transition-all font-semibold border border-[#3E2723]/50 whitespace-nowrap"
        >
          ॐ Create Kundli
        </Link>
      </div>
    </header>
  );
}