'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';

// Fix for default marker icons in Next.js/React-Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

interface MapProps {
  merchantName?: string;
  merchantAddress?: string;
}

// Helper component to smoothly center the map when coordinates change
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 16, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function Map({ merchantName, merchantAddress }: MapProps) {
  const [position, setPosition] = useState<[number, number]>([14.5995, 120.9842]); // Default Manila
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Delete the default icon _getIconUrl to force leaflet to use the custom options below
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
    });
  }, []);

  useEffect(() => {
    async function geocodeAddress() {
      if (!merchantAddress && !merchantName) return;
      setIsLoading(true);
      setError('');
      
      try {
        // Prepare search query. Combine name and address to get a better match.
        // We add "Philippines" to ensure it searches locally.
        const query = encodeURIComponent(`${merchantName || ''} ${merchantAddress || ''} Philippines`);
        
        // Nominatim OpenStreetMap Geocoding API
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
        const data = await res.json();

        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          // If strict search fails, try searching just the address
          const fallbackQuery = encodeURIComponent(`${merchantAddress || ''} Philippines`);
          const fallbackRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${fallbackQuery}&limit=1`);
          const fallbackData = await fallbackRes.json();
          
          if (fallbackData && fallbackData.length > 0) {
            setPosition([parseFloat(fallbackData[0].lat), parseFloat(fallbackData[0].lon)]);
          } else {
             setError("Location not found on map. Showing default area.");
          }
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Network error while finding location.");
      } finally {
        setIsLoading(false);
      }
    }

    geocodeAddress();
  }, [merchantName, merchantAddress]);

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 z-0 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-sm font-bold text-slate-800">Finding location...</p>
          <p className="text-xs text-slate-500">Connecting to OpenStreetMap</p>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-xs font-bold shadow-lg z-[1000]">
          {error}
        </div>
      )}

      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={position} />
        
        <Marker position={position}>
          <Popup>
            <div className="font-sans min-w-[150px]">
              <p className="font-bold text-slate-900 m-0 text-base">{merchantName || 'Merchant Location'}</p>
              {merchantAddress && <p className="text-xs text-slate-500 m-0 mt-1">{merchantAddress}</p>}
              <div className="mt-2 flex gap-2">
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Accredited
                </span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  4P-Token Ready
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
