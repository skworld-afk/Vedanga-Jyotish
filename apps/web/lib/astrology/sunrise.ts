import { swe_rise_trans } from "./swisseph";

export function getSunriseSunset(jd: number, lat: number, lon: number) {
  // Koffi securely handles Float64Arrays and passes them directly as double* pointers
  const geopos = new Float64Array([lon, lat, 0]);
  const tretRise = new Float64Array(1);
  const tretSet = new Float64Array(1);
  const serr = Buffer.alloc(256);

  // 0 = SE_SUN, 2 = SEFLG_SWIEPH, 1 = SE_CALC_RISE
  swe_rise_trans(jd, 0, "", 2, 1, geopos, 0, 0, tretRise, serr);
  
  // 2 = SE_CALC_SET
  swe_rise_trans(jd, 0, "", 2, 2, geopos, 0, 0, tretSet, serr);

  const sunrise = tretRise[0] || null;
  const sunset = tretSet[0] || null;

  return {
    sunrise,
    sunset,
  };
}