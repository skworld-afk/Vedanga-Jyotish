import { prisma } from "../../../src/lib/prisma";
import { AdminView } from "./AdminView";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const sp = await searchParams;
  
  // 🔒 Admin Protection: Only accessible via /admin?key=vedanga_admin_99
  const ADMIN_SECRET = "vedanga_admin_99";
  
  if (sp.key !== ADMIN_SECRET) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">!</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500">You are not authorized to view the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const profiles = await prisma.profile.findMany({
    include: { user: true, chart: true },
    orderBy: { createdAt: 'desc' },
  });

  return <AdminView profiles={profiles} />;
}