'use client';
import { useState, useCallback } from 'react';
import { useWalletContext } from '@/components/WalletProvider';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  const wallet = useWalletContext();
  const { publicKey } = wallet;
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Sarah Jenkins!</h1>
        <p className="text-slate-500 mt-1">Enforcing 100% transparent and restricted spending for DSWD.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Wallet Balance Card */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-slate-500 mb-1">Stellar Wallet Balance</h2>
              <div className="flex items-baseline gap-2">
                {publicKey ? (
                   <span className="text-3xl font-bold text-slate-900">Connected</span>
                ) : (
                   <span className="text-3xl font-bold text-slate-900">$24,560.85 <span className="text-xl text-slate-400 font-medium">USD</span></span>
                )}
              </div>
              {!publicKey ? (
                <p className="text-sm text-slate-400 mt-1">30,701.06 XLM (Demo)</p>
              ) : (
                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-2 font-mono inline-block border border-blue-100">
                  Active Address: {publicKey.substring(0, 6)}...{publicKey.substring(publicKey.length - 4)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={refresh} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
                View Assets
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
                Disbursement Hub
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
           <div className="grid grid-cols-2 gap-4 h-full">
              <div>
                <h3 className="text-xs font-medium text-slate-500 mb-1">Active Programs</h3>
                <p className="text-2xl font-bold text-slate-900">4</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-slate-500 mb-1">Pending Claims</h3>
                <p className="text-2xl font-bold text-slate-900">2</p>
              </div>
              <div className="col-span-2 mt-auto">
                <h3 className="text-xs font-medium text-slate-500 mb-1">Last Payment</h3>
                <p className="text-lg font-bold text-slate-900">$1,200.00</p>
              </div>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Recent Disbursements History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-5 border-b border-slate-100">Date</th>
                <th className="px-6 py-5 border-b border-slate-100">Program</th>
                <th className="px-6 py-5 border-b border-slate-100">Recipient</th>
                <th className="px-6 py-5 border-b border-slate-100">Amount</th>
                <th className="px-6 py-5 border-b border-slate-100">Transaction ID</th>
                <th className="px-6 py-5 border-b border-slate-100">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">Oct 26, 2026</td>
                <td className="px-6 py-5 font-medium text-slate-900">4Ps Education Grant</td>
                <td className="px-6 py-5">Metropolis resident<br/><span className="text-xs text-slate-400 font-mono">GBQX...084L</span></td>
                <td className="px-6 py-5 font-medium">$1,200.00 USD<br/><span className="text-xs text-slate-400 font-normal">1,500 XLM</span></td>
                <td className="px-6 py-5 text-slate-500 font-mono text-xs">e3c5...a4f3</td>
                <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs"><CheckCircle2 className="h-3.5 w-3.5"/> Confirmed</span></td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">Oct 26, 2026</td>
                <td className="px-6 py-5 font-medium text-slate-900">Housing Assistance</td>
                <td className="px-6 py-5">Metropolis resident<br/><span className="text-xs text-slate-400 font-mono">GBQX...084L</span></td>
                <td className="px-6 py-5 font-medium">$1,200.00 USD<br/><span className="text-xs text-slate-400 font-normal">1,500 XLM</span></td>
                <td className="px-6 py-5 text-slate-500 font-mono text-xs">e3c5...a4f3</td>
                <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs"><CheckCircle2 className="h-3.5 w-3.5"/> Confirmed</span></td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">Oct 26, 2026</td>
                <td className="px-6 py-5 font-medium text-slate-900">Health Subsidy</td>
                <td className="px-6 py-5">Metropolis resident<br/><span className="text-xs text-slate-400 font-mono">GBQX...084L</span></td>
                <td className="px-6 py-5 font-medium">$1,200.00 USD<br/><span className="text-xs text-slate-400 font-normal">1,500 XLM</span></td>
                <td className="px-6 py-5 text-slate-500 font-mono text-xs">e3c5...a4f3</td>
                <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs"><CheckCircle2 className="h-3.5 w-3.5"/> Confirmed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400">
        Powered by <strong>Stellar Network</strong> & Soroban
      </div>
    </div>
  );
}
