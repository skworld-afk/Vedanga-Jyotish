import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

import { CreateChartSchema } from "@repo/validation";

import { geocodePlace } from "@/src/lib/services/geocode";
import { getHistoricalTimezone } from "@/src/lib/services/timezone";
import { calculateJulianDay } from "@/src/lib/services/julian";
import { calculateChart } from "@/lib/astrology/chart";

export async function POST(request: Request) {
  try {
    console.log("=== CHART CREATE START ===");

    const body = await request.json();

    const parsed =
      CreateChartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      name,
      birthDate,
      birthTime,
      placeName,
    } = parsed.data;

    // Geocode place
    const geo =
      await geocodePlace(placeName);

    console.log("Geo:", geo);

    // Timezone lookup
    const timezone =
      await getHistoricalTimezone(
        geo.latitude,
        geo.longitude
      );

    console.log(
      "Timezone:",
      timezone
    );

    // Julian Day
    const julianDay =
      calculateJulianDay(
        birthDate,
        birthTime,
        timezone.utcOffset
      );

    console.log(
      "Julian Day:",
      julianDay
    );

    // Astrology Calculation
    const chartData =
      await calculateChart(
        julianDay,
        geo.latitude,
        geo.longitude
      );

    console.log(
      "Chart Calculated"
    );

    // Create demo user
    const user =
      await prisma.user.upsert({
        where: {
          email:
            "demo@astrosaas.com",
        },

        update: {},

        create: {
          email:
            "demo@astrosaas.com",
        },
      });

    // Save profile
    const profile =
      await prisma.profile.create({
        data: {
          userId: user.id,

          name,

          placeName,

          birthDate:
            new Date(birthDate),

          localTime:
            birthTime,

          latitude:
            geo.latitude,

          longitude:
            geo.longitude,

          utcOffset:
            timezone.utcOffset,

          julianDay,
        },
      });

    // Save chart
    const chart =
      await prisma.chart.create({
        data: {
          profileId:
            profile.id,

          planets:
            chartData.planets,

          divisional:
            chartData.divisional,
        },
      });

    console.log(
      "Chart Saved:",
      chart.id
    );

    return NextResponse.json({
      success: true,

      profileId:
        profile.id,

      chartId:
        chart.id,
    });
  } catch (error) {
    console.error(
      "CHART CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}