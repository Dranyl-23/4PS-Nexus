'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, GraduationCap, Stethoscope, Users, Clock, Loader2, ShieldCheck, FileText, Lock, Unlock, Upload, UploadCloud } from 'lucide-react';
import { useWalletContext } from '@/components/WalletProvider';

export default function CompliancePage() {
  const { publicKey } = useWalletContext();
  const [compliance, setCompliance] = useState({
    education: 'missing',
    health: 'missing',
    fds: 'missing'
  });
  const [accountStatus, setAccountStatus] = useState('active');
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  useEffect(() => {
    async function fetchCompliance() {
      if (!publicKey) return;
      try {
        const res = await fetch(`/api/compliance?wallet=${publicKey}`);
        if (res.ok) {
          const data = await res.json();
          setCompliance(data.compliance);
          if (data.accountStatus) {
            setAccountStatus(data.accountStatus);
          }
        }
      } catch (error) {
        console.error("Failed to fetch compliance", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompliance();
  }, [publicKey]);

  const getStatusUI = (status: string, targetPercent: number) => {
    if (status === 'approved') {
      return {
        label: 'COMPLIANT',
        icon: <CheckCircle2 className="w-3 h-3" />,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        progress: targetPercent,
        barColor: 'bg-emerald-500',
        message: 'Requirement Met',
        messageColor: 'text-emerald-600',
        actionable: false
      };
    }
    if (status === 'pending') {
      return {
        label: 'UNDER REVIEW',
        icon: <Clock className="w-3 h-3" />,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        progress: targetPercent / 2, // 50% visual progress for pending
        barColor: 'bg-amber-400',
        message: 'Document Pending Approval',
        messageColor: 'text-amber-600',
        actionable: false
      };
    }
    return {
      label: 'PENDING',
      icon: <Clock className="w-3 h-3" />,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      progress: 0,
      barColor: 'bg-rose-500',
      message: 'Needs Attention',
      messageColor: 'text-rose-600',
      actionable: true // Needs upload
    };
  };

  const eduUI = getStatusUI(compliance.education, 85);
  const healthUI = getStatusUI(compliance.health, 100);
  const fdsUI = getStatusUI(compliance.fds, 100);
  
  const isFrozen = accountStatus === 'frozen';

  const handleOpenSubmit = (category: string) => {
    setSelectedCategory(category);
    setSelectedFile(null); // Reset file selection on open
    setShowModal(true);
  };

  const handleSubmitProof = async () => {
    if (!publicKey) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiary: publicKey,
          category: selectedCategory,
          fileUrl: `${selectedCategory.replace(/\s+/g, '_')}_Proof.pdf`,
        })
      });
      if (res.ok) {
        // Update local state to pending
        const categoryKey = selectedCategory === 'Education' ? 'education' : selectedCategory === 'Health' ? 'health' : 'fds';
        setCompliance(prev => ({ ...prev, [categoryKey]: 'pending' }));
        setShowSuccessAnim(true);
        setTimeout(() => {
          setShowSuccessAnim(false);
          setShowModal(false);
        }, 2500);
      }
    } catch (error) {
      console.error("Failed to submit claim", error);
      alert("Failed to submit claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-700 max-w-4xl mx-auto mt-8">
        Please connect your Freighter wallet to view your compliance status.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">Compliance & Requirements</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1 md:mt-2">
          Track your family&apos;s 4Ps program conditional requirements.
        </p>
      </div>

      {/* SMART CONTRACT ENFORCEMENT BANNER */}
      {isFrozen ? (
        <div className="bg-gradient-to-br from-rose-950 to-[#120000] border border-rose-900/50 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-2xl shadow-rose-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden mb-2 md:mb-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full blur-[80px] opacity-10 -mr-20 -mt-20"></div>
          <div className="flex items-start gap-3 md:gap-4 relative z-10">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-rose-500/20 text-rose-500 rounded-xl md:rounded-3xl flex items-center justify-center shrink-0 border border-rose-500/30 mt-0.5 md:mt-0">
              <Lock className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 md:mb-1.5">
                <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-rose-500/20 text-rose-400 text-[8px] md:text-[10px] font-black tracking-widest uppercase rounded-md md:rounded-lg">Smart Contract Locked</span>
              </div>
              <h2 className="text-lg md:text-2xl font-black text-white mb-1 md:mb-2 tracking-tight">Account Frozen</h2>
              <p className="text-xs md:text-sm text-rose-200/80 max-w-lg leading-relaxed">
                Your 4Ps funds have been temporarily locked by the Soroban Smart Contract due to non-compliance. Submit the missing requirements below to unlock your funds.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-emerald-950 to-[#001205] border border-emerald-900/50 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-2xl shadow-emerald-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden mb-2 md:mb-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-[80px] opacity-10 -mr-20 -mt-20"></div>
          <div className="flex items-start gap-3 md:gap-4 relative z-10">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-emerald-500/20 text-emerald-500 rounded-xl md:rounded-3xl flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5 md:mt-0">
              <Unlock className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 md:mb-1.5">
                <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-emerald-500/20 text-emerald-400 text-[8px] md:text-[10px] font-black tracking-widest uppercase rounded-md md:rounded-lg">Smart Contract Active</span>
              </div>
              <h2 className="text-lg md:text-2xl font-black text-white mb-1 md:mb-2 tracking-tight">Funds Unlocked</h2>
              <p className="text-xs md:text-sm text-emerald-200/80 max-w-lg leading-relaxed">
                You are fully compliant with the 4Ps program requirements. The Smart Contract has authorized full access to your funds.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        
        {/* Education Requirement */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-row gap-3 md:gap-8 flex-1">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
                <GraduationCap className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 flex-wrap">
                  <h3 className="text-xs md:text-base font-bold text-slate-900 uppercase tracking-widest">Education</h3>
                  <span className={`px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-md text-[8px] md:text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${eduUI.color}`}>
                    {eduUI.icon} {eduUI.label}
                  </span>
                </div>
                <h4 className="text-base md:text-xl font-bold text-slate-800 mb-1 md:mb-2">Children&apos;s School Attendance</h4>
                <p className="text-[11px] md:text-sm text-slate-500 mb-3 md:mb-5 max-w-lg leading-relaxed">
                  Ensure children attend at least 85% of school days per month.
                </p>
                {eduUI.actionable && (
                  <button onClick={() => handleOpenSubmit('Education')} className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] md:text-sm font-bold rounded-lg md:rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center md:justify-start">
                    <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" /> Submit Proof
                  </button>
                )}
              </div>
            </div>
            <div className="w-full md:w-64 shrink-0 flex flex-col justify-center mt-2 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 md:border-0">
              <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5 md:mb-2">
                <span className="text-slate-700">Current: {eduUI.progress}%</span>
                <span className="text-slate-400">Target: 85%</span>
              </div>
              <div className="h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden w-full mb-2 md:mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${eduUI.barColor}`} style={{ width: `${(eduUI.progress / 85) * 100}%` }}></div>
              </div>
              <p className={`text-[9px] md:text-xs font-bold text-right uppercase tracking-wider ${eduUI.messageColor}`}>{eduUI.message}</p>
            </div>
          </div>
        </div>

        {/* Health Requirement */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-row gap-3 md:gap-8 flex-1">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
                <Stethoscope className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 flex-wrap">
                  <h3 className="text-xs md:text-base font-bold text-slate-900 uppercase tracking-widest">Health</h3>
                  <span className={`px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-md text-[8px] md:text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${healthUI.color}`}>
                    {healthUI.icon} {healthUI.label}
                  </span>
                </div>
                <h4 className="text-base md:text-xl font-bold text-slate-800 mb-1 md:mb-2">Monthly Health Checkup</h4>
                <p className="text-[11px] md:text-sm text-slate-500 mb-3 md:mb-5 max-w-lg leading-relaxed">
                  Visit the local health center for regular checkups and immunizations.
                </p>
                {healthUI.actionable && (
                  <button onClick={() => handleOpenSubmit('Health')} className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] md:text-sm font-bold rounded-lg md:rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 w-full md:w-auto justify-center md:justify-start">
                    <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" /> Submit Proof
                  </button>
                )}
              </div>
            </div>
            <div className="w-full md:w-64 shrink-0 flex flex-col justify-center mt-2 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 md:border-0">
              <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5 md:mb-2">
                <span className="text-slate-700">Current: {healthUI.progress}%</span>
                <span className="text-slate-400">Target: 100%</span>
              </div>
              <div className="h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden w-full mb-2 md:mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${healthUI.barColor}`} style={{ width: `${healthUI.progress}%` }}></div>
              </div>
              <p className={`text-[9px] md:text-xs font-bold text-right uppercase tracking-wider ${healthUI.messageColor}`}>{healthUI.message}</p>
            </div>
          </div>
        </div>

        {/* FDS Requirement */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-row gap-3 md:gap-8 flex-1">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-purple-50 text-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
                <Users className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 flex-wrap">
                  <h3 className="text-xs md:text-base font-bold text-slate-900 uppercase tracking-widest">Family Dev&apos;t</h3>
                  <span className={`px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-md text-[8px] md:text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${fdsUI.color}`}>
                    {fdsUI.icon} {fdsUI.label}
                  </span>
                </div>
                <h4 className="text-base md:text-xl font-bold text-slate-800 mb-1 md:mb-2">Family Dev&apos;t Session (FDS)</h4>
                <p className="text-[11px] md:text-sm text-slate-500 mb-3 md:mb-5 max-w-lg leading-relaxed">
                  Attend the mandatory monthly seminar for parents/guardians.
                </p>
                {fdsUI.actionable && (
                  <button onClick={() => handleOpenSubmit('FDS')} className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] md:text-sm font-bold rounded-lg md:rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 w-full md:w-auto justify-center md:justify-start">
                    <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" /> Submit Proof
                  </button>
                )}
              </div>
            </div>
            <div className="w-full md:w-64 shrink-0 flex flex-col justify-center mt-2 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 md:border-0">
              <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5 md:mb-2">
                <span className="text-slate-700">Current: {fdsUI.progress}%</span>
                <span className="text-slate-400">Target: 100%</span>
              </div>
              <div className="h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden w-full mb-2 md:mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${fdsUI.barColor}`} style={{ width: `${fdsUI.progress}%` }}></div>
              </div>
              <p className={`text-[9px] md:text-xs font-bold text-right uppercase tracking-wider ${fdsUI.messageColor}`}>{fdsUI.message}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Submit Proof Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 shadow-2xl border transition-all duration-500 overflow-hidden relative ${showSuccessAnim ? 'scale-105 bg-emerald-50 border-emerald-200' : 'scale-100 bg-white border-slate-200'}`}>
            
            {showSuccessAnim ? (
              <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in fade-in duration-500 fill-mode-both">
                <style>{`
                  @keyframes confetti-pop {
                    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
                    50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                  }
                  .animate-confetti { animation: confetti-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                `}</style>
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30 animate-confetti ring-8 ring-emerald-100">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-emerald-900 tracking-tight mb-2 text-center">Document Sent!</h3>
                <p className="text-sm text-emerald-700 font-medium text-center">Your {selectedCategory} requirement is now pending DSWD verification.</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Submit {selectedCategory} Proof</h3>
                <p className="text-sm text-slate-500 mb-6">Upload an image or document as proof of your compliance for {selectedCategory}.</p>
                
                <label className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center mb-6 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-colors block group relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <UploadCloud className={`w-10 h-10 mx-auto mb-3 transition-colors relative z-10 ${selectedFile ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  <p className={`text-sm font-bold relative z-10 transition-colors ${selectedFile ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-700'}`}>
                    {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 relative z-10">
                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, JPG, PNG up to 5MB'}
                  </p>
                </label>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowModal(false)} 
                    disabled={isSubmitting} 
                    className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmitProof} 
                    disabled={isSubmitting || !selectedFile} 
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-blue-500/20 disabled:shadow-none disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />}
                    {isSubmitting ? 'Uploading...' : 'Submit Claim'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
