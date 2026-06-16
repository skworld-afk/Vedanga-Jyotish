"use client";

import { PlanetDashboardData } from "@/lib/astrology/dashboardMapper";

export default function PlanetaryTable({
planetsData,
}: {
planetsData: PlanetDashboardData[];
}) {

return ( <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">


  <div className="p-5 border-b">
    <h2 className="font-bold text-lg">
      Planetary Details
    </h2>
  </div>

  <table className="w-full">
    <thead className="bg-slate-50">
      <tr>
        <th className="p-3 text-left">
          Graha
        </th>
        <th className="p-3 text-left">
          Longitude
        </th>
        <th className="p-3 text-left">
          Rashi
        </th>
        <th className="p-3 text-left">
          Lord
        </th>
        <th className="p-3 text-left">
          House
        </th>
        <th className="p-3 text-left">
          Nakshatra
        </th>
        <th className="p-3 text-left">
          Nak Lord
        </th>
        <th className="p-3 text-left">
          Pada
        </th>
        <th className="p-3 text-left">
          Status
        </th>
      </tr>
    </thead>

    <tbody>
      {planetsData.map(
        (data: any, index) => (
          <tr
            key={index}
            className="border-t border-slate-100 even:bg-slate-50/50 hover:bg-blue-50/50 transition-colors"
          >
            <td className="p-3 font-medium capitalize flex items-center">
              {data.planet || "Unknown"}
              {data.retrograde && <span className="ml-1.5 px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold" title="Retrograde">R</span>}
              {data.combust && <span className="ml-1.5 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-bold" title="Combust">C</span>}
            </td>

            <td className="p-3">
              {data.degree}°
            </td>

            <td className="p-3">
              {data.rashi}
            </td>

            <td className="p-3">
              {data.lord}
            </td>

            <td className="p-3">
              {data.house}
            </td>

            <td className="p-3">
              {data.nakshatra}
            </td>

            <td className="p-3">
              {data.nakshatraLord}
            </td>

            <td className="p-3">
              {data.pada}
            </td>

            <td className="p-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                data.status === 'Exalted' ? 'bg-green-100 text-green-700' :
                data.status === 'Debilitated' ? 'bg-red-100 text-red-700' :
                data.status === 'Own House' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {data.status}
              </span>
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>
</div>


);
}
