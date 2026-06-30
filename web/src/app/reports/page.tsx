'use client';
import { Download, FileText, PieChart, TrendingUp, Filter } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">View and export financial and activity reports.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Available Reports</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { id: 1, name: 'Monthly Financial Summary - June 2026', type: 'PDF', date: 'Jun 28, 2026' },
            { id: 2, name: 'Beneficiary Distribution Metrics', type: 'CSV', date: 'Jun 25, 2026' },
            { id: 3, name: 'Claims Audit Trail (Q2)', type: 'Excel', date: 'Jun 15, 2026' },
            { id: 4, name: 'Merchant Settlement Report', type: 'CSV', date: 'Jun 01, 2026' },
          ].map((report) => (
            <div key={report.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{report.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Generated: {report.date} • {report.type}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
