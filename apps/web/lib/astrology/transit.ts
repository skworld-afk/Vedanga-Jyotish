import { swe_rise_trans } from "./swisseph";
import { SE_SUN, SE_MOON, SEFLG_SWIEPH } from "./constants";

export const SE_CALC_RISE = 1;
export const SE_CALC_SET = 2;

export async function getSunriseSunset(
  jd_ut: number, 
  lat: number, 
  lng: number
): Promise<{ sunrise: number | null; sunset: number | null }> {
  // Geopos expects an array of [longitude, latitude, height]
  const geopos = new Float64Array([lng, lat, 0]);
  const tretRise = new Float64Array(1);
  const serrRise = Buffer.alloc(256);
  
  const riseFlag = swe_rise_trans(
    jd_ut, SE_SUN, "", SEFLG_SWIEPH, SE_CALC_RISE, geopos, 0, 0, tretRise, serrRise
  );
  
  const tretSet = new Float64Array(1);
  const serrSet = Buffer.alloc(256);
  
  const setFlag = swe_rise_trans(
    jd_ut, SE_SUN, "", SEFLG_SWIEPH, SE_CALC_SET, geopos, 0, 0, tretSet, serrSet
  );

  return {
    // tret[0] contains the Julian Date of the transit time 
    sunrise: riseFlag >= 0 ? (tretRise[0] ?? null) : null,
    sunset: setFlag >= 0 ? (tretSet[0] ?? null) : null
  };
}

export async function getMoonriseMoonset(
  jd_ut: number, 
  lat: number, 
  lng: number
): Promise<{ rise: number | null; set: number | null }> {
  const geopos = new Float64Array([lng, lat, 0]);
  const tretRise = new Float64Array(1);
  const serrRise = Buffer.alloc(256);
  
  const riseFlag = swe_rise_trans(
    jd_ut, SE_MOON, "", SEFLG_SWIEPH, SE_CALC_RISE, geopos, 0, 0, tretRise, serrRise
  );
  
  const tretSet = new Float64Array(1);
  const serrSet = Buffer.alloc(256);
  
  const setFlag = swe_rise_trans(
    jd_ut, SE_MOON, "", SEFLG_SWIEPH, SE_CALC_SET, geopos, 0, 0, tretSet, serrSet
  );

  return {
    rise: riseFlag >= 0 ? (tretRise[0] ?? null) : null,
    set: setFlag >= 0 ? (tretSet[0] ?? null) : null
  };
}