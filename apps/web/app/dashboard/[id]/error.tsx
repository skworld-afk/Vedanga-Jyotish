"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service like Sentry
    console.error("Dashboard caught an error:", error);
  }, [error]);

  return (
    <div className="bg-red-50/80 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto mt-16 shadow-sm">
      <div className="bg-red-100 p-4 rounded-full mb-2">
        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-red-900">Something went wrong!</h2>
      <p className="text-red-700/80 text-lg">
        We encountered an unexpected error while calculating or rendering this astrological view. 
        Don't worry, your profile and birth details are safely stored.
      </p>
      <div className="flex gap-4 pt-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          Try Again (Reset View)
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-white text-red-600 border border-red-200 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm"
        >
          Hard Reload Page
        </button>
      </div>
    </div>
  );
}