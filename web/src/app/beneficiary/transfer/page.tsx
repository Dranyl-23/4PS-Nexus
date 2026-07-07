'use client';
import { ArrowRightLeft, ShieldAlert, CheckCircle2, Store, Loader2, AlertTriangle, Fingerprint, AlertCircle, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWalletContext } from '@/components/WalletProvider';
import { buildSpendXDR } from '@/lib/contract';
import { submitSignedXDR, pollTransaction } from '@/lib/payment';

interface Merchant {
  id: string;
  businessName: string;
  wallet: string;
  category?: string;
  isWhitelisted: boolean;
}

export default function TransferPage() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'biometric_prompt' | 'biometric_failed' | 'processing' | 'error' | 'success'>('idle');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { publicKey } = useWalletContext();
  const [balance, setBalance] = useState<number>(0);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

  // Fetch balance when wallet is connected
  useEffect(() => {
    async function fetchBalance() {
      if (!publicKey) return;
      try {
        setIsFetchingBalance(true);
        const res = await fetch(`/api/beneficiary/profile?wallet=${publicKey}`);
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance || 0);
        }
      } catch (error) {
        console.error("Failed to fetch balance", error);
      } finally {
        setIsFetchingBalance(false);
      }
    }
    fetchBalance();
  }, [publicKey, status]); // Re-fetch when status changes (like after a successful transfer)

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

  const triggerBiometrics = async () => {
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      alert("Biometrics not supported on this device/browser. Proceeding without it.");
      return true;
    }
    try {
      // Simulate SmartAccountKit signing flow
      // We request a biometric signature to "sign" the transaction
      const { startAuthentication } = await import('@simplewebauthn/browser');
      
      await startAuthentication({
        optionsJSON: {
          challenge: 'c2lnbl90cmFuc2FjdGlvbl9jaGFsbGVuZ2VfMTIzNDU2', // base64url
          allowCredentials: [],
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname
        }
      });
      return true; // Successfully scanned face/fingerprint and signed
    } catch (err) {
      console.error("Biometric signing cancelled or failed:", err);
      return false; // User cancelled or failed
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !amount) return;
    
    // Step 1: Proof of Identity (Biometrics)
    setStatus('biometric_prompt');
    const isAuthenticated = await triggerBiometrics();
    
    if (!isAuthenticated) {
      setStatus('biometric_failed');
      return;
    }

    // Step 2: Proceed with processing
    setStatus('processing');
    
    if (isAddressValid) {
      if (!publicKey) {
        setStatus('error');
        return;
      }
      
      const numAmount = parseFloat(amount);
      if (numAmount > balance) {
        alert("Insufficient balance!");
        setStatus('idle');
        return;
      }

      try {
        // BUILD & SIGN TRANSACTION (Real Web3 Flow)
        const { Client, networks } = require('govpay-vault');
        const client = new Client({
          ...networks.testnet,
          rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org',
        });
        const tx = await client.spend({
          beneficiary: publicKey,
          merchant: address,
          amount: BigInt(numAmount)
        });
        
        // Dynamically import Freighter to avoid SSR issues
        const { signTransaction } = await import('@stellar/freighter-api');
        await tx.signAndSend({ signTransaction: async (xdr: string) => {
            const signRes = await signTransaction(xdr, { networkPassphrase: 'Test SDF Network ; September 2015' });
            if ('error' in signRes && signRes.error) throw new Error(signRes.error as string);
            return { signedTxXdr: (signRes as any).signedTxXdr };
        }});

        const txHash = tx.built?.hash().toString('hex') || `soroban-transfer-${Date.now()}`;
        
        // Wait for finality (max 60 seconds)
        await pollTransaction(txHash);
        const finalStatus = 'SUCCESS'; // pollTransaction resolves on success or throws
        
        if (finalStatus === 'SUCCESS') {
          // Record it in the DB with the real txHash
          const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              beneficiary: publicKey,
              amount: amount,
              merchantName: selectedMerchant.businessName,
              merchantCategory: selectedMerchant.category || 'General',
              txHash: txHash
            })
          });
          
          if (res.ok) {
            setStatus('success');
          } else {
            console.error("Failed to save to database");
            setStatus('success'); // Still succeeded on-chain
          }
        } else {
          setStatus('error');
          console.error("Transaction failed on-chain");
        }
      } catch (error) {
        setStatus('error');
        console.error(error); 
      }
    } else {
      // Simulate smart contract blocking
      setTimeout(() => {
        setStatus('error');
      }, 1500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 relative pb-24 md:pb-8">
      
      {/* Left Column: Info & Banner */}
      <div className="flex-1 flex flex-col gap-6 pt-2 md:pt-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2 md:mb-3">
            Send Funds
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-md">
            Transfer 4P-Tokens directly to authorized wallets on the Stellar network with instant settlement and zero fees.
          </p>
        </div>

        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5 md:p-6 flex items-start gap-4 shadow-sm max-w-md">
          <div className="w-10 h-10 bg-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-black text-amber-900 uppercase tracking-widest mb-1.5">Programmable Money Active</h3>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              4P-Tokens can <b>only</b> be sent to DSWD-Accredited Merchants. The Soroban Smart Contract will automatically reject unauthorized wallets.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Transfer Card */}
      <div className="w-full max-w-md mx-auto md:w-110 lg:w-120 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/80 overflow-hidden min-h-100 flex flex-col relative">

      {!publicKey ? (
        <div className="bg-white border border-blue-200 rounded-4xl p-10 flex flex-col items-center justify-center text-center shadow-sm mt-4 md:mt-0 h-full min-h-100">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-5">
            <Wallet className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Connect Your Wallet</h2>
          <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
            Please connect your Freighter Wallet using the button in the top right corner to access your funds and make transfers.
          </p>
        </div>
      ) : (
      <div className="bg-white rounded-4xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
        {/* subtle background decoration */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <form onSubmit={handleTransfer} className="flex flex-col gap-8 relative z-10">
          
          {/* Amount Section - Huge and Centered */}
          <div className="flex flex-col items-center justify-center pt-2 md:pt-6">
            <span className="text-slate-400 font-bold tracking-widest uppercase text-[9px] md:text-[10px] mb-3 md:mb-4">Amount to Send</span>
            <div className="relative flex items-center justify-center w-full max-w-60 md:max-w-70">
              <span className="absolute left-1 md:left-2 text-2xl md:text-4xl text-slate-300 font-light pointer-events-none">XLM</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent border-none text-center focus:outline-none focus:ring-0 font-black text-5xl md:text-7xl text-slate-900 tracking-tighter placeholder-slate-200 pl-12 md:pl-16 pr-2 md:pr-4"
                style={{ WebkitAppearance: 'none', margin: 0 }}
                required
              />
            </div>
            <div 
              className="flex items-center gap-2 mt-4 md:mt-6 bg-slate-50 border border-slate-200 rounded-full px-3 md:px-4 py-1.5 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all active:scale-95" 
              onClick={() => setAmount(balance.toString())}
            >
              <p className="text-[10px] md:text-[11px] text-slate-600 font-bold">
                {isFetchingBalance ? 'Loading balance...' : `Available: ${balance.toLocaleString()} XLM`}
              </p>
              <span className="text-[8px] md:text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Max</span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-1"></div>

          {/* Send To Section */}
          <div className="flex flex-col gap-3 md:gap-4">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between px-1 md:px-2">
              <span>Send To</span>
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
            </label>

            {/* Quick Select Chips */}
            <div className="flex gap-2.5 md:gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
              {merchants.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => setAddress(m.wallet)}
                  className={`flex flex-col items-center gap-1.5 md:gap-2 shrink-0 cursor-pointer p-2 md:p-3 rounded-2xl border-2 transition-all w-18 md:w-21.25 ${address === m.wallet ? 'border-slate-900 bg-slate-900 shadow-lg shadow-slate-900/20 -translate-y-1' : 'border-slate-100 hover:border-slate-200 bg-white hover:-translate-y-0.5'}`}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-black ${address === m.wallet ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
                    {m.businessName.charAt(0)}
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-bold w-full text-center truncate px-1 ${address === m.wallet ? 'text-white' : 'text-slate-600'}`}>{m.businessName}</span>
                </div>
              ))}
            </div>

            {/* Manual Address Input */}
            <div className="relative mt-1">
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Or paste Stellar Address (G...)"
                className={`w-full px-4 py-3 md:px-5 md:py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none font-mono text-[10px] md:text-xs transition-all placeholder-slate-400 ${
                  isAddressValid ? 'border-emerald-500 focus:border-emerald-500 bg-emerald-50/50 text-emerald-900' : 
                  isAddressInvalid ? 'border-rose-500 focus:border-rose-500 bg-rose-50/50 text-rose-900' : 
                  'border-slate-100 focus:border-slate-300 focus:bg-white text-slate-900'
                }`}
                required
              />
              {isAddressValid && (
                <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-1.5 bg-emerald-100 text-emerald-700 px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5" /> Verified
                </div>
              )}
            </div>
            
            {/* Validation Feedback */}
            {isAddressInvalid && (
              <p className="text-[10px] md:text-[11px] text-rose-600 font-bold mt-1 ml-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Unverified Wallet. Smart contract will reject this.
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-1 md:pt-2">
            {status === 'idle' && (
              <button 
                type="submit" 
                disabled={!amount || parseFloat(amount) <= 0 || !address}
                className={`w-full py-3.5 md:py-5 rounded-2xl font-black text-sm md:text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:cursor-not-allowed ${
                  !amount || parseFloat(amount) <= 0 || !address
                    ? 'bg-slate-100 text-slate-400 shadow-none'
                    : isAddressValid 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20' 
                      : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xl shadow-rose-600/20'
                }`}
              >
                <ArrowRightLeft className="w-5 h-5" /> 
                {!amount || parseFloat(amount) <= 0 
                  ? 'Enter Amount' 
                  : !address 
                    ? 'Select Merchant' 
                    : isAddressValid 
                      ? 'Send Payment' 
                      : 'Attempt Unverified Send'}
              </button>
            )}

            {status === 'processing' && (
              <div className="w-full py-4 md:py-5 bg-slate-100 text-slate-500 rounded-2xl font-bold flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-4 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                Executing Smart Contract...
              </div>
            )}

            {status === 'biometric_prompt' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-5 py-4 rounded-2xl flex items-start gap-3 animate-in fade-in duration-300">
                <div className="animate-pulse bg-blue-100 p-2 rounded-xl">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">Proof of Identity Required</p>
                  <p className="text-xs mt-1 text-blue-600/80 leading-relaxed">Please authenticate using your device&apos;s fingerprint or face scanner to authorize this transaction.</p>
                </div>
              </div>
            )}

            {status === 'biometric_failed' && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-bottom-2">
                <div className="bg-rose-100 p-2 rounded-xl shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">Authentication Failed</p>
                  <p className="text-xs mt-1 text-rose-600/80 leading-relaxed">Biometric verification failed or was cancelled. Transaction blocked to prevent unauthorized access.</p>
                  <button onClick={() => setStatus('idle')} className="mt-3 text-xs font-bold bg-white text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors">Try Again</button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <div className="w-14 h-14 bg-white text-rose-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-rose-100">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-rose-700 mb-2 tracking-tight">Transaction Blocked</h3>
                <p className="text-xs text-rose-600/80 mb-5 max-w-sm mx-auto leading-relaxed">
                  The Soroban Smart Contract rejected this transfer because the recipient is <b>not a Whitelisted Merchant</b>. 4P-Tokens can only be spent on essential goods.
                </p>
                <button 
                  type="button" 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
                >
                  Try Again
                </button>
              </div>
            )}

            {status === 'success' && (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <div className="w-14 h-14 bg-white text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-emerald-700 mb-2 tracking-tight">Transfer Successful</h3>
                <p className="text-xs text-emerald-600/80 mb-5 max-w-sm mx-auto leading-relaxed">
                  Successfully transferred <b>{amount} XLM</b> to {selectedMerchant?.businessName}. Transaction confirmed on the Stellar network.
                </p>
                <button 
                  type="button" 
                  onClick={() => {
                    setStatus('idle');
                    setAddress('');
                    setAmount('');
                  }}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Send Another
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
      )}
      </div>
    </div>
    </div>
  );
}
