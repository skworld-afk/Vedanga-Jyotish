import { prisma } from "@/src/lib/prisma";
import InteractiveChartCard from "./InteractiveChartCard";
import { Vimshottari } from "./Vimshottari";
import Link from "next/link";

import {
  buildCompleteDashboard,
} from "@/lib/astrology/dashboardMapper";

const BHAVA_NAMES = [
  "Lagna",
  "Dhan Bhava",
  "Sahaj Bhava",
  "Sukha Bhava",
  "Putra Bhava",
  "Ari Bhava",
  "Kalatra Bhava",
  "Randhra Bhava",
  "Dharma Bhava",
  "Karma Bhava",
  "Labha Bhava",
  "Vyaya Bhava"
];

// Helper to extract the correct longitude regardless of key casing from the backend
const getPlanetLon = (chart: Record<string, number> | undefined, names: string[]) => {
  if (!chart) return 0;
  const key = Object.keys(chart).find(k => names.includes(k.toLowerCase()));
  return key !== undefined ? (chart[key] ?? 0) : 0;
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      chart: true,
    },
  });

  if (!profile) {
    return (
      <div className="p-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Profile not found</h2>
          <p className="text-gray-600 mt-2">The requested profile (ID: {id}) could not be found in the database.</p>
        </div>
      </div>
    );
  }

  // Get Unified Dashboard Data from Mapper
  const dashboardData = await buildCompleteDashboard(profile);
  const overview = dashboardData?.overview || {};
  const charts = dashboardData?.charts || {};
  const planetary = dashboardData?.planetary || [];
  const bhavas = dashboardData?.bhavas || [];
  const dasha = dashboardData?.dasha || [];
  const yogas = dashboardData?.yogas || {};
  const doshas = dashboardData?.doshas || [];
  const panchang = overview?.panchang || {};

  return (
    <div className="space-y-12 sm:space-y-16 p-4 sm:p-6 md:p-8 mx-auto selection:bg-indigo-500/30">
      
     {/* Native Profile */}
{/* Native Profile */}
<section id="overview" className="relative overflow-hidden border border-slate-800 bg-slate-950 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-none">
  {/* Modern High-End Radial Ambient Glows */}
  <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />
  <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

  <div className="relative z-10">
    {/* Refined Cool Header Section */}
    <div className="border-b border-slate-800/80 bg-slate-900/20 px-6 py-5 sm:px-8 flex items-center justify-between gap-4 rounded-none">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner rounded-none">
          <span className="text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">✨</span>
        </div>
        <div>
         
          <h2 className="text-2xl font-light tracking-tight text-slate-100 ">
            Birth <span className="font-semibold text-slate-400">Details</span>
          </h2>
        </div>
      </div>

      <Link
        href={`/chart/edit/${profile.id}`}
        className="text-xs font-semibold tracking-widest uppercase bg-slate-900/30 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-slate-100 transition-colors px-4 py-2"
      >
        Edit Details
      </Link>
    </div>

    {/* Modernized 2-Row Component Registry Grid */}
    <div className="p-6 sm:p-8 space-y-4 text-sm">
      
      {/* ROW 1: IDENTITY & TEMPORAL PARAMETERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Name Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none col-span-2 sm:col-span-1">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Name</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none">{profile.displayName ?? profile.birthName}</span>
        </div>

        {/* Gender Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Gender</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight capitalize truncate rounded-none">{profile.gender?.toLowerCase() || "—"}</span>
        </div>

        {/* Birth Date Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Birth Date</span>
          <span className="text-base font-medium text-slate-200 tracking-tight font-mono truncate rounded-none">{profile.birthDate?.toLocaleDateString('en-GB') || "—"}</span>
        </div>

        {/* Birth Time Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Birth Time</span>
          <span className="text-base font-medium text-slate-200 tracking-tight font-mono truncate rounded-none">{profile.birthTime || "—"}</span>
        </div>
      </div>

      {/* ROW 2: SPATIAL & GEOGRAPHIC PARAMETERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Place Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none col-span-2 sm:col-span-1">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Place</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none" title={profile.placeName || ""}>{profile.placeName || "—"}</span>
        </div>

        {/* Latitude Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Latitude</span>
          <span className="text-base font-medium text-cyan-400 tracking-tight font-mono truncate rounded-none">{profile.latitude?.toFixed(4) || "—"}</span>
        </div>

        {/* Longitude Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Longitude</span>
          <span className="text-base font-medium text-cyan-400 tracking-tight font-mono truncate rounded-none">{profile.longitude?.toFixed(4) || "—"}</span>
        </div>

        {/* Timezone Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Timezone</span>
          <span className="text-base font-medium text-slate-300 tracking-tight font-mono truncate rounded-none" title={profile.timezoneName || profile.timezoneId || ""}>{profile.timezoneName || profile.timezoneId}</span>
        </div>
      </div>

    </div>
  </div>
</section>

{/* Panchang */}
<section id="transit" className="relative overflow-hidden border border-purple-950 bg-slate-950 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-none">
  {/* Premium Ambient Deep Purple Glows */}
  <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />
  <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-fuchsia-600/5 blur-[100px] pointer-events-none" />

  <div className="relative z-10">
    {/* Refined Cool Purple Header Section */}
    <div className="border-b border-purple-900/40 bg-purple-950/10 px-6 py-5 sm:px-8 flex items-center justify-between gap-4 rounded-none">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-purple-900/40 shadow-inner rounded-none">
          <span className="text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">🌙</span>
        </div>
        <div>
          
          <h2 className="text-2xl font-light tracking-tight text-slate-100 ">
            Panchang <span className="font-semibold text-purple-400">Details</span>
          </h2>
        </div>
      </div>
    </div>

    {/* Modernized 2-Row Component Registry Grid */}
    <div className="p-6 sm:p-8 space-y-4 text-sm">
      
      {/* ROW 1: CORE LUNAR & PLANETARY SECTIONS (7 Items) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Vara Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Vara</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none">{panchang?.vara || "—"}</span>
        </div>

        {/* Tithi Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Tithi</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none">{panchang?.tithi || "—"}</span>
        </div>

        {/* Karana Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Karana</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none">{panchang?.karana || "—"}</span>
        </div>

        {/* Yoga Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Yoga</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none">{panchang?.yoga || "—"}</span>
        </div>

        {/* Nakshatra Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Nakshatra</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none">{panchang?.nakshatra || "—"}</span>
        </div>

        {/* Pada Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Pada</span>
          <span className="text-base font-medium text-purple-300 tracking-tight font-mono truncate rounded-none">{panchang?.pada || "—"}</span>
        </div>

        {/* Moon Sign Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Moon Sign</span>
          <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none">{panchang?.moonSign || "—"}</span>
        </div>
      </div>

      {/* ROW 2: SOLAR/LUNAR TIMINGS & HOROSCOPIC CONTEXT (7 Items) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Ayanamsa Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Ayanamsa</span>
          <span className="text-sm font-medium text-slate-300 tracking-tight font-mono truncate rounded-none">{panchang?.ayanamsa || "—"}</span>
        </div>

        {/* Sunrise Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Sunrise</span>
          <span className="text-base font-medium text-amber-400 tracking-tight font-mono truncate rounded-none">{panchang?.sunrise || "—"}</span>
        </div>

        {/* Sunset Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Sunset</span>
          <span className="text-base font-medium text-purple-400 tracking-tight font-mono truncate rounded-none">{panchang?.sunset || "—"}</span>
        </div>

        {/* Moonrise Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Moonrise</span>
          <span className="text-base font-medium text-slate-300 tracking-tight font-mono truncate rounded-none">{panchang?.moonrise || "—"}</span>
        </div>

        {/* Moonset Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Moonset</span>
          <span className="text-base font-medium text-slate-300 tracking-tight font-mono truncate rounded-none">{panchang?.moonset || "—"}</span>
        </div>

        {/* Hora at Birth Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Hora at Birth</span>
          <span className="text-base font-medium text-slate-300 tracking-tight font-mono truncate rounded-none">{panchang?.hora || "—"}</span>
        </div>

        {/* Abhijit Muhurta Item */}
        <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 p-4 shadow-sm relative overflow-hidden rounded-none text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Abhijit Muhurta</span>
          <span className="text-base font-medium text-slate-300 tracking-tight font-mono truncate rounded-none">{panchang?.abhijit || "—"}</span>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Section C — Main Charts (3 Columns x 2 Rows) */}
      {/* Birth Charts */}
