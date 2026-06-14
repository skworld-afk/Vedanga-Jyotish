import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
          © {new Date().getFullYear()} Vedanga Jyotish. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <Link href="#" className="text-sm text-gray-400 hover:text-[#8B4513] transition-colors">Terms of Service</Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-[#8B4513] transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-[#8B4513] transition-colors">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}