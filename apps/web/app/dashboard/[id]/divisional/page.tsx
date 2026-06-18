import { prisma } from "@/src/lib/prisma";
import InteractiveChartCard from "../InteractiveChartCard";
import Link from "next/link";
import { buildCompleteDashboard } from "@/lib/astrology/dashboardMapper";

// Helper to extract the correct longitude regardless of key casing
const getPlanetLon = (chart: Record<string, number> | undefined, names: string[]) => {
  if (!chart) return 0;
  const key = Object.keys(chart).find(k => names.includes(k.toLowerCase()));
  return key !== undefined ? chart[key] : 0;
};

export default async function DivisionalChartsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id },
  });

  if (!profile) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-600">Profile not found</h2>
      </div>
    );
  }

  const dashboardData = await buildCompleteDashboard(profile);
  const charts = dashboardData?.charts?.AllDivisional || {};

  const divisionalOrder = [
    { key: "D1", name: "Rashi (D1) - Main" },
    { key: "D2", name: "Hora (D2) - Wealth" },
    { key: "D3", name: "Drekkana (D3) - Siblings" },
    { key: "D4", name: "Chaturthamsha (D4) - Property" },
    { key: "D7", name: "Saptamsha (D7) - Children" },
    { key: "D9", name: "Navamsha (D9) - Marriage & Destiny" },
    { key: "D10", name: "Dashamsha (D10) - Career" },
    { key: "D12", name: "Dwadashamsha (D12) - Parents" },
    { key: "D16", name: "Shodashamsha (D16) - Vehicles/Happiness" },
    { key: "D20", name: "Vimshamsha (D20) - Spiritual" },
    { key: "D24", name: "Chaturvimshamsha (D24) - Education" },
    { key: "D27", name: "Bhamsha (D27) - Strengths & Weaknesses" },
    { key: "D30", name: "Trimshamsha (D30) - Misfortunes" },
    { key: "D40", name: "Khavedamsha (D40) - Auspicious Events" },
    { key: "D45", name: "Akshavedamsha (D45) - Character/Morals" },
    { key: "D60", name: "Shashtiamsha (D60) - Past Karma / General" },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 p-4 sm:p-6 md:p-8 mx-auto selection:bg-indigo-500/30">
      <Link href={`/dashboard/${id}`} className="inline-block text-sky-400 hover:text-sky-300 text-sm font-semibold transition-colors mb-4">
        &larr; Back to Main Dashboard
      </Link>
      
      {/* Native Profile Header */}
      <section className="relative overflow-hidden border border-slate-800 bg-slate-950 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-none">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
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
          </div>

          <div className="p-6 sm:p-8 space-y-4 text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 p-4 shadow-sm relative overflow-hidden rounded-none col-span-2 sm:col-span-1">
                <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Name</span>
                <span className="text-base font-semibold text-slate-100 tracking-tight truncate rounded-none">{profile.displayName ?? profile.birthName}</span>
              </div>
              <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 p-4 shadow-sm relative overflow-hidden rounded-none">
                <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Gender</span>
                <span className="text-base font-semibold text-slate-100 tracking-tight capitalize truncate rounded-none">{profile.gender?.toLowerCase() || "—"}</span>
              </div>
              <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 p-4 shadow-sm relative overflow-hidden rounded-none">
                <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Birth Date</span>
                <span className="text-base font-medium text-slate-200 tracking-tight font-mono truncate rounded-none">{profile.birthDate?.toLocaleDateString('en-GB') || "—"}</span>
              </div>
              <div className="group flex flex-col bg-slate-900/30 border border-slate-800/80 p-4 shadow-sm relative overflow-hidden rounded-none">
                <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1.5">Birth Time</span>
                <span className="text-base font-medium text-slate-200 tracking-tight font-mono truncate rounded-none">{profile.birthTime || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisional Charts Grid */}
      <section className="relative overflow-hidden border border-slate-800 bg-slate-950 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-none">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="border-b border-slate-800/80 bg-slate-900/20 px-6 py-5 sm:px-8 flex items-center justify-between gap-4 rounded-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner rounded-none">
                <span className="text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">🔮</span>
              </div>
              <h2 className="text-2xl font-light tracking-tight text-slate-100 ">
                Shodashavarga <span className="font-semibold text-violet-400">Charts</span>
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {divisionalOrder.map((div) => {
                const divData = charts[div.key];
                if (!divData) return null;
                return (
                  <div key={div.key} className="group relative transition-all duration-300 border border-slate-800/80 bg-slate-900/10 hover:border-violet-500/30 p-1 rounded-none">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <InteractiveChartCard 
                      title={div.name} 
                      planets={divData} 
                      ascLon={getPlanetLon(divData, ['ascendant', 'asc', 'lagna'])} 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}