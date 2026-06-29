'use client';
import { User, Bell, Shield, Globe, Smartphone, Key } from 'lucide-react';
import { useState } from 'react';
import { useWalletContext } from '@/components/WalletProvider';

export default function SettingsPage() {
  const { publicKey } = useWalletContext();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [language, setLanguage] = useState('cebuano');

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
        
        {/* Navigation Sidebar for Settings (Mobile-hidden mostly, but good for structure) */}
        <div className="hidden md:flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl text-sm font-bold text-slate-900 shadow-sm border border-slate-200">
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Globe className="w-4 h-4" /> Language
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Profile Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-600" /> Personal Information
            </h2>
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Juan Dela Cruz</h3>
                <p className="text-sm text-slate-500">DSWD ID: 4PS-2026-981</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" value="Juan Dela Cruz" disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" value="+63 912 345 6789" disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-sm font-medium" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Connected Wallet (Stellar Public Key)</label>
                <input type="text" value={publicKey || "Not Connected"} disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-sm font-mono truncate" />
              </div>
            </div>
            <p className="text-xs text-rose-500 mt-4 font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" /> Info can only be updated via DSWD LGU offices.
            </p>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
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

          {/* Preferences */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-teal-500" /> Language Preferences
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setLanguage('english')}
                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'english' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('tagalog')}
                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'tagalog' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                Tagalog
              </button>
              <button 
                onClick={() => setLanguage('cebuano')}
                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-colors ${language === 'cebuano' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                Cebuano
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rose-100 mt-4">
            <h2 className="text-lg font-bold text-rose-600 flex items-center gap-2 mb-2">
              <Key className="w-5 h-5" /> Account Security
            </h2>
            <p className="text-sm text-slate-600 mb-6">If your phone is lost or stolen, you can freeze your wallet here.</p>
            <button className="w-full py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold text-sm hover:bg-rose-100 transition-colors">
              Report Lost Phone / Freeze Wallet
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
