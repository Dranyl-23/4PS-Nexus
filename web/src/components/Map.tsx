'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

export interface MapMerchant {
  id?: string;
  businessName: string;
  location: string;
}

interface MapProps {
  merchants?: MapMerchant[];
}

interface GeocodedMerchant extends MapMerchant {
  position: [number, number];
}

function MapUpdater({ markers }: { markers: GeocodedMerchant[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    
    if (markers.length === 1) {
      map.flyTo(markers[0].position, 16, { animate: true, duration: 1.5 });
    } else {
      const bounds = L.latLngBounds(markers.map(m => m.position));
      map.flyToBounds(bounds, { animate: true, duration: 1.5, padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

export default function Map({ merchants = [] }: MapProps) {
  const [markers, setMarkers] = useState<GeocodedMerchant[]>([]);
  const [defaultCenter] = useState<[number, number]>([14.5995, 120.9842]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
  }, []);

  useEffect(() => {
    async function geocodeAll() {
      if (!merchants || merchants.length === 0) return;
      setIsLoading(true);
      setError('');
      setMarkers([]);
      
      const newMarkers: GeocodedMerchant[] = [];
      
      for (let i = 0; i < merchants.length; i++) {
        const merchant = merchants[i];
        setLoadingText(`Locating ${merchant.businessName}... (${i + 1}/${merchants.length})`);
        
        try {
          // Delay to respect API limits (1 request per second)
          if (i > 0) await new Promise(resolve => setTimeout(resolve, 1100));

          const query1 = encodeURIComponent(`${merchant.businessName || ''} ${merchant.location || ''} Philippines`);
          let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query1}&limit=1`);
          let data = await res.json();

          if (!data || data.length === 0) {
            const query2 = encodeURIComponent(`${merchant.businessName || ''} Philippines`);
            res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query2}&limit=1`);
            data = await res.json();
          }

          if (!data || data.length === 0) {
            const query3 = encodeURIComponent(`${merchant.location || ''} Philippines`);
            res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query3}&limit=1`);
            data = await res.json();
          }
          
          if ((!data || data.length === 0) && (merchant.businessName.toLowerCase().includes('davao') || merchant.location.toLowerCase().includes('davao'))) {
             res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=Davao+City+Philippines&limit=1`);
             data = await res.json();
          }

          if (data && data.length > 0) {
            newMarkers.push({ ...merchant, position: [parseFloat(data[0].lat), parseFloat(data[0].lon)] });
          }
        } catch (err) {
          console.error(`Geocoding error for ${merchant.businessName}:`, err);
        }
      }

      setMarkers(newMarkers);
      if (newMarkers.length === 0) {
         setError("Could not find exact locations. Showing default map.");
      }
      setIsLoading(false);
    }

    geocodeAll();
  }, [merchants]);

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 z-0 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-800">Updating Map...</p>
          <p className="text-xs text-slate-500 font-mono mt-1">{loadingText}</p>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-xs font-bold shadow-lg z-[1000]">
          {error}
        </div>
      )}

      <MapContainer 
        center={markers.length > 0 ? markers[0].position : defaultCenter} 
        zoom={14} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater markers={markers} />
        
        {markers.map((m, idx) => (
          <Marker key={m.id || idx} position={m.position}>
            <Popup>
              <div className="font-sans min-w-[150px]">
                <p className="font-bold text-slate-900 m-0 text-base">{m.businessName}</p>
                <p className="text-xs text-slate-500 m-0 mt-1">{m.location}</p>
                <div className="mt-2 flex gap-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Accredited
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    4P-Ready
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
