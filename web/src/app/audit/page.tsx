import React from 'react';
import { AuditTable } from '@/components/audit/AuditTable';

export const metadata = {
  title: 'Audit & Compliance | 4PS-Nexus',
};

export default function AuditPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Audit & Compliance
        </h1>
        <p className="text-slate-500">
          Monitor transactions and identify suspicious activities across the network.
        </p>
      </div>

      <div className="lg:flex-1 lg:min-h-0">
        <AuditTable />
      </div>
    </div>
  );
}
