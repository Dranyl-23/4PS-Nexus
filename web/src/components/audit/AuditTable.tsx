'use client';
import React, { useState } from 'react';
import { BadgeCheck, XCircle, AlertTriangle, Maximize, Minimize, Filter, ArrowDown, ArrowUp, Eye, X, Activity, Copy, Check, Search } from 'lucide-react';

export function AuditTable() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [audits] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAudits = audits.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      a.id.toLowerCase().includes(searchLower) ||
      a.hash.toLowerCase().includes(searchLower) ||
      a.sender.toLowerCase().includes(searchLower) ||
      a.receiver.toLowerCase().includes(searchLower);
    
    return matchesStatus && matchesSearch;
  });

  const sortedAudits = [...filteredAudits].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''}`}>
        <div className="px-6 py-6 border-b border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Transaction Ledger</h2>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search beneficiaries or hashes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 md:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-80"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`transition-colors p-1.5 rounded-md flex items-center justify-center cursor-pointer relative ${statusFilter !== 'all' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : 'text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700'}`}
                title="Filter by Status"
              >
                <Filter className="w-4 h-4" />
                {statusFilter !== 'all' && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center bg-white rounded-full shadow-sm">
                    {statusFilter === 'safe' && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />}
                    {statusFilter === 'flagged' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                    {statusFilter === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                )}
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {['all', 'safe', 'flagged', 'rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <span className="capitalize">{status === 'all' ? 'All Status' : status}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 p-1.5 rounded-md flex items-center justify-center cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-5 border-b border-slate-100">Transaction</th>
                <th className="px-6 py-5 border-b border-slate-100 group cursor-pointer select-none" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                  <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-700 transition-colors">
                    Date & Time
                    {sortOrder === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                  </div>
                </th>
                <th className="px-6 py-5 border-b border-slate-100">Sender & Receiver</th>
                <th className="px-6 py-5 border-b border-slate-100">Amount</th>
                <th className="px-6 py-5 border-b border-slate-100">Risk / Status</th>
                <th className="px-6 py-5 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {sortedAudits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No transaction records found.</td>
                </tr>
              ) : sortedAudits.map((audit) => (
                <tr key={audit.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{audit.id}</div>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          {audit.hash}
                          <button onClick={() => handleCopy(audit.hash)} className="text-slate-400 hover:text-slate-600 transition-colors" title="Copy Hash">
                            {copiedHash === audit.hash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-900 whitespace-nowrap">{formatDate(audit.date)}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-slate-700"><span className="text-slate-400 font-normal">From:</span> {audit.sender}</div>
                      <div className="text-xs font-medium text-slate-700"><span className="text-slate-400 font-normal">To:</span> {audit.receiver}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-semibold text-slate-900">{audit.amount}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        {audit.status === 'safe' && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                        {audit.status === 'flagged' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {audit.status === 'rejected' && <XCircle className="w-4 h-4 text-rose-500" />}
                        <span className={`capitalize font-medium ${audit.status === 'safe' ? 'text-emerald-700' : audit.status === 'flagged' ? 'text-amber-700' : 'text-rose-700'}`}>
                          {audit.status}
                        </span>
                      </div>
                      {audit.reason !== '-' && (
                        <span className="text-xs text-slate-500 truncate max-w-[150px]" title={audit.reason}>{audit.reason}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => setSelectedAudit(audit)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs transition-colors flex items-center justify-end w-full gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Trace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAudit && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedAudit(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Transaction Trace
              </h3>
              <button onClick={() => setSelectedAudit(null)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Transaction ID</span>
                  <span className="text-sm font-medium text-slate-900">{selectedAudit.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Blockchain Hash</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono text-slate-600">{selectedAudit.hash}</span>
                    <button onClick={() => handleCopy(selectedAudit.hash)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      {copiedHash === selectedAudit.hash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Timestamp</span>
                  <span className="text-sm font-medium text-slate-900">{formatDate(selectedAudit.date)}</span>
                </div>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm z-10">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Initiated By</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedAudit.sender}</span>
                      <span className="text-lg font-bold text-slate-900 mt-2">{selectedAudit.amount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${selectedAudit.status === 'safe' ? 'bg-emerald-100 text-emerald-600' : selectedAudit.status === 'flagged' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                    {selectedAudit.status === 'safe' && <BadgeCheck className="w-4 h-4" />}
                    {selectedAudit.status === 'flagged' && <AlertTriangle className="w-4 h-4" />}
                    {selectedAudit.status === 'rejected' && <XCircle className="w-4 h-4" />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm z-10">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Smart Contract Check</span>
                      <span className={`text-sm font-semibold capitalize ${selectedAudit.status === 'safe' ? 'text-emerald-700' : selectedAudit.status === 'flagged' ? 'text-amber-700' : 'text-rose-700'}`}>
                        {selectedAudit.status}
                      </span>
                      {selectedAudit.reason !== '-' && (
                        <span className="text-xs text-slate-500 mt-1">{selectedAudit.reason}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm opacity-70 z-10">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Target</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedAudit.receiver}</span>
                      <span className="text-xs font-medium text-slate-500 mt-2">
                        {selectedAudit.status === 'rejected' ? 'Funds not transferred' : 'Funds settled successfully'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedAudit(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Close Trace</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
