import React from 'react';
import { MerchantTable } from '@/components/merchants/MerchantTable';
import { AddMerchantForm } from '@/components/merchants/AddMerchantForm';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Merchants | 4PS-Nexus',
};

export const dynamic = 'force-dynamic';

export default async function MerchantsPage() {
  const totalApproved = await prisma.merchant.count({ where: { isWhitelisted: true } });
  const pendingReview = await prisma.merchant.count({ where: { isWhitelisted: false } });
  const rejected = 0; // We don't have a rejected status in DB yet, so keeping it 0.

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Merchant Approvals
        </h1>
        <p className="text-slate-500">
          Manage whitelisted vendors and enforce restricted spending rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 flex-1 lg:min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6 lg:min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Approved</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">{totalApproved}</h3>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">{pendingReview}</h3>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Rejected</p>
              <h3 className="text-2xl font-bold tracking-tight text-rose-500">{rejected}</h3>
            </div>
          </div>
          
          <div className="lg:flex-1 lg:min-h-0">
            <MerchantTable />
          </div>
        </div>
        
        <div className="lg:col-span-1 shrink-0 lg:overflow-y-auto pr-2 pb-2">
          <AddMerchantForm />
        </div>
      </div>
    </div>
  );
}
