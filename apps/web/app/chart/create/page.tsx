import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChartForm } from "../ChartForm";
import { createBirthChart } from "./actions";

export default function CreateChartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-serif selection:bg-[#DEB887]/30">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#DEB887_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
        <ChartForm
          serverAction={createBirthChart}
          submitButtonText="Generate Janma Kundali ✨"
          isEditMode={false}
        />
      </main>

      <Footer />
    </div>
  );
}