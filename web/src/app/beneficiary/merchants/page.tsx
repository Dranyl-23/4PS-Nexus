'use client';
import { Store, MapPin, CheckCircle2, Search, ExternalLink, Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 rounded-xl flex flex-col items-center justify-center animate-pulse"><Loader2 className="w-6 h-6 text-slate-400 animate-spin mb-2" /><p className="text-slate-400 text-sm">Loading map...</p></div>
});

interface Merchant {
  id: string;
  businessName: string;
  wallet: string;
  location: string;
  isWhitelisted: boolean;
  // Synthetic fields for UI demo
  category?: string;
  distance?: string;
  items?: string[];
  color?: string;
}

const COLORS = ['bg-orange-500', 'bg-rose-500', 'bg-blue-500', 'bg-teal-500', 'bg-purple-500'];
const CATEGORIES = ['Groceries', 'Medicines', 'Hardware', 'Clothing'];
const ITEM_SETS = [
  ['Rice', 'Canned Goods', 'Milk', 'Noodles'],
  ['Vitamins', 'Maintenance Meds', 'First Aid'],
  ['Building Materials', 'Tools'],
  ['School Uniforms', 'Shoes']
];

export default function MerchantsPage() {
  const [search, setSearch] = useState('');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Map Modal State
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    async function fetchMerchants() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/merchants');
        if (res.ok) {
          const data: Merchant[] = await res.json();
          // Filter whitelisted and add synthetic UI fields
          const processed = data.filter(m => m.isWhitelisted).map((m, i) => ({
            ...m,
            category: CATEGORIES[i % CATEGORIES.length],
            distance: (0.5 + (i * 0.3)).toFixed(1) + ' km',
            items: ITEM_SETS[i % ITEM_SETS.length],
            color: COLORS[i % COLORS.length]
          }));
          setMerchants(processed);
        }
      } catch (error) {
        console.error("Failed to fetch merchants", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter(m => 
    m.businessName.toLowerCase().includes(search.toLowerCase()) || 
    (m.category && m.category.toLowerCase().includes(search.toLowerCase())) ||
    m.location.toLowerCase().includes(search.toLowerCase())
  );

  const openMapForMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setShowMapModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            Merchants <span className="text-slate-400 font-normal text-base md:text-lg">/ Directory</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse DSWD-accredited stores where you can spend your 4P-Tokens.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search stores or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center items-center flex-col gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading live merchants directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMerchants.map((merchant) => (
            <div key={merchant.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${merchant.color} shadow-sm shrink-0`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{merchant.businessName}</h3>
                    <p className="text-xs text-slate-500">{merchant.category}</p>
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                  <div>
                    <p>{merchant.location}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{merchant.distance} away</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Eligible Items</p>
                  <div className="flex flex-wrap gap-2">
                    {merchant.items?.map((item, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => openMapForMerchant(merchant)}
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors text-center flex items-center justify-center"
                >
                  Get Directions
                </button>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.businessName + ' ' + merchant.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0"
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && filteredMerchants.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No merchants found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria or wait for the Admin to accredit new merchants.</p>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && selectedMerchant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> 
                  Store Location
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedMerchant.businessName}</p>
              </div>
              <button 
                onClick={() => setShowMapModal(false)} 
                className="w-8 h-8 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1">
              <MapComponent 
                merchantName={selectedMerchant.businessName}
                merchantAddress={selectedMerchant.location}
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
               <button 
                  onClick={() => setShowMapModal(false)}
                  className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors"
                >
                  Close Map
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
