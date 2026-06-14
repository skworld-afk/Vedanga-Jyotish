import koffi from "koffi";
import path from "path";
import os from "os";

const platform = os.platform();
const binDir = path.join(process.cwd(), "bin");

let libPath = "";
if (platform === "win32") {
  libPath = path.join(binDir, "swisseph.dll");
} else if (platform === "linux") {
  libPath = path.join(binDir, "libswe.so");
} else if (platform === "darwin") {
  libPath = path.join(binDir, "libswe.dylib");
} else {
  throw new Error(`Unsupported platform: ${platform}`);
}

const ephePath = path.join(
  process.cwd(),
  "bin"
);

const swe = koffi.load(libPath);

export const swe_set_ephe_path = swe.func(
  "void swe_set_ephe_path(const char *path)"
);

export const swe_julday = swe.func(
  "double swe_julday(int year,int month,int day,double hour,int gregflag)"
);

export const swe_calc_ut = swe.func(
  "int swe_calc_ut(double tjd_ut,int ipl,int iflag, _Out_ double *xx, _Out_ char *serr)"
);

export const swe_get_ayanamsa_ut = swe.func(
  "double swe_get_ayanamsa_ut(double tjd_ut)"
);

export const swe_set_sid_mode = swe.func(
  "void swe_set_sid_mode(int sid_mode,double t0,double ayan_t0)"
);

export const swe_houses_ex = swe.func(
  "int swe_houses_ex(double tjd_ut,int iflag,double geolat,double geolon,int hsys, _Out_ double *cusps, _Out_ double *ascmc)"
);

export const swe_rise_trans = swe.func(
  "int swe_rise_trans(double tjd_ut, int ipl, const char *starname, int epheflag, int rsmi, double *geopos, double atpress, double attemp, _Out_ double *tret, _Out_ char *serr)"
);

swe_set_ephe_path(ephePath);

const SEFLG_SWIEPH = 2;
const SEFLG_SIDEREAL = 64;
const SE_SIDM_LAHIRI = 1;

swe_set_sid_mode(SE_SIDM_LAHIRI, 0, 0);

export function getPlanetDegree(jd: number, planetId: number): number {
  const xx = new Float64Array(6);
  const serr = Buffer.alloc(256);
  const flag = SEFLG_SWIEPH | SEFLG_SIDEREAL;
  
  swe_calc_ut(jd, planetId, flag, xx, serr);
  return xx[0] as number;
}

export function getAscendantDegree(jd: number, lat: number, lon: number): number {
  const cusps = new Float64Array(13);
  const ascmc = new Float64Array(10);
  swe_houses_ex(jd, 0, lat, lon, 'P'.charCodeAt(0), cusps, ascmc);
  const ayanamsha = swe_get_ayanamsa_ut(jd);
  let siderealAscendant = (ascmc[0] as number) - ayanamsha;
  if (siderealAscendant < 0) siderealAscendant += 360.0;
  return siderealAscendant;
}

export function getHouseCusps(jd: number, lat: number, lon: number): number[] {
  const cusps = new Float64Array(13);
  const ascmc = new Float64Array(10);
  // 'O' computes Porphyry houses which dictate standard Sripathi mappings
  swe_houses_ex(jd, 0, lat, lon, 'O'.charCodeAt(0), cusps, ascmc); 
  const ayanamsha = swe_get_ayanamsa_ut(jd);
  const siderealCusps = [];
  for(let i=1; i<=12; i++) {
     let val = (cusps[i] as number) - ayanamsha;
     if (val < 0) val += 360.0;
     siderealCusps.push(val);
  }
  return siderealCusps;
}