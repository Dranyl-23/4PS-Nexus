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
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-24 md:pb-8">
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

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
        {/* Tabs & Search */}
        <div className="px-5 py-4 md:px-6 md:py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 bg-white shrink-0">
          
          {/* Segmented Control Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-max">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-900'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('receive')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${filter === 'receive' ? 'bg-white text-emerald-600 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Received
              </button>
              <button 
                onClick={() => setFilter('spend')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${filter === 'spend' ? 'bg-white text-orange-600 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Spent
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-72 group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search merchants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-sm transition-all"
            />
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /><p className="text-sm text-slate-500 font-medium">Loading history...</p></div>
          ) : !publicKey ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4"><div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4"><Search className="w-8 h-8" /></div><h3 className="font-bold text-slate-900 text-lg mb-1">Wallet Disconnected</h3><p className="text-slate-500 text-sm">Please connect your wallet to view history.</p></div>
          ) : filteredTx.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4"><div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4"><Search className="w-8 h-8" /></div><h3 className="font-bold text-slate-900 text-lg mb-1">No Transactions Found</h3><p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p></div>
          ) : (
            <div className="flex flex-col">
              {filteredTx.map((tx) => (
                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors gap-4 sm:gap-6">
                  
                  {/* Left Side: Icon & Details */}
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${tx.type === 'receive' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-500/20' : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-orange-500/20'}`}>
                      {tx.type === 'receive' ? <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6" /> : <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm md:text-base truncate">{tx.merchant}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] md:text-xs text-slate-500 truncate">
                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 truncate hidden md:block">{tx.txHash}</p>
                    </div>
                  </div>

                  {/* Right Side: Status & Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0 w-full sm:w-auto pl-14 sm:pl-0">
                    <span className={`px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center justify-center ${
                      tx.status === 'COMPLETED' || tx.status === 'SIMULATED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {tx.status}
                    </span>
                    <div className={`font-mono font-black text-base md:text-lg text-right ${tx.type === 'receive' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'receive' ? '+' : '-'}{Math.abs(tx.amount)} <span className="text-xs md:text-sm font-bold text-slate-400">XLM</span>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

