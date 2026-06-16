import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocationSearch } from "@/components/layout/LocationSearch";
import { Suspense } from "react";
import { 
  swe_julday, getPlanetDegree, getAscendantDegree, 
  getSunriseSunset, getMoonriseMoonset, calculatePanchang, calculateMuhurtas, calculateActiveHora 
} from "@/lib/astrology/index";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_ABBR = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const VEDIC_SIGNS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];
const LUNAR_MONTHS = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"];
const WEEKDAYS = ["Raviwara", "Somawara", "Mangalawara", "Budhawara", "Guruwara", "Shukrawara", "Shaniwara"];

function formatDeg(deg: number) {
  const signDeg = deg % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  return `${d}° ${m}'`;
}

function formatJdTime(jd: number, tzOffsetHours: number = 5.5) {
  if (!jd) return "N/A";
  const gmtHours = ((jd + 0.5) % 1) * 24;
  const localHours = (gmtHours + tzOffsetHours + 24) % 24;
  const h = Math.floor(localHours);
  const m = Math.floor((localHours - h) * 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function getCurrentChoghadiya(jd: number, sunrise: number, sunset: number, weekday: number): string {
  if (!sunrise || !sunset) return "Unknown";
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
    return daySeq[weekday]?.[index] || "Unknown";
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
    return nightSeq[activeWeekday]?.[index] + " (Night)" || "Unknown";
  }
}

const getHousePos = (h: number) => {
  const positions = [
    { cx: 200, cy: 95,  sx: 200, sy: 162 }, // 1
    { cx: 105, cy: 45,  sx: 145, sy: 80 },  // 2
    { cx: 45,  cy: 105, sx: 85,  sy: 145 }, // 3
    { cx: 110, cy: 200, sx: 165, sy: 200 }, // 4
    { cx: 45,  cy: 295, sx: 85,  sy: 255 }, // 5
    { cx: 105, cy: 355, sx: 145, sy: 320 }, // 6
    { cx: 200, cy: 305, sx: 200, sy: 238 }, // 7
    { cx: 295, cy: 355, sx: 255, sy: 320 }, // 8
    { cx: 355, cy: 295, sx: 315, sy: 255 }, // 9
    { cx: 290, cy: 200, sx: 235, sy: 200 }, // 10
    { cx: 355, cy: 105, sx: 315, sy: 145 }, // 11
    { cx: 295, cy: 45,  sx: 255, sy: 80 }   // 12
  ];
  return positions[h - 1];
};

// Force dynamic rendering so it always shows the *exact* current time on load
export const dynamic = 'force-dynamic';

export default async function PanchangPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const now = new Date();
  const lat = searchParams?.lat ? parseFloat(searchParams.lat) : 28.6139;
  const lon = searchParams?.lon ? parseFloat(searchParams.lon) : 77.2090;
  const city = searchParams?.city || "New Delhi";
  const tzo = searchParams?.tzo ? parseFloat(searchParams.tzo) : 5.5;
  const timezone = searchParams?.timezone || "Asia/Kolkata";

  let displayDate;
  let displayTime;
  try {
    displayDate = now.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    displayTime = now.toLocaleString('en-US', { timeZone: timezone, dateStyle: 'full', timeStyle: 'short' });
  } catch (e) {
    displayDate = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    displayTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
  }

  // 1. Calculate Exact Julian Day for Right Now
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const hour = now.getUTCHours() + now.getUTCMinutes() / 60.0 + now.getUTCSeconds() / 3600.0;
  const jd = swe_julday(year, month, day, hour, 1);

  // 2. Fetch Planet Degrees (Swiss Eph IDs: Sun=0, Moon=1, Mer=2, Ven=3, Mar=4, Jup=5, Sat=6, True Node=11)
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

  // 3. Compute Panchang & Timing
  const panchang = calculatePanchang(sun, moon);
  const { sunrise, sunset } = await getSunriseSunset(jd, lat, lon);
  const { rise: moonrise, set: moonset } = await getMoonriseMoonset(jd, lat, lon);
  
  let vedicWeekday = now.getDay();
  if (sunrise && jd < sunrise) {
    vedicWeekday = (vedicWeekday + 6) % 7;
  }
  
  const muhurtas = (sunrise && sunset) ? calculateMuhurtas(sunrise, sunset, vedicWeekday) : null;
  const currentHora = (sunrise && sunset) ? calculateActiveHora(jd, sunrise, sunset, vedicWeekday) : "Unknown";
  const currentChoghadiya = (sunrise && sunset) ? getCurrentChoghadiya(jd, sunrise, sunset, now.getDay()) : "Unknown";

  // 4. Extended Panchang Elements
  const diff = (moon - sun + 360) % 360;
  const paksha = diff < 180 ? "Shukla Paksha" : "Krishna Paksha";
  const nakshatraPada = Math.floor((moon % (360/27)) / (360/108)) + 1;
  const sunsignVedic = VEDIC_SIGNS[Math.floor(sun / 30)];
  const moonsignVedic = VEDIC_SIGNS[Math.floor(moon / 30)];
  const hinduMonth = LUNAR_MONTHS[(Math.floor(sun / 30) + 1) % 12];
  const weekdayName = WEEKDAYS[vedicWeekday];
  const pravishte = day; // Using standard day as proxy for solar day entry

  // 5. Map for Chart & Details
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
    <main className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-serif selection:bg-[#DEB887]/30 flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="text-center space-y-4 w-full">
          <h1 className="text-3xl md:text-5xl font-black text-[#8B4513] tracking-tight">Today&apos;s Panchang</h1>
          <p className="text-lg text-[#5D4037]/80 font-medium" suppressHydrationWarning>
            {displayTime}
          </p>
          
          <Suspense fallback={<div className="w-full max-w-sm mx-auto h-12 mt-4 bg-[#DEB887]/20 animate-pulse rounded-xl"></div>}>
            <LocationSearch />
          </Suspense>
        </div>
        
        {/* Comprehensive Panchang Details */}
        <div className="w-full bg-white p-6 md:p-8 rounded-3xl shadow-md border border-[#DEB887]/40 mt-8 text-left">
          <div className="border-b border-[#DEB887]/30 pb-4 mb-6 text-center space-y-1">
            <h2 className="text-2xl font-black text-[#8B4513] flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-[#DEB887]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {city}
            </h2>
            <p className="text-lg text-gray-600 font-medium" suppressHydrationWarning>
              {displayDate}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-[15px] text-[#5D4037]">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Sunrise:</span> <span className="font-medium text-[#8B4513]">{formatJdTime(sunrise || 0, tzo)}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Sunset:</span> <span className="font-medium text-[#8B4513]">{formatJdTime(sunset || 0, tzo)}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Tithi:</span> <span>{panchang.tithi}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Nakshatra:</span> <span>{panchang.nakshatra} (Pada {nakshatraPada})</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Yoga:</span> <span>{panchang.yoga}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Karana:</span> <span>{panchang.karana}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Paksha:</span> <span>{paksha}</span></div>
              <div className="flex justify-between pb-1"><span className="font-semibold">Weekday:</span> <span>{weekdayName}</span></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Amanta Month:</span> <span>{hinduMonth}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Purnimanta Month:</span> <span>{hinduMonth}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Moonsign:</span> <span>{moonsignVedic}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Sunsign:</span> <span>{sunsignVedic}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Pravishte/Gate:</span> <span>{pravishte}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Shaka Samvat:</span> <span>{year - 78}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Vikram Samvat:</span> <span>{year + 57}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span className="font-semibold">Gujarati Samvat:</span> <span>{year + 56}</span></div>
              <div className="flex justify-between pb-1"><span className="font-semibold text-red-700">Rahu Kaal:</span> <span className="text-red-700">{muhurtas ? `${formatJdTime(muhurtas.rahu.start, tzo)} - ${formatJdTime(muhurtas.rahu.end, tzo)}` : 'N/A'}</span></div>
            </div>
          </div>
        </div>

        {/* Detailed Slider / Accordion */}
        <div className="w-full mt-8">
          <details open className="w-full bg-white rounded-2xl shadow-sm border border-[#DEB887]/40 overflow-hidden group">
            <summary className="text-lg font-bold text-[#8B4513] p-5 md:p-6 bg-[#FDFBF7] flex justify-between items-center cursor-pointer list-none outline-none hover:bg-orange-50 transition-colors">
              <span className="flex items-center gap-2"><span className="text-2xl">📜</span> Advanced Timings &amp; Transit</span>
              <span className="text-[#DEB887] group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            
            <div className="p-6 md:p-8 space-y-12 border-t border-[#DEB887]/40">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#8B4513] mb-4 border-b border-[#DEB887]/30 pb-2">Daily Timings</h3>
                  <div className="space-y-3 text-sm font-medium text-gray-700">
                    <div className="flex justify-between p-2 bg-[#FDFBF7] rounded"><span>Sunrise - Sunset</span> <span className="font-bold text-[#8B4513]">{formatJdTime(sunrise || 0, tzo)} - {formatJdTime(sunset || 0, tzo)}</span></div>
                    <div className="flex justify-between p-2 rounded"><span>Moonrise - Moonset</span> <span className="font-bold text-[#8B4513]">{formatJdTime(moonrise || 0, tzo)} - {formatJdTime(moonset || 0, tzo)}</span></div>
                    <div className="flex justify-between p-2 bg-[#FDFBF7] rounded"><span>Active Hora</span> <span className="font-bold text-[#8B4513]">{currentHora}</span></div>
                    <div className="flex justify-between p-2 rounded"><span>Choghadiya</span> <span className="font-bold text-[#8B4513]">{currentChoghadiya}</span></div>
                  </div>
                </div>

                {muhurtas && (
                  <div>
                    <h3 className="text-xl font-bold text-[#8B4513] mb-4 border-b border-[#DEB887]/30 pb-2">Important Muhurtas</h3>
                    <div className="space-y-3 text-sm font-medium">
                      <div className="flex justify-between p-2 bg-red-50 text-red-900 rounded border border-red-100"><span>Rahu Kaal</span> <span className="font-bold">{formatJdTime(muhurtas.rahu.start, tzo)} - {formatJdTime(muhurtas.rahu.end, tzo)}</span></div>
                      <div className="flex justify-between p-2 bg-orange-50 text-orange-900 rounded border border-orange-100"><span>Yama Ganda</span> <span className="font-bold">{formatJdTime(muhurtas.yama.start, tzo)} - {formatJdTime(muhurtas.yama.end, tzo)}</span></div>
                      <div className="flex justify-between p-2 bg-yellow-50 text-yellow-900 rounded border border-yellow-100"><span>Gulika Kaal</span> <span className="font-bold">{formatJdTime(muhurtas.gulika.start, tzo)} - {formatJdTime(muhurtas.gulika.end, tzo)}</span></div>
                      <div className="flex justify-between p-2 bg-green-50 text-green-900 rounded border border-green-100"><span>Abhijit Muhurta</span> <span className="font-bold">{formatJdTime(muhurtas.abhijit.start, tzo)} - {formatJdTime(muhurtas.abhijit.end, tzo)}</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-6 border-b border-[#DEB887]/30 pb-2 text-center">Celestial Snapshot</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="w-full max-w-[300px] mx-auto bg-[#FDFBF7] border-2 border-[#8B4513] shadow-inner aspect-square relative">
                    <svg viewBox="0 0 400 400" className="w-full h-full font-serif select-none">
                      <line x1="0" y1="0" x2="400" y2="400" stroke="#8B4513" strokeWidth="2" opacity="0.6" />
                      <line x1="400" y1="0" x2="0" y2="400" stroke="#8B4513" strokeWidth="2" opacity="0.6" />
                      <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#8B4513" strokeWidth="2" opacity="0.8" />
                      {Array.from({ length: 12 }, (_, i) => {
                        const h = i + 1;
                        const signIdx = (Math.floor(ascendant / 30) + i) % 12;
                        const occupants = signMap[signIdx] || [];
                        const pos = getHousePos(h);
                        if (!pos) return null;
                        return (
                          <g key={h}>
                            <text x={pos.sx} y={pos.sy} fontSize="14" fill="#DEB887" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
                              {signIdx + 1}
                            </text>
                            {occupants.length > 0 && (
                              <text x={pos.cx} y={pos.cy} fontSize={occupants.length > 3 ? "12" : "15"} fill="#5D4037" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
                                {occupants.join(", ")}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center font-black text-[#8B4513] text-xl opacity-15 pointer-events-none">
                      <span>LIVE</span>
                      <span>TRANSIT</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto self-center">
                    <table className="w-full text-center text-sm border-collapse">
                      <thead><tr className="text-gray-500 border-b border-gray-200"><th className="py-2 uppercase font-bold text-xs tracking-wider">Planet</th><th className="py-2 uppercase font-bold text-xs tracking-wider">Sign</th><th className="py-2 uppercase font-bold text-xs tracking-wider">Degree</th></tr></thead>
                      <tbody>{planetsData.map((p) => {
                        const deg = typeof p.deg === 'number' && !isNaN(p.deg) ? p.deg : 0;
                        const normalizedDeg = ((deg % 360) + 360) % 360;
                        const safeSignIndex = Math.max(0, Math.min(11, Math.floor(normalizedDeg / 30)));
                        return (<tr key={p.name} className="border-b border-gray-100 last:border-0 hover:bg-[#DEB887]/10 transition-colors"><td className="py-2 font-bold text-[#8B4513]">{p.name}</td><td className="py-2 text-gray-700 font-medium">{SIGNS[safeSignIndex]}</td><td className="py-2 text-gray-700 tabular-nums">{formatDeg(normalizedDeg)}</td></tr>)
                      })}</tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </details>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}