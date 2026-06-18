'use client';

import { useEffect } from 'react';

export function VisitorTracker() {
  useEffect(() => {
    // Use sessionStorage so we only log unique visits per browser session
    // rather than every single page navigation
    const hasTracked = sessionStorage.getItem('tracked_visit');
    
    if (!hasTracked) {
      fetch('/api/track', { method: 'POST' })
        .then(() => {
          sessionStorage.setItem('tracked_visit', 'true');
        })
        .catch(console.error);
    }
  }, []);

  return null;
}