"use client";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="px-4 py-3 text-left text-[#5D4037] hover:bg-[#DEB887]/20 rounded-xl font-medium transition-colors flex justify-between items-center w-full"
    >
      Print Report <span>🖨️</span>
    </button>
  );
}