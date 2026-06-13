"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({ chartId }: { chartId: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: `/dashboard/${chartId}` },
    { name: "Divisional Charts", href: `/dashboard/${chartId}/divisional` },
    { name: "Dasha Timeline", href: `/dashboard/${chartId}/dasha` },
    { name: "Transits", href: `/dashboard/${chartId}/transit` },
    { name: "Yogas", href: `/dashboard/${chartId}/yoga` },
    { name: "Reports", href: `/dashboard/${chartId}/reports` },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="font-bold text-xl tracking-tight">Astro SaaS</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/chart/create" className="block w-full text-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          + New Chart
        </Link>
      </div>
    </aside>
  );
}