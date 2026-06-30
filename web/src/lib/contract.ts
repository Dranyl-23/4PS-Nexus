import {
  Contract,
  TransactionBuilder,
  BASE_FEE,
  Account,
  rpc,
  nativeToScVal,
  scValToNative,
  Keypair
} from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE, CONTRACT_ID } from './stellar';

// A real, funded testnet account used ONLY as the source for read-only
// simulations. Nothing is signed or submitted for reads, so any existing
// account works — we reuse the Circle USDC issuer.
const READ_SOURCE = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

export function contractConfigured(): boolean {
  return Boolean(CONTRACT_ID);
}

/** Read get_allocation(beneficiary) via simulation — no wallet or signature required. */
export async function readAllocation(beneficiary: string): Promise<number> {
  if (!CONTRACT_ID) return 0;
  
  const contract = new Contract(CONTRACT_ID);
  const source = new Account(READ_SOURCE, '0');

  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('get_allocation', nativeToScVal(beneficiary, { type: 'address' })))
    .setTimeout(30)
    .build();

  try {
    const sim = await server.simulateTransaction(tx);
    if (!rpc.Api.isSimulationSuccess(sim) || !sim.result) {
      return 0;
    }
    const amountStr = scValToNative(sim.result.retval);
    return Number(amountStr);
  } catch (e) {
    console.error('Failed to read allocation:', e);
    return 0;
  }
}

/**
 * Builds, signs (with provided admin secret), and submits the `allocate` transaction.
 * This is meant to be called by the server API route (/api/claims) when an admin approves a claim.
 */
export async function submitAdminAllocateTx(
  beneficiary: string,
  amount: number,
  adminSecret: string
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecret);
  const contract = new Contract(CONTRACT_ID);
  const account = await server.getAccount(adminKeypair.publicKey());

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'allocate',
        nativeToScVal(beneficiary, { type: 'address' }),
        nativeToScVal(BigInt(Math.trunc(amount)), { type: 'i128' }),
      ),
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    console.error(sim);
    throw new Error('Simulation failed — the allocate call would not succeed.');
  }

  const assembled = rpc.assembleTransaction(tx, sim).build();
  assembled.sign(adminKeypair);
  
  const response = await server.sendTransaction(assembled);
  if (response.status === 'ERROR') {
    throw new Error(`Transaction failed: ${response.errorResult}`);
  }
  return response.hash;
}

/**
 * Build + simulate + assemble an unsigned `spend(beneficiary, merchant, amount)` invocation,
 * returning the prepared XDR ready for Freighter to sign on the client side.
 */
export async function buildSpendXDR(
  beneficiary: string,
  merchant: string,
  amount: number,
): Promise<string> {
  const contract = new Contract(CONTRACT_ID);
  const account = await server.getAccount(beneficiary);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'spend',
        nativeToScVal(beneficiary, { type: 'address' }),
        nativeToScVal(merchant, { type: 'address' }),
        nativeToScVal(BigInt(Math.trunc(amount)), { type: 'i128' }),
      ),
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error('Simulation failed — the spend call would not succeed (check balance/whitelist).');
  }

  return rpc.assembleTransaction(tx, sim).build().toXDR();
}

/**
 * Builds, signs, and submits a `freeze` transaction to lock a beneficiary's account.
 */
export async function submitAdminFreezeTx(
  beneficiary: string,
  adminSecret: string
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecret);
  const contract = new Contract(CONTRACT_ID);
  const account = await server.getAccount(adminKeypair.publicKey());

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call('freeze', nativeToScVal(beneficiary, { type: 'address' })),
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error('Simulation failed for freeze.');
  }

  const assembled = rpc.assembleTransaction(tx, sim).build();
  assembled.sign(adminKeypair);
  
  const response = await server.sendTransaction(assembled);
  if (response.status === 'ERROR') {
    throw new Error(`Freeze failed: ${response.errorResult}`);
  }
  return response.hash;
}

/**
 * Builds, signs, and submits an `unfreeze` transaction to unlock a beneficiary's account.
 */
export async function submitAdminUnfreezeTx(
  beneficiary: string,
  adminSecret: string
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecret);
  const contract = new Contract(CONTRACT_ID);
  const account = await server.getAccount(adminKeypair.publicKey());

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call('unfreeze', nativeToScVal(beneficiary, { type: 'address' })),
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error('Simulation failed for unfreeze.');
  }

  const assembled = rpc.assembleTransaction(tx, sim).build();
  assembled.sign(adminKeypair);
  
  const response = await server.sendTransaction(assembled);
  if (response.status === 'ERROR') {
    throw new Error(`Unfreeze failed: ${response.errorResult}`);
  }
  return response.hash;
}

/**
 * Builds, signs, and submits an `add_merchant` transaction to whitelist a merchant.
 */
export async function submitAdminAddMerchantTx(
  merchant: string,
  adminSecret: string
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecret);
  const contract = new Contract(CONTRACT_ID);
  const account = await server.getAccount(adminKeypair.publicKey());

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call('add_merchant', nativeToScVal(merchant, { type: 'address' })),
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error('Simulation failed for add_merchant.');
  }

  const assembled = rpc.assembleTransaction(tx, sim).build();
  assembled.sign(adminKeypair);
  
  const response = await server.sendTransaction(assembled);
  if (response.status === 'ERROR') {
    throw new Error(`Add merchant failed: ${response.errorResult}`);
  }
  return response.hash;
}

