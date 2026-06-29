import React from 'react';
import { BadgeCheck, Clock, XCircle } from 'lucide-react';

const MOCK_DISBURSEMENTS = [
  {
    id: 'txn_1029381',
    date: '2026-06-28',
    recipient: 'GBLF...49XQ',
    amount: '150.00 USDC',
    status: 'completed',
  },
  {
    id: 'txn_1029382',
    date: '2026-06-29',
    recipient: 'GBZ2...L1K9',
    amount: '50.00 XLM',
    status: 'pending',
  },
  {
    id: 'txn_1029383',
    date: '2026-06-29',
    recipient: 'GDY4...0PA3',
    amount: '200.00 USDC',
    status: 'failed',
  },
];

export function DisbursementTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Recent Disbursements</h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-5 border-b border-slate-100">Transaction ID</th>
              <th className="px-6 py-5 border-b border-slate-100">Date</th>
              <th className="px-6 py-5 border-b border-slate-100">Recipient</th>
              <th className="px-6 py-5 border-b border-slate-100">Amount</th>
              <th className="px-6 py-5 border-b border-slate-100">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {MOCK_DISBURSEMENTS.map((txn) => (
              <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 font-mono text-slate-600">{txn.id}</td>
                  <td className="px-6 py-5 text-slate-900">{txn.date}</td>
                  <td className="px-6 py-5 font-mono text-slate-600">{txn.recipient}</td>
                  <td className="px-6 py-5 font-medium text-slate-900">{txn.amount}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      {txn.status === 'completed' && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                      {txn.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                      {txn.status === 'failed' && <XCircle className="w-4 h-4 text-rose-500" />}
                      <span className="capitalize text-slate-700">{txn.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
