"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SendHorizontal } from 'lucide-react';

import { X, CheckCircle2, ShieldCheck, Fingerprint, Lock } from 'lucide-react';

export function DisbursementForm() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  
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
          adminSignature: "kms-multi-signed-token-123"
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        setShowKmsModal(false);
        // Trigger table refresh
        window.dispatchEvent(new Event('refresh_disbursements'));
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
      setAmount('');
    }
  };

  return (
    <>
      <Card className="border-indigo-100 shadow-indigo-100/50">
        <CardHeader className="bg-indigo-50/50 border-b border-indigo-50 pb-4 flex flex-row items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <CardTitle className="text-indigo-900">Batch Disbursement (KMS)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleInitialSubmit} className="flex flex-col gap-5">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 mb-2">
              This action will securely disburse funds to <strong>ALL verified beneficiaries</strong> in the database using the Soroban Smart Contract.
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Input 
                label="Amount per Beneficiary (XLM)" 
                type="number" 
                placeholder="e.g. 1500" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700" size="lg">
              <span className="flex items-center gap-2">
                <SendHorizontal className="w-4 h-4" />
                Initialize Multi-Sig Batch
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {showKmsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <Lock className="w-5 h-5" /> Enterprise KMS Authorization
              </div>
              <button onClick={() => setShowKmsModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-slate-500">Security Policy Requires Multi-Signature</p>
                <div className="text-2xl font-black text-slate-900">{sig1 && sig2 ? '2 / 2' : sig1 ? '1 / 2' : '0 / 2'}</div>
                <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest">Signatures Acquired</p>
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${sig1 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${sig1 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Treasury Director</p>
                      <p className="text-xs text-slate-500 font-mono">GAK3...X9P2</p>
                    </div>
                  </div>
                  {sig1 ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <span className="text-xs font-medium text-slate-400">Waiting...</span>}
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${sig2 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${sig2 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Regional Head</p>
                      <p className="text-xs text-slate-500 font-mono">GBW7...L1A4</p>
                    </div>
                  </div>
                  {sig2 ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <span className="text-xs font-medium text-slate-400">Waiting...</span>}
                </div>
              </div>

              {!sig1 || !sig2 ? (
                <Button onClick={simulateSignatures} className="w-full bg-slate-900 hover:bg-slate-800" size="lg">
                  Request Approvals (Simulation)
                </Button>
              ) : (
                <Button onClick={executeDisbursement} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 animate-in fade-in" size="lg">
                  {loading ? 'Executing on Soroban...' : 'Execute Batch Release'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
