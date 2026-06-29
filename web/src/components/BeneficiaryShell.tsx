'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, ArrowRightLeft, Shield, FileText, Settings, Moon } from 'lucide-react';
import ConnectWallet from '@/components/ConnectWallet';
import { useWalletContext } from '@/components/WalletProvider';

export default function BeneficiaryShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wallet = useWalletContext();

  return (
    <div className="flex min-h-screen w-full bg-[#f4f4f5] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#f4f4f5] border-r border-slate-200/60 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">4PS-Nexus</span>
          </div>
        </div>

        <div className="px-6 py-6 flex-1">
          <nav className="space-y-1">
            <Link 
              href="/beneficiary" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
            >
              <ArrowRightLeft className="h-4 w-4" /> Transfer
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
            >
              <Store className="h-4 w-4" /> Merchants
            </Link>
            
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
            </div>
            
            <Link 
              href="#" 
              className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
            >
              <FileText className="h-4 w-4" /> Transactions
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </nav>
        </div>

        {/* Footer Links */}
        <div className="p-6">
          <div className="flex items-center gap-4 px-4 text-slate-400">
            {/* Social Icons Placeholder */}
            <div className="w-5 h-5 bg-slate-300 rounded-full"></div>
            <div className="w-5 h-5 bg-slate-300 rounded-full"></div>
            <div className="w-5 h-5 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-30 bg-[#f4f4f5]/80 backdrop-blur-md">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              </div>
              1 XLM = $0.11
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ConnectWallet {...wallet} />
            <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 pt-4">
          {children}
        </main>

        <footer className="p-8 text-center md:text-right text-xs font-medium text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>©2026 4PS-Nexus. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> KYC Verified</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> DSWD Audited</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
