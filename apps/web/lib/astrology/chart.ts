import { getAscendantDegree, getPlanetData } from "./swisseph";
import { SE_SUN, SE_MOON, SE_MERCURY, SE_VENUS, SE_MARS, SE_JUPITER, SE_SATURN, SE_TRUE_NODE } from "./constants";
import { calculateD9Longitude } from "./divisional";

export function calculateChart(julianDay: number, latitude: number, longitude: number) {
  const ascendant = getAscendantDegree(julianDay, latitude, longitude);

  const sun = getPlanetData(julianDay, SE_SUN);
  const moon = getPlanetData(julianDay, SE_MOON);
  const mercury = getPlanetData(julianDay, SE_MERCURY);
  const venus = getPlanetData(julianDay, SE_VENUS);
  const mars = getPlanetData(julianDay, SE_MARS);
  const jupiter = getPlanetData(julianDay, SE_JUPITER);
  const saturn = getPlanetData(julianDay, SE_SATURN);
  const rahu = getPlanetData(julianDay, SE_TRUE_NODE);

  const planets = {
    ascendant,
    sun: sun.longitude,
    moon: moon.longitude,
    mercury: mercury.longitude,
    venus: venus.longitude,
    mars: mars.longitude,
    jupiter: jupiter.longitude,
    saturn: saturn.longitude,
    rahu: rahu.longitude,
    ketu: (rahu.longitude + 180) % 360,
  };

  const speeds = {
    sun: sun.speed,
    moon: moon.speed,
    mercury: mercury.speed,
    venus: venus.speed,
    mars: mars.speed,
    jupiter: jupiter.speed,
    saturn: saturn.speed,
    rahu: rahu.speed,
    ketu: rahu.speed,
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

  return { planets, speeds, divisional };
}

export const generateChart = calculateChart;