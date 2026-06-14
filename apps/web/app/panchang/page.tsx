import Link from "next/link";
import { Header } from "../../lib/astrology/Header";
import { Footer } from "../../lib/astrology/Footer";
import { swe_julday, getPlanetDegree, getAscendantDegree } from "../../lib/astrology/swisseph";
import { getSunriseSunset } from "../../lib/astrology/sunrise";
import { calculatePanchang } from "../../lib/astrology/nakshatra";
import { calculateMuhurtas, calculateActiveHora } from "../../lib/astrology/muhurta";

// Force dynamic rendering so it always shows the *exact* current time on load
export const dynamic = 'force-dynamic';

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_ABBR = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

function formatDeg(deg: number) {
  const signDeg = deg % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  return `${d}° ${m}'`;
}

function formatJdTime(jd: number) {
  if (!jd) return "N/A";
  // Convert Julian Day fraction to Indian Standard Time (+5:30)
  const gmtHours = ((jd + 0.5) % 1) * 24;
  const istHours = (gmtHours + 5.5 + 24) % 24;
  const h = Math.floor(istHours);
  const m = Math.floor((istHours - h) * 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default async function PanchangPage() {
  const now = new Date();
  // Standard Vedic Default (New Delhi)
  const lat = 28.6139;
  const lon = 77.2090;

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
  const { sunrise, sunset } = getSunriseSunset(jd, lat, lon);
  const weekday = now.getDay();
  
  const muhurtas = (sunrise && sunset) ? calculateMuhurtas(sunrise, sunset, weekday) : null;
  const currentHora = (sunrise && sunset) ? calculateActiveHora(jd, sunrise, sunset, weekday) : "Unknown";

  // 4. Map for Chart & Details
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

  const Cell = ({ signIndex }: { signIndex: number }) => (
    <div className="border border-[#8B4513] p-1.5 min-h-[5rem] text-[11px] font-semibold flex flex-col items-center justify-start overflow-hidden bg-white hover:bg-orange-50 transition-colors">
      <span className="text-[#DEB887] text-[10px] uppercase mb-1">{SIGN_ABBR[signIndex]}</span>
      <span className="text-[#5D4037] text-center leading-tight">{signMap[signIndex]?.join(", ")}</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-serif selection:bg-[#DEB887]/30 flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12 space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-[#8B4513] tracking-tight">Today's Panchang & Live Transit</h1>
          <p className="text-lg text-[#5D4037]/80 font-medium" suppressHydrationWarning>
            {now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} • New Delhi
          </p>
        </div>
        
        {/* Panchang & Muhurtas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#DEB887]/40">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-5 border-b border-[#DEB887]/40 pb-3 flex items-center gap-2"><span className="text-xl">🌙</span> Core Elements</h2>
            <ul className="space-y-4 text-lg">
              <li className="flex justify-between items-center"><strong className="text-gray-500 text-sm uppercase">Tithi</strong> <span className="font-semibold">{panchang.tithi}</span></li>
              <li className="flex justify-between items-center"><strong className="text-gray-500 text-sm uppercase">Nakshatra</strong> <span className="font-semibold">{panchang.nakshatra}</span></li>
              <li className="flex justify-between items-center"><strong className="text-gray-500 text-sm uppercase">Yoga</strong> <span className="font-semibold">{panchang.yoga}</span></li>
              <li className="flex justify-between items-center"><strong className="text-gray-500 text-sm uppercase">Karana</strong> <span className="font-semibold">{panchang.karana}</span></li>
            </ul>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#DEB887]/40">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-5 border-b border-[#DEB887]/40 pb-3 flex items-center gap-2"><span className="text-xl">⏳</span> Time / Choghadiya Attributes</h2>
            <ul className="space-y-4 text-lg">
              <li className="flex justify-between items-center"><strong className="text-gray-500 text-sm uppercase">Sunrise / Sunset</strong> <span className="font-semibold">{formatJdTime(sunrise || 0)} / {formatJdTime(sunset || 0)}</span></li>
              <li className="flex justify-between items-center"><strong className="text-gray-500 text-sm uppercase">Active Hora</strong> <span className="font-bold text-[#8B4513] px-3 py-0.5 bg-[#8B4513]/10 rounded">{currentHora}</span></li>
              {muhurtas && (
                <>
                  <li className="flex justify-between items-center"><strong className="text-red-800/60 text-sm uppercase">Rahu Kaal</strong> <span className="font-semibold text-red-900">{formatJdTime(muhurtas.rahu.start)} - {formatJdTime(muhurtas.rahu.end)}</span></li>
                  <li className="flex justify-between items-center"><strong className="text-gray-500 text-sm uppercase">Abhijit Muhurta</strong> <span className="font-semibold text-green-700">{formatJdTime(muhurtas.abhijit.start)} - {formatJdTime(muhurtas.abhijit.end)}</span></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Transit Chart & Planetary Details Table */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#DEB887]/40">
          <h2 className="text-2xl font-bold text-[#8B4513] mb-8 border-b border-[#DEB887]/40 pb-3 flex items-center gap-2"><span className="text-xl">🪐</span> Current Celestial Snapshot</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="grid grid-cols-4 grid-rows-4 w-full aspect-square max-w-[340px] mx-auto gap-0 bg-[#FDFBF7] border-2 border-[#8B4513] shadow-inner">
              <Cell signIndex={11} /><Cell signIndex={0} /><Cell signIndex={1} /><Cell signIndex={2} />
              <Cell signIndex={10} /><div className="col-span-2 row-span-2 flex flex-col items-center justify-center font-black text-[#8B4513] text-2xl opacity-15"><span>LIVE</span><span>TRANSIT</span></div><Cell signIndex={3} />
              <Cell signIndex={9} /><Cell signIndex={4} />
              <Cell signIndex={8} /><Cell signIndex={7} /><Cell signIndex={6} /><Cell signIndex={5} />
            </div>
            <div className="overflow-x-auto self-center">
              <table className="w-full text-left text-sm md:text-base border-collapse">
                <thead><tr className="text-gray-500 border-b border-gray-200"><th className="py-3 uppercase font-semibold text-xs tracking-wider">Planet</th><th className="py-3 uppercase font-semibold text-xs tracking-wider">Sign</th><th className="py-3 uppercase font-semibold text-xs tracking-wider">Degree</th></tr></thead>
                <tbody>{planetsData.map((p) => {
                  const deg = typeof p.deg === 'number' && !isNaN(p.deg) ? p.deg : 0;
                  const normalizedDeg = ((deg % 360) + 360) % 360;
                  const safeSignIndex = Math.max(0, Math.min(11, Math.floor(normalizedDeg / 30)));
                  return (<tr key={p.name} className="border-b border-gray-100 last:border-0 hover:bg-[#DEB887]/10 transition-colors"><td className="py-3 font-bold text-[#8B4513]">{p.name}</td><td className="py-3 text-gray-700">{SIGNS[safeSignIndex]}</td><td className="py-3 text-gray-700">{formatDeg(normalizedDeg)}</td></tr>)
                })}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}