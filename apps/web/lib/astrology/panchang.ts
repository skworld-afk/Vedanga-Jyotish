import { getTithi } from "./tithi";
import { getYoga } from "./yoga";
import { getKarana } from "./karana";
import { getNakshatra, getPada } from "./nakshatra";

export function generatePanchang(planets: { sun: number; moon: number }) {
  return {
    tithi: getTithi(planets.moon, planets.sun),
    
    nakshatra: getNakshatra(planets.moon),
    pada: getPada(planets.moon),
    
    yoga: getYoga(planets.moon, planets.sun),
    
    karana: getKarana(planets.moon, planets.sun),
  };
}