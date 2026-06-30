'use client';
import { ArrowRightLeft, ShieldAlert, CheckCircle2, Store, Loader2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Merchant {
  id: string;
  businessName: string;
  wallet: string;
  isWhitelisted: boolean;
}

export default function TransferPage() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'error' | 'success'>('idle');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMerchants() {
      try {
        const res = await fetch('/api/merchants');
        if (res.ok) {
          const data: Merchant[] = await res.json();
          setMerchants(data.filter(m => m.isWhitelisted));
        }
      } catch (error) {
        console.error("Failed to fetch merchants", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMerchants();
  }, []);

  const selectedMerchant = merchants.find(m => m.wallet === address);
  const isAddressValid = address.length > 0 && selectedMerchant;
  const isAddressInvalid = address.length > 0 && !selectedMerchant;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !amount) return;
    
    setStatus('processing');
    
    // Simulate smart contract checking and execution
    setTimeout(() => {
      if (isAddressValid) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          Transfer <span className="text-slate-400 font-normal text-base md:text-lg">/ Send Funds</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Send 4P-Tokens directly to authorized wallets.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 mb-1">Programmable Money Restriction Active</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            4P-Tokens can <b>only</b> be sent to DSWD-Accredited Merchants. 
            Transfers to unauthorized wallets, regular user accounts, or exchanges will be automatically rejected by the Soroban Smart Contract to prevent misuse of funds.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <form onSubmit={handleTransfer} className="flex flex-col gap-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Quick Select Merchant</span>
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
            </label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-medium text-slate-700"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            >
              <option value="">-- Choose from address book --</option>
              {merchants.map(m => (
                <option key={m.id} value={m.wallet}>{m.businessName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Address (Stellar PublicKey)</label>
            <div className="relative">
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="GABCDEFGHIJKLMNOPQRSTUVWXYZ..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 font-mono text-sm transition-colors ${
                  isAddressValid ? 'border-emerald-500 focus:ring-emerald-500 bg-emerald-50/30 text-emerald-900' : 
                  isAddressInvalid ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/30 text-rose-900' : 
                  'border-slate-200 focus:ring-slate-900'
                }`}
                required
              />
              {isAddressValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </div>
              )}
            </div>
            
            {/* Validation Feedback */}
            {isAddressValid && (
              <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                <Store className="w-3.5 h-3.5" /> Matched: {selectedMerchant.businessName}
              </p>
            )}
            {isAddressInvalid && (
              <p className="text-xs text-rose-600 font-bold mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Unverified Wallet. Smart contract will reject this transfer.
              </p>
            )}
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
                <button type="button" onClick={() => setAmount('1500')} className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300 transition-colors">MAX</button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">Available Balance: 1,500 XLM</p>
          </div>

          {status === 'idle' && (
            <button 
              type="submit" 
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-4 ${
                isAddressValid 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              <ArrowRightLeft className="w-5 h-5" /> 
              {isAddressValid ? 'Confirm Transfer' : 'Attempt Unverified Transfer'}
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
              <p className="text-sm text-rose-700/80 mb-4 max-w-sm mx-auto">
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

          {status === 'success' && (
            <div className="mt-4 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center animate-in slide-in-from-bottom-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-600 mb-2">Transfer Successful</h3>
              <p className="text-sm text-emerald-700/80 mb-4 max-w-sm mx-auto">
                Successfully transferred {amount} XLM to {selectedMerchant?.businessName}. Transaction confirmed on the Stellar network.
              </p>
              <button 
                type="button" 
                onClick={() => {
                  setStatus('idle');
                  setAddress('');
                  setAmount('');
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
              >
                Send Another
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
