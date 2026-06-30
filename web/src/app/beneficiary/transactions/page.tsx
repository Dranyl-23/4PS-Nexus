'use client';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Download, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWalletContext } from '@/components/WalletProvider';

export default function TransactionsPage() {
  const { publicKey } = useWalletContext();
  const [filter, setFilter] = useState<'all' | 'receive' | 'spend'>('all');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTx() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/beneficiary/transactions?wallet=${publicKey}`);
        if (res.ok) {
          setTransactions(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTx();
  }, [publicKey]);

  const filteredTx = transactions.filter(tx => {
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
        {/* Tabs & Search */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 bg-slate-50 shrink-0">
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
        <div className="overflow-x-auto flex-1">
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
              {isLoading ? (
                <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" /></td></tr>
              ) : !publicKey ? (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">Please connect your wallet.</td></tr>
              ) : filteredTx.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">No transactions found.</td></tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'receive' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                          {tx.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{tx.merchant}</p>
                          <p className="text-xs text-slate-500">{tx.category} • {tx.txHash}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{new Date(tx.date).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${tx.type === 'receive' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'receive' ? '+' : '-'}{Math.abs(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

