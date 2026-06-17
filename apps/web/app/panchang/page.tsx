import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocationSearch } from "@/components/layout/LocationSearch";
import { Suspense } from "react";
import { 
  swe_julday, getPlanetDegree, getAscendantDegree, 
  getSunriseSunset, getMoonriseMoonset, calculatePanchang, calculateActiveHora 
} from "@/lib/astrology/index";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_ABBR = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const VEDIC_SIGNS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];
const LUNAR_MONTHS = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"];
const WEEKDAYS = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];

function formatDeg(deg: number) {
  const signDeg = deg % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  return `${d}° ${m}'`;
}

function getTzOffset(timeZone: string) {
  try {
    const date = new Date();
    const tzString = date.toLocaleString("en-US", { timeZone });
    const utcString = date.toLocaleString("en-US", { timeZone: "UTC" });
    const tzDate = new Date(tzString);
    const utcDate = new Date(utcString);
    return (tzDate.getTime() - utcDate.getTime()) / 3600000;
  } catch (e) {
    return 5.5;
  }
}

function formatJdTime(jd: number, tzOffsetHours: number = 5.5) {
  if (!jd) return "N/A";
  const gmtHours = ((jd + 0.5) % 1) * 24;
  const localHours = (gmtHours + tzOffsetHours + 48) % 24;
  let h = Math.floor(localHours);
  let m = Math.round((localHours - h) * 60);
  if (m === 60) {
    m = 0;
    h = (h + 1) % 24;
  }
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function getCurrentChoghadiya(jd: number, sunrise: number, sunset: number, weekday: number) {
  if (!sunrise || !sunset) return { name: "Unknown", start: 0, end: 0 };
  const daySeq = [
    ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],
    ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit"],
    ["Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
    ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh"],
    ["Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh"],
    ["Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal"],
    ["Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal"]
  ];
  const nightSeq = [
    ["Shubh", "Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg", "Shubh"],
    ["Chal", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Chal"],
    ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Chal", "Rog", "Kaal"],
    ["Udveg", "Shubh", "Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg"],
    ["Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"],
    ["Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Chal", "Rog"],
    ["Labh", "Udveg", "Shubh", "Amrit", "Chal", "Rog", "Kaal", "Labh"]
  ];
  if (jd >= sunrise && jd < sunset) {
    const portion = (sunset - sunrise) / 8;
    const index = Math.max(0, Math.min(7, Math.floor((jd - sunrise) / portion)));
    return {
      name: daySeq[weekday]?.[index] || "Unknown",
      start: sunrise + index * portion,
      end: sunrise + (index + 1) * portion
    };
  } else {
    let activeWeekday = weekday;
    let nightStart = sunset;
    let nightEnd = sunrise + 1;
    if (jd < sunrise) {
      activeWeekday = (weekday + 6) % 7;
      nightStart = sunset - 1;
      nightEnd = sunrise;
    }
    const portion = (nightEnd - nightStart) / 8;
    const index = Math.max(0, Math.min(7, Math.floor((jd - nightStart) / portion)));
    return {
      name: (nightSeq[activeWeekday]?.[index] || "Unknown") + " (Night)",
      start: nightStart + index * portion,
      end: nightStart + (index + 1) * portion
    };
  }
}

function getDailyTimings(sunrise: number, sunset: number, weekday: number) {
  if (!sunrise || !sunset) return null;
  const dayDuration = sunset - sunrise;
  const p8 = dayDuration / 8;
  const p15 = dayDuration / 15;
  const rahu = [7, 1, 6, 4, 5, 3, 2];
  const yama = [4, 3, 2, 1, 0, 6, 5];
  const gulika = [6, 5, 4, 3, 2, 1, 0];
  
  const rIdx = rahu[weekday] ?? 0;
  const yIdx = yama[weekday] ?? 0;
  const gIdx = gulika[weekday] ?? 0;

  return {
    rahu: { start: sunrise + rIdx * p8, end: sunrise + (rIdx + 1) * p8 },
    yama: { start: sunrise + yIdx * p8, end: sunrise + (yIdx + 1) * p8 },
    gulika: { start: sunrise + gIdx * p8, end: sunrise + (gIdx + 1) * p8 },
    abhijit: { start: sunrise + 7 * p15, end: sunrise + 8 * p15 }
  };
}

const getHousePos = (h: number) => {
  const positions = [
    { cx: 200, cy: 100, sx: 200, sy: 180 }, // 1
    { cx: 100, cy: 45,  sx: 100, sy: 80 },  // 2
    { cx: 45,  cy: 100, sx: 80,  sy: 100 }, // 3
    { cx: 100, cy: 200, sx: 180, sy: 200 }, // 4
    { cx: 45,  cy: 300, sx: 80,  sy: 300 }, // 5
    { cx: 100, cy: 355, sx: 100, sy: 320 }, // 6
    { cx: 200, cy: 300, sx: 200, sy: 220 }, // 7
    { cx: 300, cy: 355, sx: 300, sy: 320 }, // 8
    { cx: 355, cy: 300, sx: 320, sy: 300 }, // 9
    { cx: 300, cy: 200, sx: 220, sy: 200 }, // 10
    { cx: 355, cy: 100, sx: 320, sy: 100 }, // 11
    { cx: 300, cy: 45,  sx: 300, sy: 80 }   // 12
  ];
  return positions[h - 1];
};

export const dynamic = 'force-dynamic';

export default async function PanchangPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  
  const getParam = (val: string | string[] | undefined) => Array.isArray(val) ? val[0] : val;

  const now = new Date();
  const latParam = getParam(searchParams?.lat);
  const lonParam = getParam(searchParams?.lon);
  const cityParam = getParam(searchParams?.city);
  const timezoneParam = getParam(searchParams?.timezone);
  const tzoParamStr = getParam(searchParams?.tzo);

  const lat = latParam && latParam.trim() !== '' ? parseFloat(latParam) : 28.6139;
  const lon = lonParam && lonParam.trim() !== '' ? parseFloat(lonParam) : 77.2090;
  const city = cityParam?.trim() ? cityParam : "New Delhi";
  const timezone = timezoneParam?.trim() ? timezoneParam : "Asia/Kolkata";
  const tzoParam = tzoParamStr && tzoParamStr.trim() !== '' ? parseFloat(tzoParamStr) : null;
  const tzo = tzoParam !== null ? tzoParam : getTzOffset(timezone);

  let displayDate;
  let displayTime;
  let tzDate;
  try {
    displayDate = now.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    displayTime = now.toLocaleString('en-US', { timeZone: timezone, dateStyle: 'full', timeStyle: 'short' });
    tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  } catch (e) {
    displayDate = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    displayTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
    tzDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  }

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const hour = now.getUTCHours() + now.getUTCMinutes() / 60.0 + now.getUTCSeconds() / 3600.0;
  const jd = swe_julday(year, month, day, hour, 1);
  
  // Calculate JD for 00:01 AM local time today to accurately fetch today's upcoming sunrise and sunset
  const localHour = tzDate.getHours() + tzDate.getMinutes() / 60.0 + tzDate.getSeconds() / 3600.0;
  const jdStart = jd - (localHour / 24) + (0.02 / 24);

  const sun = getPlanetDegree(jd, 0);
  const moon = getPlanetDegree(jd, 1);
  const mercury = getPlanetDegree(jd, 2);
  const venus = getPlanetDegree(jd, 3);
  const mars = getPlanetDegree(jd, 4);
  const jupiter = getPlanetDegree(jd, 5);
  const saturn = getPlanetDegree(jd, 6);
  const rahu = getPlanetDegree(jd, 11);
  const ketu = (rahu + 180) % 360;
  const ascendant = getAscendantDegree(jd, lat, lon);

  const panchang = calculatePanchang(sun, moon);
  const { sunrise, sunset } = await getSunriseSunset(jdStart, lat, lon);
  const { rise: moonrise, set: moonset } = await getMoonriseMoonset(jdStart, lat, lon);
  
  const vedicWeekday = tzDate.getDay();
  
  const muhurtas = (sunrise && sunset) ? getDailyTimings(sunrise as number, sunset as number, vedicWeekday) : null;
  const currentHora = (sunrise && sunset) ? calculateActiveHora(jd, sunrise as number, sunset as number, vedicWeekday) : "Unknown";
  const currentChoghadiya = (sunrise && sunset) ? getCurrentChoghadiya(jd, sunrise as number, sunset as number, tzDate.getDay()) : { name: "Unknown", start: 0, end: 0 };

  const relativeSpeed = 12.190749;
  const diff = (moon - sun + 360) % 360;
  const tithiDegLeft = 12 - (diff % 12);
  const tithiEndJd = jd + (tithiDegLeft / relativeSpeed);

  const karanaDegLeft = 6 - (diff % 6);
  const karanaEndJd = jd + (karanaDegLeft / relativeSpeed);

  const moonSpeed = 13.176358;
  const nakshatraDegLeft = (360/27) - (moon % (360/27));
  const nakshatraEndJd = jd + (nakshatraDegLeft / moonSpeed);

  const sunMoonSpeed = 14.1613; 
  const yogaDegLeft = (360/27) - ((moon + sun) % (360/27));
  const yogaEndJd = jd + (yogaDegLeft / sunMoonSpeed);

  const paksha = diff < 180 ? "Shukla Paksha" : "Krishna Paksha";
  const nakshatraPada = Math.floor((moon % (360/27)) / (360/108)) + 1;
  const sunsignVedic = VEDIC_SIGNS[Math.floor(sun / 30)];
  const moonsignVedic = VEDIC_SIGNS[Math.floor(moon / 30)];
  const hinduMonth = LUNAR_MONTHS[(Math.floor(sun / 30) + 1) % 12];
  const weekdayName = WEEKDAYS[vedicWeekday];

  const planetsData = [
    { name: "Asc", deg: ascendant },
    { name: "Sun", deg: sun },
    { name: "Moon", deg: moon },
    { name: "Mars", deg: mars },
    { name: "Mer", deg: mercury },
    { name: "Jup", deg: jupiter },
    { name: "Ven", deg: venus },
    { name: "Sat", deg: saturn },
    { name: "Rah", deg: rahu },
    { name: "Ket", deg: ketu },
  ];

  const signMap = Array(12).fill(null).map(() => [] as string[]);
  planetsData.forEach(p => {
    const deg = typeof p.deg === 'number' && !isNaN(p.deg) ? p.deg : 0;
    const normalizedDeg = ((deg % 360) + 360) % 360;
    const safeSignIndex = Math.max(0, Math.min(11, Math.floor(normalizedDeg / 30)));
    signMap[safeSignIndex]?.push(p.name);
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 font-sans flex flex-col">
      <Header />
      
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          
          {/* Top Title & Search */}
          <div className="flex flex-col items-center justify-center text-center space-y-6 mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              Daily Panchang
            </h1>
            <p className="text-lg text-zinc-400 font-medium flex flex-wrap justify-center items-center gap-3" suppressHydrationWarning>
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {city} <span className="text-zinc-700 mx-1">•</span> {displayDate} <span className="text-zinc-700 mx-1">•</span> {displayTime}
            </p>
            <div className="w-full max-w-xl mx-auto">
              <Suspense fallback={<div className="w-full h-12 bg-zinc-900 animate-pulse rounded-2xl" />}>
                <LocationSearch />
              </Suspense>
            </div>
          </div>
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-stretch w-full">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-8">
              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 shadow-xl hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl group">
                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center text-3xl">✨</div>
                  <h2 className="text-2xl font-semibold">Panchang Elements</h2>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Tithi</span>
                    <div className="text-right">
                      <div className="font-semibold text-white">{panchang.tithi}</div>
                      <div className="text-xs text-zinc-500">Ends {formatJdTime(tithiEndJd, tzo)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Nakshatra</span>
                    <div className="text-right">
                      <div className="font-semibold text-white">{panchang.nakshatra} <span className="text-amber-400">(Pada {nakshatraPada})</span></div>
                      <div className="text-xs text-zinc-500">Ends {formatJdTime(nakshatraEndJd, tzo)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Yoga</span>
                    <div className="font-semibold text-white text-right">{panchang.yoga}</div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Karana</span>
                    <div className="font-semibold text-white">{panchang.karana}</div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Paksha</span>
                    <span className="font-semibold text-amber-400">{paksha}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-zinc-400">Weekday</span>
                    <span className="font-semibold text-white">{weekdayName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 shadow-xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-3xl">🗓️</div>
                  <h2 className="text-2xl font-semibold">Calendars</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Amanta Month", value: hinduMonth },
                    { label: "Purnimanta", value: hinduMonth },
                    { label: "Shaka Samvat", value: year - 78 },
                    { label: "Vikram Samvat", value: year + 57 },
                  ].map((item) => (
                    <div key={item.label} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-center hover:border-amber-400/30 transition-colors">
                      <div className="text-xs text-zinc-500">{item.label}</div>
                      <div className="font-semibold text-lg text-white mt-1">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-8">
              <div className="bg-zinc-900 border border-emerald-800 rounded-3xl p-8 shadow-xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl">शुभ</div>
                  <h2 className="text-2xl font-semibold">Auspicious Timings</h2>
                </div>
                <div className="space-y-6 text-center">
                  <div className="bg-emerald-950 border border-emerald-700 rounded-2xl p-6">
                    <div className="text-emerald-400 text-sm tracking-widest">ACTIVE HORA</div>
                    <div className="text-3xl font-bold text-emerald-300 mt-2">{currentHora}</div>
                  </div>
                  <div className="bg-emerald-950 border border-emerald-700 rounded-2xl p-6">
                    <div className="text-emerald-400 text-sm tracking-widest">CHOGHADIYA</div>
                    <div className="text-2xl font-bold text-emerald-300">{currentChoghadiya.name}</div>
                    <div className="text-xs text-zinc-400 mt-2">
                      {formatJdTime(currentChoghadiya.start, tzo)} — {formatJdTime(currentChoghadiya.end, tzo)}
                    </div>
                  </div>
                </div>
              </div>

              {muhurtas && (
                <div className="bg-zinc-900 border border-rose-800 rounded-3xl p-8 shadow-xl hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl">अशुभ</div>
                    <h2 className="text-2xl font-semibold">Inauspicious Timings</h2>
                  </div>
                  <div className="space-y-6 text-center">
                    <div className="bg-rose-950 border border-rose-700 rounded-2xl p-5">
                      <div className="text-rose-400">Rahu Kaal</div>
                      <div className="font-semibold text-rose-300">{formatJdTime(muhurtas.rahu.start, tzo)} - {formatJdTime(muhurtas.rahu.end, tzo)}</div>
                    </div>
                    <div className="bg-rose-950 border border-rose-700 rounded-2xl p-5">
                      <div className="text-rose-400">Yama Ganda</div>
                      <div className="font-semibold text-rose-300">{formatJdTime(muhurtas.yama.start, tzo)} - {formatJdTime(muhurtas.yama.end, tzo)}</div>
                    </div>
                    <div className="bg-rose-950 border border-rose-700 rounded-2xl p-5">
                      <div className="text-rose-400">Gulika Kaal</div>
                      <div className="font-semibold text-rose-300">{formatJdTime(muhurtas.gulika.start, tzo)} - {formatJdTime(muhurtas.gulika.end, tzo)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-zinc-900 border border-amber-800 rounded-3xl p-8 shadow-xl hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl">☀️</div>
                  <h2 className="text-2xl font-semibold">Sun & Moon</h2>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  {[
                    { label: "Sunrise", value: formatJdTime(sunrise || 0, tzo) },
                    { label: "Sunset", value: formatJdTime(sunset || 0, tzo) },
                    { label: "Moonrise", value: formatJdTime(moonrise || 0, tzo) },
                    { label: "Moonset", value: formatJdTime(moonset || 0, tzo) },
                    { label: "Sunsign", value: sunsignVedic, color: "text-amber-400" },
                    { label: "Moonsign", value: moonsignVedic },
                  ].map((item, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-2xl py-5 hover:border-amber-500/30 transition-colors">
                      <div className="text-xs text-zinc-500">{item.label}</div>
                      <div className={`font-semibold text-lg ${item.color || "text-white"}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Column 3 */}
            <div className="flex flex-col gap-8">
              <div className="bg-zinc-900 border border-purple-800 rounded-3xl p-8 shadow-xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl flex flex-col items-center">
                <div className="flex flex-col items-center gap-3 mb-8 w-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-3xl">🌌</div>
                  <h2 className="text-2xl font-semibold">Transit Chart</h2>
                </div>
                <div className="w-full max-w-[340px] aspect-square relative bg-zinc-950 border border-amber-500/30 rounded-3xl shadow-inner overflow-hidden">
                  <svg viewBox="0 0 400 400" className="w-full h-full font-sans select-none">
                    <line x1="0" y1="0" x2="400" y2="400" stroke="#ca8a04" strokeWidth="3" strokeOpacity="0.5"/>
                    <line x1="400" y1="0" x2="0" y2="400" stroke="#ca8a04" strokeWidth="3" strokeOpacity="0.5"/>
                    <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#eab308" strokeWidth="4"/>
                    
                    {Array.from({ length: 12 }, (_, i) => {
                      const h = i + 1;
                      const signIdx = (Math.floor(ascendant / 30) + i) % 12;
                      const occupants = signMap[signIdx] || [];
                      const pos = getHousePos(h);
                      if (!pos) return null;
                      return (
                        <g key={h}>
                          <text x={pos.sx} y={pos.sy} fontSize="15" fill="#facc15" textAnchor="middle" dominantBaseline="middle" fontWeight="600">
                            {signIdx + 1}
                          </text>
                          {occupants.length > 0 && (
                            <text x={pos.cx} y={pos.cy} fontSize={occupants.length > 3 ? "13" : "16"} fill="#fefce8" textAnchor="middle" dominantBaseline="middle" fontWeight="700">
                              {occupants.join(", ")}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 shadow-xl hover:border-zinc-400/50 transition-all duration-300 hover:shadow-2xl h-full">
                <div className="flex flex-col items-center gap-3 mb-8 w-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-zinc-400 to-slate-500 rounded-2xl flex items-center justify-center text-3xl">🪐</div>
                  <h2 className="text-2xl font-semibold">Planetary Positions</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-zinc-400 border-b border-zinc-800">
                        <th className="pb-4 text-left pl-2">Planet</th>
                        <th className="pb-4 text-center">Sign</th>
                        <th className="pb-4 text-right pr-2">Degree</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {planetsData.map((p) => {
                        const deg = typeof p.deg === 'number' && !isNaN(p.deg) ? p.deg : 0;
                        const normalizedDeg = ((deg % 360) + 360) % 360;
                        const safeSignIndex = Math.max(0, Math.min(11, Math.floor(normalizedDeg / 30)));
                        return (
                          <tr key={p.name} className="hover:bg-zinc-800/70 transition-colors">
                            <td className="py-4 pl-2 font-semibold text-white">{p.name}</td>
                            <td className="py-4 text-center text-zinc-300">{SIGNS[safeSignIndex]}</td>
                            <td className="py-4 text-right pr-2 text-zinc-300 tabular-nums font-mono">{formatDeg(normalizedDeg)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}