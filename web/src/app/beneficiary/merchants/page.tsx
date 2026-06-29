'use client';
import { Store, MapPin, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const MERCHANTS = [
  {
    id: 1,
    name: 'Puregold Metropolis',
    category: 'Groceries',
    status: 'Verified',
    distance: '0.5 km',
    address: 'Metropolis Mall, Alabang',
    items: ['Rice', 'Canned Goods', 'Milk', 'Noodles'],
    color: 'bg-orange-500'
  },
  {
    id: 2,
    name: 'Mercury Drug',
    category: 'Medicines',
    status: 'Verified',
    distance: '0.8 km',
    address: 'National Road, Muntinlupa',
    items: ['Vitamins', 'Maintenance Meds', 'First Aid'],
    color: 'bg-rose-500'
  },
  {
    id: 3,
    name: 'SM Supermarket',
    category: 'Groceries',
    status: 'Verified',
    distance: '1.2 km',
    address: 'SM Southmall, Las Pinas',
    items: ['Fresh Produce', 'Meat', 'Pantry Staples'],
    color: 'bg-blue-500'
  },
  {
    id: 4,
    name: 'Southstar Drug',
    category: 'Medicines',
    status: 'Verified',
    distance: '2.5 km',
    address: 'Aguinaldo Highway, Bacoor',
    items: ['Prescription Meds', 'Vitamins'],
    color: 'bg-teal-500'
  }
];

export default function MerchantsPage() {
  const [search, setSearch] = useState('');

  const filteredMerchants = MERCHANTS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMerchants.map((merchant) => (
          <div key={merchant.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${merchant.color} shadow-sm`}>
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{merchant.name}</h3>
                  <p className="text-xs text-slate-500">{merchant.category}</p>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {merchant.status}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                <div>
                  <p>{merchant.address}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{merchant.distance} away</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Eligible Items</p>
                <div className="flex flex-wrap gap-2">
                  {merchant.items.map((item, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.name + ' ' + merchant.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors text-center flex items-center justify-center"
              >
                Get Directions
              </a>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.name + ' ' + merchant.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMerchants.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No merchants found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
