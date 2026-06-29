'use client';
import { QrCode, ArrowRightLeft, MapPin, Store, CheckCircle2, ChevronRight, Vault } from 'lucide-react';
import { useWalletContext } from '@/components/WalletProvider';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 rounded-xl flex items-center justify-center animate-pulse"><p className="text-slate-400">Loading map...</p></div>
});

export default function BeneficiaryApp() {
  const wallet = useWalletContext();
  const { publicKey } = wallet;
  const [showPayModal, setShowPayModal] = useState(false);
  const [payStatus, setPayStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [showMapModal, setShowMapModal] = useState(false);

  const handleDemoPay = () => {
    setPayStatus('scanning');
    setTimeout(() => {
      setPayStatus('success');
      setTimeout(() => {
        setShowPayModal(false);
        setPayStatus('idle');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Top Header Label */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Dashboard <span className="text-slate-400 font-normal text-lg">/ Beneficiary Portal</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Next disbursement in 4 days, 12 hrs
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actions Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 mb-6 border border-slate-200 shadow-sm">
            <QrCode className="w-8 h-8" />
          </div>
          <button 
            onClick={() => setShowPayModal(true)}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
          >
            Scan to Pay
          </button>
          <p className="text-xs text-slate-400 mt-4 text-center">Scan QR at whitelisted merchants to spend 4P-Tokens.</p>
        </div>

        {/* Balance Dark Card */}
        <div className="lg:col-span-2 bg-[#121216] text-white rounded-2xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Vault className="w-48 h-48" />
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Total Available Balance</p>
              <h2 className="text-6xl font-bold tracking-tighter">1,500 <span className="text-2xl text-slate-500 font-medium">XLM</span></h2>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <p className="text-xs font-bold text-slate-300">Monthly Limit: 2,000</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 relative z-10 border-t border-white/10 pt-6">
            <div>
              <p className="text-xs text-slate-400 mb-1">Total Spent</p>
              <p className="text-lg font-bold">450 <span className="text-sm text-slate-500">XLM</span></p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Next Release</p>
              <p className="text-lg font-bold">500 <span className="text-sm text-slate-500">XLM</span></p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">DSWD ID</p>
              <p className="text-lg font-bold font-mono text-slate-300">4PS-2026-981</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-900 flex items-center gap-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Puregold
                </td>
                <td className="px-6 py-4 text-slate-500">Groceries</td>
                <td className="px-6 py-4 text-right font-mono text-slate-900">-450 XLM</td>
              </tr>
              <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-900 flex items-center gap-3">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span> Mercury Drug
                </td>
                <td className="px-6 py-4 text-slate-500">Medicines</td>
                <td className="px-6 py-4 text-right font-mono text-slate-900">-210 XLM</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Accredited Merchants Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900">Accredited Merchants</h3>
            <button 
              onClick={() => setShowMapModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
            >
              <MapPin className="w-3 h-3" /> View Map
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="px-6 py-4">Store Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Distance</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-400" /> Puregold Metropolis
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold uppercase tracking-wide">Verified</span>
                </td>
                <td className="px-6 py-4 text-right text-slate-500">0.5 km</td>
              </tr>
              <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-400" /> Mercury Drug
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold uppercase tracking-wide">Verified</span>
                </td>
                <td className="px-6 py-4 text-right text-slate-500">0.8 km</td>
              </tr>
              <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-400" /> SM Supermarket
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold uppercase tracking-wide">Verified</span>
                </td>
                <td className="px-6 py-4 text-right text-slate-500">1.2 km</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* Demo Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            {payStatus === 'idle' && (
              <>
                <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">Pay Merchant</h3>
                <p className="text-slate-500 text-center mb-8">Scan a QR code at an accredited merchant.</p>
                
                <div className="aspect-square bg-slate-50 rounded-2xl mb-8 flex items-center justify-center border-2 border-dashed border-slate-300 relative cursor-pointer" onClick={handleDemoPay}>
                  <QrCode className="w-16 h-16 text-slate-400" />
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setShowPayModal(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">Cancel</button>
                  <button onClick={handleDemoPay} className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm">Simulate Scan</button>
                </div>
              </>
            )}

            {payStatus === 'scanning' && (
              <div className="py-12 flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-900">Verifying Merchant...</h3>
              </div>
            )}

            {payStatus === 'success' && (
              <div className="py-12 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600">Payment Successful!</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Merchants Map</h3>
              <button onClick={() => setShowMapModal(false)} className="w-8 h-8 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center">
                X
              </button>
            </div>
            <div className="p-4 flex-1">
              <MapComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
