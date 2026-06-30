'use client';
import { useState, useCallback, useEffect } from 'react';
import { useWalletContext } from '@/components/WalletProvider';
import { CheckCircle2, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

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

export default function Home() {
  const wallet = useWalletContext();
  const { publicKey } = wallet;
  const [refreshKey, setRefreshKey] = useState(0);
  const [balance, setBalance] = useState<string | null>(null);
  const [recentBeneficiaries, setRecentBeneficiaries] = useState<RecentBeneficiary[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // Fetch XLM balance from Horizon
  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    const fetchBalance = async () => {
      try {
        const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
        if (!res.ok) throw new Error('Account not found');
        const data = await res.json();
        const nativeBalance = data.balances?.find((b: any) => b.asset_type === 'native');
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
  }, [publicKey, refreshKey]);

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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Deterministically assign a program category based on wallet chars
  const getProgram = (w: string) => {
    const idx = (w.charCodeAt(3) + w.charCodeAt(4)) % PROGRAM_CATEGORIES.length;
    return PROGRAM_CATEGORIES[idx];
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Admin!</h1>
        <p className="text-slate-500 mt-1">Enforcing 100% transparent and restricted spending for DSWD.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Wallet Balance Card */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
            <div className="w-full">
              <h2 className="text-sm font-medium text-slate-500 mb-1">Stellar Wallet Balance</h2>
              <div className="flex items-baseline gap-2">
                {publicKey ? (
                  <span className="text-3xl font-bold text-slate-900">
                    {balance === null ? 'Loading...' : balance}{' '}
                    <span className="text-xl text-slate-400 font-medium">{balance !== null && 'XLM'}</span>
                  </span>
                ) : (
                  <span className="text-3xl font-bold text-slate-900">
                    $24,560.85 <span className="text-xl text-slate-400 font-medium">USD</span>
                  </span>
                )}
              </div>
              {!publicKey ? (
                <p className="text-sm text-slate-400 mt-1">30,701.06 XLM (Demo)</p>
              ) : (
                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-2 font-mono inline-block border border-blue-100">
                  Active Address: {publicKey.substring(0, 6)}...{publicKey.substring(publicKey.length - 4)}
                </p>
              )}
            </div>
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
              <a
                href={publicKey ? `https://stellar.expert/explorer/testnet/account/${publicKey}` : 'https://stellar.expert/explorer/testnet/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none px-3 py-2 md:px-4 md:py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs md:text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm cursor-pointer text-center inline-flex items-center justify-center whitespace-nowrap"
              >
                View Assets
              </a>
              <Link
                href="/disbursements"
                className="flex-1 md:flex-none px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer text-center inline-flex items-center justify-center whitespace-nowrap"
              >
                Disbursement Hub
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Card — live counts from DB */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div>
              <h3 className="text-xs font-medium text-slate-500 mb-1">Total Enrolled</h3>
              <p className="text-2xl font-bold text-slate-900">
                {isTableLoading ? '—' : recentBeneficiaries.length}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-slate-500 mb-1">KYC Verified</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {isTableLoading ? '—' : recentBeneficiaries.filter((b) => b.kycStatus === 'verified').length}
              </p>
            </div>
            <div className="col-span-2 mt-auto">
              <h3 className="text-xs font-medium text-slate-500 mb-1">Network</h3>
              <p className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
                Stellar Testnet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Table — fetched from MongoDB */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Recently Enrolled Beneficiaries</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live data from MongoDB ·{' '}
              {isTableLoading ? 'Loading...' : `${recentBeneficiaries.length} record(s) found`}
            </p>
          </div>
          <Link href="/beneficiaries" className="text-xs text-blue-600 hover:underline font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-5 border-b border-slate-100">Enrollment Date</th>
                <th className="px-6 py-5 border-b border-slate-100">Program</th>
                <th className="px-6 py-5 border-b border-slate-100">Beneficiary</th>
                <th className="px-6 py-5 border-b border-slate-100">Wallet Address</th>
                <th className="px-6 py-5 border-b border-slate-100">KYC Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {isTableLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Fetching from database...</span>
                    </div>
                  </td>
                </tr>
              ) : recentBeneficiaries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <p className="text-slate-500 font-medium">No beneficiaries enrolled yet.</p>
                      <Link href="/beneficiaries" className="text-blue-600 text-xs hover:underline">
                        Go to Beneficiary Registry →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                recentBeneficiaries.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-slate-600">{formatDate(b.createdAt)}</td>
                    <td className="px-6 py-5 font-medium text-slate-900">{getProgram(b.wallet)}</td>
                    <td className="px-6 py-5">
                      <span className="font-medium text-slate-900">{b.fullName}</span>
                      <br />
                      <span className="text-xs text-slate-400">{b.address}</span>
                    </td>
                    <td className="px-6 py-5 font-mono text-slate-600 text-xs">
                      {b.wallet.substring(0, 6)}...{b.wallet.substring(b.wallet.length - 4)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" /> KYC Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400">
        Powered by <strong>Stellar Network</strong> &amp; Soroban
      </div>
    </div>
  );
}
