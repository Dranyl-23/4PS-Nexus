'use client';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const DynamicMapPicker = dynamic(() => import('./MapPicker'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-slate-800">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mb-2" />
      <span className="text-xs text-slate-500">Loading Map...</span>
    </div>
  )
});

type DynamicMapProps = {
  position: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
};

export default function DynamicMap(props: DynamicMapProps) {
  return <DynamicMapPicker {...props} />;
}
