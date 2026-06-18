"use server";

import { prisma } from "../../src/lib/prisma";
import { redirect } from "next/navigation";

export async function createProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const placeName = formData.get("placeName") as string;
  const birthDateTime = formData.get("birthDateTime") as string;

  // For now, we fetch the first user to attach the profile to.
  // Once Authentication is added, you will use the logged-in User's ID here!
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: "test@example.com" },
    });
  }

  const dateObj = new Date(birthDateTime);

  // 1. Create the profile in the database
  const profile = await prisma.profile.create({
    data: {
      displayName: name,
      placeName,
      birthDate: dateObj,
      birthTime: dateObj.toLocaleTimeString(),
      // Defaulting coords for now - later we will hook up a Google Maps/Mapbox API
      latitude: 0,
      longitude: 0,
      utcOffset: 0, 
      userId: user.id,
    },
  });

  // 2. Later: Call your astro calculation API to generate the `Chart` and `DashaCache` here

  // 3. Redirect the user to the visualization page
  redirect(`/dashboard/${profile.id}`);
}