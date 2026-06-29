import React from 'react';
import { DisbursementTable } from '@/components/disbursements/DisbursementTable';
import { DisbursementForm } from '@/components/disbursements/DisbursementForm';

export const metadata = {
  title: 'Disbursements | 4PS-Nexus',
};

export default function DisbursementsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Disbursements
        </h1>
        <p className="text-slate-500">
          Manage and initiate payouts to recipients instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-indigo-600 text-white shadow-sm">
              <p className="text-sm font-medium opacity-80 mb-1">Total Disbursed</p>
              <h3 className="text-2xl font-bold tracking-tight">$42,500.00</h3>
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
          
          <DisbursementTable />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <DisbursementForm />
          </div>
        </div>
      </div>
    </div>
  );
}
