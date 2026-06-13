import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-bold text-xl tracking-tight">Astro SaaS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100 transition-colors"
          >
            Dashboard Settings
          </Link>
          <Link 
            href="/dashboard/profiles/new" 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100 transition-colors hover:bg-gray-200"
          >
            + New Chart
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
