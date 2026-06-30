'use client';
import { useMerchantWalletContext } from '@/components/MerchantWalletProvider';
import { Store, Loader2, Clock, BadgeCheck, XCircle, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MerchantDashboard() {
  const { publicKey, disconnect } = useMerchantWalletContext();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [balance, setBalance] = useState('0.00');
  
  // Onboarding form state
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      window.location.href = '/merchant-login';
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/merchant/profile?wallet=${publicKey}`);
        const data = await res.json();
        
        if (data.exists) {
          setProfile(data.merchant);
          
          if (data.merchant.isWhitelisted) {
            // Fetch balance from testnet
            fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`)
              .then(r => r.ok ? r.json() : null)
              .then(acc => {
                if (acc) {
                  const native = acc.balances?.find((b: any) => b.asset_type === 'native');
                  if (native) {
                    setBalance(parseFloat(native.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                  }
                }
              })
              .catch(console.error);

            // Fetch recent sales (transactions where this merchant was paid)
            // For MVP, we'll fetch all and filter client-side, or use an API. 
            // We can just use the /api/transactions if we had one, but we don't have a GET for all transactions.
            // Let's create a quick API fetch or just rely on a new endpoint. 
            fetch(`/api/merchant/sales?name=${encodeURIComponent(data.merchant.businessName)}`)
              .then(r => r.json())
              .then(d => {
                if (d.success) setSales(d.transactions);
              })
              .catch(console.error);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [publicKey]);

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/merchant/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey, businessName, category, location })
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.merchant);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!publicKey) return <div className="min-h-screen bg-slate-50" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // --- 1. NOT REGISTERED YET ---
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 w-full max-w-md">
          <div className="flex items-center gap-3 text-indigo-600 mb-6">
            <Store className="w-8 h-8" />
            <h2 className="text-2xl font-bold text-slate-900">Merchant Setup</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">Register your business to receive DSWD 4P-Tokens directly to your wallet.</p>
          
          <form onSubmit={handleOnboard} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
              <input 
                required value={businessName} onChange={e => setBusinessName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                placeholder="e.g. Aling Nena's Sari-Sari" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
              <select 
                required value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select category...</option>
                <option value="Grocery">Grocery</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Address / Location</label>
              <input 
                required value={location} onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                placeholder="e.g. Brgy. 143, Manila" 
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for DSWD Approval'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. PENDING APPROVAL ---
  if (!profile.isWhitelisted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 w-full max-w-md text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pending DSWD Approval</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Your application for <strong>{profile.businessName}</strong> is currently under review by the Department of Social Welfare and Development. You will be able to receive 4P-Tokens once you are whitelisted.
          </p>
          <button onClick={disconnect} className="text-slate-400 hover:text-slate-600 font-medium text-sm flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  // --- 3. APPROVED (FULL DASHBOARD) ---
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-indigo-900 text-white pb-24">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-800 rounded-lg flex items-center justify-center shadow-inner">
              <Store className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight">{profile.businessName}</h1>
              <div className="flex items-center gap-1.5 text-indigo-300 text-xs">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                DSWD Whitelisted Merchant
              </div>
            </div>
          </div>
          <button onClick={disconnect} className="text-indigo-300 hover:text-white transition-colors p-2 bg-indigo-800/50 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <p className="text-slate-500 font-medium mb-1">Stellar Wallet Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{balance}</span>
              <span className="text-xl font-medium text-slate-400">XLM</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono break-all">{publicKey}</p>
          </div>
          
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Deposit to Bank
            </button>
            <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              Generate QR Code
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900">Recent Sales (4P-Tokens Received)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase bg-slate-50/50">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">From Beneficiary</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  sales.map(sale => (
                    <tr key={sale.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-600">{new Date(sale.date).toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono text-slate-400 text-xs">{sale.txHash.substring(0,16)}...</td>
                      <td className="px-6 py-4 font-mono text-slate-600">{sale.beneficiary.substring(0,8)}...</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">+{sale.amount} XLM</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
