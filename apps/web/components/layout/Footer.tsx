import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0">
        <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
          © {new Date().getFullYear()} Vedanga Jyotish. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="#" className="text-xs md:text-sm text-gray-400 hover:text-[#8B4513] transition-colors">Terms of Service</Link>
          <Link href="#" className="text-xs md:text-sm text-gray-400 hover:text-[#8B4513] transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-xs md:text-sm text-gray-400 hover:text-[#8B4513] transition-colors">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}