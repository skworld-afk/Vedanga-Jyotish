const DASHA_PERIODS = [
  { lord: "Ketu", years: 7 }, { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 }, { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 }, { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 }, { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 }
];

export function calculateVimshottariDasha(moonLon: number, birthDate: Date) {
  const nakshatraLength = 360 / 27;
  const nakshatraIndex = Math.floor(moonLon / nakshatraLength);
  const dashaStartIndex = nakshatraIndex % 9;
  
  const passedFraction = (moonLon % nakshatraLength) / nakshatraLength;
  const remainingFraction = 1 - passedFraction;

  const dashas = [];
  let currentStartDate = new Date(birthDate);
  const firstDasha = DASHA_PERIODS[dashaStartIndex]!;
  let durationMs = firstDasha.years * remainingFraction * 365.25 * 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < 9; i++) {
    const idx = (dashaStartIndex + i) % 9;
    const dasha = DASHA_PERIODS[idx]!;
    const nextDate = new Date(currentStartDate.getTime() + durationMs);
    dashas.push({ lord: dasha.lord, start: currentStartDate, end: nextDate });
    currentStartDate = nextDate;
    durationMs = DASHA_PERIODS[(idx + 1) % 9]!.years * 365.25 * 24 * 60 * 60 * 1000;
  }
  return dashas;
}