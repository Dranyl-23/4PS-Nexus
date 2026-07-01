'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, UserPlus, Fingerprint, Coins, BarChart3, ChevronRight, LockKeyhole, Sparkles } from 'lucide-react';
import BlockchainNetworkBackground from '@/components/BlockchainNetworkBackground';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* Background Gradients & Noise & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        {/* Soft background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-100/80 via-indigo-50/50 to-transparent blur-[120px] mix-blend-multiply animate-pulse duration-1000"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-tl from-emerald-100/80 via-teal-50/50 to-transparent blur-[120px] mix-blend-multiply"></div>
      </div>

      {/* Interactive Blockchain Network Animation */}
      <div className="fixed inset-0 z-0 opacity-60">
        <BlockchainNetworkBackground />
      </div>

      {/* Premium Floating Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none animate-in fade-in slide-in-from-top-8 duration-700">
        <div className="bg-white/40 border border-white/60 backdrop-blur-2xl px-6 py-3 rounded-full flex items-center justify-between w-full max-w-5xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] pointer-events-auto">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="4PS-Nexus Logo" width={140} height={40} className="h-8 w-auto rounded-lg shadow-sm bg-white p-0.5" priority />
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/merchant-login" className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              For Merchants
            </Link>
            <Link href="/admin" className="text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 sm:px-4 py-2 rounded-full border border-slate-200 transition-all flex items-center gap-1.5 sm:gap-2 group">
              <LockKeyhole className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              DSWD Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 z-10 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Powered by Stellar Smart Contracts
          </div>
          
          <h1 className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-8 text-slate-900">
            Programmable Money for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#3b82f6,45%,#10b981,55%,#8b5cf6)] bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">Social Welfare.</span>
          </h1>
          
          <p className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both text-lg lg:text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            A transparent, fraud-resistant disbursement system for DSWD. We use on-chain verification and biometric passkeys to ensure funds reach exactly who they're meant for.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-4 sm:px-0">
            <Link href="/login" className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-base sm:text-lg group border border-transparent">
              <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5" />
              Beneficiary Login
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
            <Link href="/signup" className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-bold shadow-sm transition-all flex items-center justify-center gap-2 text-base sm:text-lg">
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              Enroll Device
            </Link>
          </div>
          
        </div>
      </main>

      {/* Features Section (Glassmorphism aesthetic) */}
      <section className="py-24 relative z-10">
        {/* Colorful blobs specifically behind the cards to make the glass effect pop! */}
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply blur-[80px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-multiply blur-[80px] -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="group relative p-6 sm:p-8 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_rgba(31,38,135,0.12)] hover:bg-white/50 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 text-blue-600 rounded-2xl flex items-center justify-center border border-white shadow-sm shrink-0">
                    <Fingerprint className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">Biometric Passkeys</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                  No 24-word seed phrases. Beneficiaries authenticate seamlessly using their phone's native WebAuthn (FaceID/TouchID).
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative p-6 sm:p-8 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_rgba(31,38,135,0.12)] hover:bg-white/50 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 text-emerald-600 rounded-2xl flex items-center justify-center border border-white shadow-sm shrink-0">
                    <Coins className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">Smart Spending Limits</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                  Stellar Smart Contracts cryptographically lock funds to specific accredited merchants (Education, Health, Groceries).
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-6 sm:p-8 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_rgba(31,38,135,0.12)] hover:bg-white/50 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 text-purple-600 rounded-2xl flex items-center justify-center border border-white shadow-sm shrink-0">
                    <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">Immutable Audit</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                  Every transaction is permanently recorded on-chain, providing auditors with 100% transparency and zero reconciliation errors.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Custom Styles for shimmers */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
