export type DashaYearMode = "savana" | "solar";

export interface DashaPeriod {
  lord: string;
  years: number;
  balanceYears?: number;
  start: Date;
  end: Date;
  subDashas?: DashaPeriod[];
}

export interface CurrentDasha {
  maha?: Omit<DashaPeriod, 'subDashas'>;
  antar?: Omit<DashaPeriod, 'subDashas'>;
  pratyantar?: Omit<DashaPeriod, 'subDashas'>;
  sookshma?: Omit<DashaPeriod, 'subDashas'>;
  prana?: Omit<DashaPeriod, 'subDashas'>;
}

const DASHA_PERIODS = [
  { lord: "Ketu", years: 7 }, { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 }, { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 }, { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 }, { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 }
];

function generateSubPeriods(
  parentStartMs: number,
  parentEndMs: number,
  parentYears: number,
  parentLordIdx: number,
  currentLevel: number,
  maxLevel: number,
  birthDateMs: number,
  daysPerYear: number
): DashaPeriod[] | undefined {
  if (currentLevel > maxLevel) return undefined;

  const subs: DashaPeriod[] = [];
  let currentStartMs = parentStartMs;

  for (let i = 0; i < 9; i++) {
    const lordIdx = (parentLordIdx + i) % 9;
    const lord = DASHA_PERIODS[lordIdx]!;

    // Recursive Sub-Period Duration Formula: (Parent Years * Lord Years) / 120
    const subYears = (parentYears * lord.years) / 120;
    const subDurationMs = subYears * daysPerYear * 24 * 60 * 60 * 1000;

    // Force snap the final sub-dasha strictly to the parent's absolute end time
    const endMs = i === 8 ? parentEndMs : currentStartMs + subDurationMs;

    // Keep period if it finishes after birth, correctly catching active birth sub-periods
    if (endMs > birthDateMs) {
      const subDashas = generateSubPeriods(
        currentStartMs, endMs, subYears, lordIdx, currentLevel + 1, maxLevel, birthDateMs, daysPerYear
      );

      subs.push({
        lord: lord.lord,
        years: subYears,
        start: new Date(currentStartMs),
        end: new Date(endMs),
        ...(subDashas ? { subDashas } : {})
      });
    }
    currentStartMs = endMs;
  }
  return subs;
}

export function calculateVimshottariDasha(moonLon: number, birthDate: Date, yearType: DashaYearMode = "solar"): DashaPeriod[] {
  // Parashari Savana year uses exactly 360 days, Solar uses 365.2425
  const daysPerYear = yearType === "savana" ? 360 : 365.2425;

  // Minor Edge Case: Normalize moon longitude to 0-359.99
  const normalizedMoonLon = ((moonLon % 360) + 360) % 360;
  const nakshatraLength = 360 / 27;
  
  // Epsilon to fix floating point boundary matching (e.g., exactly at 13°20' jump)
  const epsilon = 1e-9;
  const nakshatraIndex = Math.floor((normalizedMoonLon + epsilon) / nakshatraLength) % 27;
  
  // Vimshottari mapping repeats every 9 nakshatras starting from Ashwini (Ketu)
  const dashaStartIndex = nakshatraIndex % 9;
  
  const passedDegrees = (normalizedMoonLon + epsilon) - (nakshatraIndex * nakshatraLength);
  const passedFraction = Math.max(0, passedDegrees / nakshatraLength);
  const remainingFraction = 1 - passedFraction;

  const dashas: DashaPeriod[] = [];
  const firstDasha = DASHA_PERIODS[dashaStartIndex]!;
  
  // Determine the theoretical absolute start date of the first Mahadasha (before birth)
  const birthDateMs = birthDate.getTime();
  const passedMs = firstDasha.years * passedFraction * daysPerYear * 24 * 60 * 60 * 1000;
  let currentMahaStartMs = birthDateMs - passedMs;
  
  // Loop until we reach approx 120 Vimshottari years of lifespan
  const MAX_LIFESPAN_MS = 120 * daysPerYear * 24 * 60 * 60 * 1000;
  const endOfLifeMs = birthDateMs + MAX_LIFESPAN_MS;

  let i = 0;
  // Safety limit of i < 20 to prevent infinite loops but allow full 120-year span
  while (currentMahaStartMs < endOfLifeMs && i < 20) {
    const idx = (dashaStartIndex + i) % 9;
    const mahaDasha = DASHA_PERIODS[idx]!;
    
    const mahaDurationMs = mahaDasha.years * daysPerYear * 24 * 60 * 60 * 1000;
    const mahaEndMs = currentMahaStartMs + mahaDurationMs;
    
    // Only include Mahadashas that end after birthDate
    if (mahaEndMs > birthDateMs) {
      // Generate up to Prana Dasha (Level 5)
      const subDashas = generateSubPeriods(
        currentMahaStartMs, mahaEndMs, mahaDasha.years, idx, 2, 5, birthDateMs, daysPerYear
      );

      dashas.push({
        lord: mahaDasha.lord,
        years: mahaDasha.years,
        ...(i === 0 ? { balanceYears: mahaDasha.years * remainingFraction } : {}),
        start: new Date(currentMahaStartMs),
        end: new Date(mahaEndMs),
        subDashas
      });
    }
    
    currentMahaStartMs = mahaEndMs;
    i++;
  }
  
  return dashas;
}

export function getCurrentVimshottariDasha(dashas: DashaPeriod[], targetDate: Date = new Date()): CurrentDasha {
  const targetMs = targetDate.getTime();
  const current: CurrentDasha = {};

  const extractNode = (node: DashaPeriod) => {
    const { subDashas, ...rest } = node;
    return rest;
  };

  let currentLevel = 1;
  let currentArray: DashaPeriod[] | undefined = dashas;

  while (currentArray && currentArray.length > 0 && currentLevel <= 5) {
    // <= d.end.getTime() prevents dropping the very last millisecond
    const active: DashaPeriod | undefined = currentArray.find(d => targetMs >= d.start.getTime() && targetMs <= d.end.getTime());
    
    if (!active) break;

    if (currentLevel === 1) current.maha = extractNode(active);
    else if (currentLevel === 2) current.antar = extractNode(active);
    else if (currentLevel === 3) current.pratyantar = extractNode(active);
    else if (currentLevel === 4) current.sookshma = extractNode(active);
    else if (currentLevel === 5) current.prana = extractNode(active);

    currentArray = active.subDashas;
    currentLevel++;
  }
  
  return current;
}