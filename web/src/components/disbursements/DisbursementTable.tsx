import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Recent Disbursements</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Recipient</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_DISBURSEMENTS.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-600">{txn.id}</td>
                  <td className="px-6 py-4 text-slate-900">{txn.date}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{txn.recipient}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{txn.amount}</td>
                  <td className="px-6 py-4">
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
      </CardContent>
    </Card>
  );
}
