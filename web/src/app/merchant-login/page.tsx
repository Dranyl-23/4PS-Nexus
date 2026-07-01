'use client';
import { useMerchantWallet } from '@/hooks/useMerchantWallet';
import { Store, Loader2, ArrowRight, Fingerprint, MapPin, Building2, ShieldCheck, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BlockchainNetworkBackground from '@/components/BlockchainNetworkBackground';

export default function MerchantLogin() {
  const { connect, connecting, error, publicKey } = useMerchantWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (publicKey && !error) {
      setIsVerifying(true);
      const timer = setTimeout(() => {
        router.push('/merchant');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [publicKey, error, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Top Bar: Logo & Back Button */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-6">
        <Image src="/logo.png" alt="4PS-Nexus Logo" width={160} height={160} className="w-auto h-12 rounded-xl shadow-sm" priority />
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full backdrop-blur-md border border-slate-200 shadow-sm">
          &larr; Back to Home
        </Link>
      </div>

      {/* Left side - Graphic / Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 border-r border-slate-200 bg-white overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-indigo-100/80 via-purple-50/50 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 -right-1/4 w-[120%] h-[120%] bg-gradient-to-tl from-emerald-100/80 via-teal-50/50 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 pt-16">
          {/* Logo moved to top-left navbar */}
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Merchant <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Verification</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Apply to become a DSWD-Accredited Merchant. Receive secure, transparent payments directly from 4Ps beneficiaries using the Stellar network.
          </p>
          
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4 text-slate-700">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">DSWD Accreditation</h4>
                <p className="text-sm text-slate-500 mt-1">Get whitelisted in the Soroban Smart Contract to receive programmable money.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-700">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Instant Settlements</h4>
                <p className="text-sm text-slate-500 mt-1">Beneficiary payments are settled instantly to your Stellar wallet.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-slate-400 text-sm font-medium">
          © 2026 Department of Social Welfare and Development
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-slate-50 overflow-hidden">
        
        {/* Subtle grid pattern for tech feel */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Blockchain Network Animation */}
        <BlockchainNetworkBackground />

        <div className="max-w-md w-full px-6 relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10 transform transition-all hover:scale-[1.01] duration-500">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20 relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse blur-md"></div>
                <Store className="w-10 h-10 text-white relative z-10" />
              </div>
              
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Merchant Portal</h2>
              <p className="text-slate-500 mb-10 text-sm leading-relaxed">
                Connect your business Freighter wallet to apply for accreditation or access your merchant dashboard.
              </p>

              {error && (
                <div className="w-full bg-rose-50 text-rose-600 border border-rose-200 rounded-xl p-4 mb-8 text-sm font-medium text-left flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                  <p className="whitespace-pre-line">{error}</p>
                </div>
              )}

              <button
                onClick={connect}
                disabled={connecting || isVerifying}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                    Connecting Wallet...
                  </>
                ) : isVerifying ? (
                  <>
                    <Fingerprint className="w-5 h-5 animate-pulse text-emerald-400" />
                    <span className="text-emerald-300">Wallet Connected...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                    Connect Freighter Wallet
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </>
                )}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                <span className="w-8 h-[1px] bg-slate-200"></span>
                Powered by Stellar
                <span className="w-8 h-[1px] bg-slate-200"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
