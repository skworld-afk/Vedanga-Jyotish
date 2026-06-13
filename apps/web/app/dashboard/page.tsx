import { prisma } from "../../src/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function DashboardSettingsPage() {
  // Fetch the first dashboard for the user (placeholder for auth)
  const dashboard = await prisma.dashboard.findFirst({
    orderBy: { createdAt: "asc" }
  });

  // Handle empty state if no dashboard exists yet
  if (!dashboard) {
    return (
      <div className="p-8 max-w-4xl mx-auto">No dashboards found. Please create one.</div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard Settings</h1>
      <SettingsForm dashboardId={dashboard.id} />
    </div>
  );
}