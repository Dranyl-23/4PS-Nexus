'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SmartAccountKit } from 'smart-account-kit';

// We will replace these with the actual deployed values later
const ACCOUNT_WASM_HASH = '497df09bbae0c6f6f50bf89f612bed40e6bdedbe4f7401f8748b43315d5b38cb';
const WEBAUTHN_VERIFIER = 'CB4PESX4OHLMO2OBNLJN27PAYHZQQTU4LWUKR544X2T4MR32M45XZQDM';

interface SmartAccountContextType {
  kit: SmartAccountKit | null;
  isReady: boolean;
  isConnected: boolean;
  contractId?: string;
  credentialId?: string;
}

const SmartAccountContext = createContext<SmartAccountContextType>({
  kit: null,
  isReady: false,
  isConnected: false,
});

export function SmartAccountProvider({ children }: { children: React.ReactNode }) {
  const [kit, setKit] = useState<SmartAccountKit | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [contractId, setContractId] = useState<string | undefined>();
  const [credentialId, setCredentialId] = useState<string | undefined>();

  useEffect(() => {
    // Initialize the SmartAccountKit
    const sak = new SmartAccountKit({
      rpcUrl: 'https://soroban-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015',
      accountWasmHash: ACCOUNT_WASM_HASH,
      webauthnVerifierAddress: WEBAUTHN_VERIFIER,
    });

    setKit(sak);

    // If there's an existing session, connect
    sak.connectWallet().then((result) => {
      if (result) {
        setIsConnected(true);
        setContractId(result.contractId);
        setCredentialId(result.credentialId);
      }
      setIsReady(true);
    }).catch(err => {
      console.error("SmartAccountKit connection error:", err);
      setIsReady(true);
    });

    // Listen to connection events
    sak.events.on('walletConnected', (data) => {
      setIsConnected(true);
      setContractId(data.contractId);
      setCredentialId(data.credentialId);
    });

    sak.events.on('walletDisconnected', () => {
      setIsConnected(false);
      setContractId(undefined);
      setCredentialId(undefined);
    });

  }, []);

  return (
    <SmartAccountContext.Provider value={{ kit, isReady, isConnected, contractId, credentialId }}>
      {children}
    </SmartAccountContext.Provider>
  );
}

export function useSmartAccount() {
  return useContext(SmartAccountContext);
}
