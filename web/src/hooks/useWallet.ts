'use client';
import { useState, useCallback, useEffect } from 'react';

const TIMEOUT_MS = 3000;

// Freighter API calls can hang if the extension is missing — race them with a timeout.
function withTimeout<T>(p: Promise<T>, fallback: T, ms = TIMEOUT_MS): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export interface WalletState {
  publicKey: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

export function useWallet(): WalletState {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('4ps_wallet_pubkey');
    if (savedKey) {
      setPublicKey(savedKey);
    }
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      // Dynamic import only — a static import breaks SSR (browser globals).
      const freighter = await import('@stellar/freighter-api');

      const connectedRes = await withTimeout(freighter.isConnected(), false as any);
      const isConn = typeof connectedRes === 'object' ? (connectedRes as any).isConnected : connectedRes;
      
      if (!isConn) {
        throw new Error(
          'Freighter not detected. Install it from freighter.app and reload.',
        );
      }

      // requestAccess() prompts the user and returns their address.
      const access = await freighter.requestAccess();
      let addressStr = '';
      
      if (typeof access === 'string') {
        addressStr = access;
      } else if (access && typeof access === 'object') {
        if ((access as any).error) throw new Error((access as any).error);
        if ((access as any).address) addressStr = (access as any).address;
      }

      if (!addressStr) {
        throw new Error('No address returned — did you approve the request?');
      }

      // Check admin auth
      const adminWalletsStr = process.env.NEXT_PUBLIC_ADMIN_WALLETS || 'GDI4QZJXCRCPO6KONAXXYFSN3NEY73OVPSDDD7C2OPW5QYX2IDQB5GNJ';
      const adminWallets = adminWalletsStr.split(',').map(w => w.trim());
      
      if (!adminWallets.includes(addressStr)) {
        throw new Error("Unauthorized: Wallet is not whitelisted as Admin.");
      }

      // Set cookie for middleware
      document.cookie = `4ps_admin_auth=true; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
      
      setPublicKey(addressStr);
      localStorage.setItem('4ps_wallet_pubkey', addressStr);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to connect wallet';
      console.error("Wallet Connection Error:", e);
      alert("Error Connecting: " + errorMessage); // Force popup so we know what's wrong
      setError(errorMessage);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setError(null);
    localStorage.removeItem('4ps_wallet_pubkey');
    document.cookie = '4ps_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }, []);

  return { publicKey, connecting, error, connect, disconnect };
}
