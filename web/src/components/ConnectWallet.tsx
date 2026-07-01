'use client';
import { useState } from 'react';
import type { WalletState } from '@/hooks/useWallet';

interface ConnectWalletProps extends WalletState {
  role?: 'admin' | 'beneficiary';
}

export default function ConnectWallet({
  publicKey,
  connecting,
  error,
  connect,
  disconnect,
  role = 'beneficiary',
}: ConnectWalletProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (publicKey) {
    return (
      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          onClick={copy}
          title="Copy full address"
          className="rounded bg-slate-200/50 px-2 md:px-3 py-1 font-mono text-[10px] md:text-sm text-slate-700 transition-colors hover:bg-slate-200"
        >
          {copied ? 'Copied!' : `${publicKey.slice(0, 5)}…${publicKey.slice(-4)}`}
        </button>
        <button
          onClick={disconnect}
          className="text-[10px] md:text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 px-2 py-1 rounded md:bg-transparent md:px-0"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="text-right">
      <button
        onClick={() => connect(role)}
        disabled={connecting}
        className="rounded-lg bg-indigo-600 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {connecting ? 'Connecting…' : 'Connect Freighter'}
      </button>
      {error && <p className="mt-2 max-w-xs text-sm text-red-500">{error}</p>}
    </div>
  );
}
