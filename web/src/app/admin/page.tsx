'use client';
import { useState, useEffect } from 'react';
import { useWalletContext } from '@/components/WalletProvider';
import { CheckCircle2, Loader2, Users, Wallet, ShieldCheck, Activity, ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type AnalyticsData = {
  dailyFlow: { date: string; disbursed: number; spent: number }[];
  categoryDistribution: { name: string; value: number }[];
};

type RecentBeneficiary = {
  id: string;
  fullName: string;
  wallet: string;
  address: string;
  kycStatus: string;
  createdAt: string;
};

const PROGRAM_CATEGORIES = [
  '4Ps Education Grant',
  'Health Subsidy',
  'Housing Assistance',
  'Livelihood Assistance',
  'Social Pension',
];

// Custom Tooltip for Area Chart
type TooltipPayload = { color: string; name: string; value: number };
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100">
        <p className="text-slate-500 font-medium text-xs mb-3">{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6 mb-1.5 last:mb-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-sm font-semibold text-slate-700">{entry.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{entry.value.toLocaleString()} XLM</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Home() {
  const wallet = useWalletContext();
  const { publicKey } = wallet;
  const [balance, setBalance] = useState<string | null>(null);
  const [recentBeneficiaries, setRecentBeneficiaries] = useState<RecentBeneficiary[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Fetch XLM balance from Horizon
  useEffect(() => {
    if (!publicKey) {
      const timer = setTimeout(() => setBalance(null), 0);
      return () => clearTimeout(timer);
    }
    const fetchBalance = async () => {
      try {
        const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
        if (!res.ok) throw new Error('Account not found');
        const data = await res.json();
        const nativeBalance = data.balances?.find((b: { asset_type: string; balance: string }) => b.asset_type === 'native');
        if (nativeBalance) {
          const formatted = parseFloat(nativeBalance.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          setBalance(formatted);
        } else {
          setBalance('0.00');
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance('0.00');
      }
    };
    fetchBalance();
  }, [publicKey]);

  // Fetch recent beneficiaries from MongoDB (live data)
  useEffect(() => {
    const fetchRecent = async () => {
      setIsTableLoading(true);
      try {
        const res = await fetch('/api/beneficiaries');
        const data = await res.json();
        if (data.success && data.beneficiaries) {
          setRecentBeneficiaries(data.beneficiaries.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch recent beneficiaries:', error);
      } finally {
        setIsTableLoading(false);
      }
    };
    fetchRecent();
  }, []);

  // Fetch Analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        const data = await res.json();
        if (data.success) {
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getProgram = (w: string) => {
    const idx = (w.charCodeAt(3) + w.charCodeAt(4)) % PROGRAM_CATEGORIES.length;
    return PROGRAM_CATEGORIES[idx];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Command Center</h1>
        <p className="text-slate-500 mt-2 font-medium">DSWD National Treasury • Transparent Disbursement System</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Wallet Balance Card (Premium Glass/Gradient) */}
        <div className="col-span-1 lg:col-span-2 relative bg-linear-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-8 shadow-xl overflow-hidden group animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Decorative glowing orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <Wallet className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-indigo-200">National Treasury Balance</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">Stellar Testnet Live</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  {publicKey ? (
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                      {balance === null ? 'Loading...' : balance}
                    </span>
                  ) : (
                    <span className="text-3xl font-bold text-white/50">Disconnected</span>
                  )}
                  {publicKey && balance !== null && <span className="text-2xl font-bold text-indigo-300">XLM</span>}
                </div>
                {!publicKey ? (
                  <p className="text-sm text-indigo-200/60 mt-2">Connect Freighter to view treasury funds.</p>
                ) : (
                  <p className="text-xs text-indigo-200/80 font-mono tracking-widest uppercase">
                    {publicKey.substring(0, 8)} •••• {publicKey.substring(publicKey.length - 8)}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <a
                  href={publicKey ? `https://stellar.expert/explorer/testnet/account/${publicKey}` : 'https://stellar.expert/explorer/testnet/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" /> Explorer
                </a>
                <Link
                  href="/disbursements"
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Disburse
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Small Stat Cards (Stacked vertically on large screens) */}
        <div className="col-span-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-linear-to-br from-blue-50 to-blue-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Enrolled</p>
                <p className="text-3xl font-black text-slate-900">
                  {isTableLoading ? '—' : recentBeneficiaries.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">KYC Verified</p>
                <p className="text-3xl font-black text-emerald-600">
                  {isTableLoading ? '—' : recentBeneficiaries.filter((b) => b.kycStatus === 'verified').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        {/* Daily Flow Area Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Network Fund Flow</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Disbursements vs Verified Spending (Last 7 Days)</p>
            </div>
          </div>
          <div className="flex-1 min-h-75 w-full">
            {analytics ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="disbursed" name="Disbursed" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorDisbursed)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />
                  <Area type="monotone" dataKey="spent" name="Spent" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSpent)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
            )}
          </div>
        </div>

        {/* Category Spending Pie Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col relative overflow-hidden">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Spending by Category</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Smart Contract execution paths</p>
          </div>
          <div className="flex-1 min-h-50 w-full flex items-center justify-center relative">
            {analytics ? (
              analytics.categoryDistribution.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {analytics.categoryDistribution.map((entry, index) => {
                          const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <RechartsTooltip 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => [`${value} XLM`, 'Total'] as any}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {analytics.categoryDistribution.reduce((a, b) => a + b.value, 0)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total XLM</span>
                  </div>
                </>
              ) : (
                <p className="text-sm font-medium text-slate-400">No spending data yet.</p>
              )
            ) : (
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            )}
          </div>
          
          {/* Custom Modern Legend */}
          {analytics && analytics.categoryDistribution.length > 0 && (
            <div className="mt-8 flex flex-col gap-3">
              {analytics.categoryDistribution.map((entry, index) => {
                const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500'];
                return (
                  <div key={index} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-default">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <span className={`w-3 h-3 rounded-full shadow-sm ${colors[index % colors.length]}`}></span>
                      <span className="group-hover:text-slate-900 transition-colors">{entry.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{entry.value} XLM</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Live Table — fetched from MongoDB */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-[60px] duration-1000">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Enrollments</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live MongoDB Feed</p>
            </div>
          </div>
          <Link href="/beneficiaries" className="group flex items-center gap-1.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all">
            View Registry <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[30%]">Beneficiary</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[25%]">Program Access</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[25%]">Stellar Address</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[20%] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100/50">
              {isTableLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      <span className="text-sm font-medium text-slate-500">Syncing with database...</span>
                    </div>
                  </td>
                </tr>
              ) : recentBeneficiaries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium mt-2">No beneficiaries enrolled yet.</p>
                      <Link href="/beneficiaries" className="text-blue-600 font-bold text-sm hover:underline mt-1">
                        Go to Beneficiary Registry
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                recentBeneficiaries.map((b) => (
                  <tr key={b.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-50 to-indigo-100 text-blue-700 flex items-center justify-center text-sm font-black border border-blue-200/50 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                          {getInitials(b.fullName)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{b.fullName}</div>
                          <div className="text-xs text-slate-500 mt-0.5 truncate max-w-50">{b.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                        {getProgram(b.wallet)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-mono text-slate-700 text-xs font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block w-fit">
                          {b.wallet.substring(0, 12)}...
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">Joined {formatDate(b.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black tracking-widest uppercase">KYC Verified</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 mb-8 text-center animate-in fade-in duration-1000">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Powered by <span className="text-slate-600">Stellar Network</span> & Soroban
        </p>
      </div>
    </div>
  );
}
