import React from "react";

interface PlanetData {
  name: string;
  longitude: number;
}

export function PlanetTable({ planets }: { planets: PlanetData[] }) {
  const getZodiacSign = (deg: number) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[Math.floor(deg / 30) % 12];
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#DEB887]/40 shadow-sm mt-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-[#8B4513]">Planetary Positions</h2>
      <div className="overflow-x-auto rounded-lg border border-[#DEB887]/20">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#FDFBF7] border-b border-[#DEB887]/40 text-[#8B4513]">
              <th className="p-3 font-semibold">Planet</th>
              <th className="p-3 font-semibold">Sign</th>
              <th className="p-3 font-semibold">Degree</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => {
              const signDegree = p.longitude % 30;
              const degree = Math.floor(signDegree);
              const minutes = Math.floor((signDegree - degree) * 60);
              return (
                <tr key={p.name} className="border-b border-gray-100 last:border-none">
                  <td className="p-3 font-medium text-[#3E2723]">{p.name === 'As' ? 'Ascendant' : p.name}</td>
                  <td className="p-3 text-[#5D4037]">{getZodiacSign(p.longitude)}</td>
                  <td className="p-3 text-[#5D4037]">{degree}° {minutes}'</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}