'use client';
import { QrCode, ArrowRightLeft, MapPin, Store, CheckCircle2, ChevronRight, Vault, Bell, Receipt, X, Info } from 'lucide-react';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

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
      
      {/* Top Header Label & Notifications */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
            Dashboard <span className="text-slate-400 font-normal text-base md:text-lg">/ Beneficiary Portal</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span> Next disbursement in 4 days, 12 hrs
          </p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">DSWD Messages</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer bg-blue-50/30">
                  <p className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1"><Info className="w-3 h-3"/> System Alert</p>
                  <p className="text-sm font-medium text-slate-900 mb-1">Budget Released</p>
                  <p className="text-xs text-slate-500">Ang imong 1,500 XLM nga budget karong bulana na-release na sa imong account.</p>
                </div>
                <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs font-bold text-rose-500 mb-1 flex items-center gap-1"><Info className="w-3 h-3"/> Emergency Alert</p>
                  <p className="text-sm font-medium text-slate-900 mb-1">Calamity Relief</p>
                  <p className="text-xs text-slate-500">Tungod sa bag-ong bagyo, nagpadala mi ug extra 500 XLM para emergency fund.</p>
                </div>
              </div>
            </div>
          )}
        </div>
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
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Total Available Balance</p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter flex items-baseline gap-2">
                1,500 <span className="text-xl md:text-2xl text-slate-500 font-medium">XLM</span>
              </h2>
            </div>
            <div className="bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg backdrop-blur-sm border border-white/10 shrink-0">
              <p className="text-[10px] md:text-xs font-bold text-slate-300">Monthly Limit: 2,000</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 relative z-10 border-t border-white/10 pt-6">
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 mb-1 uppercase">Total Spent</p>
              <p className="text-base md:text-lg font-bold">450 <span className="text-xs md:text-sm text-slate-500">XLM</span></p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 mb-1 uppercase">Next Release</p>
              <p className="text-base md:text-lg font-bold">500 <span className="text-xs md:text-sm text-slate-500">XLM</span></p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-[10px] md:text-xs text-slate-400 mb-1 uppercase">DSWD ID</p>
              <p className="text-base md:text-lg font-bold font-mono text-slate-300">4PS-2026-981</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm md:text-base">Recent Transactions</h3>
            <button className="text-[10px] md:text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-4 md:px-6 py-4">Merchant</th>
                  <th className="px-4 md:px-6 py-4">Category</th>
                  <th className="px-4 md:px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm font-medium">
                <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedTx({ merchant: 'Puregold', amount: 450, category: 'Groceries', hash: '5f3a...b29c', items: ['5kg Dinorado Rice', '1x Century Tuna Flakes', '1x 500ml Cooking Oil', '1L Fresh Milk'] })}>
                  <td className="px-4 md:px-6 py-4 text-slate-900 flex items-center gap-2 md:gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></span> Puregold
                  </td>
                  <td className="px-4 md:px-6 py-4 text-slate-500">Groceries</td>
                  <td className="px-4 md:px-6 py-4 text-right font-mono text-slate-900 whitespace-nowrap">-450 XLM</td>
                </tr>
                <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedTx({ merchant: 'Mercury Drug', amount: 210, category: 'Medicines', hash: '8a1f...c441', items: ['1x Ascorbic Acid (100 tabs)', '1x Paracetamol Biogesic'] })}>
                  <td className="px-4 md:px-6 py-4 text-slate-900 flex items-center gap-2 md:gap-3">
                    <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0"></span> Mercury Drug
                  </td>
                  <td className="px-4 md:px-6 py-4 text-slate-500">Medicines</td>
                  <td className="px-4 md:px-6 py-4 text-right font-mono text-slate-900 whitespace-nowrap">-210 XLM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Accredited Merchants Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm md:text-base">Accredited Merchants</h3>
            <button 
              onClick={() => setShowMapModal(true)}
              className="text-[10px] md:text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              <MapPin className="w-3 h-3" /> View Map
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-4 md:px-6 py-4">Store Name</th>
                  <th className="px-4 md:px-6 py-4">Status</th>
                  <th className="px-4 md:px-6 py-4 text-right">Distance</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm font-medium">
                <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 text-slate-900 flex items-center gap-2 whitespace-nowrap">
                    <Store className="w-4 h-4 text-slate-400 shrink-0" /> Puregold Metropolis
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-[9px] md:text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold uppercase tracking-wide">Verified</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right text-slate-500 whitespace-nowrap">0.5 km</td>
                </tr>
                <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 text-slate-900 flex items-center gap-2 whitespace-nowrap">
                    <Store className="w-4 h-4 text-slate-400 shrink-0" /> Mercury Drug
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-[9px] md:text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold uppercase tracking-wide">Verified</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right text-slate-500 whitespace-nowrap">0.8 km</td>
                </tr>
                <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 text-slate-900 flex items-center gap-2 whitespace-nowrap">
                    <Store className="w-4 h-4 text-slate-400 shrink-0" /> SM Supermarket
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-[9px] md:text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold uppercase tracking-wide">Verified</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right text-slate-500 whitespace-nowrap">1.2 km</td>
                </tr>
              </tbody>
            </table>
          </div>
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

      {/* Itemized Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-t-[12px] border-slate-900">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Digital Receipt</p>
                <h3 className="text-2xl font-bold text-slate-900">{selectedTx.merchant}</h3>
                <p className="text-sm text-slate-500">12 June 2026, 09:41 AM</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Itemized Breakdown</p>
              <ul className="space-y-2 mb-4 border-b border-slate-200 pb-4">
                {selectedTx.items.map((item: string, i: number) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-lg font-mono text-slate-900">{selectedTx.amount} XLM</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-6">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase">Smart Contract Verified</p>
                <p className="text-[10px] opacity-80">Eligible 4Ps Goods Only</p>
              </div>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-mono break-all">
              TxHash: {selectedTx.hash}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
