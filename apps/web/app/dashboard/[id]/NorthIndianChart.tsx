"use client";

// Vivid cosmic color themes specifically assigned to each planet
const PLANET_COLORS: Record<string, string> = {
  SU: "#f59e0b", // Sun: Vibrant Amber
  MO: "#38bdf8", // Moon: Sky Blue
  MA: "#f43f5e", // Mars: Rose Red
  ME: "#14b8a6", // Mercury: Teal
  JU: "#eab308", // Jupiter: Yellow Gold
  VE: "#f472b6", // Venus: Pink
  SA: "#818cf8", // Saturn: Indigo
  RA: "#10b981", // Rahu: Emerald Green
  KE: "#c084fc", // Ketu: Purple
  Asc: "#ffffff", // Ascendant
};

// Distinct premium colors mapped to each of the 12 signs/digits to maximize structural division
const DIGIT_COLORS: Record<number, string> = {
  1: "#a7f3d0",  2: "#bae6fd",  3: "#c7d2fe",  4: "#f5d0fe",
  5: "#fecdd3",  6: "#fed7aa",  7: "#fef08a",  8: "#ccfbf1",
  9: "#e0f2fe",  10: "#fae8ff", 11: "#ffedd5", 12: "#f3e8ff"
};

export function NorthIndianChart({ planets, ascLon, title = "D1 Lagna Chart" }: { planets: Record<string, number>, ascLon: number, title?: string }) {
  // Calculate Ascendant Sign (1-12)
  const ascSign = Math.floor(((ascLon % 360) + 360) % 360 / 30) + 1;
  
  const lagnaEntry = Object.entries(planets).find(([p]) => ['ascendant', 'asc', 'lagna'].includes(p.toLowerCase()));
  const lagnaLon = lagnaEntry ? (lagnaEntry[1] as number) : ascLon;

  // Map planets into the 12 houses relative to the Ascendant
  const houses = Array.from({length: 12}, (_, i) => {
    const sign = ((ascSign + i - 1) % 12) + 1;
    const occupants = Object.entries(planets).filter(([p, lon]) => {
       if (['ascendant', 'asc', 'lagna', 'mc', 'midheaven', 'ayanamsha'].includes(p.toLowerCase())) return false;
       const pSign = Math.floor(((lon as number % 360) + 360) % 360 / 30) + 1;
       return pSign === sign;
    }).map(([p]) => p.substring(0, 2).toUpperCase());
    
    const lagnaSign = Math.floor(((lagnaLon % 360) + 360) % 360 / 30) + 1;
    if (lagnaSign === sign) {
      occupants.unshift("Asc");
    }

    return { sign, occupants };
  });

  // Re-calibrated coordinates optimized for clean readability next to thicker lines
  const getHousePos = (h: number) => {
    const positions = [
      { cx: 200, cy: 95,  sx: 200, sy: 160 }, // 1 (Lagna)
      { cx: 105, cy: 45,  sx: 120, sy: 85 },  // 2
      { cx: 45,  cy: 105, sx: 85,  sy: 120 }, // 3
      { cx: 110, cy: 200, sx: 160, sy: 200 }, // 4
      { cx: 45,  cy: 295, sx: 85,  sy: 280 }, // 5
      { cx: 105, cy: 355, sx: 120, sy: 315 }, // 6
      { cx: 200, cy: 305, sx: 200, sy: 240 }, // 7
      { cx: 295, cy: 355, sx: 280, sy: 315 }, // 8
      { cx: 355, cy: 295, sx: 315, sy: 280 }, // 9
      { cx: 290, cy: 200, sx: 240, sy: 200 }, // 10
      { cx: 355, cy: 105, sx: 315, sy: 120 }, // 11
      { cx: 295, cy: 45,  sx: 280, sy: 85 }   // 12
    ];
    return positions[h - 1];
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 rounded-none bg-transparent">
      {title && (
        <h3 className="text-xs font-bold text-slate-400 mb-5 uppercase tracking-[0.2em]">{title}</h3>
      )}
      
      <svg 
        viewBox="0 0 400 400" 
        className="w-full max-w-[360px] aspect-square font-mono select-none overflow-visible"
      >
        {/* Deep Translucent Astro Panel Base */}
        <rect x="6" y="6" width="388" height="388" fill="rgba(8, 12, 24, 0.75)" />

        {/* --- OUTER BOUNDARY SYSTEM (BLUE/CYAN SPECTRUM) --- */}
        {/* Thick Vibrant Deep Sky Blue Outer Box Frame */}
        <rect x="6" y="6" width="388" height="388" fill="none" stroke="#0284c7" strokeWidth="3.5" />
        <rect x="14" y="14" width="372" height="372" fill="none" stroke="#1e293b" strokeWidth="1.5" />
        
        {/* High-Contrast Technical Corner Brackets */}
        <path d="M6 26V6H26" fill="none" stroke="#38bdf8" strokeWidth="3" />
        <path d="M394 26V6H374" fill="none" stroke="#38bdf8" strokeWidth="3" />
        <path d="M6 374v20h20" fill="none" stroke="#38bdf8" strokeWidth="3" />
        <path d="M394 374v20H374" fill="none" stroke="#38bdf8" strokeWidth="3" />

        {/* --- CHANGED INNER CORE STRUCTURE: DISTINCT DYNAMIC CONTRAST --- */}
        {/* Background Diagonal Crossing Matrices - Clean Dark Indigo */}
        <line x1="14" y1="14" x2="386" y2="386" stroke="#4338ca" strokeWidth="1.5" opacity="0.5" />
        <line x1="386" y1="14" x2="14" y2="386" stroke="#4338ca" strokeWidth="1.5" opacity="0.5" />

        {/* Thick Inner Diamond Core Enclosure - Intense Neon Cosmic Purple */}
        <polygon 
          points="200,14 386,200 200,386 14,200" 
          fill="none" 
          stroke="#d946ef" 
          strokeWidth="2.5" 
          opacity="0.95" 
        />

        {/* Render Houses data */}
        {houses.map((h, i) => {
          const pos = getHousePos(i + 1);
          if (!pos) return null;

          return (
            <g key={i}>
              {/* House Digits (Sign Indices) */}
              <text 
                x={pos.sx} 
                y={pos.sy} 
                fontSize="16" 
                fill={DIGIT_COLORS[h.sign] || "#94a3b8"} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontWeight="800"
              >
                {h.sign}
              </text>
              
              {/* Planet Name Tokens with Auto-Spacing Offset Mapping */}
              {h.occupants.length > 0 && (
                <g>
                  {h.occupants.map((occ, idx) => {
                    const totalOffset = (h.occupants.length - 1) * 11;
                    const xOffset = (idx * 22) - totalOffset;
                    
                    return (
                      <text 
                        key={idx}
                        x={pos.cx + xOffset} 
                        y={pos.cy} 
                        fontSize="17" 
                        fill={PLANET_COLORS[occ] || "#e2e8f0"} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        fontWeight="900"
                      >
                        {occ}
                      </text>
                    );
                  })}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
