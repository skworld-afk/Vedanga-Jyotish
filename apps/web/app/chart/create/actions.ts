"use server";

import { prisma } from "../../../src/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { geocodePlace } from "../../../src/lib/services/geocode";
import { getHistoricalTimezone } from "../../../src/lib/services/timezone";
import { calculateJulianDay } from "../../../src/lib/services/julian";
import { calculateChart } from "@/lib/astrology/chart";

// Validation Schema
const BirthChartSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().default("MALE"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  birthTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time format"),
  placeName: z.string().min(3, "Place name is required"),
});

export async function createBirthChart(formData: FormData) {
  try {
    // Track the visitor
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || 'Unknown';
    const userAgent = headerList.get('user-agent') || 'Unknown';

    await prisma.visitor.create({
      data: { ip, userAgent }
    });

    const rawData = {
      displayName: String(formData.get("displayName") || ""),
      gender: String(formData.get("gender") || "MALE"),
      birthDate: String(formData.get("birthDate") || ""),
      birthTime: String(formData.get("birthTime") || ""),
      placeName: String(formData.get("placeName") || ""),
    };

    const validated = BirthChartSchema.parse(rawData);

    // Geocoding
    const geo = await geocodePlace(validated.placeName);
    if (!geo?.latitude || !geo?.longitude) {
      throw new Error("Could not find coordinates for this location.");
    }

    // Timezone
    const timezone = await getHistoricalTimezone(geo.latitude, geo.longitude);

    // Local Birth DateTime
    const localBirthDateTime = new Date(`${validated.birthDate}T${validated.birthTime}`);

    // Julian Day
    const julianDay = calculateJulianDay(
      validated.birthDate,
      validated.birthTime,
      timezone.utcOffset
    );

    // Calculate Chart
    const chartData = await calculateChart(julianDay, geo.latitude, geo.longitude);

    // Demo User
    const user = await prisma.user.upsert({
      where: { email: "demo@astrosaas.com" },
      update: {},
      create: {
        email: "demo@astrosaas.com",
        name: "Demo User",
        role: "USER",
      },
    });

    // Create Profile
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        displayName: validated.displayName,
        birthName: validated.displayName,
        gender: validated.gender as any,
        placeName: validated.placeName,
        birthDate: localBirthDateTime,
        birthTime: validated.birthTime,
        latitude: geo.latitude,
        longitude: geo.longitude,
        timezoneId: timezone.timezoneId,
        utcOffset: timezone.utcOffset,
        utcDateTime: localBirthDateTime,
        julianDay,
        isPrimary: true,
      },
    });

    // Create Chart
    await prisma.chart.create({
      data: {
        profileId: profile.id,
        ayanamsa: "Lahiri",
        planets: chartData.planets as any,
        divisional: chartData.divisional as any,
      },
    });

    // ✅ Important: Redirect should be outside try-catch or re-thrown properly
    redirect(`/dashboard/${profile.id}`);
    
  } catch (error: any) {
    console.error("Create Birth Chart Error:", error);

    // Agar redirect error hai to usko phir se throw kar do (important)
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0]?.message || "Validation failed");
    }

    throw new Error(error.message || "Failed to create birth chart. Please try again.");
  }
}

export async function updateBirthChart(id: string, formData: FormData) {
  try {
    const rawData = {
      displayName: String(formData.get("displayName") || ""),
      gender: String(formData.get("gender") || "MALE"),
      birthDate: String(formData.get("birthDate") || ""),
      birthTime: String(formData.get("birthTime") || ""),
      placeName: String(formData.get("placeName") || ""),
    };

    const validated = BirthChartSchema.parse(rawData);

    // Geocoding
    const geo = await geocodePlace(validated.placeName);
    if (!geo?.latitude || !geo?.longitude) {
      throw new Error("Could not find coordinates for this location.");
    }

    // Timezone
    const timezone = await getHistoricalTimezone(geo.latitude, geo.longitude);

    // Local Birth DateTime
    const localBirthDateTime = new Date(`${validated.birthDate}T${validated.birthTime}`);

    // Julian Day
    const julianDay = calculateJulianDay(
      validated.birthDate,
      validated.birthTime,
      timezone.utcOffset
    );

    // Calculate Chart
    const chartData = await calculateChart(julianDay, geo.latitude, geo.longitude);

    // Update Profile
    const profile = await prisma.profile.update({
      where: { id },
      data: {
        displayName: validated.displayName,
        birthName: validated.displayName,
        gender: validated.gender as any,
        placeName: validated.placeName,
        birthDate: localBirthDateTime,
        birthTime: validated.birthTime,
        latitude: geo.latitude,
        longitude: geo.longitude,
        timezoneId: timezone.timezoneId,
        utcOffset: timezone.utcOffset,
        utcDateTime: localBirthDateTime,
        julianDay,
      },
    });

    // Update Chart Details
    await prisma.chart.updateMany({
      where: { profileId: id },
      data: {
        planets: chartData.planets as any,
        divisional: chartData.divisional as any,
      },
    });

    revalidatePath(`/dashboard/${profile.id}`);
    redirect(`/dashboard/${profile.id}`);
  } catch (error: any) {
    console.error("Update Birth Chart Error:", error);
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0]?.message || "Validation failed");
    }
    throw new Error(error.message || "Failed to update birth chart. Please try again.");
  }
}