<section id="charts" className="relative overflow-hidden border border-slate-800 bg-slate-950 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-none">
  {/* High-End Cosmic Sky-Blue Ambient Glows */}
  <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-500/5 blur-[120px] pointer-events-none" />
  <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

  <div className="relative z-10">
    {/* Refined Cool Sky-Blue Header Section */}
    <div className="border-b border-slate-800/80 bg-slate-900/20 px-6 py-5 sm:px-8 flex items-center justify-between gap-4 rounded-none">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner rounded-none">
          <span className="text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">🌌</span>
        </div>
        <div>
          
          <h2 className="text-2xl font-light tracking-tight text-slate-100 ">
            Birth <span className="font-semibold text-sky-400">Charts</span>
          </h2>
        </div>
      </div>
      <Link
        href={`/dashboard/${profile.id}/divisional`}
        className="text-xs font-semibold tracking-widest uppercase bg-sky-900/30 text-sky-300 border border-sky-700/80 hover:bg-sky-800 hover:text-sky-100 transition-colors px-4 py-2"
      >
        Show All Divisional Charts
      </Link>
    </div>

    {/* Elegant Harmonic Card Interface Grid */}
    <div className="p-6 sm:p-8 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Chart 1: D1 Rashi */}
        <div className="group relative transition-all duration-300 border border-slate-800/80 bg-slate-900/10 hover:border-sky-500/30 p-1 rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <InteractiveChartCard 
            title="D1 Rashi" 
            planets={charts?.D1 || {}} 
            ascLon={getPlanetLon(charts?.D1, ['ascendant', 'asc', 'lagna'])} 
          />
        </div>

        {/* Chart 2: D9 Navamsa */}
        <div className="group relative transition-all duration-300 border border-slate-800/80 bg-slate-900/10 hover:border-sky-500/30 p-1 rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <InteractiveChartCard 
            title="D9 Navamsa" 
            planets={charts?.D9 || {}} 
            ascLon={getPlanetLon(charts?.D9, ['ascendant', 'asc', 'lagna'])} 
          />
        </div>

        {/* Chart 3: Moon Chart */}
        <div className="group relative transition-all duration-300 border border-slate-800/80 bg-slate-900/10 hover:border-sky-500/30 p-1 rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <InteractiveChartCard 
            title="Moon Chart" 
            planets={charts?.Moon || {}} 
            ascLon={getPlanetLon(charts?.Moon, ['moon', 'mo'])} 
          />
        </div>

        {/* Chart 4: Bhava Chalit */}
        <div className="group relative transition-all duration-300 border border-slate-800/80 bg-slate-900/10 hover:border-sky-500/30 p-1 rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <InteractiveChartCard 
            title="Bhava Chalit" 
            planets={charts?.Chalit || charts?.D1 || {}} 
            ascLon={getPlanetLon(charts?.Chalit || charts?.D1, ['ascendant', 'asc', 'lagna'])} 
          />
        </div>

        {/* Chart 5: Transit Chart */}
        <div className="group relative transition-all duration-300 border border-slate-800/80 bg-slate-900/10 hover:border-sky-500/30 p-1 rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <InteractiveChartCard 
            title="Transit Chart" 
            planets={charts?.Transit && Object.keys(charts.Transit).length > 0 ? charts.Transit : charts?.D1 || {}} 
            ascLon={getPlanetLon(charts?.Transit && Object.keys(charts.Transit).length > 0 ? charts.Transit : charts?.D1, ['ascendant', 'asc', 'lagna'])} 
          />
        </div>

        {/* Chart 6: Sun Chart */}
        <div className="group relative transition-all duration-300 border border-slate-800/80 bg-slate-900/10 hover:border-sky-500/30 p-1 rounded-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <InteractiveChartCard 
            title="Sun Chart" 
            planets={charts?.Sun || {}} 
            ascLon={getPlanetLon(charts?.Sun, ['sun', 'su'])} 
          />
        </div>

      </div>
    </div>
  </div>
