'use client';
import { QrCode, ArrowRightLeft, History, ShoppingBag, Pill, Bell, CheckCircle2, MapPin, Store, X, Receipt, Info } from 'lucide-react';
import ConnectWallet from '@/components/ConnectWallet';
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
  const [selectedTx, setSelectedTx] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
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
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pb-24">
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <div className="flex justify-between items-center mb-8">
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">4PS-Nexus Beneficiary Portal</h1>
              <p className="text-blue-100 text-sm mt-1">Manage your restricted funds securely.</p>
            </div>
            <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-indigo-600"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-in fade-in slide-in-from-top-4">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm">Announcements</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    <div className="p-4 bg-blue-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Budget Released</p>
                          <p className="text-xs text-slate-600 mt-1">Na-release na ang imong 1,500 XLM nga budget karong bulana. Pwede na kini gamiton sa mga accredited merchants.</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">Just now</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-rose-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Emergency Relief Fund</p>
                          <p className="text-xs text-slate-600 mt-1">Tungod sa bag-ong bagyo, nagpadala ang DSWD ug extra 500 XLM para sa inyong emergency grocery fund.</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ConnectWallet {...wallet} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Balance & ID Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Balance Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <p className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-2">Available Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">1,500</span>
                  <span className="text-lg font-medium text-slate-400">XLM (4P-Token)</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Welcome back, Maria Santos</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setShowPayModal(true)}
                  className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" /> Scan to Pay
                </button>
                <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-200">
                  <ArrowRightLeft className="w-5 h-5" /> Transfer
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="p-0">
                <div 
                  onClick={() => setSelectedTx('puregold')}
                  className="flex items-center gap-4 p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0 group-hover:bg-orange-100 transition-colors">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Puregold Metropolis</p>
                    <p className="text-sm text-slate-500">Groceries • Today, 10:42 AM</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900">-450 XLM</p>
                    <p className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Receipt</p>
                  </div>
                </div>
                <div 
                  onClick={() => setSelectedTx('mercury')}
                  className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0 group-hover:bg-rose-100 transition-colors">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Mercury Drug</p>
                    <p className="text-sm text-slate-500">Medicines • Oct 24, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900">-210 XLM</p>
                    <p className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Receipt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Digital ID Banner */}
            <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <ShieldIcon className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="text-lg font-bold">Verified Beneficiary</p>
                <p className="text-sm text-emerald-100 mt-1">DSWD ID: 4PS-2026-9812</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-emerald-200">Status</p>
                  <p className="text-sm font-medium">Active & Eligible</p>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Wallet Address</p>
                  <p className="text-sm text-slate-700 font-mono mt-1 break-all bg-slate-50 p-2 rounded border border-slate-100">
                    {publicKey || 'Not Connected'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Network</p>
                  <p className="text-sm text-slate-700 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Stellar Testnet
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Accredited Merchants Directory */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Nearby Accredited Merchants</h2>
              <p className="text-sm text-slate-500 mt-1">Use your 4P-Tokens at these whitelisted stores.</p>
            </div>
            <button 
              onClick={() => setShowMapModal(true)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> View Map
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Merchant 1 */}
            <div className="border border-slate-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <Store className="w-6 h-6" />
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Whitelisted
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Puregold Metropolis</h3>
              <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> 0.5 km away • Main Avenue
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Groceries</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Essentials</span>
              </div>
            </div>

            {/* Merchant 2 */}
            <div className="border border-slate-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                  <Store className="w-6 h-6" />
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Whitelisted
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Mercury Drug</h3>
              <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> 0.8 km away • Central Plaza
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Medicines</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Vitamins</span>
              </div>
            </div>

            {/* Merchant 3 */}
            <div className="border border-slate-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Store className="w-6 h-6" />
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Whitelisted
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">SM Supermarket</h3>
              <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> 1.2 km away • SM City
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Groceries</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Meat & Produce</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Demo Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            {payStatus === 'idle' && (
              <>
                <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">Pay Merchant</h3>
                <p className="text-slate-500 text-center mb-8">Scan a QR code at an accredited merchant to spend your 4P-Tokens.</p>
                
                <div className="aspect-square bg-slate-50 rounded-2xl mb-8 flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden group hover:bg-slate-100 transition-colors cursor-pointer" onClick={handleDemoPay}>
                  <div className="absolute inset-8 border-2 border-blue-500/30 rounded-lg group-hover:border-blue-500/60 transition-colors"></div>
                  <QrCode className="w-16 h-16 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setShowPayModal(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Cancel</button>
                  <button onClick={handleDemoPay} className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">Simulate Scan</button>
                </div>
              </>
            )}

            {payStatus === 'scanning' && (
              <div className="py-12 flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-900">Verifying Merchant...</h3>
                <p className="text-slate-500 mt-2 text-center">Checking if merchant is accredited on Soroban.</p>
              </div>
            )}

            {payStatus === 'success' && (
              <div className="py-12 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600">Payment Successful!</h3>
                <p className="text-slate-500 mt-2 text-center">Sent 450 XLM to Puregold Metropolis.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Itemized Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            {/* Receipt Header */}
            <div className="bg-slate-50 px-6 py-6 border-b border-slate-200 relative">
              <button 
                onClick={() => setSelectedTx(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Digital Receipt</h3>
              <p className="text-sm text-slate-500 mt-1">Proof of Purchase (On-chain)</p>
            </div>
            
            {/* Receipt Body */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="font-bold text-slate-900">{selectedTx === 'puregold' ? 'Puregold Metropolis' : 'Mercury Drug'}</p>
                  <p className="text-sm text-slate-500">Merchant ID: {selectedTx === 'puregold' ? 'PGM-981' : 'MD-102'}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Validated
                </span>
              </div>

              <div className="border-t border-dashed border-slate-300 my-4"></div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Itemized Goods</h4>
              
              {selectedTx === 'puregold' ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">1x 5kg Dinorado Rice</span>
                    <span className="font-medium text-slate-900">280 XLM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">2x Century Tuna (Canned)</span>
                    <span className="font-medium text-slate-900">70 XLM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">1x Anchor Milk Powder 500g</span>
                    <span className="font-medium text-slate-900">100 XLM</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">1x Paracetamol (Box of 20)</span>
                    <span className="font-medium text-slate-900">80 XLM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">1x Vitamin C Syrup 120ml</span>
                    <span className="font-medium text-slate-900">130 XLM</span>
                  </div>
                </div>
              )}

              <div className="border-t border-dashed border-slate-300 my-4"></div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-700">Total Paid</span>
                <span className="text-2xl font-bold text-slate-900">{selectedTx === 'puregold' ? '450' : '210'} XLM</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Blockchain Hash</p>
                <p className="text-xs font-mono text-slate-700 break-all">{selectedTx === 'puregold' ? '0x8f2a...c3b19d4e7f' : '0x1a9c...8f2b3e4d5c'}</p>
              </div>
            </div>
            
            {/* Receipt Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-400">Powered by 4PS-Nexus & Soroban</p>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">Merchants Map</h3>
                <p className="text-xs text-slate-500">Locate accredited stores near you</p>
              </div>
              <button 
                onClick={() => setShowMapModal(false)}
                className="w-8 h-8 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
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

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
