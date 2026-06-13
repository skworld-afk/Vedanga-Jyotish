import koffi from "koffi";
import path from "path";

// 1. Swiss Ephemeris Constants
export const SE_SUN = 0;
export const SE_MOON = 1;
export const SE_MERCURY = 2;
export const SE_VENUS = 3;
export const SE_MARS = 4;
export const SE_JUPITER = 5;
export const SE_SATURN = 6;

const SEFLG_SWIEPH = 2;       // Use strict Swiss Ephemeris
const SEFLG_SIDEREAL = 64;    // Return sidereal positions
const SE_SIDM_LAHIRI = 1;     // Lahiri Ayanamsha for Vedic Astrology

// 2. Load the compiled DLL using your workspace paths
const dllPath = path.join(
  process.cwd(),
  "..",
  "..",
  "cpp",
  "swisseph",
  "build",
  "Release",
  "swisseph.dll"
);

const ephePath = path.join(
  process.cwd(),
  "..",
  "..",
  "cpp",
  "swisseph",
  "ephe"
);

const swe = koffi.load(dllPath);

// 3. Define the C-functions (with _Out_ parameter definitions for JS memory mapping)
export const swe_set_ephe_path = swe.func("void swe_set_ephe_path(const char *path)");
export const swe_julday = swe.func("double swe_julday(int year,int month,int day,double hour,int gregflag)");
export const swe_calc_ut = swe.func("int swe_calc_ut(double tjd_ut,int ipl,int iflag, _Out_ double *xx, _Out_ char *serr)");
export const swe_get_ayanamsa_ut = swe.func("double swe_get_ayanamsa_ut(double tjd_ut)");
export const swe_set_sid_mode = swe.func("void swe_set_sid_mode(int sid_mode,double t0,double ayan_t0)");
export const swe_houses_ex = swe.func("int swe_houses_ex(double tjd_ut,int iflag,double geolat,double geolon,int hsys, _Out_ double *cusps, _Out_ double *ascmc)");

// 4. Initialize Swiss Ephemeris
swe_set_ephe_path(ephePath);
swe_set_sid_mode(SE_SIDM_LAHIRI, 0, 0);

// 5. High-speed exported wrapper functions
export function getPlanetDegree(jd: number, planetId: number): number {
  const xx = new Float64Array(6);
  const serr = Buffer.alloc(256);
  const flag = SEFLG_SWIEPH | SEFLG_SIDEREAL;
  
  swe_calc_ut(jd, planetId, flag, xx, serr);
  return xx[0] as number; // xx[0] contains the precise Ecliptic Longitude
}

export function getAscendantDegree(jd: number, lat: number, lon: number): number {
  const cusps = new Float64Array(13);
  const ascmc = new Float64Array(10);
  
  // Calculate tropical house positions (using 0 for iflag, 'P' for Placidus)
  swe_houses_ex(jd, 0, lat, lon, 'P'.charCodeAt(0), cusps, ascmc);
  
  // ascmc[0] is the Tropical Ascendant. Subtract Ayanamsha to get the exact Sidereal Ascendant
  const ayanamsha = swe_get_ayanamsa_ut(jd);
  let siderealAscendant = (ascmc[0] as number) - ayanamsha;
  if (siderealAscendant < 0) siderealAscendant += 360.0;
  
  return siderealAscendant;
}