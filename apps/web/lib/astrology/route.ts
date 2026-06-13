import { NextRequest, NextResponse } from "next/server";
import { calculateChart } from "@/lib/astrology/chart";
import { generatePanchang } from "@/lib/astrology/panchang";
import { calculateJulianDay } from "@/src/lib/services/julian";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Generate Julian Day, then pass to chart calculator
    const jd = calculateJulianDay(body.birthDate, body.birthTime, body.utcOffset || 0);
    const chart = await calculateChart(jd, Number(body.lat) || 0, Number(body.lon) || 0);

    // Pass pure SwissEph generated planets into your new Panchang engine
    const panchang = generatePanchang(chart.planets);

    return NextResponse.json({
      success: true,
      panchang,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}