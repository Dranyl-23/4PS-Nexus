'use client';
import { useState } from 'react';
import { Settings, Shield, Wallet, Store, Building, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('contract');

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-1">Configure your Soroban smart contracts, wallets, and accredited merchants.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('contract')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left ${activeTab === 'contract' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Shield className="w-5 h-5" /> Smart Contract
            </button>
            <button 
              onClick={() => setActiveTab('merchants')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left ${activeTab === 'merchants' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Store className="w-5 h-5" /> Accredited Merchants
            </button>
            <button 
              onClick={() => setActiveTab('agency')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left ${activeTab === 'agency' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Building className="w-5 h-5" /> Agency Profile
            </button>
            <button 
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left ${activeTab === 'wallet' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Wallet className="w-5 h-5" /> Wallet Limits
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'contract' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">Soroban Protocol Settings</h2>
                <p className="text-sm text-slate-500 mt-1">Manage the deployed 4P-Token contract on the Stellar Testnet.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Token Contract Address</label>
                  <input 
                    type="text" 
                    defaultValue="CAVWEVUDRWMKRL5UIZTTFN5NXEUM7MKXIQ3JFKL62EUALXTLZS4QVQXK" 
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-default"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-500">The unique identifier of the 4P-Token restricted asset contract.</p>
                    <a href="https://stellar.expert/explorer/testnet/contract/CAVWEVUDRWMKRL5UIZTTFN5NXEUM7MKXIQ3JFKL62EUALXTLZS4QVQXK" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                      View on Stellar Expert ↗
                    </a>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Government Authority Public Key</label>
                  <input 
                    type="text" 
                    defaultValue="GBQX4Y6... [Your Connected Wallet]" 
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-2">Only this address has the authority to mint tokens and accredit merchants.</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800">Enforce Merchant Whitelist</h4>
                    <p className="text-xs text-amber-700 mt-0.5">If enabled, beneficiaries can only send funds to accredited addresses.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Configuration
                </button>
              </div>
            </div>
          )}

          {activeTab === 'merchants' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Accredited Merchants Whitelist</h2>
                  <p className="text-sm text-slate-500 mt-1">Wallets allowed to receive restricted 4P-Tokens.</p>
                </div>
                <button onClick={() => window.location.href='/merchants'} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                  + Add Merchant
                </button>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Merchant Name</th>
                      <th className="px-6 py-4">Wallet Address</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">Mercury Drug - Main Branch</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">GBD...7X2P</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">Active</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">Puregold Metropolis</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">GA2...9M4Q</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'agency' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">Agency Profile</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your government agency details and contact information.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Agency Name</label>
                    <input 
                      type="text" 
                      defaultValue="DSWD Central Office" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department ID</label>
                    <input 
                      type="text" 
                      defaultValue="GOV-PH-001" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                    <input 
                      type="email" 
                      defaultValue="admin@dswd.gov.ph" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">Wallet & Disbursement Limits</h2>
                <p className="text-sm text-slate-500 mt-1">Configure global limits and security thresholds for transactions.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Disbursement per Beneficiary (Monthly)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input 
                      type="number" 
                      defaultValue="500" 
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Hard cap on how much a single beneficiary can receive in 30 days.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Global Monthly Budget Cap</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input 
                      type="number" 
                      defaultValue="10000000" 
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-xl mt-6">
                  <div>
                    <h4 className="text-sm font-semibold text-rose-800">Emergency Stop</h4>
                    <p className="text-xs text-rose-700 mt-0.5">Pause all outgoing disbursements system-wide.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-rose-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-rose-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Update Limits
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
