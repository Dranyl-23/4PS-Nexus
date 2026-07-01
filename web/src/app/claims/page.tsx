'use client';
import { useState, useEffect } from 'react';
import { useWalletContext } from '@/components/WalletProvider';
import { FileText, XCircle, CheckCircle2, UploadCloud, FileSignature, Check, Loader2 } from 'lucide-react';

type Claim = {
  id: string;
  submitted: string;
  name: string;
  wallet: string;
  category: string;
  file: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function ClaimsPage() {
  const wallet = useWalletContext();
  const { publicKey } = wallet;
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 5000);
  };

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await fetch('/api/claims');
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((c: any) => ({
            id: c.id,
            submitted: new Date(c.submittedAt).toLocaleDateString(),
            name: c.name,
            wallet: c.beneficiary,
            category: c.category,
            file: c.fileUrl,
            status: c.status,
          }));
          setClaims(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch claims", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClaims();
  }, []);

  const pendingCount = claims.filter(c => c.status === 'pending').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;
  const rejectedCount = claims.filter(c => c.status === 'rejected').length;

  const handleApprove = async (id: string) => {
    if (!publicKey) {
      showToast('error', "Please connect your Freighter wallet first.");
      return;
    }

    const claim = claims.find(c => c.id === id);
    if (!claim || !claim.wallet) {
      showToast('error', "Cannot find beneficiary wallet address for this claim.");
      return;
    }

    setIsApproving(id);
    try {
      const amountToAllocate = "1500";
      const beneficiaryAddress = claim.wallet; 

      const { executeAllocate } = await import('@/lib/soroban/client');
      const response = await executeAllocate(publicKey, beneficiaryAddress, claim.category, amountToAllocate);

      if (response && response.status !== "ERROR") {
        const res = await fetch('/api/claims', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: 'approved' })
        });
        if (res.ok) {
          setClaims(claims.map(c => c.id === id ? { ...c, status: 'approved' } : c));
          showToast('success', `Funds allocated to ${beneficiaryAddress.substring(0,6)}...${beneficiaryAddress.substring(beneficiaryAddress.length-4)} on the Soroban Smart Contract!`);
        }
      } else {
        throw new Error("Transaction failed on the network.");
      }
    } catch (error) {
      console.error(error);
      showToast('error', "Transaction failed or was rejected by user.");
    } finally {
      setIsApproving(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch('/api/claims', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      });
      if (res.ok) {
        setClaims(claims.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
      }
    } catch (error) {
      console.error("Failed to reject claim", error);
    }
  };


  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Beneficiary Claims</h1>
          <p className="text-slate-500 mt-1">Review and approve proofs submitted by beneficiaries to release restricted funds.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Pending Approval</h3>
          <p className="text-3xl font-bold text-slate-900">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Approved This Week</h3>
          <p className="text-3xl font-bold text-slate-900">{approvedCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Rejected</h3>
          <p className="text-3xl font-bold text-slate-900">{rejectedCount}</p>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Recent Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-5 border-b border-slate-100">Submitted</th>
                <th className="px-6 py-5 border-b border-slate-100">Beneficiary</th>
                <th className="px-6 py-5 border-b border-slate-100">Program Category</th>
                <th className="px-6 py-5 border-b border-slate-100">Proof Document</th>
                <th className="px-6 py-5 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Loading claims...
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No claims found.</td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className={`border-b border-slate-100 transition-colors ${claim.status === 'pending' ? 'hover:bg-slate-50/50' : 'bg-slate-50/30'}`}>
                    <td className="px-6 py-5 whitespace-nowrap text-slate-500">{claim.submitted}</td>
                    <td className="px-6 py-5 font-medium text-slate-900">{claim.name}<br/><span className="text-xs text-slate-400 font-mono font-normal">{claim.wallet.substring(0,6)}...{claim.wallet.substring(claim.wallet.length-4)}</span></td>
                    <td className="px-6 py-5">{claim.category}</td>
                    <td className="px-6 py-5">
                      <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                        <FileSignature className="w-4 h-4" /> {claim.file}
                      </a>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {claim.status === 'pending' ? (
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleReject(claim.id)} className="px-3 py-1.5 bg-white text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5 border border-rose-200 shadow-sm">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                          <button disabled={isApproving === claim.id} onClick={() => handleApprove(claim.id)} className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50">
                            {isApproving === claim.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {isApproving === claim.id ? 'Signing...' : 'Approve & Release'}
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full text-xs ${claim.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {claim.status === 'approved' ? <><Check className="w-3.5 h-3.5"/> Approved</> : <><XCircle className="w-3.5 h-3.5"/> Rejected</>}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-300 max-w-lg w-max ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100 shadow-emerald-500/20' 
            : 'bg-rose-900/90 border-rose-500/50 text-rose-100 shadow-rose-500/20'
        }`}>
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <p className="font-medium text-sm">{toastMsg.text}</p>
          <button onClick={() => setToastMsg(null)} className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors shrink-0">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
