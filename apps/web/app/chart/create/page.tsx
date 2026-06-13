"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";

export default function CreateChartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Location Autocomplete State
  const [placeQuery, setPlaceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced Photon API OpenStreetMap search
  useEffect(() => {
    if (placeQuery.length < 3 || !showSuggestions) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(placeQuery)}&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&limit=5`);
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (err) {
        console.error("Location search failed:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [placeQuery, showSuggestions]);

  const formatPlace = (feature: any) => {
    const p = feature.properties;
    return [p.name, p.state, p.country].filter(Boolean).join(", ");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/chart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (data.success && data.profileId) {
        router.push(`/dashboard/${data.profileId}`);
      } else {
        setError(data.error || "Failed to calculate chart. Please check your inputs.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-serif selection:bg-[#DEB887]/30">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        {/* Background graphic */}
        <div className="absolute inset-0 bg-[radial-gradient(#DEB887_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
        
        <div className="max-w-3xl w-full bg-[#FFFDF8] p-10 sm:p-14 rounded-3xl shadow-xl border border-[#DEB887]/40 relative z-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8B4513] via-[#DEB887] to-[#8B4513]"></div>
          
          <div className="text-center mb-10">
            <div className="text-[#8B4513] text-4xl mb-4">✨</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">Cast Janma Kundali</h2>
            <p className="text-lg text-[#5D4037]">Provide the native's birth details for precise shastric calculations.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-lg shadow-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" name="name" id="name" required className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] placeholder-[#5D4037]/50 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513] transition-all duration-300" placeholder="e.g. Arjuna" />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">Gender</label>
                <select name="gender" id="gender" className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513] transition-all duration-300">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="hidden md:block"></div> {/* Empty column for layout */}

              <div>
                <label htmlFor="birthDate" className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">Date of Birth</label>
                <input type="date" name="birthDate" id="birthDate" required className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513] transition-all duration-300" />
              </div>

              <div>
                <label htmlFor="birthTime" className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">Time of Birth</label>
                <input type="time" name="birthTime" id="birthTime" required className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513] transition-all duration-300" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="placeName" className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">Birth Place</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="placeName" 
                    id="placeName" 
                    required 
                    autoComplete="off"
                    value={placeQuery}
                    onChange={(e) => {
                      setPlaceQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] placeholder-[#5D4037]/50 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513] transition-all duration-300" 
                    placeholder="e.g. Varanasi, Uttar Pradesh, India" 
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-[#DEB887]/60 rounded-xl shadow-xl overflow-hidden">
                      {suggestions.map((f, i) => (
                        <div
                          key={i}
                          onMouseDown={() => {
                            setPlaceQuery(formatPlace(f));
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-3 hover:bg-[#FDFBF7] cursor-pointer text-[#3E2723] transition-colors border-b border-[#DEB887]/20 last:border-0"
                        >
                          {formatPlace(f)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-[#8B4513] to-[#5D4037] hover:from-[#5D4037] hover:to-[#3E2723] disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-lg tracking-wide hover:-translate-y-0.5">
                {isLoading ? "Calculating..." : "Calculate Chart ✨"}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}