'use client';
import { useState, useEffect } from 'react';
import { BeneficiaryTable } from '@/components/beneficiaries/BeneficiaryTable';
import { Users, Link as LinkIcon, BadgeCheck, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function BeneficiariesPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', address: '', wallet: '' });
  const [stats, setStats] = useState({ totalEnrolled: 0, compliant: 0, walletsLinked: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/beneficiaries/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.wallet) {
      alert("Please fill in all fields.");
      return;
    }
    setIsRegistering(true);
    try {
      const res = await fetch('/api/kyc/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ fullName: '', address: '', wallet: '' });
        window.location.reload(); // Reload to fetch new data
      } else {
        const err = await res.json();
        alert(err.error || "Failed to register beneficiary.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to register");
    } finally {
      setIsRegistering(false);
    }
  };

  const complianceRate = stats.totalEnrolled > 0 
    ? Math.round((stats.compliant / stats.totalEnrolled) * 100) 
    : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Beneficiary Registry</h1>
          <p className="text-slate-500 mt-1">Manage enrolled families and track 4Ps compliance.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          <Users className="w-4 h-4" />
          Register Beneficiary (KYC)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <div className="p-2 md:p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">Total Enrolled</h3>
          </div>
          <div className="flex items-baseline gap-2">
            {isLoadingStats ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            ) : (
              <span className="text-3xl md:text-4xl font-bold text-slate-900">{stats.totalEnrolled.toLocaleString()}</span>
            )}
            <span className="text-xs md:text-sm font-medium text-slate-500">Families</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <div className="p-2 md:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <BadgeCheck className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">Compliant</h3>
          </div>
          <div className="flex items-baseline gap-2">
            {isLoadingStats ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            ) : (
              <>
                <span className="text-3xl md:text-4xl font-bold text-slate-900">{stats.compliant.toLocaleString()}</span>
                <span className="text-xs md:text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{complianceRate}%</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <div className="p-2 md:p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <LinkIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">Wallets Linked</h3>
          </div>
          <div className="flex items-baseline gap-2">
            {isLoadingStats ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            ) : (
              <span className="text-3xl md:text-4xl font-bold text-slate-900">{stats.walletsLinked.toLocaleString()}</span>
            )}
            <span className="text-xs md:text-sm font-medium text-slate-500">Accounts</span>
          </div>
        </div>
      </div>

      <BeneficiaryTable />

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl border border-slate-200 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-lg font-bold text-slate-900">Register Beneficiary</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <Input 
                    placeholder="e.g. Juan Dela Cruz" 
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    disabled={isRegistering}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Physical Address</label>
                  <Input 
                    placeholder="e.g. Brgy. San Jose, Cebu City" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    disabled={isRegistering}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Stellar Wallet Address</label>
                  <Input 
                    placeholder="G..." 
                    className="font-mono text-sm"
                    value={formData.wallet}
                    onChange={e => setFormData({...formData, wallet: e.target.value})}
                    disabled={isRegistering}
                  />
                  <p className="text-xs text-slate-500 mt-1">Make sure the beneficiary has saved their Secret Key.</p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={isRegistering}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isRegistering} className="bg-blue-600 hover:bg-blue-700">
                    {isRegistering ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isRegistering ? 'Registering...' : 'Register (KYC Approved)'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
