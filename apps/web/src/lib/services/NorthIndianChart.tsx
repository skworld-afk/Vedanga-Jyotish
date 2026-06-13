import React from "react";

export interface Planet {
  name: string;
  longitude: number;
}

interface NorthIndianChartProps {
  planets: Planet[];
  ascendant?: number;
}

export function NorthIndianChart({ planets, ascendant = 0 }: NorthIndianChartProps) {
  // Calculate the Zodiac Sign (1-12) for the Ascendant (Lagna)
  const ascendantSign = Math.floor(ascendant / 30) + 1;

  // Map planets to their respective signs
  const planetsBySign: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) planetsBySign[i] = [];

  planets.forEach((p) => {
    let sign = Math.floor(p.longitude / 30) + 1;
    if (sign > 12) sign -= 12;
    planetsBySign[sign]?.push(p.name);
  });

  // Map signs to the 12 houses based on the Ascendant
  const houses: Record<number, { sign: number; planets: string[] }> = {};
  for (let i = 1; i <= 12; i++) {
    let sign = ascendantSign + (i - 1);
    if (sign > 12) sign -= 12;
    houses[i] = {
      sign,
      planets: planetsBySign[sign] || [],
    };
  }

  // SVG Coordinates for the text placement of the 12 houses
  const houseCenters = {
    1: { x: 150, y: 75 },
    2: { x: 75, y: 35 },
    3: { x: 35, y: 75 },
    4: { x: 75, y: 150 },
    5: { x: 35, y: 225 },
    6: { x: 75, y: 265 },
    7: { x: 150, y: 225 },
    8: { x: 225, y: 265 },
    9: { x: 265, y: 225 },
    10: { x: 225, y: 150 },
    11: { x: 265, y: 75 },
    12: { x: 225, y: 35 },
  };

  return (
    <svg viewBox="0 0 300 300" className="w-full h-auto max-w-sm mx-auto bg-[#FFFDF8]">
      <rect x="0" y="0" width="300" height="300" fill="none" stroke="#DEB887" strokeWidth="2" />
      <line x1="0" y1="0" x2="300" y2="300" stroke="#DEB887" strokeWidth="2" />
      <line x1="0" y1="300" x2="300" y2="0" stroke="#DEB887" strokeWidth="2" />
      <polygon points="150,0 300,150 150,300 0,150" fill="none" stroke="#DEB887" strokeWidth="2" />

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
        const { x, y } = houseCenters[houseNum as keyof typeof houseCenters];
        const data = houses[houseNum];
        if (!data) return null;
        return (
          <g key={houseNum}>
            <text x={x} y={y - 12} fontSize="11" textAnchor="middle" fill="#DEB887" fontWeight="bold">{data.sign}</text>
            <text x={x} y={y + 6} fontSize="14" textAnchor="middle" fill="#5D4037" fontWeight="bold">{data.planets.join(", ")}</text>
          </g>
        );
      })}
    </svg>
  );
}