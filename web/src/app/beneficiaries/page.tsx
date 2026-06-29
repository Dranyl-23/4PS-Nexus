import { BeneficiaryTable } from '@/components/beneficiaries/BeneficiaryTable';
import { Users, Link as LinkIcon, BadgeCheck } from 'lucide-react';

export default function BeneficiariesPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Beneficiary Registry</h1>
          <p className="text-slate-500 mt-1">Manage enrolled families and track 4Ps compliance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Enrolled</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">4,280</span>
            <span className="text-sm font-medium text-slate-500">Families</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Compliant</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">3,950</span>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">92%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Wallets Linked</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">4,120</span>
            <span className="text-sm font-medium text-slate-500">Accounts</span>
          </div>
        </div>
      </div>

      <BeneficiaryTable />
    </div>
  );
}
