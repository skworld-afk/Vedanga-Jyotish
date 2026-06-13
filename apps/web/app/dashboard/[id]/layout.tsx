import { ReactNode } from "react";
import { prisma } from "../../../src/lib/prisma";
import { notFound } from "next/navigation";
import { Header } from "../../../lib/astrology/Header";
import { Footer } from "../../../lib/astrology/Footer";
import { SessionTimeout } from "./SessionTimeout";

export default async function ChartDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  const profile = await prisma.profile.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!profile) return notFound();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black">
      <Header />
      
      <div className="flex flex-1">
        <SessionTimeout>
          <main className="flex-1 p-4 md:p-8 min-w-0">
            {children}
          </main>
        </SessionTimeout>
      </div>
      
      <Footer />
    </div>
  );
}