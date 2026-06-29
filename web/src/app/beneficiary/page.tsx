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
    <div className="bg-slate-100 min-h-screen flex justify-center items-start pt-0 sm:pt-10 pb-10">
      {/* Mobile Device Container */}
      <div className="w-full max-w-[400px] bg-white min-h-[800px] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative border-x border-b sm:border border-slate-200">
        
        {/* App Header (Gradient) */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 pt-12 pb-6 text-white rounded-b-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-blue-100 text-sm font-medium">Magandang araw,</p>
              <h1 className="text-xl font-bold">Maria Santos</h1>
            </div>
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20">
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">4P-Token Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">1,500</span>
              <span className="text-sm font-medium text-blue-200">XLM</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-blue-100">Wallet Connected</span>
              <div className="scale-75 origin-right">
                <ConnectWallet {...wallet} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-8">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowPayModal(true)}
              className="bg-blue-50 hover:bg-blue-100 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border border-blue-100"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-sm text-white">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-blue-900">Scan to Pay</span>
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 border border-slate-200">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700">Transfer</span>
            </button>
          </div>
        </div>

        {/* Digital ID Banner */}
        <div className="px-6 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 flex items-center gap-4 text-white shadow-sm">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold">Verified 4Ps Beneficiary</p>
              <p className="text-xs text-emerald-100">DSWD ID: 4PS-2026-9812</p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="px-6 flex-1 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Recent Transactions</h2>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Puregold Metropolis</p>
                <p className="text-xs text-slate-500">Groceries • Today, 10:42 AM</p>
              </div>
              <p className="text-sm font-bold text-slate-900">-450 XLM</p>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0">
                <Pill className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Mercury Drug</p>
                <p className="text-xs text-slate-500">Medicines • Oct 24, 2026</p>
              </div>
              <p className="text-sm font-bold text-slate-900">-210 XLM</p>
            </div>
          </div>
        </div>

        {/* Demo Pay Modal */}
        {showPayModal && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
              
              {payStatus === 'idle' && (
                <>
                  <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Pay Merchant</h3>
                  <p className="text-sm text-center text-slate-500 mb-8">Scan a QR code at an accredited merchant to spend your 4P-Tokens.</p>
                  
                  <div className="aspect-square bg-slate-100 rounded-2xl mb-8 flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden">
                    <div className="absolute inset-8 border-2 border-blue-500/50 rounded-lg"></div>
                    <QrCode className="w-12 h-12 text-slate-400" />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setShowPayModal(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">Cancel</button>
                    <button onClick={handleDemoPay} className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm">Simulate Scan</button>
                  </div>
                </>
              )}

              {payStatus === 'scanning' && (
                <div className="py-12 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-lg font-bold text-slate-900">Verifying Merchant...</h3>
                  <p className="text-sm text-slate-500 mt-2 text-center">Checking if merchant is accredited on Soroban.</p>
                </div>
              )}

              {payStatus === 'success' && (
                <div className="py-12 flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-600">Payment Successful!</h3>
                  <p className="text-sm text-slate-500 mt-2 text-center">Sent 450 XLM to Puregold Metropolis.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
