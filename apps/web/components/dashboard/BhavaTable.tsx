"use client";

import { BhavaDashboardData } from "@/lib/astrology/dashboardMapper";

export default function BhavaTable({
bhavas,
}: {
bhavas: BhavaDashboardData[];
}) {
return ( <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">


  <div className="p-5 border-b">
    <h2 className="font-bold text-lg">
      Bhava Sandhi
    </h2>
  </div>

  <table className="w-full">
    <thead className="bg-slate-50">
      <tr>
        <th className="p-3 text-left">
          House
        </th>

        <th className="p-3 text-left">
          Start
        </th>

        <th className="p-3 text-left">
          Middle
        </th>

        <th className="p-3 text-left">
          End
        </th>

        <th className="p-3 text-left">
          Sign
        </th>

        <th className="p-3 text-left">
          Occupants
        </th>
      </tr>
    </thead>

    <tbody>
      {bhavas.map(
        (bhava) => (
          <tr
            key={bhava.bhava}
            className="border-t border-slate-100 even:bg-slate-50/50 hover:bg-purple-50/50 transition-colors"
          >
            <td className="p-3 font-semibold">
              House {bhava.bhava}
            </td>

            <td className="p-3">
              {bhava.start}°
            </td>

            <td className="p-3">
              {bhava.middle}°
            </td>

            <td className="p-3">
              {bhava.end}°
            </td>

            <td className="p-3">
              {bhava.sign}
            </td>

            <td className="p-3">
              {bhava.occupants?.join(", ") || "-"}
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>
</div>


);
}
