'use client';
import { ClipboardCheck, GraduationCap, Stethoscope, Users, CheckCircle2, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWalletContext } from '@/components/WalletProvider';

const BASE_REQUIREMENTS = [
  {
    id: 'req_1',
    category: 'Education',
    title: "Children's School Attendance",
    description: 'Ensure children attend at least 85% of school days per month.',
    target: 85,
    icon: GraduationCap,
    color: 'text-slate-900',
    bgColor: 'bg-slate-100',
    progressColor: 'bg-slate-900',
  },
  {
    id: 'req_2',
    category: 'Health',
    title: 'Monthly Health Checkup',
    description: 'Visit the local health center for regular checkups and immunizations.',
    target: 100,
    icon: Stethoscope,
    color: 'text-slate-900',
    bgColor: 'bg-slate-100',
    progressColor: 'bg-slate-900',
  },
  {
    id: 'req_3',
    category: 'Family Development',
    title: 'Family Development Session (FDS)',
    description: 'Attend the mandatory monthly seminar for parents/guardians.',
    target: 100,
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    progressColor: 'bg-amber-500',
    date: 'June 30, 2026',
  }
];

export default function CompliancePage() {
  const { publicKey } = useWalletContext();
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/claims');
        if (res.ok) {
          const allClaims = await res.json();
          // Filter claims for this beneficiary
          setClaims(allClaims.filter((c: any) => c.beneficiary === publicKey));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClaims();
  }, [publicKey]);

  // Derive compliance status from claims
  const requirements = BASE_REQUIREMENTS.map(req => {
    // Check if there is an approved claim for this category
    const isApproved = claims.some(c => c.category === req.category && c.status === 'approved');
    return {
      ...req,
      status: isApproved ? 'compliant' : 'pending',
      progress: isApproved ? req.target : 0,
      color: isApproved ? req.color : 'text-amber-500',
      bgColor: isApproved ? req.bgColor : 'bg-amber-50',
      progressColor: isApproved ? req.progressColor : 'bg-amber-500'
    };
  });

  const allCompliant = requirements.every(r => r.status === 'compliant');

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1 md:mb-2">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900">Compliance & Requirements</h1>
        </div>
        <p className="text-sm md:text-base text-slate-500">Track your family's 4Ps program conditional requirements.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      ) : !publicKey ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-700">
          Please connect your Freighter wallet to view your compliance status.
        </div>
      ) : (
        <>
          {/* Status Banner */}
          <div className={`p-4 md:p-6 rounded-2xl border flex items-start md:items-center gap-3 md:gap-4 shadow-lg bg-[#121216] border-[#1a1a24]`}>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${allCompliant ? 'bg-white/10 text-emerald-400' : 'bg-white/10 text-amber-400'}`}>
              {allCompliant ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base md:text-lg mb-0.5 md:mb-1 text-white">
                {allCompliant ? 'Ready for Next Disbursement' : 'Action Required for Next Payout'}
              </h3>
              <p className="text-sm text-slate-400">
                {allCompliant 
                  ? "Great job! You have met all requirements for this month. Your funds will be automatically released on schedule."
                  : "You have pending requirements. Please complete them to ensure your Smart Contract releases your funds."}
              </p>
            </div>
          </div>

          {/* Requirements List */}
          <div className="grid gap-3 md:gap-6">
            {requirements.map((req) => {
              const Icon = req.icon;
              return (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    
                    {/* Left side: Icon & Text */}
                    <div className="flex-1 flex gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${req.bgColor} ${req.color}`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{req.category}</span>
                          {req.status === 'compliant' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                              <CheckCircle2 className="w-3 h-3" /> Compliant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 uppercase tracking-wide border border-amber-100">
                              <AlertCircle className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1 leading-tight">{req.title}</h3>
                        <p className="text-xs md:text-sm text-slate-500">{req.description}</p>
                        
                        {req.date && (
                          <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-amber-600 mt-2 md:mt-3 bg-amber-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg w-fit">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            Next Session: {req.date}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side: Progress Bar */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col justify-center mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-0">
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-900">Current: {req.progress}%</span>
                        <span className="text-slate-400">Target: {req.target}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${req.progress >= req.target ? req.progressColor : 'bg-slate-300'}`}
                          style={{ width: `${Math.max(req.progress, 5)}%` }}
                        />
                      </div>
                      {req.progress >= req.target ? (
                         <p className="text-xs text-slate-500 font-medium mt-2 text-right">Target Met</p>
                      ) : (
                         <p className="text-xs text-amber-600 font-medium mt-2 text-right">Needs Attention</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

