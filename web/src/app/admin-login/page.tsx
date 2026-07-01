'use client';
import { useWalletContext } from '@/components/WalletProvider';
import { Shield, Loader2, ArrowRight, Building2, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BlockchainNetworkBackground from '@/components/BlockchainNetworkBackground';

export default function AdminLogin() {
  const { connect, connecting, error, publicKey, disconnect } = useWalletContext();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  // Force a fresh login state when visiting the admin login page
  useEffect(() => {
    disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (publicKey && !error && hasClicked && !connecting) {
      setIsVerifying(true);
      window.location.href = '/admin';
    }
  }, [publicKey, error, hasClicked, connecting]);

  const handleLoginClick = () => {
    setHasClicked(true);
    connect('admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Top Bar: Logo & Back Button */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-6">
        <Image src="/logo.png" alt="4PS-Nexus Logo" width={160} height={160} className="w-auto h-12 rounded-xl border border-white/10 shadow-sm" priority />
        <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50">
          &larr; Back to Home
        </Link>
      </div>

      {/* Left side - Graphic / Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 border-r border-slate-800 bg-slate-900">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-linear-to-br from-blue-600/20 via-indigo-600/10 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 -right-1/4 w-[120%] h-[120%] bg-linear-to-tl from-emerald-600/10 via-teal-600/5 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 pt-16">
          {/* Logo moved to top-left navbar */}
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Government <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">Control Center</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Secure administrative access to the 4PS-Nexus disbursement network. Monitor transactions, verify merchants, and manage beneficiary funds on the Stellar blockchain.
          </p>
          
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-white">Cryptographic Security</h4>
                <p className="text-sm text-slate-500 mt-1">Wallet-based authentication ensures zero unauthorized access.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white">Full Auditability</h4>
                <p className="text-sm text-slate-500 mt-1">Every administrative action is immutably logged on-chain.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 Department of Social Welfare and Development
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-slate-950 overflow-hidden">
        
        {/* Subtle grid pattern for tech feel */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Blockchain Network Animation */}
        <BlockchainNetworkBackground />

        <div className="max-w-md w-full px-6 relative z-10">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl shadow-black/50 p-8 sm:p-10 transform transition-all hover:scale-[1.01] duration-500">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse blur-md"></div>
                <Shield className="w-10 h-10 text-white relative z-10" />
              </div>
              
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Admin Portal</h2>
              <p className="text-slate-400 mb-10 text-sm leading-relaxed">
                Connect your authorized Freighter hardware or browser wallet to access the administrative dashboard.
              </p>

              {error && (
                <div className="w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl p-4 mb-8 text-sm font-medium text-left flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                  <p className="whitespace-pre-line">{error}</p>
                </div>
              )}

              <button
                onClick={handleLoginClick}
                disabled={connecting || isVerifying}
                className="w-full py-4 px-6 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold shadow-xl shadow-white/5 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    Authenticating Wallet...
                  </>
                ) : isVerifying ? (
                  <>
                    <Fingerprint className="w-5 h-5 animate-pulse text-emerald-600" />
                    <span className="text-emerald-700">Verifying Identity...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                    Connect Freighter Wallet
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
                  </>
                )}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
                <span className="w-8 h-px bg-slate-800"></span>
                Powered by Stellar
                <span className="w-8 h-px bg-slate-800"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
