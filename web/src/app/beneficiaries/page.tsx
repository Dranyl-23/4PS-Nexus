'use client';
import { useState } from 'react';
import { BeneficiaryTable } from '@/components/beneficiaries/BeneficiaryTable';
import { Users, Link as LinkIcon, BadgeCheck, Loader2 } from 'lucide-react';

export default function BeneficiariesPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  // A pool of valid-format Stellar testnet public keys for demo use
  const DEMO_WALLETS = [
    "GBSI3CP5LLRUMQ3UZSIGJ5APTTEFKZGAJZFN3H6TKSG2NN4ABKWR6UB4",
    "GAXH7YHUL5FWFJF3LCZQ74XOQHQX6E2GBUJQBS3FMYB5FVRS7UUOAKR",
    "GDM1WNHQCBWMKRL9Z6XNHPLKJQSJ3KZUAJPWJH3FXKKM1KCQFPNZSVX",
    "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGZDDX5E5H2OVCZQFPNZAPM",
    "GBVNQHPLQQMBZLQHRG3WNLKQ2KVJXAJPWJH4BXOITVB5KV3CDTHNJVLT",
  ];

  const handleRegisterDemo = async () => {
    setIsRegistering(true);
    try {
      const randomWallet = DEMO_WALLETS[Math.floor(Math.random() * DEMO_WALLETS.length)];
      const res = await fetch('/api/kyc/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: randomWallet,
          fullName: "Demo Beneficiary " + Math.floor(Math.random() * 100),
          address: "Brgy. Demo, Sample City, Philippines"
        })
      });
      if (res.ok) {
        window.location.reload(); // Reload to fetch new data
      }
    } catch (error) {
      console.error(error);
      alert("Failed to register");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Beneficiary Registry</h1>
          <p className="text-slate-500 mt-1">Manage enrolled families and track 4Ps compliance.</p>
        </div>
        <button 
          onClick={handleRegisterDemo} 
          disabled={isRegistering}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
          {isRegistering ? 'Registering...' : 'Register Demo Beneficiary (KYC)'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <div className="p-2 md:p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">Total Enrolled</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-bold text-slate-900">4,280</span>
            <span className="text-xs md:text-sm font-medium text-slate-500">Families</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <div className="p-2 md:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <BadgeCheck className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">Compliant</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-bold text-slate-900">3,950</span>
            <span className="text-xs md:text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">92%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <div className="p-2 md:p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <LinkIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">Wallets Linked</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-bold text-slate-900">4,120</span>
            <span className="text-xs md:text-sm font-medium text-slate-500">Accounts</span>
          </div>
        </div>
      </div>

      <BeneficiaryTable />
    </div>
  );
}
