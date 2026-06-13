"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDashboardSettings } from "./actions";
import { settingsSchema, type SettingsFormValues } from "@repo/validation";

export default function SettingsForm({ dashboardId }: { dashboardId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      dashboardName: "",
      enableNotifications: true,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      // Call the Server Action
      await updateDashboardSettings(dashboardId, data);
      alert("Settings successfully saved!");
    } catch (error) {
      console.error("Failed to update settings", error);
      alert("An error occurred while saving.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Dashboard Name</label>
        <input
          {...register("dashboardName")}
          className="mt-1 block w-full max-w-md rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="My awesome dashboard"
        />
        {errors.dashboardName && <p className="text-red-500 text-sm mt-1">{errors.dashboardName.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="enableNotifications"
          {...register("enableNotifications")}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="enableNotifications" className="text-sm text-gray-700">
          Enable email notifications
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}