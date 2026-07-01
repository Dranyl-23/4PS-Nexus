'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Store, ArrowRightLeft, Shield, FileText, Settings, Menu, X, ClipboardCheck, Loader2 } from 'lucide-react';
import ConnectWallet from '@/components/ConnectWallet';
import { useWalletContext } from '@/components/WalletProvider';
import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/lib/language';

export default function BeneficiaryShell({ children }: { children: React.ReactNode }) {
  const wallet = useWalletContext();
  return (
    <LanguageProvider wallet={wallet.publicKey}>
      <BeneficiaryShellInner>{children}</BeneficiaryShellInner>
    </LanguageProvider>
  );
}

function BeneficiaryShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wallet = useWalletContext();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('dswd_auth');
    if (!auth) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-sm">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f4f4f5] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#f4f4f5] border-r border-slate-200/60 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8">
          <div className="flex items-center gap-3 -ml-4">
            <Image src="/logo.png" alt="4PS-Nexus Logo" width={200} height={200} className="w-auto h-16 mix-blend-multiply" priority />
          </div>
        </div>

        <div className="px-6 py-6 flex-1">
          <nav className="space-y-1">
            <Link 
              href="/beneficiary" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <LayoutDashboard className="h-4 w-4" /> {t.dashboard}
            </Link>
            <Link 
              href="/beneficiary/transfer" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/transfer' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <ArrowRightLeft className="h-4 w-4" /> {t.transfer}
            </Link>
            <Link 
              href="/beneficiary/merchants" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/merchants' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <Store className="h-4 w-4" /> {t.merchants}
            </Link>
            <Link 
              href="/beneficiary/compliance" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/compliance' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <ClipboardCheck className="h-4 w-4" /> {t.compliance}
            </Link>
            
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.account}</p>
            </div>
            
            <Link 
              href="/beneficiary/transactions" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/transactions' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <FileText className="h-4 w-4" /> {t.transactions}
            </Link>
            <Link 
              href="/beneficiary/settings" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <Settings className="h-4 w-4" /> {t.settings}
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
      <div className="flex-1 flex flex-col min-h-screen max-w-[100vw] overflow-x-hidden">
        
        {/* Top Header */}
        <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 bg-[#f4f4f5]/90 backdrop-blur-md border-b border-slate-200/60 md:border-none">
          {/* Logo for mobile */}
          <div className="md:hidden flex items-center gap-2 font-bold text-slate-900 shrink-0">
            <Image src="/logo.png" alt="4PS-Nexus Logo" width={200} height={200} className="w-auto h-8 md:h-12 mix-blend-multiply" priority />
          </div>

          <div className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              </div>
              <span className="whitespace-nowrap">1 XLM = $0.11</span>
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <ConnectWallet {...wallet} role="beneficiary" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 md:pt-4 pb-24 md:pb-8">
          {children}
        </main>

        <footer className="p-8 text-center md:text-right text-xs font-medium text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4 hidden md:flex">
          <p>©2026 4PS-Nexus. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> KYC Verified</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> DSWD Audited</span>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar (Neo-Bank Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center px-2 py-3">
          <Link href="/beneficiary" className={`flex flex-col items-center gap-1 w-16 transition-colors ${pathname === '/beneficiary' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
            <LayoutDashboard className={`w-6 h-6 ${pathname === '/beneficiary' ? 'fill-blue-600/20' : ''}`} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/beneficiary/transfer" className={`flex flex-col items-center gap-1 w-16 transition-colors ${pathname === '/beneficiary/transfer' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
            <ArrowRightLeft className={`w-6 h-6 ${pathname === '/beneficiary/transfer' ? 'fill-blue-600/20' : ''}`} />
            <span className="text-[10px] font-bold">Transfer</span>
          </Link>
          
          {/* Center Scan/Pay FAB style in bottom nav (Links to Merchants for now) */}
          <Link href="/beneficiary/merchants" className="flex flex-col items-center -mt-8">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95 ${pathname === '/beneficiary/merchants' ? 'bg-slate-900' : 'bg-blue-600'}`}>
              <Store className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-bold mt-2 ${pathname === '/beneficiary/merchants' ? 'text-slate-900' : 'text-slate-500'}`}>Pay</span>
          </Link>
          
          <Link href="/beneficiary/compliance" className={`flex flex-col items-center gap-1 w-16 transition-colors ${pathname === '/beneficiary/compliance' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
            <ClipboardCheck className={`w-6 h-6 ${pathname === '/beneficiary/compliance' ? 'fill-blue-600/20' : ''}`} />
            <span className="text-[10px] font-bold">Tasks</span>
          </Link>
          <Link href="/beneficiary/settings" className={`flex flex-col items-center gap-1 w-16 transition-colors ${pathname === '/beneficiary/settings' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
            <Settings className={`w-6 h-6 ${pathname === '/beneficiary/settings' ? 'fill-blue-600/20' : ''}`} />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </div>
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
