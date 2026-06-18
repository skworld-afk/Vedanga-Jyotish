import { verifyAdminSession } from '../../actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Using relative path to match your project structure
import prisma from '../../../../src/lib/prisma';

export default async function UserDetailDashboard({ params }: { params: Promise<{ id: string }> }) {
  await verifyAdminSession(); // Ensure admin is logged in
  
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    // Adjust 'charts' to whatever your Prisma relation is named
    // include: { charts: true } 
  });

  if (!user) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-black">&larr; Back to Users</Link>
          <h1 className="text-2xl font-bold text-gray-900">User Details: {user.email}</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg border-b pb-4 mb-4">User Charts & Activity</h2>
          
          {/* 
            Uncomment and adjust this map once your charts relation is included 
          */}
          {/* {user.charts.length === 0 ? (
            <p className="text-gray-500 py-4">This user has not created any charts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.charts.map(chart => (
                <div key={chart.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{chart.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">Data points: {chart.data.length}</p>
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}