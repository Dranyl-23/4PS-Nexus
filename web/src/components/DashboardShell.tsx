'use client';
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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const wallet = useWalletContext();
  const pathname = usePathname();

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
          <Link href="/reports" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${pathname === '/reports' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <BarChart3 className="h-4 w-4" /> Reports
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

      {/* Main Content Area (shifted right to accommodate fixed sidebar) */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Stellar Testnet
            </span>
          </div>
          <div className="flex items-center gap-4">
             <ConnectWallet {...wallet} />
          </div>
        </header>

        {/* Page Content injected here */}
        {children}
      </div>
    </div>
  );
}
