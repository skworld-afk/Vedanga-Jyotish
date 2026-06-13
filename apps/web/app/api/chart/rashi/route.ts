import { NextRequest, NextResponse } from "next/server";
import { generateChart } from "@/lib/astrology/chart";
import { getRashi } from "@/lib/astrology/signs";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const chart =
      generateChart(body);

    const planets: any = {};

    for (
      const [name, longitude]
      of Object.entries(chart.planets)
    ) {
      planets[name] = getRashi(
        longitude as number
      );
    }

    return NextResponse.json({
      success: true,

      ascendant: getRashi(
        chart.ascendant
      ),

      planets,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error:
          e instanceof Error
            ? e.message
            : String(e),
      },
      {
        status: 500,
      }
    );
  }
}