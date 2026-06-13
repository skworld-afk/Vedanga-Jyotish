import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  generateChart,
} from "@/lib/astrology/chart";

import {
  getAllHouses,
} from "@/lib/astrology/houses";

export const runtime =
  "nodejs";

export async function POST(
  req: NextRequest
) {
  try {
    const body =
      await req.json();

    const chart =
      generateChart(body);

    const houses =
      getAllHouses(
        chart.ascendant,
        chart.planets
      );

    return NextResponse.json({
      success: true,
      ascendant:
        chart.ascendant,
      houses,
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