"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

export function AdminView({ profiles }: { profiles: any[] }) {
  const [activeTab, setActiveTab] = useState<'users' | 'search'>('users');
  
  // Search Filters
  const [ascendantFilter, setAscendantFilter] = useState('');
  const [planetFilter, setPlanetFilter] = useState('');
  const [houseFilter, setHouseFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Complex Filter Logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      let matches = true;
      const date = new Date(profile.birthDate);
      
      if (dayFilter && date.getDate().toString() !== dayFilter) matches = false;
      if (monthFilter && (date.getMonth() + 1).toString() !== monthFilter) matches = false;
      if (yearFilter && date.getFullYear().toString() !== yearFilter) matches = false;

      if (profile.chart && profile.chart.planets) {
        const planets = profile.chart.planets;
        const ascLon = planets.ascendant;
        const ascSignIndex = Math.floor(ascLon / 30);
        const ascSign = SIGNS[ascSignIndex];

        // Filter by Ascendant
        if (ascendantFilter && ascSign !== ascendantFilter) matches = false;

        // Filter by Planet in House
        if (planetFilter && houseFilter) {
          const pLon = planets[planetFilter.toLowerCase()];
          if (pLon !== undefined) {
            const house = ((Math.floor(pLon / 30) - ascSignIndex + 12) % 12) + 1;
            if (house.toString() !== houseFilter) matches = false;
          }
        }
      } else if (ascendantFilter || (planetFilter && houseFilter)) {
        // If searching by astro but no chart exists for user
        matches = false;
      }

      return matches;
    });
  }, [profiles, ascendantFilter, planetFilter, houseFilter, dayFilter, monthFilter, yearFilter]);

  const renderTable = (data: any[]) => (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
            <th className="p-4 font-medium">Name</th>
            <th className="p-4 font-medium">Email</th>
            <th className="p-4 font-medium">Date of Birth</th>
            <th className="p-4 font-medium">Location</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.length === 0 ? (
            <tr><td colSpan={5} className="p-8 text-center text-gray-400">No profiles found.</td></tr>
          ) : (
            data.map((p, i) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{p.name}</td>
                <td className="p-4 text-gray-600">{p.user?.email || "N/A"}</td>
                <td className="p-4 text-gray-600">{new Date(p.birthDate).toLocaleDateString()} at {p.localTime}</td>
                <td className="p-4 text-gray-600">{p.placeName}</td>
                <td className="p-4 text-right">
                  <Link href={`/dashboard/${p.id}`} target="_blank" className="px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#6A330F] transition-colors inline-block text-xs font-semibold shadow-sm">
                    View Chart ↗
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#8B4513] tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and cross-reference astrological profiles securely.</p>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          <button onClick={() => setActiveTab('users')} className={`px-5 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'users' ? 'border-[#8B4513] text-[#8B4513]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            All Users List ({profiles.length})
          </button>
          <button onClick={() => setActiveTab('search')} className={`px-5 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'search' ? 'border-[#8B4513] text-[#8B4513]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Astrological Search Engine
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderTable(profiles)}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-6 rounded-xl border border-[#DEB887]/40 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-900">Find Similar Charts</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Ascendant Sign</label>
                  <select value={ascendantFilter} onChange={e => setAscendantFilter(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#8B4513]/20 outline-none">
                    <option value="">Any Ascendant</option>
                    {SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Planet in Specific House</label>
                  <div className="flex gap-2">
                    <select value={planetFilter} onChange={e => setPlanetFilter(e.target.value)} className="w-1/2 p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none">
                      <option value="">Any Planet</option>
                      {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select value={houseFilter} onChange={e => setHouseFilter(e.target.value)} disabled={!planetFilter} className="w-1/2 p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none disabled:opacity-50">
                      <option value="">House</option>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => <option key={h} value={h}>{h} House</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Birth Date Match</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="DD" value={dayFilter} onChange={e => setDayFilter(e.target.value)} className="w-1/3 p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none" min="1" max="31" />
                    <input type="number" placeholder="MM" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="w-1/3 p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none" min="1" max="12" />
                    <input type="number" placeholder="YYYY" value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="w-1/3 p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button onClick={() => {
                  setAscendantFilter(''); setPlanetFilter(''); setHouseFilter(''); setDayFilter(''); setMonthFilter(''); setYearFilter('');
                }} className="text-sm text-gray-500 hover:text-gray-800">Clear Filters</button>
              </div>
            </div>

            {/* Results */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Search Results
                <span className="bg-[#8B4513]/10 text-[#8B4513] py-0.5 px-2.5 rounded-full text-xs">{filteredProfiles.length} found</span>
              </h3>
              {renderTable(filteredProfiles)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}