'use client';
import { useMerchantWalletContext } from '@/components/MerchantWalletProvider';
import { Store, Loader2, Clock, BadgeCheck, XCircle, LogOut, ArrowRight, ShieldCheck, MapPin, Tag, Activity, Coins, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BlockchainNetworkBackground from '@/components/BlockchainNetworkBackground';
import DynamicMap from '@/components/DynamicMap';

export default function MerchantDashboard() {
  const { publicKey, disconnect } = useMerchantWalletContext();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [balance, setBalance] = useState('0.00');
  const [showQR, setShowQR] = useState(false);
  
  // Onboarding form state
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      const timer = setTimeout(() => {
        if (!localStorage.getItem('4ps_merchant_pubkey')) {
          window.location.href = '/merchant-login';
        }
      }, 500);
      return () => clearTimeout(timer);
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

            // Fetch recent sales
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

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(', ');
        setLocation(parts.slice(0, 3).join(', '));
      }
    } catch (e) {
      console.error("Reverse geocoding failed", e);
    }
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapPosition([lat, lng]);
          reverseGeocode(lat, lng);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please check browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleMapSelect = (lat: number, lng: number) => {
    setMapPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + Math.abs(sale.amount), 0);
  const totalTxs = sales.length;

  if (!publicKey) return <div className="min-h-screen bg-slate-950" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Syncing with Stellar Network...</p>
      </div>
    );
  }

  // --- 1. NOT REGISTERED YET ---
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <BlockchainNetworkBackground />
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-800 p-8 w-full max-w-md relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Merchant Setup</h2>
            <p className="text-sm text-slate-400 mt-2">Register your business to receive DSWD 4P-Tokens directly to your wallet.</p>
          </div>
          
          <form onSubmit={handleOnboard} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5">Business Name</label>
              <input 
                required value={businessName} onChange={e => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-600 focus:outline-none" 
                placeholder="e.g. Aling Nena's Sari-Sari" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5">Category</label>
              <select 
                required value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white focus:outline-none"
              >
                <option value="" disabled>Select category...</option>
                <option value="Food">Food & Groceries</option>
                <option value="Health">Health & Pharmacy</option>
                <option value="Education">Education & School Supplies</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-300">Physical Address</label>
                <button 
                  type="button" 
                  onClick={detectLocation}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-md transition-colors"
                >
                  <MapPin className="w-3 h-3" /> Auto-Detect
                </button>
              </div>
              
              <div className="h-48 w-full mb-3 rounded-xl overflow-hidden border border-slate-800 relative z-0">
                <DynamicMap position={mapPosition} onLocationSelect={handleMapSelect} />
              </div>

              <input 
                required value={location} onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-600 focus:outline-none" 
                placeholder="e.g. Brgy. 143, Manila" 
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-4 shadow-lg shadow-indigo-600/20">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for Accreditation'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. PENDING APPROVAL ---
  if (!profile.isWhitelisted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <BlockchainNetworkBackground />
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-800 p-10 w-full max-w-md text-center flex flex-col items-center relative z-10">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-3">Pending Accreditation</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Your application for <strong className="text-white">{profile.businessName}</strong> is currently under review by DSWD. You will be able to receive 4P-Tokens once you are whitelisted.
          </p>
          <button onClick={disconnect} className="text-slate-500 hover:text-white font-medium text-sm flex items-center gap-2 transition-colors">
            <LogOut className="w-4 h-4" /> Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  // --- 3. APPROVED (FULL DASHBOARD) ---
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="fixed top-0 -left-1/4 w-[100%] h-[100%] bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-50 pointer-events-none"></div>
      
      {/* Navbar */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-white leading-tight">{profile.businessName}</h1>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <BadgeCheck className="w-3.5 h-3.5" />
                DSWD Accredited Merchant
              </div>
            </div>
          </div>
          <button onClick={disconnect} className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-700">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 relative z-10">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <div className="md:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <Coins className="w-48 h-48 text-indigo-300" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Settled Wallet Balance</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black text-white tracking-tighter">{balance}</span>
                  <span className="text-xl font-bold text-slate-500">XLM</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-950/50 inline-flex px-3 py-1.5 rounded-lg border border-white/5">
                  <LinkIcon className="w-3.5 h-3.5" /> {publicKey}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
                <button className="w-full sm:w-auto px-4 md:px-6 py-3 md:py-3.5 bg-white text-slate-900 font-bold text-sm md:text-base rounded-xl hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2">
                  Off-Ramp via Anchor
                </button>
                <button 
                  onClick={() => setShowQR(true)}
                  className="w-full sm:w-auto px-4 md:px-6 py-3 md:py-3.5 bg-indigo-600 text-white font-bold text-sm md:text-base rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 border border-indigo-500"
                >
                  Generate Payment QR
                </button>
              </div>
            </div>
          </div>

          {/* Revenue & Metrics */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-slate-500 font-bold">XLM</span></p>
              <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">+12.5% from last week</p>
            </div>
            
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Txns</p>
                <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{totalTxs}</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Successful on-chain spends</p>
            </div>
          </div>
        </div>

        {/* Sales Table Explorer Style */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
            <h3 className="font-extrabold text-white text-lg">Blockchain Settlement Ledger</h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-md border border-emerald-400/20 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Live
            </span>
          </div>
          
          {/* Desktop Table Header */}
          <div className="hidden md:flex items-center px-8 py-4 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50">
            <div className="w-1/4">Date & Time</div>
            <div className="w-1/3">Transaction Hash</div>
            <div className="w-1/4">Beneficiary Wallet</div>
            <div className="w-1/6 text-right">Settled Amount</div>
          </div>

          {/* List Content */}
          <div className="flex flex-col">
            {sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
                <Store className="w-10 h-10 text-slate-700" />
                <p className="text-slate-500 font-medium">No sales recorded yet.</p>
              </div>
            ) : (
              sales.map(sale => (
                <div key={sale.id} className="flex flex-col md:flex-row md:items-center px-6 py-5 md:px-8 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors group gap-4 md:gap-0">
                  
                  {/* Date and Time */}
                  <div className="w-full md:w-1/4 flex justify-between md:flex-col md:justify-start">
                    <span className="text-sm font-bold md:font-normal text-slate-300 md:text-slate-400">
                      {new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(sale.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Transaction Hash */}
                  <div className="w-full md:w-1/3 overflow-hidden">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 md:hidden">Transaction Hash</p>
                    <a href={`https://stellar.expert/explorer/testnet/tx/${sale.txHash}`} target="_blank" rel="noreferrer" className="font-mono text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                      {sale.txHash.substring(0,16)}...<ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
                    </a>
                  </div>

                  {/* Beneficiary Wallet */}
                  <div className="w-full md:w-1/4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 md:hidden">Beneficiary Wallet</p>
                    <span className="font-mono text-sm text-slate-400">
                      {sale.beneficiary.substring(0,8)}...{sale.beneficiary.substring(sale.beneficiary.length - 4)}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="w-full md:w-1/6 md:text-right mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-800/50 md:border-t-0 flex justify-between md:block items-center">
                    <p className="text-xs text-slate-500 font-bold md:hidden">SETTLED AMOUNT</p>
                    <span className="font-black text-lg md:text-base text-emerald-400">
                      +{Math.abs(sale.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm md:text-xs">XLM</span>
                    </span>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl flex flex-col items-center p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Store className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="font-black text-white text-xl text-center mb-1">{profile.businessName}</h3>
            <p className="text-xs text-slate-400 mb-6 font-mono bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
              {publicKey.substring(0,8)}...{publicKey.substring(publicKey.length - 8)}
            </p>
            
            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-indigo-500/10 mb-6">
              {/* Fallback to QR Server API */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicKey)}`} 
                alt="Wallet QR Code" 
                className="w-48 h-48"
              />
            </div>
            
            <p className="text-xs text-center text-slate-500 max-w-[250px] leading-relaxed">
              Show this QR code to beneficiaries so they can scan and pay using their 4P-Tokens.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
