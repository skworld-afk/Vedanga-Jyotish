import React from 'react';

export default function PlanetaryDetailsPage() {
  const planets = [
    { graha: 'Sun', longitude: '25° 14\' Virgo', rashi: 'Virgo', lord: 'Mercury', house: 5, nakshatra: 'Chitra', nakLord: 'Mars', pada: 1, status: 'Combust' },
    { graha: 'Moon', longitude: '12° 04\' Taurus', rashi: 'Taurus', lord: 'Venus', house: 1, nakshatra: 'Rohini', nakLord: 'Moon', pada: 3, status: 'Exalted' },
    { graha: 'Jupiter', longitude: '08° 42\' Pisces', rashi: 'Pisces', lord: 'Jupiter', house: 11, nakshatra: 'Uttara Bhadrapada', nakLord: 'Saturn', pada: 2, status: 'Retrograde' },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Exalted': return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800">Exalted</span>;
      case 'Debilitated': return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-100 text-rose-800">Debilitated</span>;
      case 'Retrograde': return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-800">Retrograde</span>;
      case 'Combust': return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700">Combust</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Planetary Table */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Planetary Positions (Graha)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Graha</th>
                <th className="px-6 py-4">Longitude</th>
                <th className="px-6 py-4">Rashi</th>
                <th className="px-6 py-4">Lord</th>
                <th className="px-6 py-4">House</th>
                <th className="px-6 py-4">Nakshatra</th>
                <th className="px-6 py-4">Nak Lord</th>
                <th className="px-6 py-4">Pada</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {planets.map((p, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{p.graha}</td>
                  <td className="px-6 py-4">{p.longitude}</td>
                  <td className="px-6 py-4">{p.rashi}</td>
                  <td className="px-6 py-4">{p.lord}</td>
                  <td className="px-6 py-4">{p.house}</td>
                  <td className="px-6 py-4">{p.nakshatra}</td>
                  <td className="px-6 py-4">{p.nakLord}</td>
                  <td className="px-6 py-4">{p.pada}</td>
                  <td className="px-6 py-4 text-right">{getStatusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* House Table Setup Placeholder */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Bhava Sandhi (House Table)</h2>
        </div>
        <div className="p-6 text-sm text-slate-500 italic">
          House computation data mapping will be placed here.
        </div>
      </section>
    </div>
  );
}
