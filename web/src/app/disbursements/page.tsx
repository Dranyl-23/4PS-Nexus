import React from 'react';
import { DisbursementTable } from '@/components/disbursements/DisbursementTable';
import { DisbursementForm } from '@/components/disbursements/DisbursementForm';

export const metadata = {
  title: 'Disbursements | 4PS-Nexus',
};

export default function DisbursementsPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Disbursements
        </h1>
        <p className="text-slate-500">
          Manage and initiate payouts to recipients instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 flex-1 lg:min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6 lg:min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Disbursed</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">$42,500.00</h3>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Pending</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">3</h3>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Failed</p>
              <h3 className="text-2xl font-bold tracking-tight text-rose-500">1</h3>
            </div>
          </div>
          
          <div className="lg:flex-1 lg:min-h-0">
            <DisbursementTable />
          </div>
        </div>
        
        <div className="lg:col-span-1 shrink-0 lg:overflow-y-auto pr-2 pb-2">
          <DisbursementForm />
        </div>
      </div>
    </div>
  );
}
