import { getAscendantDegree, getPlanetData } from "./swisseph";
import { SE_SUN, SE_MOON, SE_MERCURY, SE_VENUS, SE_MARS, SE_JUPITER, SE_SATURN, SE_TRUE_NODE } from "./constants";
import { getDivisionalLongitude } from "./divisional";

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
      ascendant: getDivisionalLongitude(planets.ascendant, 9),
      sun: getDivisionalLongitude(planets.sun, 9),
      moon: getDivisionalLongitude(planets.moon, 9),
      mercury: getDivisionalLongitude(planets.mercury, 9),
      venus: getDivisionalLongitude(planets.venus, 9),
      mars: getDivisionalLongitude(planets.mars, 9),
      jupiter: getDivisionalLongitude(planets.jupiter, 9),
      saturn: getDivisionalLongitude(planets.saturn, 9),
      rahu: getDivisionalLongitude(planets.rahu, 9),
      ketu: getDivisionalLongitude(planets.ketu, 9),
    }
  };

  return { planets, speeds, divisional };
}

export const generateChart = calculateChart;