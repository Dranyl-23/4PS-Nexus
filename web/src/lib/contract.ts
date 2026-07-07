import { Keypair } from '@stellar/stellar-sdk';
import { Client, networks } from 'govpay-vault';
import { CONTRACT_ID } from './stellar';

export function contractConfigured(): boolean {
  return Boolean(CONTRACT_ID);
}

const getClient = () => {
  return new Client({
    ...networks.testnet,
    rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org',
  });
};

export async function submitAdminFreezeTx(
  beneficiary: string,
  adminSecret: string
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecret);
  const client = getClient();

  const tx = await client.freeze({ beneficiary });
  await tx.signAndSend({ signTransaction: async (xdr) => {
    const transaction = require('@stellar/stellar-sdk').TransactionBuilder.fromXDR(xdr, networks.testnet.networkPassphrase);
    transaction.sign(adminKeypair);
    return { signedTxXdr: transaction.toXDR() };
  }});

  return tx.built?.hash().toString('hex') || 'freeze-hash';
}

export async function submitAdminUnfreezeTx(
  beneficiary: string,
  adminSecret: string
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecret);
  const client = getClient();

  const tx = await client.unfreeze({ beneficiary });
  await tx.signAndSend({ signTransaction: async (xdr) => {
    const transaction = require('@stellar/stellar-sdk').TransactionBuilder.fromXDR(xdr, networks.testnet.networkPassphrase);
    transaction.sign(adminKeypair);
    return { signedTxXdr: transaction.toXDR() };
  }});

  return tx.built?.hash().toString('hex') || 'unfreeze-hash';
}

export async function submitAdminAddMerchantTx(
  merchant: string,
  adminSecret: string
): Promise<string> {
  // This is handled in merchants/route.ts now, but kept for compatibility
  return 'use-route-ts';
}

export async function submitAdminAllocateTx(): Promise<string> {
  return 'deprecated';
}

export async function buildSpendXDR(): Promise<string> {
  // This will be handled on the mobile side
  return 'deprecated';
}

export async function readAllocation(): Promise<number> {
  // Can be implemented if needed
  return 0;
}

