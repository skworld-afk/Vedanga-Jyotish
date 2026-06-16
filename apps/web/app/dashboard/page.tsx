import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  // Find the user's most recent profile
  const profile = await prisma.profile.findFirst();

  // If a profile exists, immediately redirect them to the specific [id] dashboard
  if (profile) {
    redirect(`/dashboard/${profile.id}`);
  }

  // If NO profile exists, show an empty state instead of crashing
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/50 p-6">
      <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl p-10 text-center max-w-lg w-full">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome to Astro SaaS</h2>
        <p className="text-slate-500 mt-3 mb-8 leading-relaxed">
          You don't have any birth charts generated yet. Enter your birth details to unlock your personalized astrological insights.
        </p>
        <Link href="/" className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
          Generate New Chart
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </Link>
      </div>
    </div>
  );
}