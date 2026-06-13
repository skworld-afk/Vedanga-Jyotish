import { NextRequest, NextResponse } from "next/server";
import { generateChart } from "@/lib/astrology/chart";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const chart =
      generateChart(body);

    return NextResponse.json({
      success: true,
      ...chart,
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
      { status: 500 }
    );
  }
}