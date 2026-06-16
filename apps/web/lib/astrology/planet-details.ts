import { getRashi } from "./signs";
import { getHouse } from "./houses";
import { getNakshatra, getPada, NAKSHATRAS } from "./nakshatra";

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

export function buildPlanetData(
  longitude:number,
  ascendant:number
){
  const rashi = getRashi(longitude);
  const nakIndex = getNakshatra(longitude);

  return {
     longitude,
     sign: rashi.sign,
     signLord: SIGN_LORDS[rashi.index] || "Unknown",
     house: getHouse(ascendant, longitude),
     nakshatra: NAKSHATRAS[nakIndex - 1] || "Unknown",
     nakshatraLord: NAKSHATRA_LORDS[(nakIndex - 1) % 9] || "Unknown",
     pada: getPada(longitude)
  };
}