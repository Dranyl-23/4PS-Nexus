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

const COLORS = [
  'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/30', 
  'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/30', 
  'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/30', 
  'bg-gradient-to-br from-teal-400 to-teal-600 shadow-teal-500/30', 
  'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/30'
];
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
            category: m.category ? m.category.charAt(0).toUpperCase() + m.category.slice(1) : CATEGORIES[i % CATEGORIES.length],
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
    <div className="max-w-6xl mx-auto flex flex-col gap-8 relative pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            Merchants <span className="text-slate-400 font-normal text-base md:text-lg">/ Directory</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse DSWD-accredited stores where you can spend your 4P-Tokens.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search stores or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm shadow-sm transition-all"
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
            <div key={merchant.id} className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${merchant.color}`}>
                    <Store className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">{merchant.businessName}</h3>
                    <p className="text-xs md:text-sm text-slate-500 mt-0.5">{merchant.category}</p>
                  </div>
                </div>
                <div className="bg-emerald-50/80 border border-emerald-100 text-emerald-600 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </div>
              </div>

              <div className="flex-1 space-y-5 mt-2">
                <div className="flex items-start gap-2.5 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  <MapPin className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{merchant.location}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {merchant.distance} away
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Eligible Items</p>
                  <div className="flex flex-wrap gap-2">
                    {merchant.items?.map((item, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-semibold shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => openMapForMerchant(merchant)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 text-center flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MapPin className="w-4 h-4" /> Get Directions
                </button>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.businessName + ' ' + merchant.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-5 h-5" />
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
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
                merchants={selectedMerchant ? [selectedMerchant] : []}
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
