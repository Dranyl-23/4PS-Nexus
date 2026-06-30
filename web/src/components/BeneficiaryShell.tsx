'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Store, ArrowRightLeft, Shield, FileText, Settings, Menu, X, ClipboardCheck, Loader2 } from 'lucide-react';
import ConnectWallet from '@/components/ConnectWallet';
import { useWalletContext } from '@/components/WalletProvider';
import { useState, useEffect } from 'react';

export default function BeneficiaryShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wallet = useWalletContext();
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
              href="/beneficiary/transfer" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/transfer' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <ArrowRightLeft className="h-4 w-4" /> Transfer
            </Link>
            <Link 
              href="/beneficiary/merchants" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/merchants' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <Store className="h-4 w-4" /> Merchants
            </Link>
            <Link 
              href="/beneficiary/compliance" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/compliance' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <ClipboardCheck className="h-4 w-4" /> Compliance
            </Link>
            
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
            </div>
            
            <Link 
              href="/beneficiary/transactions" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/transactions' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              <FileText className="h-4 w-4" /> Transactions
            </Link>
            <Link 
              href="/beneficiary/settings" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
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
      <div className="flex-1 flex flex-col min-h-screen max-w-[100vw] overflow-x-hidden">
        
        {/* Top Header */}
        <header className="h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 bg-[#f4f4f5]/80 backdrop-blur-md border-b border-slate-200/60 md:border-none">
          {/* Logo and Hamburger for mobile */}
          <div className="md:hidden flex items-center gap-3 font-bold text-slate-900">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <span className="tracking-tight text-sm">4PS</span>
            </div>
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
            <ConnectWallet {...wallet} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 md:pt-4">
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar Panel */}
        <div 
          className={`absolute top-0 left-0 w-64 bg-[#f4f4f5] h-full flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">4PS-Nexus</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-6 flex-1 overflow-y-auto">
            <nav className="space-y-1">
              <Link 
                href="/beneficiary" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link 
                href="/beneficiary/transfer" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/transfer' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              >
                <ArrowRightLeft className="h-4 w-4" /> Transfer
              </Link>
              <Link 
                href="/beneficiary/merchants" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/merchants' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              >
                <Store className="h-4 w-4" /> Merchants
              </Link>
              <Link 
                href="/beneficiary/compliance" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/compliance' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              >
                <ClipboardCheck className="h-4 w-4" /> Compliance
              </Link>
              
              <div className="pt-6 pb-2">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
              </div>
              
              <Link 
                href="/beneficiary/transactions" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/transactions' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              >
                <FileText className="h-4 w-4" /> Transactions
              </Link>
              <Link 
                href="/beneficiary/settings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === '/beneficiary/settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              >
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </nav>
          </div>
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
