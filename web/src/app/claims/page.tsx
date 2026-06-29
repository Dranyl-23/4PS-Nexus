'use client';
import { useState } from 'react';
import { FileText, XCircle, CheckCircle2, UploadCloud, FileSignature } from 'lucide-react';

export default function ClaimsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Beneficiary Claims</h1>
          <p className="text-slate-500 mt-1">Review and approve proofs submitted by beneficiaries to release restricted funds.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          Submit Mock Claim
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Pending Approval</h3>
          <p className="text-3xl font-bold text-slate-900">12</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Approved This Week</h3>
          <p className="text-3xl font-bold text-slate-900">45</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Rejected</h3>
          <p className="text-3xl font-bold text-slate-900">3</p>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Pending Submissions</h2>
          <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">Needs Review</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-slate-200">Submitted</th>
                <th className="px-6 py-4 border-b border-slate-200">Beneficiary</th>
                <th className="px-6 py-4 border-b border-slate-200">Program Category</th>
                <th className="px-6 py-4 border-b border-slate-200">Proof Document</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-slate-500">2 hours ago</td>
                <td className="px-6 py-4 font-medium text-slate-900">Maria Santos<br/><span className="text-xs text-slate-400 font-mono font-normal">GCB4...X9KL</span></td>
                <td className="px-6 py-4">Education Grant</td>
                <td className="px-6 py-4">
                  <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <FileSignature className="w-4 h-4" /> School_Enrollment_Form.pdf
                  </a>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button className="px-3 py-1.5 bg-white text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5 border border-rose-200 shadow-sm">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-4 h-4" /> Approve & Release
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-slate-500">5 hours ago</td>
                <td className="px-6 py-4 font-medium text-slate-900">Juan Dela Cruz<br/><span className="text-xs text-slate-400 font-mono font-normal">GDM1...P2ZA</span></td>
                <td className="px-6 py-4">Health Subsidy</td>
                <td className="px-6 py-4">
                  <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <FileSignature className="w-4 h-4" /> Medical_Prescription.jpg
                  </a>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button className="px-3 py-1.5 bg-white text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5 border border-rose-200 shadow-sm">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-4 h-4" /> Approve & Release
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mock Submit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Submit New Claim</h3>
            <p className="text-sm text-slate-500 mb-4">Upload proof of compliance (e.g. school attendance, health center visit) to unlock restricted wallet funds.</p>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center mb-6 bg-slate-50">
              <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">Drag & drop document here</p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
