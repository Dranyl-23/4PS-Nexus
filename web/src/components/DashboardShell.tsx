'use client';
import React, { useState } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import { useWalletContext } from '@/components/WalletProvider';
import { 
  LayoutDashboard, 
  SendHorizontal, 
  FileText, 
  Store,
  BarChart3, 
  Settings, 
  HelpCircle,
  Building2,
  Users,
  Menu,
  X,
  ShieldAlert,
  LineChart,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const wallet = useWalletContext();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If we are on the beneficiary app, don't show the admin shell
  if (pathname?.startsWith('/beneficiary')) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex fixed h-full z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span>4PS-Nexus</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Transparent Disbursement System</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Link>
          <Link href="/beneficiaries" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/beneficiaries' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Users className="h-4 w-4" /> Beneficiaries
          </Link>
          <Link href="/disbursements" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/disbursements' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <SendHorizontal className="h-4 w-4" /> Disbursements
          </Link>
          <Link href="/claims" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/claims' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <FileText className="h-4 w-4" /> Claims
          </Link>
          <Link href="/merchants" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/merchants' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Store className="h-4 w-4" /> Merchants
          </Link>
          <Link href="/audit" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/audit' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <ShieldAlert className="h-4 w-4" /> Audit & Compliance
          </Link>
          <Link href="/reports" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/reports' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <FileText className="h-4 w-4" /> Reports
          </Link>
          <Link href="/analytics" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/analytics' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <LineChart className="h-4 w-4" /> Analytics
          </Link>
          <Link href="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/settings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors">
            <HelpCircle className="h-4 w-4" /> Help
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-64 max-w-[80%] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left-1/2">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-800">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>4PS-Nexus</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <LayoutDashboard className="h-4 w-4" /> Overview
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/beneficiaries" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/beneficiaries' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Users className="h-4 w-4" /> Beneficiaries
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/disbursements" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/disbursements' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <SendHorizontal className="h-4 w-4" /> Disbursements
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/claims" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/claims' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <FileText className="h-4 w-4" /> Claims
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/merchants" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/merchants' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Store className="h-4 w-4" /> Merchants
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/audit" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/audit' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <ShieldAlert className="h-4 w-4" /> Audit & Compliance
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/reports" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/reports' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <FileText className="h-4 w-4" /> Reports
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/analytics" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/analytics' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <LineChart className="h-4 w-4" /> Analytics
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/settings" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${pathname === '/settings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area (shifted right to accommodate fixed sidebar) */}
      <div className="flex-1 flex flex-col md:ml-64 w-full">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 md:gap-2">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs md:text-sm font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1.5 md:gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="hidden sm:inline">Stellar Testnet</span>
              <span className="sm:hidden">Testnet</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 hidden sm:block">
               Beneficiary Portal
             </Link>
             <ConnectWallet {...wallet} />
          </div>
        </header>

        {/* Page Content injected here */}
        {children}
      </div>
    </div>
  );
}
