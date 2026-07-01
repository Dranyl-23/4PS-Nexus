import React from 'react';
import { DisbursementTable } from '@/components/disbursements/DisbursementTable';
import { DisbursementForm } from '@/components/disbursements/DisbursementForm';

export const metadata = {
  title: 'Disbursements | 4PS-Nexus',
};

export default function DisbursementsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-8 shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Disbursement Hub
          </h1>
        </div>
        <p className="text-slate-500 font-medium">
          Command Center • Initiate and track batch payouts to verified beneficiaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 flex-1 lg:min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-6 lg:min-h-0 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
              <p className="text-sm font-medium text-blue-100 mb-1">Total Disbursed</p>
              <h3 className="text-3xl font-black tracking-tight">0.00 <span className="text-lg text-blue-300">XLM</span></h3>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Batch</p>
              <h3 className="text-3xl font-black tracking-tight text-amber-500">0</h3>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Failed Txns</p>
              <h3 className="text-3xl font-black tracking-tight text-rose-500">0</h3>
            </div>
          </div>
          
          <div className="lg:flex-1 lg:min-h-0 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
            </div>
            <div className="flex-1 overflow-auto p-0">
              <DisbursementTable />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 shrink-0 lg:overflow-y-auto pb-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            <DisbursementForm />
          </div>
        </div>
      </div>
    </div>
  );
}
