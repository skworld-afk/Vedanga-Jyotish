import { getRashi } from "./signs";
import { getHouse } from "./houses";
import {
  NAKSHATRAS,
  getNakshatra,
  getPada,
  calculatePanchang
} from "./nakshatra";
import { calculateVimshottariDasha, getCurrentVimshottariDasha, CurrentDasha, DashaPeriod, DashaYearMode } from "./dasha";
import { swe_julday, swe_get_ayanamsa_ut, getSunriseSunset, getMoonriseMoonset, calculateMuhurtas, calculateActiveHora } from "./index";
import { calculateChart } from "./chart";

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

function getSignLord(signIndex: number) {
  return SIGN_LORDS[signIndex] || "Unknown";
}

function getNakshatraLord(nakshatraIndex: number) {
  return NAKSHATRA_LORDS[(nakshatraIndex - 1) % 9] || "Unknown";
}

function getPlanetStatus(planetName: string, signIndex: number): string {
  const statusMap: Record<string, { exalted: number; debilitated: number; own: number[] }> = {
    sun: { exalted: 0, debilitated: 6, own: [4] }, // Aries, Libra, Leo
    moon: { exalted: 1, debilitated: 7, own: [3] }, // Taurus, Scorpio, Cancer
    mars: { exalted: 9, debilitated: 3, own: [0, 7] }, // Capricorn, Cancer, Aries/Scorpio
    mercury: { exalted: 5, debilitated: 11, own: [2, 5] }, // Virgo, Pisces, Gemini/Virgo
    jupiter: { exalted: 3, debilitated: 9, own: [8, 11] }, // Cancer, Capricorn, Sag/Pisces
    venus: { exalted: 11, debilitated: 5, own: [1, 6] }, // Pisces, Virgo, Taurus/Libra
    saturn: { exalted: 6, debilitated: 0, own: [9, 10] }, // Libra, Aries, Cap/Aq
    rahu: { exalted: 1, debilitated: 7, own: [] }, // Taurus, Scorpio
    ketu: { exalted: 7, debilitated: 1, own: [] }, // Scorpio, Taurus
  };

  const info = statusMap[planetName.toLowerCase()];
  if (!info) return "Neutral";

  if (info.exalted === signIndex) return "Exalted";
  if (info.debilitated === signIndex) return "Debilitated";
  if (info.own.includes(signIndex)) return "Own House";

  return "Neutral";
}

