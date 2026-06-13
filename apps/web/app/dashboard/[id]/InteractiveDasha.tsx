"use client";

import { useState } from "react";

interface BaseDasha {
  lord: string;
  start: string;
  end: string;
}

interface InteractiveDashaProps {
  baseDashas: BaseDasha[];
}

const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const LORDS_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

// Calculates proportional sub-periods based on Vimshottari logic
function calculateSubPeriods(parentStart: Date, parentEnd: Date, parentLord: string) {
  const parentDuration = parentEnd.getTime() - parentStart.getTime();
  const subPeriods = [];
  
  let startIndex = LORDS_ORDER.indexOf(parentLord);
  let currentStartTime = parentStart.getTime();

  for (let i = 0; i < 9; i++) {
    const currentLord = LORDS_ORDER[(startIndex + i) % 9];
    if (!currentLord) continue;

    const proportion = (DASHA_YEARS[currentLord] || 0) / 120;
    const duration = parentDuration * proportion;
    
    subPeriods.push({
      lord: currentLord,
      start: new Date(currentStartTime),
      end: new Date(currentStartTime + duration),
    });
    
    currentStartTime += duration;
  }

  return subPeriods;
}

export function InteractiveDasha({ baseDashas }: InteractiveDashaProps) {
  const [selectedMD, setSelectedMD] = useState<BaseDasha | null>(null);
  const [selectedAD, setSelectedAD] = useState<any | null>(null);
  const [selectedPD, setSelectedPD] = useState<any | null>(null);
  const [selectedSD, setSelectedSD] = useState<any | null>(null);

  // Sub-period lists based on selections
  const antardashas = selectedMD ? calculateSubPeriods(new Date(selectedMD.start), new Date(selectedMD.end), selectedMD.lord) : [];
  const pratyantardashas = selectedAD ? calculateSubPeriods(selectedAD.start, selectedAD.end, selectedAD.lord) : [];
  const sookshmadashas = selectedPD ? calculateSubPeriods(selectedPD.start, selectedPD.end, selectedPD.lord) : [];
  const pranadashas = selectedSD ? calculateSubPeriods(selectedSD.start, selectedSD.end, selectedSD.lord) : [];

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  const renderList = (
    title: string, 
    data: any[], 
    selected: any, 
    onSelect: (item: any) => void,
    onClear?: () => void
  ) => (
    <div className="w-72 flex-shrink-0 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300">
      <div className="bg-gradient-to-r from-gray-50 to-white text-gray-800 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
        <span className="font-bold text-sm tracking-wide text-[#8B4513]">{title}</span>
        {onClear && (
          <button onClick={onClear} className="text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider bg-gray-100 hover:bg-red-50 px-2 py-1 rounded-md">
            Reset
          </button>
        )}
      </div>
      <div className="overflow-y-auto max-h-[450px] p-2 space-y-1 custom-scrollbar">
        {data.map((item, i) => {
          const isSelected = selected?.lord === item.lord;
          return (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-200 border group ${
                isSelected
                  ? "bg-[#8B4513] border-[#8B4513] text-white shadow-md transform scale-[1.02]"
                  : "border-transparent hover:bg-[#FDFBF7] hover:border-[#DEB887]/30 text-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${isSelected ? "text-white" : "text-[#8B4513]"}`}>
                  {item.lord}
                </span>
                <span className={`text-xs ${isSelected ? "text-white/80" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {formatDate(item.start)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Active Breadcrumb view */}
      <div className="flex flex-wrap gap-2 text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <span className={selectedMD ? "text-[#8B4513]" : ""}>
          MD: {selectedMD ? selectedMD.lord : "None Selected"}
        </span>
        {selectedAD && (
          <>
            <span className="text-gray-400">→</span>
            <span className="text-[#8B4513]">AD: {selectedAD.lord}</span>
          </>
        )}
        {selectedPD && (
          <>
            <span className="text-gray-400">→</span>
            <span className="text-[#8B4513]">PD: {selectedPD.lord}</span>
          </>
        )}
        {selectedSD && (
          <>
            <span className="text-gray-400">→</span>
            <span className="text-[#8B4513]">SD: {selectedSD.lord}</span>
          </>
        )}
      </div>

      {/* Columns */}
      <div className="flex flex-col md:flex-row gap-5 overflow-x-auto pb-6 pt-2 px-2 custom-scrollbar">
        {renderList("Mahadasha (MD)", baseDashas, selectedMD, (md) => {
          setSelectedMD(md);
          setSelectedAD(null);
          setSelectedPD(null);
          setSelectedSD(null);
        })}
        
        {selectedMD && renderList("Antardasha (AD)", antardashas, selectedAD, (ad) => {
          setSelectedAD(ad);
          setSelectedPD(null);
        }, () => {
          setSelectedMD(null);
          setSelectedAD(null);
          setSelectedPD(null);
          setSelectedSD(null);
        })}

        {selectedAD && renderList("Pratyantar (PD)", pratyantardashas, selectedPD, (pd) => {
          setSelectedPD(pd);
        }, () => {
          setSelectedAD(null);
          setSelectedPD(null);
          setSelectedSD(null);
        })}

        {selectedPD && renderList("Sookshma (SD)", sookshmadashas, selectedSD, (sd) => {
          setSelectedSD(sd);
        }, () => {
          setSelectedPD(null);
          setSelectedSD(null);
        })}

        {selectedSD && renderList("Prana (PrD)", pranadashas, null, () => {}, () => setSelectedSD(null))}
      </div>
    </div>
  );
}