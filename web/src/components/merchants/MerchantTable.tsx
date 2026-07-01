'use client';
import React, { useState, useEffect } from 'react';
import { BadgeCheck, Clock, XCircle, Store, Maximize, Minimize, X, Filter, ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { useWalletContext } from '@/components/WalletProvider';

interface Merchant {
  id: string;
  name: string;
  category: string;
  address: string;
  status: string;
  date: string;
}

interface DBMerchant {
  id: string;
  businessName: string;
  category: string;
  location: string;
  wallet: string;
  isWhitelisted: boolean;
  createdAt: string;
}

export function MerchantTable() {
  const { publicKey } = useWalletContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    async function fetchMerchants() {
      try {
        const res = await fetch('/api/merchants');
        if (res.ok) {
          const data = await res.json();
          // Map DB structure to table structure
          const mapped = data.map((m: DBMerchant) => ({
            id: m.id,
            name: m.businessName,
            category: m.category || m.location, // fallback for old records
            address: m.wallet,
            status: m.isWhitelisted ? 'approved' : 'pending',
            date: new Date(m.createdAt).toISOString().split('T')[0]
          }));
          setMerchants(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch merchants', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMerchants();
  }, []);

  const handleApprove = async () => {
    if (!selectedMerchant) return;
    if (!publicKey) {
      alert("Please connect your Freighter wallet to sign the Soroban transaction.");
      return;
    }
    
    setIsApproving(true);
    try {
      const { executeAddMerchant } = await import('@/lib/soroban/client');
      const txResponse = await executeAddMerchant(publicKey, selectedMerchant.address, selectedMerchant.category);
      
      if (txResponse && txResponse.status !== "ERROR") {
      
      const res = await fetch('/api/merchants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedMerchant.id, isWhitelisted: true })
      });
      
      if (res.ok) {
        setMerchants(merchants.map(m => m.id === selectedMerchant.id ? { ...m, status: 'approved' } : m));
        setSelectedMerchant({ ...selectedMerchant, status: 'approved' });
        } else {
          alert('Failed to update database after Soroban transaction');
        }
      }
    } catch (error) {
      console.error('Failed to approve merchant', error);
      alert('Failed to approve merchant');
    } finally {
      setIsApproving(false);
    }
  };

  const filteredMerchants = merchants.filter(m => statusFilter === 'all' || m.status === statusFilter);

  const sortedMerchants = [...filteredMerchants].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  return (
    <>
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''}`}>
        <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Whitelisted Merchants</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`transition-colors p-1.5 rounded-md flex items-center justify-center cursor-pointer relative ${statusFilter !== 'all' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : 'text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700'}`}
                title="Filter by Status"
              >
                <Filter className="w-4 h-4" />
                {statusFilter !== 'all' && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center bg-white rounded-full shadow-sm">
                    {statusFilter === 'approved' && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />}
                    {statusFilter === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                    {statusFilter === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                )}
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {['all', 'approved', 'pending', 'rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <span className="capitalize">{status === 'all' ? 'All Status' : status}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 p-1.5 rounded-md flex items-center justify-center cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-5 border-b border-slate-100">Merchant Details</th>
                <th className="px-6 py-5 border-b border-slate-100">Category</th>
                <th className="px-6 py-5 border-b border-slate-100">Wallet Address</th>
                <th className="px-6 py-5 border-b border-slate-100 group cursor-pointer select-none" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                  <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-700 transition-colors">
                    Date
                    {sortOrder === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                  </div>
                </th>
                <th className="px-6 py-5 border-b border-slate-100">Status</th>
                <th className="px-6 py-5 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Loading merchants...
                  </td>
                </tr>
              ) : sortedMerchants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No merchants found.
                  </td>
                </tr>
              ) : (
                sortedMerchants.map((merchant) => (
                  <tr key={merchant.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{merchant.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{merchant.id.substring(0, 10)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-600">{merchant.category}</td>
                    <td className="px-6 py-5 font-mono text-slate-600">{merchant.address.substring(0,4)}...{merchant.address.substring(merchant.address.length-4)}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMerchant && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedMerchant(null)}>
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
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isApproving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isApproving ? 'Approving...' : 'Approve Merchant'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
