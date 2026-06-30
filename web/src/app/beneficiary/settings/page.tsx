'use client';
import { User, Bell, Shield, Globe, Smartphone, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWalletContext } from '@/components/WalletProvider';

type Tab = 'personal' | 'notifications' | 'security' | 'language';

export default function SettingsPage() {
  const { publicKey } = useWalletContext();
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  
  // Real Profile State
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    async function fetchProfile() {
      if (!publicKey) return;
      try {
        const res = await fetch(`/api/beneficiary/profile?wallet=${publicKey}`);
        if (res.ok) {
          setProfile(await res.json());
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    }
    fetchProfile();
  }, [publicKey]);
  
  // States
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [language, setLanguage] = useState('cebuano');
  
  // Freeze Wallet States
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [freezeStep, setFreezeStep] = useState<'confirm' | 'processing' | 'frozen'>('confirm');

  const handleFreezeWallet = async () => {
    if (!profile?.profile?.id) return;
    setFreezeStep('processing');
    
    try {
      const res = await fetch(`/api/beneficiaries/${profile.profile.id}/freeze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'freeze' })
      });
      
      if (res.ok) {
        setFreezeStep('frozen');
        // Update local state
        setProfile((prev: any) => ({
          ...prev,
          profile: { ...prev.profile, accountStatus: 'frozen' }
        }));
      } else {
        alert('Failed to freeze wallet');
        setShowFreezeModal(false);
        setFreezeStep('confirm');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
      setShowFreezeModal(false);
      setFreezeStep('confirm');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          Settings <span className="text-slate-400 font-normal text-base md:text-lg">/ Preferences</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account details, notifications, and security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-2 md:pb-0 hide-scrollbar">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'personal' ? 'bg-white font-bold text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'notifications' ? 'bg-white font-bold text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'security' ? 'bg-white font-bold text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('language')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'language' ? 'bg-white font-bold text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Globe className="w-4 h-4" /> Language
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-600" /> Personal Information
              </h2>
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{profile?.profile?.fullName || 'Beneficiary Account'}</h3>
                  <p className="text-sm text-slate-500">DSWD ID: {profile?.dswdId || 'Loading...'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">DSWD ID / Household ID</label>
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 text-sm font-bold">
                    {profile?.dswdId || 'Loading...'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Status</label>
                  <div className={`w-full px-4 py-3 border rounded-xl text-sm font-bold flex items-center gap-2 ${profile?.profile?.accountStatus === 'frozen' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                    {profile?.profile?.accountStatus === 'frozen' ? (
                      <><AlertTriangle className="w-4 h-4" /> FROZEN</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> ACTIVE</>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Connected Wallet (Stellar Public Key)</label>
                  <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                    <p className="text-sm font-mono text-slate-600 break-all">
                      {profile?.profile?.walletAddress || publicKey || "Not Connected"}
                    </p>
                    <button 
                      onClick={() => {
                        const wallet = profile?.profile?.walletAddress || publicKey;
                        if (wallet) {
                          navigator.clipboard.writeText(wallet);
                          alert("Wallet address copied!");
                        }
                      }}
                      className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-rose-500 mt-4 font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" /> Info can only be updated via DSWD LGU offices.
              </p>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-orange-500" /> Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">SMS Alerts</p>
                      <p className="text-xs text-slate-500">Receive texts for payouts & emergency funds</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Email Alerts</p>
                      <p className="text-xs text-slate-500">Get monthly digital statements</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-indigo-500" /> Account Security
              </h2>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                <p className="font-bold text-slate-900 text-sm mb-1">Passkey Authentication</p>
                <p className="text-xs text-slate-500 mb-4">Your account is secured using WebAuthn Passkeys. No passwords required.</p>
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Enabled on this device
                </div>
              </div>

              <div className="p-6 bg-rose-50 rounded-xl border border-rose-100">
                <h3 className="font-bold text-rose-600 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" /> Emergency Freeze
                </h3>
                <p className="text-sm text-rose-700/80 mb-4">
                  If your phone is lost or stolen, you can instantly freeze your Soroban Smart Wallet. This blocks all outgoing transactions until you verify your identity at a DSWD office.
                </p>
                <button 
                  onClick={() => setShowFreezeModal(true)}
                  className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-md"
                >
                  Freeze Wallet Now
                </button>
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-teal-500" /> Language Preferences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button 
                  onClick={() => setLanguage('english')}
                  className={`py-4 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'english' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('tagalog')}
                  className={`py-4 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'tagalog' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  Tagalog
                </button>
                <button 
                  onClick={() => setLanguage('cebuano')}
                  className={`py-4 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'cebuano' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  Cebuano
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-6 text-center">Changes will be applied across the entire application.</p>
            </div>
          )}
          
        </div>
      </div>

      {/* Freeze Wallet Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 md:p-8 shadow-2xl text-center">
            
            {freezeStep === 'confirm' && (
              <>
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Freeze Wallet?</h3>
                <p className="text-slate-500 mb-8 text-sm">
                  This action will invoke a Soroban Smart Contract function to lock your funds. You will need to visit a DSWD office with your ID to unlock it.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowFreezeModal(false)} 
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleFreezeWallet} 
                    className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-md"
                  >
                    Yes, Freeze It
                  </button>
                </div>
              </>
            )}

            {freezeStep === 'processing' && (
              <div className="py-8">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-rose-600 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-lg font-bold text-slate-900">Calling Smart Contract...</h3>
                <p className="text-sm text-slate-500 mt-2">Locking your 4P-Tokens on the Stellar blockchain.</p>
              </div>
            )}

            {freezeStep === 'frozen' && (
              <div className="py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Wallet Frozen!</h3>
                <p className="text-slate-500 mb-8 text-sm">
                  Your funds are now safe. Please visit the nearest DSWD LGU office with a valid ID to request an account recovery.
                </p>
                <button 
                  onClick={() => {
                    setShowFreezeModal(false);
                    setFreezeStep('confirm'); // reset for demo purposes
                  }} 
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-md"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
