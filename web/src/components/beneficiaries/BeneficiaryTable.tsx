'use client';
import React, { useState, useEffect } from 'react';
import { BadgeCheck, Clock, XCircle, Users, Maximize, Minimize, Filter, ChevronDown, ArrowDown, ArrowUp, Eye, X, Link as LinkIcon } from 'lucide-react';

export function BeneficiaryTable() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await fetch('/api/beneficiaries');
        const data = await res.json();
        if (data.success && data.beneficiaries) {
          const dbBeneficiaries = data.beneficiaries.map((b: any) => ({
            id: b.id.substring(b.id.length - 8).toUpperCase(),
            name: b.fullName,
            address: b.wallet,
            status: b.kycStatus === 'verified' ? 'active' : 'suspended',
            schoolAttendance: '90%',
            healthCheckup: 'Up to Date',
            date: new Date(b.createdAt).toISOString().split('T')[0],
          }));
          setBeneficiaries(dbBeneficiaries);
        }
      } catch (error) {
        console.error("Failed to fetch from DB", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBeneficiaries();
  }, []);

  const filteredBeneficiaries = beneficiaries.filter(b => statusFilter === 'all' || b.status === statusFilter);

  const sortedBeneficiaries = [...filteredBeneficiaries].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  return (
    <>
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''}`}>
        <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Enrolled Beneficiaries</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`transition-colors p-1.5 rounded-md flex items-center justify-center cursor-pointer relative ${statusFilter !== 'all' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : 'text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700'}`}
                title="Filter by Status"
              >
                <Filter className="w-4 h-4" />
                {statusFilter !== 'all' && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center bg-white rounded-full shadow-sm">
                    {statusFilter === 'active' && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />}
                    {statusFilter === 'suspended' && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                )}
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {['all', 'active', 'suspended'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <span className="capitalize">{status === 'all' ? 'All Status' : status}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 p-1.5 rounded-md flex items-center justify-center cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-5 border-b border-slate-100">Family Info</th>
                <th className="px-6 py-5 border-b border-slate-100">Wallet Address</th>
                <th className="px-6 py-5 border-b border-slate-100">Compliance</th>
                <th className="px-6 py-5 border-b border-slate-100 group cursor-pointer select-none" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                  <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-700 transition-colors">
                    Enrollment Date
                    {sortOrder === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                  </div>
                </th>
                <th className="px-6 py-5 border-b border-slate-100">Status</th>
                <th className="px-6 py-5 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading beneficiaries from database...</td>
                </tr>
              ) : sortedBeneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{beneficiary.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{beneficiary.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {beneficiary.address === 'Not Linked' ? (
                      <span className="text-slate-400 font-medium text-xs bg-slate-100 px-2 py-1 rounded-md">Not Linked</span>
                    ) : (
                      <span className="font-mono text-slate-600">{beneficiary.address}</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center w-32">
                        <span className="text-xs text-slate-500">School:</span>
                        <span className={`text-xs font-medium ${parseInt(beneficiary.schoolAttendance) >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {beneficiary.schoolAttendance}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-32">
                        <span className="text-xs text-slate-500">Health:</span>
                        <span className={`text-xs font-medium ${beneficiary.healthCheckup === 'Up to Date' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {beneficiary.healthCheckup}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-900 whitespace-nowrap">{beneficiary.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      {beneficiary.status === 'active' && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                      {beneficiary.status === 'suspended' && <XCircle className="w-4 h-4 text-rose-500" />}
                      <span className="capitalize text-slate-700">{beneficiary.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => setSelectedBeneficiary(beneficiary)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs transition-colors flex items-center justify-end w-full gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBeneficiary && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedBeneficiary(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Beneficiary Profile</h3>
              <button onClick={() => setSelectedBeneficiary(null)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-lg">{selectedBeneficiary.name}</div>
                  <div className="text-sm font-mono text-slate-500">{selectedBeneficiary.id}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Compliance Status</p>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700 font-medium">School Attendance</span>
                      <span className={`text-sm font-bold ${parseInt(selectedBeneficiary.schoolAttendance) >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {selectedBeneficiary.schoolAttendance}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700 font-medium">Health Checkups</span>
                      <span className={`text-sm font-bold ${selectedBeneficiary.healthCheckup === 'Up to Date' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {selectedBeneficiary.healthCheckup}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Stellar Wallet</p>
                  {selectedBeneficiary.address === 'Not Linked' ? (
                    <div className="flex flex-col gap-3">
                      <div className="text-sm text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        This family does not have a connected wallet address yet.
                      </div>
                      <button 
                        onClick={() => {
                          setBeneficiaries(beneficiaries.map(b => b.id === selectedBeneficiary.id ? { ...b, address: 'GBX9...A1Z2' } : b));
                          setSelectedBeneficiary({ ...selectedBeneficiary, address: 'GBX9...A1Z2' });
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                      >
                        <LinkIcon className="w-4 h-4" /> Link Stellar Wallet
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm font-mono text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span>{selectedBeneficiary.address}</span>
                      <BadgeCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedBeneficiary(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