function formatJdTime(jd: number | null | undefined): string {
  if (!jd) return "N/A";
  const gmtHours = ((jd + 0.5) % 1) * 24;
  const istHours = (gmtHours + 5.5 + 24) % 24; // Note: defaults to IST for now
  const h = Math.floor(istHours);
  const m = Math.floor((istHours - h) * 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export interface PlanetDashboardData {
  planet: string;
  longitude: number;
  rashi: string;
  lord: string;
  degree: number;
  house: number;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  retrograde: boolean;
  combust: boolean;
  status: string;
}

export function mapPlanet(
  planetName: string,
  longitude: number,
  ascendant: number,
  sunLongitude: number = 0,
  speed: number = 0
): PlanetDashboardData {
  const rashi = getRashi(longitude);
  const nakIndex = getNakshatra(longitude);
  const isSunOrNode = ["sun", "moon", "rahu", "ketu"].includes(planetName.toLowerCase());

  return {
    planet: planetName,
    longitude,
    rashi: rashi.sign || "Unknown",
    lord: getSignLord(rashi.index),
    degree: Number(rashi.degree.toFixed(2)),
    house: getHouse(ascendant, longitude),
    nakshatra: NAKSHATRAS[nakIndex - 1] || "Unknown",
    nakshatraLord: getNakshatraLord(nakIndex),
    pada: getPada(longitude),
    retrograde: speed < 0,
    combust: !isSunOrNode && Math.abs(longitude - sunLongitude) < 8,
    status: getPlanetStatus(planetName, rashi.index),
  };
}

export function mapAllPlanets(
  planets: Record<
    string,
    number
  >,
  speeds: Record<string, number> = {}
) {
  const asc = planets.ascendant || 0;
  const sun = planets.sun || 0;

  return {
    Sun: mapPlanet("sun", planets.sun || 0, asc, sun, speeds.sun),
    Moon: mapPlanet("moon", planets.moon || 0, asc, sun, speeds.moon),
    Mercury: mapPlanet("mercury", planets.mercury || 0, asc, sun, speeds.mercury),
    Venus: mapPlanet("venus", planets.venus || 0, asc, sun, speeds.venus),
    Mars: mapPlanet("mars", planets.mars || 0, asc, sun, speeds.mars),
    Jupiter: mapPlanet("jupiter", planets.jupiter || 0, asc, sun, speeds.jupiter),
    Saturn: mapPlanet("saturn", planets.saturn || 0, asc, sun, speeds.saturn),
    Rahu: mapPlanet("rahu", planets.rahu || 0, asc, sun, speeds.rahu),
    Ketu: mapPlanet("ketu", planets.ketu || 0, asc, sun, speeds.ketu),
  };
}

export function buildHouseTable(
  ascendant: number,
  planets: Record<
    string,
    number
  >
) {
  const houses: Record<
    number,
    string[]
  > = {};

  for (
    let i = 1;
    i <= 12;
    i++
  ) {
    houses[i] = [];
  }

  Object.entries(
    planets
  ).forEach(
    ([planet, longitude]) => {
      if (
        planet ===
        "ascendant"
      )
        return;

      const house =
        getHouse(
          ascendant,
          longitude
        );

      houses[house]!.push(
        planet
          .charAt(0)
          .toUpperCase() +
          planet.slice(1)
      );
    }
  );

  return houses;
}

export interface BhavaDashboardData {
  bhava: number;
  start: number;
  middle: number;
  end: number;
  sign: string;
  occupants: string[];
}

export function buildBhavaDetailsTable(
  ascendant: number,
  planets: Record<string, number>
): BhavaDashboardData[] {
  const occupantsMap = buildHouseTable(ascendant, planets);
  const bhavas: BhavaDashboardData[] = [];

  for (let i = 1; i <= 12; i++) {
    const middle = (ascendant + (i - 1) * 30) % 360;
    let start = middle - 15;
    if (start < 0) start += 360;
    const end = (middle + 15) % 360;

    bhavas.push({
      bhava: i,
      start: Number(start.toFixed(2)),
      middle: Number(middle.toFixed(2)),
      end: Number(end.toFixed(2)),
      sign: getRashi(middle).sign || "Unknown",
      occupants: occupantsMap[i] || []
    });
  }

  return bhavas;
}

export function getAscendantSign(
  ascendant: number
) {
  return getRashi(
    ascendant
  );
}

export function getPlanetSummary(
  planets: Record<string, number>,
  speeds?: Record<string, number>
) {
  return Object.values(mapAllPlanets(planets, speeds || {}));
}

// ============================================================================
// COMPREHENSIVE DASHBOARD DATA STRUCTURES & CALCULATORS
// ============================================================================

export interface YogaDetails {
  name: string;
  category: "Raja Yogas" | "Dhana Yogas" | "Pancha Mahapurusha" | "Gaja Kesari" | "Arishta Yogas" | "Spiritual Yogas" | "Other";
  isPresent: boolean;
  strength: number; // percentage
  description?: string;
}

export interface DoshaDetails {
  name: string;
  strength: "Low" | "Medium" | "High" | "None";
  affectedHouses: number[];
  isPresent: boolean;
}

export interface AshtakavargaDetails {
  bhinna: Record<string, number[]>;
  sarva: number[];
  total: number;
  strongestHouse: { house: number; score: number };
  weakestHouse: { house: number; score: number };
}

export interface SBCDetails {
  highlightedNakshatras: Record<string, string>;
}

export interface FullDashboardData {
  overview: {
    native: any; // User Profile Data
    panchang: {
      vara: string;
      tithi: string;
      karana: string;
      yoga: string;
      nakshatra: string;
      pada: number;
      moonSign: string;
      ayanamsa: string;
      sunrise: string;
      sunset: string;
      moonrise: string;
      moonset: string;
      hora: string;
      abhijit: string;
    }; // Today's / Birth Panchang
  };
  charts: {
    D1: Record<string, number>;
    D9: Record<string, number>;
    Moon: Record<string, number>;
    Sun: Record<string, number>;
    Transit: Record<string, number>;
  };
  planetary: PlanetDashboardData[];
  bhavas: BhavaDashboardData[];
  divisional: Record<string, Record<string, number>>;
  dasha: DashaPeriod[];
  currentDasha: CurrentDasha;
  yogas: Record<string, YogaDetails[]>;
  doshas: DoshaDetails[];
  ashtakavarga: AshtakavargaDetails;
  sbc: SBCDetails;
}

export function calculateYogas(ascendant: number, planets: Record<string, number>): YogaDetails[] {
  const yogas: YogaDetails[] = [];
  
  // Helper for Kendra from Moon
  const getHouseFromMoon = (planetLon: number) => {
    const moonSign = Math.floor((planets.moon || 0) / 30);
    const pSign = Math.floor(planetLon / 30);
    return ((pSign - moonSign + 12) % 12) + 1;
  };

  // 1. Gaja Kesari: Jupiter in Kendra (1, 4, 7, 10) from Moon
  const jupFromMoon = getHouseFromMoon(planets.jupiter || 0);
  if ([1, 4, 7, 10].includes(jupFromMoon)) {
    yogas.push({
      name: "Gaja Kesari Yoga",
      category: "Gaja Kesari",
      isPresent: true,
      strength: 85,
      description: "Jupiter is in a Kendra from the Moon. Bestows wealth, intelligence, and lasting reputation."
    });
  }

  // 2. Pancha Mahapurusha Yogas (Mars, Merc, Jup, Ven, Sat in Kendra + Own/Exalted Sign)
  const checkMahapurusha = (planetName: string, yogaName: string, lon: number) => {
    const house = getHouse(ascendant, lon);
    if ([1, 4, 7, 10].includes(house)) {
      const status = getPlanetStatus(planetName, Math.floor(lon / 30));
      if (status === "Exalted" || status === "Own House") {
         yogas.push({
           name: yogaName,
           category: "Pancha Mahapurusha",
           isPresent: true,
           strength: status === "Exalted" ? 100 : 80,
           description: `${planetName.charAt(0).toUpperCase() + planetName.slice(1)} is in Kendra and is ${status}.`
         });
      }
    }
  };

  checkMahapurusha("mars", "Ruchaka Yoga", planets.mars || 0);
  checkMahapurusha("mercury", "Bhadra Yoga", planets.mercury || 0);
  checkMahapurusha("jupiter", "Hamsa Yoga", planets.jupiter || 0);
  checkMahapurusha("venus", "Malavya Yoga", planets.venus || 0);
  checkMahapurusha("saturn", "Shasha Yoga", planets.saturn || 0);

  // 3. Dharma Karmadhipati (Placeholders for complex Lord conjuncts)
  yogas.push({ name: "Dharma Karmadhipati", category: "Raja Yogas", isPresent: false, strength: 0 });
  yogas.push({ name: "Dhana Yoga", category: "Dhana Yogas", isPresent: false, strength: 0 });

  return yogas;
}

export function calculateDoshas(ascendant: number, planets: Record<string, number>): DoshaDetails[] {
  const doshas: DoshaDetails[] = [];
  
  // 1. Manglik Dosha
  const marsHouse = getHouse(ascendant, planets.mars || 0);
  if ([1, 4, 7, 8, 12].includes(marsHouse)) {
    doshas.push({ name: "Manglik Dosha", strength: "High", affectedHouses: [marsHouse], isPresent: true });
  } else {
    doshas.push({ name: "Manglik Dosha", strength: "None", affectedHouses: [], isPresent: false });
  }

  // 2. Guru Chandal Dosha (Jupiter conjunct Rahu)
  const jupHouse = getHouse(ascendant, planets.jupiter || 0);
  const rahuHouse = getHouse(ascendant, planets.rahu || 0);
  if (jupHouse === rahuHouse) {
    doshas.push({ name: "Guru Chandal Dosha", strength: "High", affectedHouses: [jupHouse], isPresent: true });
  }

  // 3. Grahan Dosha (Sun/Moon conjunct Node)
  const sunHouse = getHouse(ascendant, planets.sun || 0);
  const moonHouse = getHouse(ascendant, planets.moon || 0);
  const ketuHouse = getHouse(ascendant, planets.ketu || 0);
  if ([sunHouse, moonHouse].includes(rahuHouse) || [sunHouse, moonHouse].includes(ketuHouse)) {
    const affectedHouse = (rahuHouse === sunHouse || ketuHouse === sunHouse) ? sunHouse : moonHouse;
    doshas.push({ name: "Grahan Dosha", strength: "High", affectedHouses: [affectedHouse], isPresent: true });
  }

  return doshas;
}

export function calculateAshtakavarga(planets: Record<string, number>): AshtakavargaDetails {
  // Note: Placeholder for rigorous 337 Bindu matrix allocation
  const sarva = [28, 30, 32, 25, 29, 31, 22, 26, 33, 27, 24, 30]; 
  return {
    bhinna: {
      Sun: [4, 3, 5, 2, 4, 3, 6, 2, 4, 5, 3, 7],
      Moon: [5, 4, 4, 3, 5, 6, 2, 4, 3, 5, 4, 4],
    },
    sarva,
    total: sarva.reduce((a, b) => a + b, 0),
    strongestHouse: { house: sarva.indexOf(Math.max(...sarva)) + 1, score: Math.max(...sarva) },
    weakestHouse: { house: sarva.indexOf(Math.min(...sarva)) + 1, score: Math.min(...sarva) },
  };
}

export async function buildCompleteDashboard(
  profile: any
): Promise<FullDashboardData> {
  const bDate = new Date(profile.birthDate);
  const bYear = bDate.getUTCFullYear();
  const bMonth = bDate.getUTCMonth() + 1;
  const bDay = bDate.getUTCDate();
  const bHour = bDate.getUTCHours() + bDate.getUTCMinutes() / 60.0 + bDate.getUTCSeconds() / 3600.0;
  const bJd = swe_julday(bYear, bMonth, bDay, bHour, 1) as number;
  
  const lat = Number(profile.latitude ?? 28.6139);
  const lon = Number(profile.longitude ?? 77.2090);

  // =========================================================================
  // DYNAMIC CHART CALCULATION
  // Dynamically calculate planetary positions on the fly ensuring real-time 
  // data matches the core swisseph engine instead of relying on stale db caches
  // =========================================================================
  const calculatedData = await calculateChart(bJd, lat, lon);
  const planets = calculatedData.planets;
  const speeds = calculatedData.speeds;
  const divisional = calculatedData.divisional;

  const asc = planets.ascendant || 0;
  const moonLon = planets.moon || 0;
  const sunLon = planets.sun || 0;

  const yogas = calculateYogas(asc, planets);
  const groupedYogas = yogas.reduce((acc, yoga) => {
    if (!acc[yoga.category]) {
      acc[yoga.category] = [];
    }
    acc[yoga.category]!.push(yoga);
    return acc;
  }, {} as Record<string, YogaDetails[]>);

  // Comprehensive Panchang & Timing Calculations
  const basicPanchang = calculatePanchang(sunLon, moonLon);
  const ayanamsaVal = swe_get_ayanamsa_ut(bJd) as number;
  const ayanD = Math.floor(ayanamsaVal);
  const ayanM = Math.floor((ayanamsaVal - ayanD) * 60);

  const { sunrise, sunset } = await getSunriseSunset(bJd, lat, lon);
  const { rise: moonrise, set: moonset } = await getMoonriseMoonset(bJd, lat, lon);
  const weekday = bDate.getDay();
  
  const muhurtas = (sunrise && sunset) ? calculateMuhurtas(sunrise, sunset, weekday) : null;
  const hora = (sunrise && sunset) ? calculateActiveHora(bJd, sunrise, sunset, weekday) : "Unknown";
  const abhijit = muhurtas?.abhijit ? `${formatJdTime(muhurtas.abhijit.start)}–${formatJdTime(muhurtas.abhijit.end)}` : "N/A";
  const nakIndex = getNakshatra(moonLon);

  const fullPanchang = {
    vara: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(bDate),
    tithi: basicPanchang.tithi,
    karana: basicPanchang.karana,
    yoga: basicPanchang.yoga,
    nakshatra: NAKSHATRAS[nakIndex - 1] || "Unknown",
    pada: getPada(moonLon),
    moonSign: getRashi(moonLon).sign || "Unknown",
    ayanamsa: `Lahiri ${ayanD}°${ayanM.toString().padStart(2, '0')}'`,
    sunrise: formatJdTime(sunrise),
    sunset: formatJdTime(sunset),
    moonrise: formatJdTime(moonrise),
    moonset: formatJdTime(moonset),
    hora,
    abhijit,
  };
  
  // Dasha generation (5-level Parashara precise) and fetch running periods for today
  // Defaults to "solar", optionally controlled by user profile settings
  const dashaMode: DashaYearMode = profile?.settings?.dashaYearMode === "savana" ? "savana" : "solar";
  const fullDashaTree = calculateVimshottariDasha(moonLon, bDate, dashaMode);
  const activeDasha = getCurrentVimshottariDasha(fullDashaTree, new Date());

  return {
    overview: { native: profile, panchang: fullPanchang },
    charts: {
      D1: planets,
      D9: divisional.D9 || {},
      Moon: planets, // Will be rendered shifting Moon to Asc
      Sun: planets, // Will be rendered shifting Sun to Asc
      Transit: {}, // TODO: Fetch current transit planets
    },
    planetary: getPlanetSummary(planets, speeds),
    bhavas: buildBhavaDetailsTable(asc, planets),
    divisional,
    dasha: fullDashaTree,
    currentDasha: activeDasha,
    yogas: groupedYogas,
    doshas: calculateDoshas(asc, planets),
    ashtakavarga: calculateAshtakavarga(planets),
    sbc: { highlightedNakshatras: {} }
  };
}