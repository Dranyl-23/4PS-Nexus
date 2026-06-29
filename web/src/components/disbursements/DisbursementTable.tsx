'use client';
import React, { useState } from 'react';
import { BadgeCheck, Clock, XCircle, Maximize, Minimize, Filter, ChevronDown, ArrowDown, ArrowUp } from 'lucide-react';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredDisbursements = MOCK_DISBURSEMENTS.filter(d => statusFilter === 'all' || d.status === statusFilter);

  const sortedDisbursements = [...filteredDisbursements].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''}`}>
      <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Recent Disbursements</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`transition-colors p-1.5 rounded-md flex items-center justify-center cursor-pointer relative ${statusFilter !== 'all' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : 'text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700'}`}
              title="Filter by Status"
            >
              <Filter className="w-4 h-4" />
              {statusFilter !== 'all' && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {['all', 'completed', 'pending', 'failed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <span className="capitalize">{status === 'all' ? 'All Status' : status}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 p-1.5 rounded-md flex items-center justify-center cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-5 border-b border-slate-100">Transaction ID</th>
              <th className="px-6 py-5 border-b border-slate-100 group cursor-pointer select-none" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-700 transition-colors">
                  Date
                  {sortOrder === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                </div>
              </th>
              <th className="px-6 py-5 border-b border-slate-100">Recipient</th>
              <th className="px-6 py-5 border-b border-slate-100">Amount</th>
              <th className="px-6 py-5 border-b border-slate-100">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {sortedDisbursements.map((txn) => (
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
