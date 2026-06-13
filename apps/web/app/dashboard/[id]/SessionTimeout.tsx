"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Set timeout to 10 minutes (in milliseconds)
const TIMEOUT_MS = 10 * 60 * 1000;

export function SessionTimeout({ children }: { children: React.ReactNode }) {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsTimedOut(true);
      }, TIMEOUT_MS);
    };

    // List of DOM events that signify the user is still active and viewing the chart
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    // Initialize the timer on mount
    resetTimeout();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
      clearTimeout(timeoutId);
    };
  }, []);

  if (isTimedOut) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-[#FDFBF7] border border-[#DEB887]/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Session Paused</h2>
          <p className="text-gray-500">
            For your security and to conserve resources, your session was paused due to inactivity. Your chart progress is perfectly safe!
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <button onClick={() => setIsTimedOut(false)} className="w-full px-4 py-2.5 bg-[#8B4513] text-white font-medium rounded-lg hover:bg-[#6A330F] transition-colors">
              Resume Viewing Chart
            </button>
            <button onClick={() => router.push('/')} className="w-full px-4 py-2.5 bg-white text-gray-700 border border-gray-200 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}