</section>


      {/* Planetary Details Table */}
      {/* Planetary Details */}
<section id="planetary" className="relative overflow-hidden border border-slate-800 bg-slate-950 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-none">
  {/* Modern Cosmic Blue Ambient Glows */}
  <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />
  <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />

  <div className="relative z-10">
    {/* Refined Cool Blue Header Section */}
    <div className="border-b border-slate-800/80 bg-slate-900/20 px-6 py-5 sm:px-8 flex items-center justify-between gap-4 rounded-none">
      <div className="flex items-center gap-4">
        {/* Stylish Cosmic Grid Crosshair Icon Box instead of generic planet emoji */}
        <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner rounded-none text-blue-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="7" strokeWidth="1.5" strokeLinecap="square" />
            <circle cx="12" cy="12" r="3" strokeWidth="1" strokeLinecap="square" opacity="0.6" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </div>
        <div>
          
          <h2 className="text-2xl font-light tracking-tight text-slate-100 ">
            Planetary <span className="font-semibold text-blue-400">Details</span>
          </h2>
        </div>
      </div>
    </div>

    {/* Table Interface Viewport wrapper */}
    <div className="p-6 sm:p-8">
      <div className="overflow-x-auto custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[700px] rounded-none">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
              <th className="py-4 px-5 tracking-widest rounded-none">Planet</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Sign</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Degree</th>
              <th className="py-4 px-5 tracking-widest rounded-none">House</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Nakshatra</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Pada</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 text-sm">
            {/* Ascendant Row */}
            <tr className="border-b border-slate-900 bg-slate-950/40 hover:bg-slate-900/30 transition-all duration-200 group rounded-none">
              <td className="py-4 px-5 font-semibold capitalize flex items-center gap-2.5 rounded-none relative">
                <div className="absolute left-0 w-[2px] h-3/5 top-1/5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="w-1.5 h-1.5 rounded-none bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></span>
                <span className="tracking-tight text-slate-100">Ascendant</span>
              </td>
              <td className="py-4 px-5 text-orange-300 font-medium tracking-wide rounded-none">{bhavas[0]?.sign || "—"}</td>
              <td className="py-4 px-5 font-mono text-[13px] text-cyan-400 font-semibold rounded-none">{(getPlanetLon(charts?.D1, ['ascendant', 'asc', 'lagna']) % 30).toFixed(2)}°</td>
              <td className="py-4 px-5 font-mono text-[13px] text-yellow-400 font-bold rounded-none">1</td>
              <td className="py-4 px-5 text-slate-300 rounded-none">
                <span className="text-slate-500">—</span>
              </td>
              <td className="py-4 px-5 font-mono text-[13px] text-slate-500 rounded-none">—</td>
              <td className="py-4 px-5 rounded-none">
                <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold rounded-none bg-slate-900 border border-slate-800 text-slate-400">
                  Lagna
                </span>
              </td>
            </tr>
            {planetary.map((p, i) => {
              const planetColors: Record<string, string> = {
                sun: "text-amber-400",
                moon: "text-sky-400",
                mars: "text-rose-400",
                mercury: "text-teal-400",
                jupiter: "text-yellow-400",
                venus: "text-pink-400",
                saturn: "text-indigo-400",
                rahu: "text-emerald-400",
                ketu: "text-purple-400",
              };
              const currentPlanetColor = planetColors[p.planet?.toLowerCase()] || "text-slate-100";

              return (
                <tr 
                  key={i} 
                  className="border-b border-slate-900 bg-slate-950/40 hover:bg-slate-900/30 transition-all duration-200 group rounded-none"
                >
                  {/* Planet Identifier Column */}
                  <td className="py-4 px-5 font-semibold capitalize flex items-center gap-2.5 rounded-none relative">
                    <div className="absolute left-0 w-[2px] h-3/5 top-1/5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <span className={`w-1.5 h-1.5 rounded-none ${p.retrograde ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></span>
                    <span className={`tracking-tight ${currentPlanetColor}`}>{p.planet}</span>
                    
                    {p.retrograde && (
                      <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 ml-1 rounded-none" title="Retrograde">
                        R
                      </span>
                    )}
                    {p.combust && (
                      <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-500/10 border border-rose-500/20 px-1 py-0.5 ml-1 rounded-none" title="Combust">
                        C
                      </span>
                    )}
                  </td>
                  
                  {/* Sign/Rashi Column */}
                  <td className="py-4 px-5 text-orange-300 font-medium tracking-wide rounded-none">{p.rashi}</td>
                  
                  {/* Degree Column */}
                  <td className="py-4 px-5 font-mono text-[13px] text-cyan-400 font-semibold rounded-none">{p.degree}°</td>
                  
                  {/* House Column */}
                  <td className="py-4 px-5 font-mono text-[13px] text-yellow-400 font-bold rounded-none">{p.house}</td>
                  
                  {/* Nakshatra & Lord Column */}
                  <td className="py-4 px-5 text-slate-300 rounded-none">
                    <span className="text-slate-200">{p.nakshatra}</span>{" "}
                    <span className="text-blue-400 text-xs font-semibold ml-1">
                      ({p.nakshatraLord})
                    </span>
                  </td>
                  
                  {/* Pada Column */}
                  <td className="py-4 px-5 font-mono text-[13px] text-slate-300 rounded-none">{p.pada}</td>
                  
                  {/* Status Badge Column */}
                  <td className="py-4 px-5 rounded-none">
                    <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold rounded-none ${
                      p.status === 'Exalted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      p.status === 'Debilitated' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                      p.status === 'Own House' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>


      {/* Bhava (House) Details Table */}
      {/* Bhava Details */}
<section id="bhava" className="relative overflow-hidden border border-slate-800 bg-slate-950 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-none">
  {/* Modern Cosmic Teal & Emerald Ambient Glows */}
  <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-600/5 blur-[100px] pointer-events-none" />
  <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />

  <div className="relative z-10">
    {/* Refined Cool Teal Header Section */}
    <div className="border-b border-slate-800/80 bg-slate-900/20 px-6 py-5 sm:px-8 flex items-center justify-between gap-4 rounded-none">
      <div className="flex items-center gap-4">
        {/* Technical Coordinate House Crosshair Icon Box instead of house emoji */}
        <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner rounded-none text-teal-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M3 12h18M12 3v18" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-light tracking-tight text-slate-100 ">
            Bhava <span className="font-semibold text-teal-400">Details</span>
          </h2>
        </div>
      </div>
    </div>

    {/* Table Interface Viewport wrapper */}
    <div className="p-6 sm:p-8">
      <div className="overflow-x-auto custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[700px] rounded-none">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
              <th className="py-4 px-5 tracking-widest rounded-none">Bhava</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Sign</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Start</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Middle</th>
              <th className="py-4 px-5 tracking-widest rounded-none">End</th>
              <th className="py-4 px-5 tracking-widest rounded-none">Occupants</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 text-sm">
            {bhavas.map((b, i) => (
              <tr 
                key={i} 
                className="border-b border-slate-900 bg-slate-950/40 hover:bg-slate-900/30 transition-all duration-300 group rounded-none"
              >
                {/* Bhava Name Column */}
                <td className="py-4 px-5 font-semibold text-slate-200 rounded-none relative flex items-center">
                  {/* Premium Sidebar Accent Indicator Strip */}
                  <div className="absolute left-0 w-[2px] h-3/5 top-1/5 bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="tracking-tight text-slate-100 transition-colors duration-300 group-hover:text-white">
                    {BHAVA_NAMES[b.bhava - 1]}
                  </span>
                </td>
                
                {/* Sign Column - Subtle Amber Hover Glow */}
                <td className="py-4 px-5 text-orange-300 font-medium tracking-wide rounded-none transition-all duration-300 group-hover:text-orange-200 group-hover:drop-shadow-[0_0_6px_rgba(253,186,116,0.4)]">
                  {b.sign}
                </td>
                
                {/* Start Degree Column */}
                <td className="py-4 px-5 font-mono text-[13px] text-slate-400 rounded-none">
                  {b.start}°
                </td>
                
                {/* Middle Cusp Degree Column - Intense Cyan Hover Glow */}
                <td className="py-4 px-5 font-mono text-[13px] font-bold text-cyan-400 rounded-none transition-all duration-300 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                  {b.middle}°
                </td>
                
                {/* End Degree Column */}
                <td className="py-4 px-5 font-mono text-[13px] text-slate-400 rounded-none">
                  {b.end}°
                </td>
                
                {/* Occupants Column - Emerald Badge Outer Hover Glow */}
                <td className="py-4 px-5 font-mono text-[13px] font-bold rounded-none">
                  {b.occupants.length > 0 ? (
                    <div className="flex gap-1.5">
                      {b.occupants.map((occ, idx) => (
                        <span 
                          key={idx} 
                          className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 uppercase tracking-wide text-xs transition-all duration-300 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]"
                        >
                          {occ}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-600 font-normal tracking-wide transition-colors duration-300 group-hover:text-slate-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>



      {/* Dasha Section */}
      <div id="dasha">
        <Vimshottari dasha={dasha} />
      </div>

      {/* Yogas & Doshas Summary */}
      {/* Yogas & Doshas Summary */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
  {/* Yogas Card */}
  <section id="yoga" className="relative overflow-hidden bg-slate-950 border border-slate-800 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col h-full rounded-none">
    {/* Premium Ambient Deep Gold & Emerald Glows */}
    <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
    <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

    <div className="relative z-10 flex flex-col h-full rounded-none">
      {/* Refined Cool Emerald Header Section */}
      <div className="border-b border-slate-800/80 bg-slate-900/20 px-6 py-5 sm:px-8 flex items-center justify-between gap-4 rounded-none">
        <div className="flex items-center gap-4">
          {/* Technical Data Constellation Cluster Icon Box */}
          <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner rounded-none text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.5 5.5L20 10l-4.5 4.5L17 22l-5-4-5 4 1.5-7.5L3 10l5.5-2.5z" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
              <circle cx="12" cy="11" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="h-1 w-1 bg-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                Harmonic Alignment Combinations
              </span>
            </div>
            <h2 className="text-2xl font-light tracking-tight text-slate-100 uppercase">
              Auspicious <span className="font-semibold text-emerald-400">Yogas</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Content Feed Container */}
      <div className="p-6 sm:p-8 space-y-6 flex-grow rounded-none">
        <div className="space-y-6">
          {Object.entries(yogas || {}).length > 0 ? (
            Object.entries(yogas || {}).map(([category, yogaList]) => (
              <div key={category} className="space-y-3">
                {/* Category Structural Sub-Header Header */}
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-amber-400/90 uppercase tracking-[0.2em] text-[10px]">{category}</h3>
                  <div className="h-[1px] bg-slate-800 flex-grow opacity-60" />
                </div>
                
                <ul className="space-y-3">
                  {yogaList.map((yoga, i) => (
                    <li 
                      key={i} 
                      className="text-sm border border-slate-900 bg-slate-900/20 hover:border-emerald-500/30 transition-all duration-300 p-4 sm:p-5 relative overflow-hidden group rounded-none"
                    >
                      {/* Top Edge Accent Strip Active Highlight Rule */}
                      {yoga.isPresent && (
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}

                      <div className="flex justify-between items-center relative z-10">
                        {/* Yoga Component Name Identifier */}
                        <span className={`text-base font-semibold tracking-tight ${yoga.isPresent ? 'text-slate-100' : 'text-slate-500 line-through decoration-slate-800'}`}>
                          {yoga.name}
                        </span>
                        
                        {/* Active Status Badge Module */}
                        <span className={`text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold border rounded-none ${
                          yoga.isPresent 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}>
                          {yoga.isPresent ? `Active (${yoga.strength}%)` : 'Inactive'}
                        </span>
                      </div>

                      {/* Description Block Element */}
                      {yoga.isPresent && yoga.description && (
                        <p className="text-emerald-300/70 text-xs mt-3 leading-relaxed font-normal tracking-wide max-w-3xl border-t border-slate-900 pt-2.5">
                          {yoga.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-500/60 p-4 border border-slate-900 bg-slate-900/10 rounded-none">
              No Yogas calculated.
            </p>
          )}
        </div>
      </div>
    </div>
  </section>

  {/* Doshas Card */}
  <section id="dosha" className="relative overflow-hidden bg-slate-950 border border-slate-800 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col h-full rounded-none">
    {/* Modern High-End Deep Scarlet Ambient Glows */}
    <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-rose-600/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />
    <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

    <div className="relative z-10 flex flex-col h-full rounded-none">
      {/* Refined Cool Rose Header Section */}
      <div className="border-b border-slate-800/80 bg-slate-900/20 px-6 py-5 sm:px-8 flex items-center justify-between gap-4 rounded-none">
        <div className="flex items-center gap-4">
          {/* Technical Alert Telemetry Hazard Icon Box */}
          <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner rounded-none text-rose-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="h-1 w-1 bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-500">
                Malignant Structural Afflictions
              </span>
            </div>
            <h2 className="text-2xl font-light tracking-tight text-slate-100 uppercase">
              Challenging <span className="font-semibold text-rose-500">Doshas</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Content Feed Grid Layout */}
      <div className="p-6 sm:p-8 md:p-10 space-y-4 flex-grow rounded-none">
        <div className="space-y-4">
          {(doshas || []).map((dosha, i) => (
            <div 
              key={i} 
              className={`group flex flex-col p-4 sm:p-5 border transition-all duration-300 relative overflow-hidden rounded-none shadow-sm ${
                dosha.isPresent 
                  ? 'bg-slate-900/40 border-rose-900/40 hover:border-rose-500/40' 
                  : 'bg-slate-900/10 border-slate-900 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Top-Edge Alert Strip Layer for Active Afflictions */}
              {dosha.isPresent && (
                <div className="absolute top-0 left-0 w-full h-[1px] bg-rose-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              <div className="flex justify-between items-center mb-2 relative z-10">
                {/* Dosha Metric Name */}
                <span className={`text-base font-semibold tracking-tight ${dosha.isPresent ? 'text-slate-100' : 'text-slate-500 line-through decoration-slate-800'}`}>
                  {dosha.name}
                </span>
                
                {/* Dynamic Warning Level Status Badge */}
                <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border rounded-none ${
                  dosha.isPresent
                    ? dosha.strength === 'High' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.1)]' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {dosha.isPresent ? `${dosha.strength} Impact` : 'No Dosha'}
                </span>
              </div>

              {/* Affected Coordinates Block */}
              {dosha.isPresent && dosha.affectedHouses.length > 0 && (
                <div className="text-xs text-rose-300/90 mt-3 bg-slate-950/80 p-3 rounded-none border border-rose-950 relative z-10 flex items-center justify-between gap-4">
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-rose-500/40" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 pl-1">
                    Affected Houses
                  </span>
                  <span className="font-mono font-bold text-rose-400 tracking-wider">
                    {dosha.affectedHouses.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>

</div>


      {/* Advanced Charts & Reports Placeholders (To satisfy remaining sidebar links) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section id="ashtakavarga" className="relative overflow-hidden bg-black rounded-3xl border border-fuchsia-900/30 shadow-sm text-center flex flex-col items-center justify-center min-h-[200px] hover:border-fuchsia-700/50 transition-colors group p-8">
          <div className="text-3xl mb-4 p-4 bg-fuchsia-950/30 rounded-2xl border border-fuchsia-900/30 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-500/40 transition-colors shadow-[0_0_15px_rgba(217,70,239,0.1)]">📈</div>
          <h3 className="font-serif font-semibold text-xl tracking-wide text-fuchsia-200">Ashtakavarga</h3>
          <p className="text-xs text-fuchsia-500/70 mt-2 font-medium tracking-wide uppercase">Coming Soon</p>
        </section>
        <section id="sarvatobhadra" className="relative overflow-hidden bg-black rounded-3xl border border-violet-900/30 shadow-sm text-center flex flex-col items-center justify-center min-h-[200px] hover:border-violet-700/50 transition-colors group p-8">
          <div className="text-3xl mb-4 p-4 bg-violet-950/30 rounded-2xl border border-violet-900/30 group-hover:bg-violet-500/20 group-hover:border-violet-500/40 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.1)]">🕉️</div>
          <h3 className="font-serif font-semibold text-xl tracking-wide text-violet-200">Sarvatobhadra</h3>
          <p className="text-xs text-violet-500/70 mt-2 font-medium tracking-wide uppercase">Coming Soon</p>
        </section>
        <section id="reports" className="relative overflow-hidden bg-black rounded-3xl border border-amber-900/30 shadow-sm text-center flex flex-col items-center justify-center min-h-[200px] hover:border-amber-700/50 transition-colors group p-8">
          <div className="text-3xl mb-4 p-4 bg-amber-950/30 rounded-2xl border border-amber-900/30 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.1)]">📄</div>
          <h3 className="font-serif font-semibold text-xl tracking-wide text-amber-200">Reports</h3>
          <p className="text-xs text-amber-500/70 mt-2 font-medium tracking-wide uppercase">Coming Soon</p>
        </section>
      </div>

    </div>
  );
}