import Link from 'next/link';
import { Building2, LayoutDashboard, SendHorizontal, FileText, ChartColumn, Settings, CircleHelp } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex fixed h-full z-20">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span>4PS-Nexus</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium">Transparent Disbursement System</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-6">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <LayoutDashboard className="h-4 w-4" /> Overview
        </Link>
        <Link href="/disbursements" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <SendHorizontal className="h-4 w-4" /> Disbursements
        </Link>
        <Link href="/claims" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <FileText className="h-4 w-4" /> Claims
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <ChartColumn className="h-4 w-4" /> Reports
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </nav>

      <div className="p-4 mt-auto">
        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors">
          <CircleHelp className="h-4 w-4" /> Help
        </Link>
      </div>
    </aside>
  );
}
