import { getAscendantDegree, getPlanetDegree } from "./swisseph";
import { SE_SUN, SE_MOON, SE_MERCURY, SE_VENUS, SE_MARS, SE_JUPITER, SE_SATURN, SE_TRUE_NODE } from "./constants";
import { calculateD9Longitude } from "./divisional";

export async function calculateChart(julianDay: number, latitude: number, longitude: number) {
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
    rahu: getPlanetDegree(julianDay, SE_TRUE_NODE),
    ketu: (getPlanetDegree(julianDay, SE_TRUE_NODE) + 180) % 360,
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
      rahu: calculateD9Longitude(planets.rahu),
      ketu: calculateD9Longitude(planets.ketu),
    }
  };

  return { planets, divisional };
}