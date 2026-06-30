'use client';
import React, { createContext, useContext } from 'react';
import { useMerchantWallet, MerchantWalletState } from '@/hooks/useMerchantWallet';

const MerchantWalletContext = createContext<MerchantWalletState | undefined>(undefined);

export function MerchantWalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useMerchantWallet();
  return (
    <MerchantWalletContext.Provider value={wallet}>
      {children}
    </MerchantWalletContext.Provider>
  );
}

export function useMerchantWalletContext() {
  const context = useContext(MerchantWalletContext);
  if (context === undefined) {
    throw new Error('useMerchantWalletContext must be used within a MerchantWalletProvider');
  }
  return context;
}
