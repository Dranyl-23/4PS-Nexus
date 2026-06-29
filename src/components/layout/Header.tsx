import React from 'react';

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          Stellar Testnet
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <button className="rounded bg-indigo-600 px-4 py-2 text-white font-medium transition-colors hover:bg-indigo-700 disabled:opacity-50">
            Connect Freighter
          </button>
        </div>
      </div>
    </header>
  );
}
