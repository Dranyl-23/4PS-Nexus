'use client';
import { useState, useCallback, useEffect } from 'react';

const TIMEOUT_MS = 3000;

function withTimeout<T>(p: Promise<T>, fallback: T, ms = TIMEOUT_MS): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export interface MerchantWalletState {
  publicKey: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

export function useMerchantWallet(): MerchantWalletState {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('4ps_merchant_pubkey');
    if (savedKey) {
      setPublicKey(savedKey);
    }
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const freighter = await import('@stellar/freighter-api');

      const connectedRes = await withTimeout(freighter.isConnected(), false as any);
      const isConn = typeof connectedRes === 'object' ? (connectedRes as any).isConnected : connectedRes;
      
      if (!isConn) {
        throw new Error('Freighter not detected. Install it from freighter.app and reload.');
      }

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

      // No admin check for merchants!
      
      // Set cookie for middleware (merchant auth)
      document.cookie = `4ps_merchant_auth=true; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
      
      setPublicKey(addressStr);
      localStorage.setItem('4ps_merchant_pubkey', addressStr);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to connect wallet';
      console.error("Merchant Wallet Connection Error:", e);
      setError(errorMessage);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setError(null);
    localStorage.removeItem('4ps_merchant_pubkey');
    document.cookie = '4ps_merchant_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    window.location.href = '/merchant-login';
  }, []);

  return { publicKey, connecting, error, connect, disconnect };
}
