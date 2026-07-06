import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

export async function POST(request: Request) {
  try {
    const { payload } = await request.json();

    if (!payload) {
      return NextResponse.json({ error: 'Missing QR payload' }, { status: 400 });
    }

    // Decode the Base64 payload
    let intentString;
    try {
      intentString = Buffer.from(payload, 'base64').toString('utf-8');
    } catch (e) {
      return NextResponse.json({ error: 'Invalid QR Format' }, { status: 400 });
    }

    let intent;
    try {
      intent = JSON.parse(intentString);
    } catch (e) {
      return NextResponse.json({ error: 'Corrupted QR Data' }, { status: 400 });
    }

    const { b: beneficiary, s: secretKey, m: merchantName, a: amount, c: assetCode, t: timestamp } = intent;

    if (!beneficiary || !secretKey || !amount || !merchantName) {
      return NextResponse.json({ error: 'Incomplete Offline Transaction Data' }, { status: 400 });
    }

    // Anti-replay check: ensure timestamp is within last 10 minutes
    const now = Date.now();
    if (now - timestamp > 10 * 60 * 1000) {
      return NextResponse.json({ error: 'QR Code has expired. Please ask beneficiary to generate a new one.' }, { status: 400 });
    }

    console.log(`[Stellar Relay] Processing offline relayed payment from ${beneficiary} to ${merchantName} for ${amount} ${assetCode || 'XLM'}`);

    // Submit to Stellar Testnet
    const sourceAccount = await server.loadAccount(beneficiary);
    const fee = await server.fetchBaseFee();
    
    let stellarAsset = StellarSdk.Asset.native();
    if (assetCode && assetCode !== 'native') {
      const ISSUER_PUBLIC_KEY = 'GCL5RVXDZO5UJFV3EP7S2LFFZ75A3LLQGPUCOQJPZZ6E6HBFYZE334W4';
      stellarAsset = new StellarSdk.Asset(assetCode, ISSUER_PUBLIC_KEY);
    }
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: fee.toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: merchantName,
      asset: stellarAsset,
      amount: amount.toString(),
    }))
    .setTimeout(30)
    .build();

    const keypair = StellarSdk.Keypair.fromSecret(secretKey);
    transaction.sign(keypair);

    const response = await server.submitTransaction(transaction);
    const txHash = response.hash;
    console.log(`[Stellar Relay] Success! TX Hash: ${txHash}`);

    // Record in Prisma Database
    let finalMerchantName = merchantName;
    let finalCategory = 'General';

    if (merchantName.startsWith('G') && merchantName.length === 56) {
      const merchantObj = await prisma.merchant.findFirst({
        where: { wallet: merchantName }
      });
      if (merchantObj) {
        finalMerchantName = merchantObj.businessName;
        finalCategory = merchantObj.category;
      }
    }

    const savedTx = await prisma.transaction.create({
      data: {
        beneficiary: beneficiary,
        type: 'spend',
        merchant: finalMerchantName,
        category: finalCategory,
        amount: parseFloat(amount),
        status: 'Completed',
        txHash: txHash,
      }
    });

    return NextResponse.json({ success: true, transaction: savedTx, txHash });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[Stellar Relay] Error:', error.response?.data || error.message);
    
    let errorDetails = error.message;
    if (error.response?.data?.extras?.result_codes) {
      errorDetails = JSON.stringify(error.response.data.extras.result_codes);
    }
    
    if (errorDetails.includes('op_no_destination')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Merchant wallet does not exist on the network.' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: `Blockchain error: ${errorDetails}` 
    }, { status: 400 });
  }
}
