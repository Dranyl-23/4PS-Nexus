'use client';
import { ClipboardCheck, GraduationCap, Stethoscope, Users, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useState } from 'react';

const REQUIREMENTS = [
  {
    id: 'req_1',
    category: 'Education',
    title: "Children's School Attendance",
    description: 'Ensure children attend at least 85% of school days per month.',
    status: 'compliant',
    progress: 92, // percentage
    target: 85,
    icon: GraduationCap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    progressColor: 'bg-blue-500',
  },
  {
    id: 'req_2',
    category: 'Health',
    title: 'Monthly Health Checkup',
    description: 'Visit the local health center for regular checkups and immunizations.',
    status: 'compliant',
    progress: 100,
    target: 100,
    icon: Stethoscope,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    progressColor: 'bg-emerald-500',
  },
  {
    id: 'req_3',
    category: 'Family Development',
    title: 'Family Development Session (FDS)',
    description: 'Attend the mandatory monthly seminar for parents/guardians.',
    status: 'pending',
    progress: 0,
    target: 100,
    icon: Users,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    progressColor: 'bg-amber-500',
    date: 'June 30, 2026',
  }
];

export default function CompliancePage() {
  const allCompliant = REQUIREMENTS.every(r => r.status === 'compliant');

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1 md:mb-2">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900">Compliance & Requirements</h1>
        </div>
        <p className="text-sm md:text-base text-slate-500">Track your family's 4Ps program conditional requirements.</p>
      </div>

      {/* Status Banner */}
      <div className={`p-4 md:p-6 rounded-2xl border ${allCompliant ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'} flex items-start md:items-center gap-3 md:gap-4`}>
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${allCompliant ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
          {allCompliant ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-base md:text-lg mb-0.5 md:mb-1 ${allCompliant ? 'text-emerald-900' : 'text-amber-900'}`}>
            {allCompliant ? 'Ready for Next Disbursement' : 'Action Required for Next Payout'}
          </h3>
          <p className={`text-sm ${allCompliant ? 'text-emerald-700' : 'text-amber-700'}`}>
            {allCompliant 
              ? "Great job! You have met all requirements for this month. Your funds will be automatically released on schedule."
              : "You have 1 pending requirement. Please complete it before the cutoff date to ensure your Smart Contract releases your funds."}
          </p>
        </div>
      </div>

      {/* Requirements List */}
      <div className="grid gap-3 md:gap-6">
        {REQUIREMENTS.map((req) => {
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
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3" /> Compliant
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">
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
                     <p className="text-xs text-emerald-600 font-medium mt-2 text-right">Target Met</p>
                  ) : (
                     <p className="text-xs text-amber-600 font-medium mt-2 text-right">Needs Attention</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
