'use client';

import Link from 'next/link';
import { ShieldCheck, UserPlus, Fingerprint, Coins, BarChart3, Building2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Navbar */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800">
          <Building2 className="h-7 w-7 text-blue-600" />
          <span>4PS-Nexus</span>
        </div>
        <div className="flex gap-4">
          <Link href="/admin" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white rounded-xl backdrop-blur-md transition-all shadow-sm">
            Admin Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Powered by Stellar Smart Contracts
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Programmable Money for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Social Welfare</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              4PS Nexus is a transparent, fraud-resistant disbursement system for DSWD. We use on-chain verification and biometric WebAuthn passkeys to ensure funds reach exactly who they're meant for, and are spent exactly how they should be.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-lg">
                <Fingerprint className="w-5 h-5" />
                Login as Beneficiary
              </Link>
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 text-lg">
                <UserPlus className="w-5 h-5" />
                Enroll Device
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Requires DSWD Household Registration
            </p>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Seedless Web3 Passkeys</h3>
              <p className="text-slate-600 leading-relaxed">
                Beneficiaries don't need to write down 24 words or manage private keys. They authenticate transactions seamlessly using their phone's native Fingerprint or FaceID.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Spending Limits</h3>
              <p className="text-slate-600 leading-relaxed">
                Stellar Smart Contracts enforce where funds can be spent. Subsidies can be cryptographically locked to registered merchants for education, health, and groceries.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Immutable Audit Trail</h3>
              <p className="text-slate-600 leading-relaxed">
                Every disbursement and transaction is recorded on the Stellar blockchain. Providing DSWD and auditors with 100% real-time transparency and zero reconciliation errors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
