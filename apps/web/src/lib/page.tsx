import { prisma } from "../../src/lib/prisma";
import { notFound } from "next/navigation";

interface ChartPageProps {
  params: {
    profileId: string;
  };
}

export default async function ChartVisualizationPage({ params }: ChartPageProps) {
  const { profileId } = await params; // resolve params promise
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: { chart: true },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold">{profile.displayName}'s Chart</h1>
        <p className="text-gray-500">
          Born on {profile.birthDate.toLocaleDateString()} at {profile.birthTime} in {profile.placeName}
        </p>
      </header>

      {/* 1. Basic Panchang */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Basic Panchang</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded"><strong>Tithi:</strong> Tritiya</div>
          <div className="p-3 bg-gray-50 rounded"><strong>Nakshatra:</strong> Rohini</div>
          <div className="p-3 bg-gray-50 rounded"><strong>Karana:</strong> Garaja</div>
          <div className="p-3 bg-gray-50 rounded"><strong>Yoga:</strong> Siddhi</div>
        </div>
      </section>

      {/* 2. D1, D9, and Moon Chart Layout */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[300px] flex items-center justify-center font-medium text-gray-400">D1 (Lagna) Chart Viewer</div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[300px] flex items-center justify-center font-medium text-gray-400">D9 (Navamsha) Chart Viewer</div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[300px] flex items-center justify-center font-medium text-gray-400">Moon (Chandra) Chart Viewer</div>
      </section>

      {/* 3. Dasha System */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Vimshottari Dasha</h2>
        <div className="min-h-[200px] flex items-center justify-center font-medium text-gray-400 bg-gray-50 rounded">
          Interactive Dasha Timeline goes here...
        </div>
      </section>
    </div>
  );
}