'use client';
import React, { useState } from 'react';
import { BadgeCheck, Clock, XCircle, Store, Maximize, Minimize, X } from 'lucide-react';

const INITIAL_MERCHANTS = [
  {
    id: 'mer_1029381',
    name: 'Mercury Drug - Quezon City',
    category: 'Pharmacy',
    address: 'GBLF...49XQ',
    status: 'approved',
    date: '2026-06-28',
  },
  {
    id: 'mer_1029382',
    name: 'Puregold - North EDSA',
    category: 'Grocery',
    address: 'GBZ2...L1K9',
    status: 'pending',
    date: '2026-06-29',
  },
  {
    id: 'mer_1029383',
    name: 'Dr. Santos Clinic',
    category: 'Health Center',
    address: 'GDY4...0PA3',
    status: 'rejected',
    date: '2026-06-27',
  },
  {
    id: 'mer_1029384',
    name: 'National Book Store - SM North',
    category: 'School Supplies',
    address: 'GDX1...9LZ4',
    status: 'approved',
    date: '2026-06-26',
  }
];

export function MerchantTable() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [merchants, setMerchants] = useState(INITIAL_MERCHANTS);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sortedMerchants = [...merchants].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  return (
    <>
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'h-full'}`}>
        <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Whitelisted Merchants</h2>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 p-1.5 rounded-md flex items-center justify-center cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-5 border-b border-slate-100">Merchant Details</th>
                <th className="px-6 py-5 border-b border-slate-100">Category</th>
                <th className="px-6 py-5 border-b border-slate-100">Wallet Address</th>
                <th className="px-6 py-5 border-b border-slate-100 cursor-pointer hover:text-slate-700 select-none" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                  <div className="flex items-center gap-1">
                    Date {sortOrder === 'desc' ? '↓' : '↑'}
                  </div>
                </th>
                <th className="px-6 py-5 border-b border-slate-100">Status</th>
                <th className="px-6 py-5 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {sortedMerchants.map((merchant) => (
                <tr key={merchant.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{merchant.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{merchant.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600">{merchant.category}</td>
                  <td className="px-6 py-5 font-mono text-slate-600">{merchant.address}</td>
                  <td className="px-6 py-5 text-slate-900 whitespace-nowrap">{merchant.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      {merchant.status === 'approved' && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                      {merchant.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                      {merchant.status === 'rejected' && <XCircle className="w-4 h-4 text-rose-500" />}
                      <span className="capitalize text-slate-700">{merchant.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => setSelectedMerchant(merchant)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMerchant && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedMerchant(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Merchant Details</h3>
              <button onClick={() => setSelectedMerchant(null)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-lg">{selectedMerchant.name}</div>
                  <div className="text-sm text-slate-500">{selectedMerchant.category}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Stellar Wallet Address</p>
                  <p className="text-sm font-mono text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100 break-all">{selectedMerchant.address}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
                  <div className="flex items-center gap-1.5 text-sm">
                    {selectedMerchant.status === 'approved' && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                    {selectedMerchant.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                    {selectedMerchant.status === 'rejected' && <XCircle className="w-4 h-4 text-rose-500" />}
                    <span className="capitalize font-medium text-slate-700">{selectedMerchant.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setSelectedMerchant(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Close</button>
              {selectedMerchant.status !== 'approved' && (
                <button 
                  onClick={() => {
                    setMerchants(merchants.map(m => m.id === selectedMerchant.id ? { ...m, status: 'approved' } : m));
                    setSelectedMerchant({ ...selectedMerchant, status: 'approved' });
                  }}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Approve Merchant
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
