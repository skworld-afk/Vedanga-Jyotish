import { z } from "zod";

export const settingsSchema = z.object({
  dashboardName: z.string().min(3, "Name must be at least 3 characters"),
  enableNotifications: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;