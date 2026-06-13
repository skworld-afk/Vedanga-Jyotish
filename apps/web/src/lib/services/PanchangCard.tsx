import React from "react";

export function PanchangCard({ panchang }: { panchang?: any }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#DEB887]/40 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[#8B4513]">Basic Panchang</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#5D4037]">
        <div className="p-4 bg-[#FDFBF7] border border-[#DEB887]/20 rounded-lg">
          <strong className="block text-[#8B4513] mb-1">Tithi</strong>
          {panchang?.tithi || "Calculation pending"}
        </div>
        <div className="p-4 bg-[#FDFBF7] border border-[#DEB887]/20 rounded-lg">
          <strong className="block text-[#8B4513] mb-1">Nakshatra</strong>
          {panchang?.nakshatra || "Calculation pending"}
        </div>
        <div className="p-4 bg-[#FDFBF7] border border-[#DEB887]/20 rounded-lg">
          <strong className="block text-[#8B4513] mb-1">Karana</strong>
          {panchang?.karana || "Calculation pending"}
        </div>
        <div className="p-4 bg-[#FDFBF7] border border-[#DEB887]/20 rounded-lg">
          <strong className="block text-[#8B4513] mb-1">Yoga</strong>
          {panchang?.yoga || "Calculation pending"}
        </div>
      </div>
    </div>
  );
}