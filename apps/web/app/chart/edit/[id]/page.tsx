import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChartForm } from "../../ChartForm";
import { updateBirthChart } from "../../create/actions";

export default async function EditChartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id },
  });

  if (!profile) {
    notFound();
  }

  // We bind the profile ID to the server action.
  // This is a secure way to pass the ID to the action.
  const updateActionWithId = updateBirthChart.bind(null, profile.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-serif selection:bg-[#DEB887]/30">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#DEB887_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
        <ChartForm
          serverAction={updateActionWithId}
          initialData={profile}
          submitButtonText="Update Janma Kundali ✨"
          isEditMode={true}
        />
      </main>

      <Footer />
    </div>
  );
}
