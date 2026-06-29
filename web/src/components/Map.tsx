'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js/React-Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

export default function Map() {
  useEffect(() => {
    // Delete the default icon _getIconUrl to force leaflet to use the custom options below
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
    });
  }, []);

  // Center on Metropolis / Quezon City area roughly for demo
  const position: [number, number] = [14.6333, 121.0333];

  const merchants = [
    { id: 1, name: 'Puregold Metropolis', pos: [14.6350, 121.0350] as [number, number], tag: 'Groceries' },
    { id: 2, name: 'Mercury Drug', pos: [14.6310, 121.0310] as [number, number], tag: 'Medicines' },
    { id: 3, name: 'SM Supermarket', pos: [14.6400, 121.0300] as [number, number], tag: 'Groceries' },
  ];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 z-0 relative">
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
        {merchants.map((m) => (
          <Marker key={m.id} position={m.pos}>
            <Popup>
              <div className="font-sans">
                <p className="font-bold text-slate-900 m-0">{m.name}</p>
                <p className="text-xs text-slate-500 m-0 mt-1">{m.tag}</p>
                <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Accredited
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
