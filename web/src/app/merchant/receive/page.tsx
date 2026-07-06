'use client';
import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CheckCircle2, ShieldAlert, Loader2, QrCode } from 'lucide-react';

export default function MerchantReceivePage() {
  const [isScanning, setIsScanning] = useState(true);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [txDetails, setTxDetails] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = async (result: string) => {
    if (!result) return;
    setIsScanning(false);
    setStatus('processing');
    
    try {
      const res = await fetch('/api/transactions/relay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: result })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        setTxDetails(data.transaction);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to relay transaction');
      }
    } catch (e: any) {
      setStatus('error');
      setErrorMsg('Network error while processing the offline transaction.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setTxDetails(null);
    setErrorMsg('');
    setIsScanning(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center">
        
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
          <QrCode className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center mb-2">
          Receive Payment
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium">
          Scan the Beneficiary's Offline QR Code to relay their transaction to the Stellar Network.
        </p>

        {status === 'idle' && isScanning && (
          <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-4 border-slate-100 relative">
            <Scanner 
              onScan={(result) => handleScan(result[0].rawValue)}
              formats={['qr_code']}
            />
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"></div>
            <div className="absolute inset-0 border-2 border-emerald-500 rounded-xl m-[38px] pointer-events-none"></div>
          </div>
        )}

        {status === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Relaying Transaction...</h2>
            <p className="text-sm text-slate-500 max-w-xs">
              Submitting the beneficiary's offline transaction to the Stellar Network.
            </p>
          </div>
        )}

        {status === 'success' && txDetails && (
          <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-white text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-emerald-700 mb-2">Payment Received!</h2>
            <p className="text-slate-600 mb-6">
              The offline transaction was successfully verified and submitted to the blockchain.
            </p>
            
            <div className="w-full bg-white rounded-xl p-4 border border-emerald-100/50 mb-6 space-y-3 text-left">
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</span>
                <span className="text-lg font-black text-slate-900">₱{txDetails.amount}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</span>
                <span className="text-sm font-bold text-emerald-600">{txDetails.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Beneficiary</span>
                <span className="text-xs font-mono text-slate-500">{txDetails.beneficiary.substring(0,8)}...</span>
              </div>
            </div>

            <button 
              onClick={reset}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
            >
              Scan Next Customer
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-white text-rose-500 rounded-full flex items-center justify-center mb-4 shadow-sm border border-rose-100">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-rose-700 mb-2">Transaction Failed</h2>
            <p className="text-sm text-rose-600/80 mb-6 font-medium">
              {errorMsg}
            </p>
            <button 
              onClick={reset}
              className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
