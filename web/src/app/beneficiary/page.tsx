'use client';
import { QrCode, MapPin, Store, CheckCircle2, ChevronRight, Vault, Bell, X, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useWalletContext } from '@/components/WalletProvider';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { signTransaction } from '@stellar/freighter-api';
import { NETWORK_PASSPHRASE, server } from '@/lib/stellar';
import { buildSpendXDR } from '@/lib/contract';
import { TransactionBuilder, Transaction } from '@stellar/stellar-sdk';
import { Scanner } from '@yudiel/react-qr-scanner';

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-100 w-full bg-slate-100 rounded-xl flex items-center justify-center animate-pulse"><p className="text-slate-400">Loading map...</p></div>
});

interface TxDetails {
  merchant: string;
  amount: number;
  category: string;
  hash: string;
  items: string[];
}

interface Profile {
  balance: number;
  totalSpent: number;
  nextRelease: number;
  dswdId: string;
}

interface TransactionItem {
  id: string;
  type: string;
  merchant: string;
  category: string;
  amount: number;
  txHash: string;
}

interface Merchant {
  id: string;
  businessName: string;
  wallet: string;
  location: string;
  isWhitelisted: boolean;
}

export default function BeneficiaryApp() {
  const wallet = useWalletContext();
  const { publicKey } = wallet;
  const [showPayModal, setShowPayModal] = useState(false);
  const [payStatus, setPayStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapMerchants, setMapMerchants] = useState<Merchant[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TxDetails | null>(null);
  
  // Payment Modal States
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<string>('');
  
  // Real Data States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // Fetch profile
        const profileRes = await fetch(`/api/beneficiary/profile?wallet=${publicKey}`);
        if (profileRes.ok) setProfile(await profileRes.json());
        
        // Fetch transactions
        const txRes = await fetch(`/api/beneficiary/transactions?wallet=${publicKey}`);
        if (txRes.ok) setTransactions(await txRes.json());

        // Fetch merchants
        const merchantsRes = await fetch(`/api/merchants`);
        if (merchantsRes.ok) {
          const allMerchants: Merchant[] = await merchantsRes.json();
          setMerchants(allMerchants.filter(m => m.isWhitelisted));
          // Pre-select first merchant if available
          const whitelisted = allMerchants.filter(m => m.isWhitelisted);
          if (whitelisted.length > 0) {
            setSelectedMerchantId(whitelisted[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [publicKey]);

  const handleDemoPay = async () => {
    if (!selectedMerchantId || !payAmount || isNaN(Number(payAmount)) || Number(payAmount) <= 0) {
      alert("Please select a merchant and enter a valid amount.");
      return;
    }

    setPayStatus('scanning');
    
    try {
      if (publicKey && merchants.length > 0) {
        const targetMerchant = merchants.find(m => m.id === selectedMerchantId) || merchants[0];
        // Fallback wallet if merchant doesn't have one (for demo purposes)
        const merchantWallet = targetMerchant.wallet || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
        const amount = Number(payAmount);

        // 1. Build Smart Contract Spend XDR
        console.log("Building spend XDR...");
        const xdr = await buildSpendXDR(publicKey, merchantWallet, amount);
        
        // 2. Sign with Freighter
        console.log("Prompting Freighter...");
        const signRes = await signTransaction(xdr, { networkPassphrase: NETWORK_PASSPHRASE });
        if ('error' in signRes && signRes.error) {
          throw new Error(signRes.error);
        }
        
        // 3. Submit to Stellar
        console.log("Submitting to network...");
        const tx = TransactionBuilder.fromXDR((signRes as { signedTxXdr: string }).signedTxXdr, NETWORK_PASSPHRASE) as Transaction;
        const res = await server.sendTransaction(tx);
        
        if (res.status === 'ERROR') throw new Error(`Transaction failed: ${res.errorResult?.toString() || 'Unknown error'}`);

        // 4. Record to Prisma DB for history tracking
        await fetch('/api/beneficiary/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            beneficiary: publicKey,
            type: 'spend',
            merchant: targetMerchant.businessName,
            category: targetMerchant.location,
            amount: amount,
            txHash: res.hash
          })
        });

        setPayStatus('success');
        setTimeout(() => {
          setShowPayModal(false);
          setPayStatus('idle');
          window.location.reload(); // Reload to fetch updated balance/txs
        }, 2000);
      }
    } catch (e: unknown) {
      console.error(e);
      setPayStatus('idle');
      alert('Payment failed: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const balance = profile?.balance || 0;
  const totalSpent = profile?.totalSpent || 0;
  const nextRelease = profile?.nextRelease || 1500;
  const dswdId = profile?.dswdId || 'Loading...';

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Top Header Label & Notifications */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
            Dashboard <span className="text-slate-400 font-normal text-base md:text-lg">/ Beneficiary Portal</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span> Next disbursement in 4 days, 12 hrs
          </p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">DSWD Messages</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer bg-blue-50/30">
                  <p className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1"><Info className="w-3 h-3"/> System Alert</p>
                  <p className="text-sm font-medium text-slate-900 mb-1">Budget Released</p>
                  <p className="text-xs text-slate-500">Ang imong budget karong bulana na-release na sa imong account.</p>
                </div>
                <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs font-bold text-rose-500 mb-1 flex items-center gap-1"><Info className="w-3 h-3"/> Emergency Alert</p>
                  <p className="text-sm font-medium text-slate-900 mb-1">Calamity Relief</p>
                  <p className="text-xs text-slate-500">Tungod sa bag-ong bagyo, nagpadala mi ug extra 500 XLM para emergency fund.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!publicKey ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-700">
          Please connect your Freighter wallet to view your personalized dashboard.
        </div>
      ) : isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Actions Column */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-75">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 mb-6 border border-slate-200 shadow-sm">
                <QrCode className="w-8 h-8" />
              </div>
              <button 
                onClick={() => {
                  setShowPayModal(true);
                  setIsScanning(true);
                  setScanError('');
                  setSelectedMerchantId('');
                }}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
              >
                Scan to Pay
              </button>
              <p className="text-xs text-slate-400 mt-4 text-center">Scan QR at whitelisted merchants to spend 4P-Tokens.</p>
            </div>

            {/* Balance Dark Card */}
            <div className="lg:col-span-2 bg-[#121216] text-white rounded-2xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Vault className="w-48 h-48" />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
                <div>
                  <p className="text-xs md:text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Total Available Balance</p>
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tighter flex items-baseline gap-2">
                    {balance.toLocaleString()} <span className="text-xl md:text-2xl text-slate-500 font-medium">XLM</span>
                  </h2>
                </div>
                <div className="bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg backdrop-blur-sm border border-white/10 shrink-0">
                  <p className="text-[10px] md:text-xs font-bold text-slate-300">Monthly Limit: 2,000</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 relative z-10 border-t border-white/10 pt-6">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-400 mb-1 uppercase">Total Spent</p>
                  <p className="text-base md:text-lg font-bold">{totalSpent.toLocaleString()} <span className="text-xs md:text-sm text-slate-500">XLM</span></p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-slate-400 mb-1 uppercase">Next Release</p>
                  <p className="text-base md:text-lg font-bold">{nextRelease.toLocaleString()} <span className="text-xs md:text-sm text-slate-500">XLM</span></p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[10px] md:text-xs text-slate-400 mb-1 uppercase">DSWD ID</p>
                  <p className="text-base md:text-lg font-bold font-mono text-slate-300">{dswdId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Transactions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">Recent Transactions</h3>
                <Link href="/beneficiary/transactions" className="text-[10px] md:text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-100">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="px-4 md:px-6 py-4">Merchant</th>
                      <th className="px-4 md:px-6 py-4">Category</th>
                      <th className="px-4 md:px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs md:text-sm font-medium">
                    {transactions.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-6 text-slate-500">No transactions found.</td></tr>
                    ) : (
                      transactions.slice(0, 5).map(tx => (
                        <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedTx({ merchant: tx.merchant, amount: Math.abs(tx.amount), category: tx.category, hash: tx.txHash, items: ['Purchased Goods'] })}>
                          <td className="px-4 md:px-6 py-4 text-slate-900 flex items-center gap-2 md:gap-3">
                            <span className={`w-2 h-2 ${tx.type === 'receive' ? 'bg-emerald-500' : 'bg-orange-500'} rounded-full shrink-0`}></span> {tx.merchant}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-slate-500">{tx.category}</td>
                          <td className="px-4 md:px-6 py-4 text-right font-mono text-slate-900 whitespace-nowrap">
                            {tx.type === 'receive' ? '+' : '-'}{Math.abs(tx.amount)} XLM
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accredited Merchants Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">Accredited Merchants</h3>
                <button 
                  onClick={() => {
                    setMapMerchants(merchants);
                    setShowMapModal(true);
                  }}
                  className="text-[10px] md:text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-3 h-3" /> View Map
                </button>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-100">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="px-4 md:px-6 py-4">Store Name</th>
                      <th className="px-4 md:px-6 py-4">Status</th>
                      <th className="px-4 md:px-6 py-4 text-right">Category</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs md:text-sm font-medium">
                    {merchants.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-6 text-slate-500">No accredited merchants yet.</td></tr>
                    ) : (
                      merchants.slice(0, 5).map(m => (
                        <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-4 md:px-6 py-4 text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Store className="w-4 h-4 text-slate-400 shrink-0" /> {m.businessName}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-4">
                              <span className="text-[9px] md:text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold uppercase tracking-wide">Verified</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMapMerchants([m]);
                                  setShowMapModal(true);
                                }}
                                className="p-1 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors tooltip relative group"
                                title="View on Map"
                              >
                                <MapPin className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-right text-slate-500 whitespace-nowrap">{m.location}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Demo Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            {payStatus === 'idle' && (
              <>
                <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">
                  {isScanning ? 'Scan Merchant QR' : 'Payment Details'}
                </h3>
                <p className="text-slate-500 text-center mb-6 text-sm">
                  {isScanning ? 'Point your camera at the merchant\'s QR code.' : 'Review merchant and enter amount.'}
                </p>
                
                {isScanning ? (
                  <div className="mb-6">
                    <div className="relative rounded-2xl overflow-hidden border-4 border-slate-900 mb-4 bg-black aspect-square max-w-sm mx-auto shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
                      <Scanner
                        onScan={(detectedCodes) => {
                          const text = detectedCodes[0]?.rawValue;
                          if (!text) return;
                          const found = merchants.find(m => m.wallet === text);
                          if (found) {
                            setSelectedMerchantId(found.id);
                            setIsScanning(false);
                            setScanError('');
                          } else {
                            setScanError("QR Code is not a recognized merchant wallet.");
                          }
                        }}
                        onError={(error) => {
                          console.log(error?.message);
                        }}
                      />
                      
                      {/* Premium Scanning Effects */}
                      <div className="absolute inset-0 pointer-events-none border-[4px] border-blue-500/20 z-10"></div>
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.6)] animate-scan-laser"></div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-blue-500/50 rounded-xl pointer-events-none z-10 opacity-70"></div>
                    </div>
                    {scanError && <p className="text-rose-500 text-sm mt-2 text-center font-bold mb-4">{scanError}</p>}
                    
                    <button 
                      onClick={() => {
                        setIsScanning(false);
                        if (merchants.length > 0) setSelectedMerchantId(merchants[0].id);
                      }} 
                      className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                      Enter Details Manually
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Select Merchant</label>
                      <select 
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={selectedMerchantId}
                        onChange={(e) => setSelectedMerchantId(e.target.value)}
                      >
                        <option value="" disabled>Choose a merchant...</option>
                        {merchants.map(m => (
                          <option key={m.id} value={m.id}>{m.businessName}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Amount (XLM)</label>
                      <input 
                        type="number"
                        placeholder="e.g. 150"
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setShowPayModal(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Cancel</button>
                  {!isScanning && (
                    <button onClick={handleDemoPay} className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg">Pay via Smart Contract</button>
                  )}
                </div>
              </>
            )}

            {payStatus === 'scanning' && (
              <div className="py-12 flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-900">Verifying Merchant...</h3>
              </div>
            )}

            {payStatus === 'success' && (
              <div className="py-12 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600">Payment Successful!</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Merchants Map</h3>
              <button onClick={() => setShowMapModal(false)} className="w-8 h-8 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center">
                X
              </button>
            </div>
            <div className="p-4 flex-1">
              <MapComponent merchants={mapMerchants} />
            </div>
          </div>
        </div>
      )}

      {/* Itemized Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-t-12 border-slate-900">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Digital Receipt</p>
                <h3 className="text-2xl font-bold text-slate-900">{selectedTx.merchant}</h3>
                <p className="text-sm text-slate-500">12 June 2026, 09:41 AM</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Itemized Breakdown</p>
              <ul className="space-y-2 mb-4 border-b border-slate-200 pb-4">
                {selectedTx.items.map((item: string, i: number) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-lg font-mono text-slate-900">{selectedTx.amount} XLM</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-6">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase">Smart Contract Verified</p>
                <p className="text-[10px] opacity-80">Eligible 4Ps Goods Only</p>
              </div>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-mono break-all">
              TxHash: {selectedTx.hash}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
