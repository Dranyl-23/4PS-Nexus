"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SendHorizontal, X, CheckCircle2, ShieldCheck, Fingerprint, Lock, Loader2 } from 'lucide-react';

export function DisbursementForm() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // KMS Simulation States
  const [showKmsModal, setShowKmsModal] = useState(false);
  const [sig1, setSig1] = useState(false);
  const [sig2, setSig2] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setShowKmsModal(true);
    setSig1(false);
    setSig2(false);
  };

  const simulateSignatures = () => {
    setTimeout(() => setSig1(true), 800);
    setTimeout(() => setSig2(true), 2000);
  };

  const executeDisbursement = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/disbursements/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountPerUser: amount,
          category: category,
          adminSignature: "kms-multi-signed-token-123"
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setToastMsg({ type: 'success', text: data.message });
        setShowKmsModal(false);
        // Trigger table refresh
        window.dispatchEvent(new Event('refresh_disbursements'));
      } else {
        setToastMsg({ type: 'error', text: data.error || 'Disbursement failed' });
      }
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => setToastMsg(null), 5000);
      
    } catch (error) {
      setToastMsg({ type: 'error', text: 'Failed to connect to backend' });
      setTimeout(() => setToastMsg(null), 5000);
    } finally {
      setLoading(false);
      setAmount('');
    }
  };

  return (
    <>
      <div className="p-6 md:p-8 flex flex-col h-full relative z-10 text-slate-100">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Batch Disburse</h2>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-0.5">KMS Secured</p>
          </div>
        </div>

        <form onSubmit={handleInitialSubmit} className="flex flex-col gap-6 flex-1">
          <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-sm text-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>This action will securely disburse funds to <strong>ALL verified beneficiaries</strong> in the active registry using the Soroban Smart Contract.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Program</label>
              <select 
                className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Food" className="bg-slate-800 text-white">Food & Groceries</option>
                <option value="Education" className="bg-slate-800 text-white">Education & School Supplies</option>
                <option value="Health" className="bg-slate-800 text-white">Health & Pharmacy</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount Per Family (XLM)</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="e.g. 1500" 
                  className="flex h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 pr-14 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm placeholder:text-slate-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">XLM</div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6">
            <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 text-lg">
              <SendHorizontal className="w-5 h-5" />
              Init Multi-Sig Protocol
            </Button>
          </div>
        </form>
      </div>

      {showKmsModal && (
        <div className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-[2rem] max-w-md w-full shadow-2xl border border-white/10 overflow-hidden relative">
            {/* Glowing orbs inside modal */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-20"></div>
            
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 text-white font-bold">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg tracking-tight">KMS Auth</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Hardware Module</p>
                </div>
              </div>
              <button onClick={() => setShowKmsModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-8 space-y-8 relative z-10">
              <div className="text-center space-y-2">
                <div className="text-4xl font-black text-white">{sig1 && sig2 ? '2 / 2' : sig1 ? '1 / 2' : '0 / 2'}</div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Signatures Required</p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${sig1 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${sig1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold transition-colors ${sig1 ? 'text-emerald-100' : 'text-slate-300'}`}>Treasury Director</p>
                      <p className="text-xs text-slate-500 font-mono">GAK3...X9P2</p>
                    </div>
                  </div>
                  {sig1 ? <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-in zoom-in" /> : <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></div>}
                </div>

                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${sig2 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${sig2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold transition-colors ${sig2 ? 'text-emerald-100' : 'text-slate-300'}`}>Regional Head</p>
                      <p className="text-xs text-slate-500 font-mono">GBW7...L1A4</p>
                    </div>
                  </div>
                  {sig2 ? <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-in zoom-in" /> : <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></div>}
                </div>
              </div>

              {!sig1 || !sig2 ? (
                <Button onClick={simulateSignatures} className="w-full h-14 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-colors text-lg">
                  Request Approvals
                </Button>
              ) : (
                <Button onClick={executeDisbursement} disabled={loading} className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all text-lg animate-in fade-in slide-in-from-bottom-2">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Execute On-Chain'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-300 max-w-lg w-max ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100 shadow-emerald-500/20' 
            : 'bg-rose-900/90 border-rose-500/50 text-rose-100 shadow-rose-500/20'
        }`}>
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <X className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <p className="font-medium text-sm">{toastMsg.text}</p>
          <button onClick={() => setToastMsg(null)} className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
