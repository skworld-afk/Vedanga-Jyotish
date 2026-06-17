import koffi from "koffi";
import path from "path";
import os from "os";
import { SEFLG_SIDEREAL, SEFLG_SPEED, SIDM_LAHIRI } from "./constants";

const SEFLG_SWIEPH = 2;

let initialized = false;
let _swe_set_ephe_path: any;
let _swe_julday: any;
let _swe_calc_ut: any;
let _swe_get_ayanamsa_ut: any;
let _swe_set_sid_mode: any;
let _swe_houses_ex: any;
let _swe_rise_trans: any;

export function initSwe() {
  if (initialized) return;

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

  const ephePath = path.join(process.cwd(), "bin");

  try {
    const swe = koffi.load(libPath);

    _swe_set_ephe_path = swe.func("void swe_set_ephe_path(const char *path)");
    _swe_julday = swe.func("double swe_julday(int year,int month,int day,double hour,int gregflag)");
    _swe_calc_ut = swe.func("int swe_calc_ut(double tjd_ut,int ipl,int iflag, _Out_ double *xx, _Out_ char *serr)");
    _swe_get_ayanamsa_ut = swe.func("double swe_get_ayanamsa_ut(double tjd_ut)");
    _swe_set_sid_mode = swe.func("void swe_set_sid_mode(int sid_mode,double t0,double ayan_t0)");
    _swe_houses_ex = swe.func("int swe_houses_ex(double tjd_ut,int iflag,double geolat,double geolon,int hsys, _Out_ double *cusps, _Out_ double *ascmc)");
    _swe_rise_trans = swe.func("int swe_rise_trans(double tjd_ut, int ipl, const char *starname, int epheflag, int rsmi, double *geopos, double atpress, double attemp, _Out_ double *tret, _Out_ char *serr)");

    _swe_set_ephe_path(ephePath);
    _swe_set_sid_mode(SIDM_LAHIRI, 0, 0);
    
    initialized = true;
  } catch (err) {
    console.error("Failed to initialize Swiss Ephemeris (koffi):", err);
  }
}

export function swe_set_ephe_path(pathStr: string) {
  initSwe();
  if (_swe_set_ephe_path) return _swe_set_ephe_path(pathStr);
}

export function swe_julday(year: number, month: number, day: number, hour: number, gregflag: number): number {
  initSwe();
  if (_swe_julday) return _swe_julday(year, month, day, hour, gregflag);
  return 0;
}

export function swe_calc_ut(tjd_ut: number, ipl: number, iflag: number, xx: Float64Array, serr: Buffer): number {
  initSwe();
  if (_swe_calc_ut) return _swe_calc_ut(tjd_ut, ipl, iflag, xx, serr);
  return -1;
}

export function swe_get_ayanamsa_ut(tjd_ut: number): number {
  initSwe();
  if (_swe_get_ayanamsa_ut) return _swe_get_ayanamsa_ut(tjd_ut);
  return 0;
}

export function swe_set_sid_mode(sid_mode: number, t0: number, ayan_t0: number) {
  initSwe();
  if (_swe_set_sid_mode) return _swe_set_sid_mode(sid_mode, t0, ayan_t0);
}

export function swe_houses_ex(tjd_ut: number, iflag: number, geolat: number, geolon: number, hsys: number, cusps: Float64Array, ascmc: Float64Array): number {
  initSwe();
  if (_swe_houses_ex) return _swe_houses_ex(tjd_ut, iflag, geolat, geolon, hsys, cusps, ascmc);
  return -1;
}

export function swe_rise_trans(tjd_ut: number, ipl: number, starname: string, epheflag: number, rsmi: number, geopos: Float64Array, atpress: number, attemp: number, tret: Float64Array, serr: Buffer): number {
  initSwe();
  if (_swe_rise_trans) return _swe_rise_trans(tjd_ut, ipl, starname, epheflag, rsmi, geopos, atpress, attemp, tret, serr);
  return -1;
}

export function getPlanetDegree(jd: number, planetId: number): number {
  initSwe();
  const xx = new Float64Array(6);
  const serr = Buffer.alloc(256);
  const flag = SEFLG_SWIEPH | SEFLG_SIDEREAL;
  
  swe_calc_ut(jd, planetId, flag, xx, serr);
  return xx[0] as number;
}

export function getPlanetData(jd: number, planetId: number): { longitude: number; speed: number } {
  initSwe();
  const xx = new Float64Array(6);
  const serr = Buffer.alloc(256);
  const flag = SEFLG_SWIEPH | SEFLG_SIDEREAL | SEFLG_SPEED;
  
  swe_calc_ut(jd, planetId, flag, xx, serr);
  return { longitude: xx[0] as number, speed: xx[3] as number };
}

export function getAscendantDegree(jd: number, lat: number, lon: number): number {
  initSwe();
  const cusps = new Float64Array(13);
  const ascmc = new Float64Array(10);
  const flags = SEFLG_SWIEPH | SEFLG_SIDEREAL;
  swe_houses_ex(jd, flags, lat, lon, 'P'.charCodeAt(0), cusps, ascmc);
  return ascmc[0] as number;
}

export function getHouseCusps(jd: number, lat: number, lon: number): number[] {
  initSwe();
  const cusps = new Float64Array(13);
  const ascmc = new Float64Array(10);
  const flags = SEFLG_SWIEPH | SEFLG_SIDEREAL;
  // 'O' computes Porphyry houses which dictate standard Sripathi mappings
  swe_houses_ex(jd, flags, lat, lon, 'O'.charCodeAt(0), cusps, ascmc); 
  // The cusps array is 1-indexed, and we want all 12 cusps.
  return Array.from(cusps.slice(1, 13));
}