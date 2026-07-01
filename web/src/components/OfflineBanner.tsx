'use client';
import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    // Check initial state safely
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOffline(true);
    }

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 3000); // Hide restored message after 3s
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-10000 bg-rose-600 text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-rose-600/20 animate-in slide-in-from-top-4 duration-300">
        <WifiOff className="w-4 h-4 animate-pulse" />
        No Internet Connection. Please check your network.
      </div>
    );
  }

  if (showRestored) {
    return (
      <div className="fixed top-0 left-0 right-0 z-10000 bg-emerald-500 text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-emerald-500/20 animate-in slide-in-from-top-4 fade-out duration-300">
        <Wifi className="w-4 h-4" />
        Internet Connection Restored!
      </div>
    );
  }

  return null;
}
