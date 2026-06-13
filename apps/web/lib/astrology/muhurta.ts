// Mathematical Day Segment Divisions
export function calculateMuhurtas(sunriseJd: number, sunsetJd: number, weekday: number) {
  const dayLength = sunsetJd - sunriseJd;
  const segment = dayLength / 8; // 8 equal parts of the day

  // Index alignments: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  const rahuSegments = [7, 1, 6, 4, 5, 3, 2];
  const yamaSegments = [4, 3, 2, 1, 0, 6, 5];
  const gulikaSegments = [6, 5, 4, 3, 2, 1, 0];

  const rahuStart = sunriseJd + (rahuSegments[weekday] ?? 0) * segment;
  const yamaStart = sunriseJd + (yamaSegments[weekday] ?? 0) * segment;
  const gulikaStart = sunriseJd + (gulikaSegments[weekday] ?? 0) * segment;

  // Abhijit is the 8th muhurta of exactly 15 day divisions
  const muhurta15 = dayLength / 15;
  const abhijitStart = sunriseJd + 7 * muhurta15;
  const abhijitEnd = abhijitStart + muhurta15;

  return {
    rahu: { start: rahuStart, end: rahuStart + segment },
    yama: { start: yamaStart, end: yamaStart + segment },
    gulika: { start: gulikaStart, end: gulikaStart + segment },
    abhijit: { start: abhijitStart, end: abhijitEnd }
  };
}

// Determine active planetary periods based on exact Birth Time
export function calculateActiveHora(jd: number, sunriseJd: number, sunsetJd: number, weekday: number) {
  const HORA_SEQUENCE = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
  
  let elapsedHoras = 0;
  let effectiveWeekday = weekday;

  if (jd >= sunriseJd && jd <= sunsetJd) {
    // Born during the day
    const horaDuration = (sunsetJd - sunriseJd) / 12;
    elapsedHoras = Math.floor((jd - sunriseJd) / horaDuration);
  } else if (jd > sunsetJd) {
    // Born after sunset (Night time of the same day)
    const nightDuration = (sunriseJd + 1 - sunsetJd) / 12;
    elapsedHoras = 12 + Math.floor((jd - sunsetJd) / nightDuration);
  } else {
    // Born before sunrise (Night time of the previous day)
    effectiveWeekday = (weekday + 6) % 7;
    const prevSunsetJd = sunsetJd - 1; // Approx previous day's sunset
    const nightDuration = (sunriseJd - prevSunsetJd) / 12;
    elapsedHoras = 12 + Math.floor((jd - prevSunsetJd) / nightDuration);
  }

  if (elapsedHoras < 0) elapsedHoras = 0;
  if (elapsedHoras > 23) elapsedHoras = 23;

  const startIndices = [0, 3, 6, 2, 5, 1, 4]; // Sunday=0, Monday=1, ...
  const startIndex = startIndices[effectiveWeekday] ?? 0;
  
  const currentHoraIndex = (startIndex + elapsedHoras) % 7;
  return HORA_SEQUENCE[currentHoraIndex] || "Unknown";
}