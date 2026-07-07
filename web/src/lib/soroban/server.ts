import { Keypair } from '@stellar/stellar-sdk';
import { Client, Category, networks } from 'govpay-vault';

const getAdminKeypair = () => {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    throw new Error("ADMIN_SECRET_KEY is not defined in environment variables");
  }
  return Keypair.fromSecret(secret);
};

export const executeBatchAllocate = async (beneficiaryPubKeys: string[], amountStr: string, categoryStr?: string) => {
    const adminKeypair = getAdminKeypair();
    
    let category = Category.Food;
    const catUpper = (categoryStr || '').toUpperCase();
    if (catUpper.includes('EDUCATION')) category = Category.Education;
    if (catUpper.includes('HEALTH') || catUpper.includes('MEDICAL')) category = Category.Health;

    // Set expiry to 30 days from now (ledger timestamp is in seconds)
    const expiresAt = BigInt(Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60));

    const client = new Client({
        ...networks.testnet,
        rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org',
    });

    console.log(`[Soroban] Simulating allocate_batch for ${beneficiaryPubKeys.length} wallets...`);
    const tx = await client.allocate_batch({
        beneficiaries: beneficiaryPubKeys,
        category,
        amount: BigInt(amountStr),
        expires_at: expiresAt
    });

    console.log(`[Soroban] Submitting allocate_batch...`);
    await tx.signAndSend({ signTransaction: async (xdr) => {
        const transaction = require('@stellar/stellar-sdk').TransactionBuilder.fromXDR(xdr, networks.testnet.networkPassphrase);
        transaction.sign(adminKeypair);
        return { signedTxXdr: transaction.toXDR() };
    }});

    const hash = tx.built?.hash().toString('hex') || `soroban-batch-${Date.now()}`;
    return { hash };
};
