'use client';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Download } from 'lucide-react';
import { useState } from 'react';

const TRANSACTIONS = [
  {
    id: 'tx_1',
    date: '12 June 2026',
    time: '09:41 AM',
    type: 'spend',
    merchant: 'Puregold Metropolis',
    category: 'Groceries',
    amount: -450,
    status: 'Completed',
    hash: '5f3a...b29c'
  },
  {
    id: 'tx_2',
    date: '10 June 2026',
    time: '02:15 PM',
    type: 'spend',
    merchant: 'Mercury Drug',
    category: 'Medicines',
    amount: -210,
    status: 'Completed',
    hash: '8a1f...c441'
  },
  {
    id: 'tx_3',
    date: '01 June 2026',
    time: '08:00 AM',
    type: 'receive',
    merchant: 'DSWD Disbursement',
    category: 'Monthly Grant',
    amount: 1500,
    status: 'Completed',
    hash: '9x8b...a112'
  },
  {
    id: 'tx_4',
    date: '28 May 2026',
    time: '11:20 AM',
    type: 'spend',
    merchant: 'SM Supermarket',
    category: 'Groceries',
    amount: -340,
    status: 'Completed',
    hash: '2c4d...e55f'
  },
  {
    id: 'tx_5',
    date: '01 May 2026',
    time: '08:00 AM',
    type: 'receive',
    merchant: 'DSWD Disbursement',
    category: 'Monthly Grant',
    amount: 1500,
    status: 'Completed',
    hash: '1a2b...3c4d'
  }
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'receive' | 'spend'>('all');
  const [search, setSearch] = useState('');

  const filteredTx = TRANSACTIONS.filter(tx => {
    if (filter !== 'all' && tx.type !== filter) return false;
    if (search && !tx.merchant.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            Transactions <span className="text-slate-400 font-normal text-base md:text-lg">/ History</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View your complete transaction history on the Stellar blockchain.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Tabs & Search */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 bg-slate-50">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-200/50'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('receive')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'receive' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-200/50'}`}
            >
              Received
            </button>
            <button 
              onClick={() => setFilter('spend')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'spend' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-200/50'}`}
            >
              Spent
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount (XLM)</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'receive' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                        {tx.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{tx.merchant}</p>
                        <p className="text-xs text-slate-500">{tx.category} • {tx.hash}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-900">{tx.date}</p>
                    <p className="text-xs text-slate-500">{tx.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${tx.type === 'receive' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'receive' ? '+' : ''}{tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTx.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-sm">No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
