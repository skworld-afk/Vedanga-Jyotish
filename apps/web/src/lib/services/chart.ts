import { 
  getAscendantDegree, 
  getPlanetDegree, 
  SE_SUN, SE_MOON, SE_MERCURY, SE_VENUS, SE_MARS, SE_JUPITER, SE_SATURN 
} from "./sweph";

function calculateD9Longitude(lon: number): number {
  const sign = Math.floor(lon / 30);
  const part = Math.floor((lon % 30) / (30 / 9));
  const element = sign % 4; // 0=Fiery, 1=Earthy, 2=Airy, 3=Watery
  const startSign = element === 0 ? 0 : element === 1 ? 9 : element === 2 ? 6 : 3;
  const d9Sign = (startSign + part) % 12;
  const remainder = (lon % 30) % (30 / 9);
  return d9Sign * 30 + remainder * 9;
}

export async function calculateChart(
  julianDay: number,
  latitude: number,
  longitude: number
) {
  const ascendant = getAscendantDegree(julianDay, latitude, longitude);

  const planets = {
    ascendant,
    sun: getPlanetDegree(julianDay, SE_SUN),
    moon: getPlanetDegree(julianDay, SE_MOON),
    mercury: getPlanetDegree(julianDay, SE_MERCURY),
    venus: getPlanetDegree(julianDay, SE_VENUS),
    mars: getPlanetDegree(julianDay, SE_MARS),
    jupiter: getPlanetDegree(julianDay, SE_JUPITER),
    saturn: getPlanetDegree(julianDay, SE_SATURN),
  };

  const divisional = {
    D9: {
      ascendant: calculateD9Longitude(planets.ascendant),
      sun: calculateD9Longitude(planets.sun),
      moon: calculateD9Longitude(planets.moon),
      mercury: calculateD9Longitude(planets.mercury),
      venus: calculateD9Longitude(planets.venus),
      mars: calculateD9Longitude(planets.mars),
      jupiter: calculateD9Longitude(planets.jupiter),
      saturn: calculateD9Longitude(planets.saturn),
    }
  };

  return {
    planets,
    divisional,
  };
}