'use client';
import { QrCode, ArrowRightLeft, History, ShoppingBag, Pill, Bell, CheckCircle2 } from 'lucide-react';
import ConnectWallet from '@/components/ConnectWallet';
import { useWalletContext } from '@/components/WalletProvider';
import { useState } from 'react';

export default function BeneficiaryApp() {
  const wallet = useWalletContext();
  const { publicKey } = wallet;
  const [showPayModal, setShowPayModal] = useState(false);
  const [payStatus, setPayStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

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
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5 text-white" />
              </button>
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
                <div className="flex items-center gap-4 p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900">Puregold Metropolis</p>
                    <p className="text-sm text-slate-500">Groceries • Today, 10:42 AM</p>
                  </div>
                  <p className="text-base font-bold text-slate-900">-450 XLM</p>
                </div>
                <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900">Mercury Drug</p>
                    <p className="text-sm text-slate-500">Medicines • Oct 24, 2026</p>
                  </div>
                  <p className="text-base font-bold text-slate-900">-210 XLM</p>
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
