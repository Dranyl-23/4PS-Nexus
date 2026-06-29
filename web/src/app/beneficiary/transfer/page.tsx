'use client';
import { ArrowRightLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function TransferPage() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !amount) return;
    
    setStatus('processing');
    
    // Simulate smart contract checking
    setTimeout(() => {
      setStatus('error');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          Transfer <span className="text-slate-400 font-normal text-base md:text-lg">/ Send Funds</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Send 4P-Tokens to another wallet or merchant.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <form onSubmit={handleTransfer} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Address (Stellar PublicKey)</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="GABCDEFGHIJKLMNOPQRSTUVWXYZ..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount (XLM)</label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-xl"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-slate-400 font-bold">XLM</span>
                <button type="button" onClick={() => setAmount('1500')} className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300">MAX</button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">Available Balance: 1,500 XLM</p>
          </div>

          {status === 'idle' && (
            <button 
              type="submit" 
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg mt-4"
            >
              <ArrowRightLeft className="w-5 h-5" /> Confirm Transfer
            </button>
          )}

          {status === 'processing' && (
            <div className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl font-bold flex items-center justify-center gap-3 mt-4">
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              Executing Smart Contract...
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center text-center animate-in slide-in-from-bottom-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-rose-600 mb-2">Transaction Blocked</h3>
              <p className="text-sm text-rose-700/80 mb-4 max-w-sm">
                The Soroban Smart Contract rejected this transfer because the recipient is <b>not a Whitelisted Merchant</b>. 4P-Tokens can only be spent on essential goods.
              </p>
              <button 
                type="button" 
                onClick={() => setStatus('idle')}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold text-sm hover:bg-rose-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
