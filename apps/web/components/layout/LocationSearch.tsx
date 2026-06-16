'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LocationSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('city') || 'New Delhi');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query && query !== searchParams?.get('city')) {
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`)
          .then((res) => res.json())
          .then((data) => {
            if (data.results) {
              setResults(data.results);
              setIsOpen(true);
            } else {
              setResults([]);
            }
          });
      } else {
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams]);

  const handleSelect = (city: string, lat: number, lon: number) => {
    setQuery(city);
    setIsOpen(false);
    router.push(`/panchang?city=${encodeURIComponent(city)}&lat=${lat}&lon=${lon}`);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto z-40 mt-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if(results.length > 0) setIsOpen(true) }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Search any city globally..."
        className="w-full border-2 border-[#DEB887]/50 rounded-xl px-4 py-3 text-[#5D4037] font-bold outline-none focus:border-[#8B4513] text-center shadow-sm transition-colors"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-[#DEB887]/50 rounded-xl shadow-xl overflow-hidden flex flex-col">
          {results.map((res: any, idx: number) => (
            <button
              key={idx}
              onClick={() => handleSelect(`${res.name}, ${res.admin1 || res.country}`, res.latitude, res.longitude)}
              className="px-4 py-3 cursor-pointer hover:bg-[#DEB887]/20 text-left border-b border-gray-100 last:border-0 transition-colors w-full"
            >
              <div className="font-bold text-[#8B4513] text-sm">{res.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{res.admin1 ? `${res.admin1}, ` : ''}{res.country}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}