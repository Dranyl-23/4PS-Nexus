import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

const ISSUER_PUBLIC_KEY = 'GCL5RVXDZO5UJFV3EP7S2LFFZ75A3LLQGPUCOQJPZZ6E6HBFYZE334W4';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { beneficiary, secretKey } = body;

    if (!beneficiary || !secretKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[Stellar API] Adding trustlines for ${beneficiary}`);

    const sourceAccount = await server.loadAccount(beneficiary);
    const fee = await server.fetchBaseFee();
    
    const foodAsset = new StellarSdk.Asset('FOOD', ISSUER_PUBLIC_KEY);
    const educAsset = new StellarSdk.Asset('EDUC', ISSUER_PUBLIC_KEY);

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: (parseInt(fee) * 2).toString(), // 2 operations
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: foodAsset,
      limit: '1000000',
    }))
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: educAsset,
      limit: '1000000',
    }))
    .setTimeout(30)
    .build();

    const keypair = StellarSdk.Keypair.fromSecret(secretKey);
    transaction.sign(keypair);

    const response = await server.submitTransaction(transaction);
    console.log(`[Stellar API] Trustlines added! TX Hash: ${response.hash}`);

    return NextResponse.json({ success: true, txHash: response.hash });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[Stellar API] Error adding trustlines:', error.response?.data || error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add trustlines' 
    }, { status: 400 });
  }
}
