import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  generateChart,
} from "@/lib/astrology/chart";

import {
  buildDivisionalChart,
} from "@/lib/astrology/divisional";

export const runtime =
  "nodejs";

export async function POST(
  req: NextRequest
) {
  const body =
    await req.json();

  const chart =
    generateChart(body);

  return NextResponse.json({
    success: true,
    chart:
      buildDivisionalChart(
        {
          ascendant:
            chart.ascendant,
          ...chart.planets,
        },
        10
      ),
  });
}