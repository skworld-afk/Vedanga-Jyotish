"use server";

import { prisma } from "../../../src/lib/prisma";
import { redirect } from "next/navigation";
import { geocodePlace } from "../../../src/lib/services/geocode";
import { getHistoricalTimezone } from "../../../src/lib/services/timezone";
import { calculateJulianDay } from "../../../src/lib/services/julian";
import { calculateChart } from "../../../lib/astrology/chart";

export async function createBirthChart(formData: FormData) {
  const name = formData.get("name") as string;
  const birthDate = formData.get("birthDate") as string;
  const birthTime = formData.get("birthTime") as string;
  const placeName = formData.get("placeName") as string;

  // Geocode place
  const geo = await geocodePlace(placeName);

  // Timezone lookup
  const timezone = await getHistoricalTimezone(geo.latitude, geo.longitude);

  // Julian Day
  const julianDay = calculateJulianDay(birthDate, birthTime, timezone.utcOffset);

  // Astrology Calculation
  const chartData = await calculateChart(julianDay, geo.latitude, geo.longitude);

  // Create demo user safely using upsert (avoids the findFirst crash)
  const user = await prisma.user.upsert({
    where: { email: "demo@astrosaas.com" },
    update: {},
    create: { email: "demo@astrosaas.com" },
  });

  // Save profile
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      name,
      placeName,
      birthDate: new Date(birthDate),
      localTime: birthTime,
      latitude: geo.latitude,
      longitude: geo.longitude,
      utcOffset: timezone.utcOffset, 
      julianDay,
    },
  });

  // Save chart
  await prisma.chart.create({
    data: {
      profileId: profile.id,
      planets: chartData.planets as any,
      divisional: chartData.divisional as any,
    },
  });

  redirect(`/dashboard/${profile.id}`);
}