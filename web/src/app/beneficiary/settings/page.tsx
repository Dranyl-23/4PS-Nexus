'use client';
import { User, Bell, Shield, Globe, Smartphone, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWalletContext } from '@/components/WalletProvider';
import { useLanguage } from '@/lib/language';

type Tab = 'personal' | 'notifications' | 'security' | 'language';

export default function SettingsPage() {
  const { publicKey } = useWalletContext();
  const { lang, setLang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  
  // Real Profile State
  const [profile, setProfile] = useState<{ profile?: { id?: string; fullName?: string; walletAddress?: string; accountStatus?: string; phoneNumber?: string; email?: string; smsAlerts?: boolean; emailAlerts?: boolean; networkAlerts?: boolean; complianceReminders?: boolean; language?: string }; dswdId?: string } | null>(null);
  
  useEffect(() => {
    async function fetchProfile() {
      if (!publicKey) return;
      try {
        const res = await fetch(`/api/beneficiary/profile?wallet=${publicKey}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          if (data.profile) {
            if (data.profile.smsAlerts !== undefined) setSmsAlerts(data.profile.smsAlerts);
            if (data.profile.emailAlerts !== undefined) setEmailAlerts(data.profile.emailAlerts);
            if (data.profile.networkAlerts !== undefined) setNetworkAlerts(data.profile.networkAlerts);
            if (data.profile.complianceReminders !== undefined) setComplianceReminders(data.profile.complianceReminders);
            if (data.profile.language) {
              const dbLang = data.profile.language as 'english' | 'tagalog' | 'cebuano';
              setLanguage(dbLang);
              setLang(dbLang);
            }
          }
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
  const [networkAlerts, setNetworkAlerts] = useState(true);
  const [complianceReminders, setComplianceReminders] = useState(true);
  const [language, setLanguage] = useState(lang);
  
  const updatePreference = async (key: string, value: unknown) => {
    if (!publicKey) return;
    try {
      await fetch('/api/beneficiary/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey,
          settings: { [key]: value }
        })
      });
    } catch (error) {
      console.error(`Failed to update ${key}`, error);
    }
  };
  
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
        setProfile((prev) => prev ? ({
          ...prev,
          profile: { ...prev.profile, accountStatus: 'frozen' }
        }) : prev);
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
    <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8 pb-24 md:pb-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          {t.settingsTitle} <span className="text-slate-400 font-normal text-base md:text-lg">/ {t.settingsSubtitle}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">{t.settingsDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        {/* Navigation Sidebar */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex md:flex-col gap-1 p-1 md:gap-2 md:p-0 bg-slate-100 md:bg-transparent rounded-xl md:rounded-none w-max md:w-auto">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-2 px-4 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'personal' ? 'bg-white font-bold text-slate-900 shadow-sm md:border md:border-slate-200' : 'text-slate-500 hover:text-slate-900 md:hover:bg-slate-100'}`}
            >
              <User className="w-4 h-4" /> {t.personalInfo}
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'notifications' ? 'bg-white font-bold text-slate-900 shadow-sm md:border md:border-slate-200' : 'text-slate-500 hover:text-slate-900 md:hover:bg-slate-100'}`}
            >
              <Bell className="w-4 h-4" /> {t.notifications}
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-white font-bold text-slate-900 shadow-sm md:border md:border-slate-200' : 'text-slate-500 hover:text-slate-900 md:hover:bg-slate-100'}`}
            >
              <Shield className="w-4 h-4" /> {t.security}
            </button>
            <button 
              onClick={() => setActiveTab('language')}
              className={`flex items-center gap-2 px-4 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'language' ? 'bg-white font-bold text-slate-900 shadow-sm md:border md:border-slate-200' : 'text-slate-500 hover:text-slate-900 md:hover:bg-slate-100'}`}
            >
              <Globe className="w-4 h-4" /> {t.language}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2 mb-5 md:mb-6">
                <User className="w-5 h-5 text-blue-600" /> {t.personalInformation}
              </h2>
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-100">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 text-base md:text-lg truncate">{profile?.profile?.fullName || 'Beneficiary Account'}</h3>
                  <p className="text-xs md:text-sm text-slate-500 truncate">DSWD ID: {profile?.dswdId || 'Loading...'}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-0 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                
                {/* DSWD ID */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border-b border-slate-100 gap-1 sm:gap-4">
                  <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">{t.dswdId}</label>
                  {profile ? (
                    <span className="text-sm font-bold text-slate-700 truncate">{profile.dswdId}</span>
                  ) : (
                    <div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div>
                  )}
                </div>

                {/* Account Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border-b border-slate-100 gap-1 sm:gap-4">
                  <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">{t.accountStatus}</label>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit ${profile?.profile?.accountStatus === 'frozen' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {profile?.profile?.accountStatus === 'frozen' ? (
                      <><AlertTriangle className="w-3.5 h-3.5" /> FROZEN</>
                    ) : (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE</>
                    )}
                  </div>
                </div>

                {/* Connected Wallet */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white gap-2 sm:gap-4 overflow-hidden">
                  <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">{t.connectedWallet}</label>
                  <div className="flex items-center gap-2 overflow-hidden w-full sm:justify-end">
                    <p className="text-xs md:text-sm font-mono text-slate-600 truncate flex-1 sm:flex-none text-left sm:text-right">
                      {profile?.profile?.walletAddress || publicKey || "Not Connected"}
                    </p>
                    <button 
                      onClick={() => {
                        const wallet = profile?.profile?.walletAddress || publicKey;
                        if (wallet) navigator.clipboard.writeText(wallet);
                      }}
                      className="shrink-0 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-500 transition-colors"
                      title="Copy"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                </div>

              </div>
              <p className="text-[10px] md:text-xs text-rose-500 mt-4 font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" /> {t.infoNote}
              </p>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between gap-3 mb-5 md:mb-6">
                <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2 leading-tight">
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-orange-500 shrink-0" /> 
                  <span className="truncate">{t.notificationPreferences}</span>
                </h2>
                <span className="px-2 py-1 md:px-3 md:py-1 bg-emerald-50 text-emerald-600 text-[8px] md:text-[10px] font-black tracking-wider uppercase rounded-md md:rounded-full shrink-0 whitespace-nowrap">
                  {t.allSystemsActive}
                </span>
              </div>
              
              <div className="flex flex-col gap-0 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                
                {/* SMS Alerts */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 gap-2 md:gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm md:text-base truncate">{t.smsAlerts}</p>
                      <p className="text-[11px] md:text-xs text-slate-500 truncate">{t.smsAlertsDesc}</p>
                      <p className="text-[9px] md:text-[10px] font-mono text-slate-400 mt-0.5 truncate">Target: {profile?.profile?.phoneNumber || '+63 9** *** **42'}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" checked={smsAlerts} onChange={(e) => { setSmsAlerts(e.target.checked); updatePreference('smsAlerts', e.target.checked); }} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Email Alerts */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 gap-2 md:gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm md:text-base truncate">{t.emailAlerts}</p>
                      <p className="text-[11px] md:text-xs text-slate-500 truncate">{t.emailAlertsDesc}</p>
                      <p className="text-[9px] md:text-[10px] font-mono text-slate-400 mt-0.5 truncate">Target: {profile?.profile?.email || 'j****.d***@gmail.com'}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" checked={emailAlerts} onChange={(e) => { setEmailAlerts(e.target.checked); updatePreference('emailAlerts', e.target.checked); }} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Network Alerts */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 gap-2 md:gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm md:text-base truncate">{t.networkAlerts}</p>
                      <p className="text-[11px] md:text-xs text-slate-500 truncate">{t.networkAlertsDesc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" checked={networkAlerts} onChange={(e) => { setNetworkAlerts(e.target.checked); updatePreference('networkAlerts', e.target.checked); }} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Compliance Reminders */}
                <div className="flex items-center justify-between p-4 bg-white gap-2 md:gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm md:text-base truncate">{t.complianceReminders}</p>
                      <p className="text-[11px] md:text-xs text-slate-500 truncate">{t.complianceRemindersDesc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" checked={complianceReminders} onChange={(e) => { setComplianceReminders(e.target.checked); updatePreference('complianceReminders', e.target.checked); }} className="sr-only peer" />
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
                <Shield className="w-5 h-5 text-indigo-500" /> {t.accountSecurity}
              </h2>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                <p className="font-bold text-slate-900 text-sm mb-1">{t.passkeyAuth}</p>
                <p className="text-xs text-slate-500 mb-4">{t.passkeyDesc}</p>
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> {t.enabledOnDevice}
                </div>
              </div>

              <div className="p-6 bg-rose-50 rounded-xl border border-rose-100">
                <h3 className="font-bold text-rose-600 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" /> {t.emergencyFreeze}
                </h3>
                <p className="text-sm text-rose-700/80 mb-4">{t.emergencyFreezeDesc}</p>
                <button 
                  onClick={() => setShowFreezeModal(true)}
                  className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-md"
                >
                  {t.freezeWalletNow}
                </button>
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-teal-500" /> {t.languagePreferences}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button 
                  onClick={() => { setLanguage('english'); setLang('english'); updatePreference('language', 'english'); }}
                  className={`py-4 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'english' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => { setLanguage('tagalog'); setLang('tagalog'); updatePreference('language', 'tagalog'); }}
                  className={`py-4 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'tagalog' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  Tagalog
                </button>
                <button 
                  onClick={() => { setLanguage('cebuano'); setLang('cebuano'); updatePreference('language', 'cebuano'); }}
                  className={`py-4 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'cebuano' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  Cebuano
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-6 text-center">{t.languageNote}</p>
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
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.freezeConfirmTitle}</h3>
                <p className="text-slate-500 mb-8 text-sm">{t.freezeConfirmDesc}</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowFreezeModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                    {t.cancel}
                  </button>
                  <button onClick={handleFreezeWallet} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors shadow-md">
                    {t.yesFreezeIt}
                  </button>
                </div>
              </>
            )}

            {freezeStep === 'processing' && (
              <div className="py-8">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-rose-600 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-lg font-bold text-slate-900">{t.callingContract}</h3>
                <p className="text-sm text-slate-500 mt-2">{t.lockingFunds}</p>
              </div>
            )}

            {freezeStep === 'frozen' && (
              <div className="py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.walletFrozen}</h3>
                <p className="text-slate-500 mb-8 text-sm">{t.frozenDesc}</p>
                <button 
                  onClick={() => { setShowFreezeModal(false); setFreezeStep('confirm'); }} 
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-md"
                >
                  {t.close}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
