"use server";

import { prisma } from "../../src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateDashboardSettings(dashboardId: string, data: any) {
  await prisma.dashboard.update({
    where: { id: dashboardId },
    data: {
      name: data.dashboardName,
      notificationsEnabled: data.enableNotifications,
    },
  });
  revalidatePath("/dashboard");
}