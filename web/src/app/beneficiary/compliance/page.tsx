'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, GraduationCap, Stethoscope, Users, Clock, Loader2, ShieldCheck, FileText } from 'lucide-react';

export default function CompliancePage() {
  const [compliance, setCompliance] = useState({
    education: 'missing',
    health: 'missing',
    fds: 'missing'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompliance() {
      try {
        const res = await fetch('/api/compliance');
        if (res.ok) {
          const data = await res.json();
          setCompliance(data.compliance);
        }
      } catch (error) {
        console.error("Failed to fetch compliance", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompliance();
  }, []);

  const getStatusUI = (status: string, targetPercent: number) => {
    if (status === 'approved') {
      return {
        label: 'COMPLIANT',
        icon: <CheckCircle2 className="w-3 h-3" />,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        progress: targetPercent,
        barColor: 'bg-emerald-500',
        message: 'Requirement Met',
        messageColor: 'text-emerald-600'
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
        messageColor: 'text-amber-600'
      };
    }
    return {
      label: 'PENDING',
      icon: <Clock className="w-3 h-3" />,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      progress: 0,
      barColor: 'bg-rose-500',
      message: 'Needs Attention',
      messageColor: 'text-rose-600'
    };
  };

  const eduUI = getStatusUI(compliance.education, 85);
  const healthUI = getStatusUI(compliance.health, 100);
  const fdsUI = getStatusUI(compliance.fds, 100);
  
  const hasActionRequired = Object.values(compliance).includes('missing') || Object.values(compliance).includes('pending');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Compliance & Requirements</h1>
        <p className="text-slate-500 mt-2">
          Track your family&apos;s 4Ps program conditional requirements.
        </p>
      </div>

      {hasActionRequired ? (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Action Required for Next Payout</h2>
            <p className="text-sm text-slate-400">
              You have pending requirements. Please upload claims or wait for approval to ensure your Smart Contract releases your funds.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-emerald-900 mb-1">100% Compliant</h2>
            <p className="text-sm text-emerald-700">
              You have met all conditional requirements. Your next payout is secured.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        
        {/* Education Requirement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Education</h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${eduUI.color}`}>
                  {eduUI.icon} {eduUI.label}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Children&apos;s School Attendance</h4>
              <p className="text-sm text-slate-500 mb-4">
                Ensure children attend at least 85% of school days per month.
              </p>
            </div>
            <div className="w-full md:w-64 shrink-0 flex flex-col justify-center">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">Current: {eduUI.progress}%</span>
                <span className="text-slate-400">Target: 85%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden w-full mb-2">
                <div className={`h-full rounded-full transition-all duration-1000 ${eduUI.barColor}`} style={{ width: `${(eduUI.progress / 85) * 100}%` }}></div>
              </div>
              <p className={`text-xs font-bold text-right ${eduUI.messageColor}`}>{eduUI.message}</p>
            </div>
          </div>
        </div>

        {/* Health Requirement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Health</h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${healthUI.color}`}>
                  {healthUI.icon} {healthUI.label}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Monthly Health Checkup</h4>
              <p className="text-sm text-slate-500 mb-4">
                Visit the local health center for regular checkups and immunizations.
              </p>
            </div>
            <div className="w-full md:w-64 shrink-0 flex flex-col justify-center">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">Current: {healthUI.progress}%</span>
                <span className="text-slate-400">Target: 100%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden w-full mb-2">
                <div className={`h-full rounded-full transition-all duration-1000 ${healthUI.barColor}`} style={{ width: `${healthUI.progress}%` }}></div>
              </div>
              <p className={`text-xs font-bold text-right ${healthUI.messageColor}`}>{healthUI.message}</p>
            </div>
          </div>
        </div>

        {/* FDS Requirement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Family Development</h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${fdsUI.color}`}>
                  {fdsUI.icon} {fdsUI.label}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Family Development Session (FDS)</h4>
              <p className="text-sm text-slate-500 mb-4">
                Attend the mandatory monthly seminar for parents/guardians.
              </p>
            </div>
            <div className="w-full md:w-64 shrink-0 flex flex-col justify-center">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">Current: {fdsUI.progress}%</span>
                <span className="text-slate-400">Target: 100%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden w-full mb-2">
                <div className={`h-full rounded-full transition-all duration-1000 ${fdsUI.barColor}`} style={{ width: `${fdsUI.progress}%` }}></div>
              </div>
              <p className={`text-xs font-bold text-right ${fdsUI.messageColor}`}>{fdsUI.message}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
