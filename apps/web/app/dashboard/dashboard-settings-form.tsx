"use client";

import { useState, useTransition } from "react";
import { updateDashboardSettings } from "./actions";

type DashboardSettingsFormProps = {
  dashboard: {
    id: string;
    name: string;
    notificationsEnabled: boolean;
  };
};

export function DashboardSettingsForm({ dashboard }: DashboardSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setMessage("");
    
    // Using useTransition keeps the UI responsive while the server action runs
    startTransition(async () => {
      const data = {
        dashboardName: formData.get("dashboardName") as string,
        enableNotifications: formData.get("enableNotifications") === "on",
      };

      try {
        await updateDashboardSettings(dashboard.id, data);
        setMessage("Settings saved successfully!");
      } catch (error) {
        setMessage("Failed to save settings. Please try again.");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-6 bg-white p-6 rounded-lg border max-w-md">
      <div>
        <label htmlFor="dashboardName" className="block text-sm font-medium mb-2">
          Dashboard Name
        </label>
        <input
          id="dashboardName"
          name="dashboardName"
          defaultValue={dashboard.name}
          required
          className="w-full border rounded-md p-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enableNotifications"
          name="enableNotifications"
          defaultChecked={dashboard.notificationsEnabled}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="enableNotifications" className="text-sm font-medium">
          Enable Notifications
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50 transition-opacity"
      >
        {isPending ? "Saving..." : "Save Settings"}
      </button>

      {message && <p className="text-sm mt-2 font-medium">{message}</p>}
    </form>
  );
}