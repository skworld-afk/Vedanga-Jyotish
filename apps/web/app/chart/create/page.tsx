"use client";

import { useState, useEffect } from "react";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";
import { createBirthChart } from "./actions";

export default function CreateChartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [placeQuery, setPlaceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Location Search
  useEffect(() => {
    if (placeQuery.length < 3 || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(placeQuery)}&limit=6`
        );
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (err) {
        console.error("Location search failed:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [placeQuery, showSuggestions]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await createBirthChart(formData);
    } catch (err: any) {
      if (err.digest?.startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setError(err.message || "Failed to create chart. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-serif selection:bg-[#DEB887]/30">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#DEB887_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="max-w-3xl w-full bg-[#FFFDF8] p-10 sm:p-14 rounded-3xl shadow-xl border border-[#DEB887]/40 relative z-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8B4513] via-[#DEB887] to-[#8B4513]" />

          <div className="text-center mb-10">
            <div className="text-[#8B4513] text-4xl mb-4">✨</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">
              Cast Janma Kundali
            </h2>
            <p className="text-lg text-[#5D4037]">
              Provide accurate birth details for precise shastric calculations
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  defaultValue="MALE"
                  className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="birthDate"
                  required
                  className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
                />
              </div>

              {/* Time of Birth */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">
                  Time of Birth
                </label>
                <input
                  type="time"
                  step="1"
                  name="birthTime"
                  required
                  className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
                />
              </div>

              {/* Place of Birth */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-2">
                  Place of Birth
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="placeName"
                    value={placeQuery}
                    onChange={(e) => {
                      setPlaceQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="e.g. Varanasi, Uttar Pradesh"
                    required
                    className="block w-full bg-[#FDFBF7] border border-[#DEB887]/60 rounded-xl px-4 py-3 text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
                  />

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-[#DEB887]/60 rounded-xl shadow-xl max-h-60 overflow-auto">
                      {suggestions.map((feature, i) => (
                        <div
                          key={i}
                          onMouseDown={() => {
                            const place = [
                              feature.properties.name,
                              feature.properties.state,
                              feature.properties.country,
                            ]
                              .filter(Boolean)
                              .join(", ");
                            setPlaceQuery(place);
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-3 hover:bg-[#FDFBF7] cursor-pointer border-b border-[#DEB887]/20 last:border-0"
                        >
                          {feature.properties.name}, {feature.properties.state},{" "}
                          {feature.properties.country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-4 bg-gradient-to-br from-[#8B4513] to-[#5D4037] hover:from-[#5D4037] hover:to-[#3E2723] text-white rounded-xl font-bold text-lg transition-all disabled:opacity-70"
            >
              {isLoading ? "Calculating Kundli..." : "Generate Janma Kundali ✨"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}