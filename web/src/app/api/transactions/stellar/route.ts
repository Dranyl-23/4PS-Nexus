import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { beneficiary, secretKey, amount, merchantName, merchantCategory, type, assetCode } = body;

    if (!beneficiary || !secretKey || !amount || !merchantName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[Stellar API] Processing payment from ${beneficiary} to ${merchantName} for ${amount} ${assetCode || 'XLM'}`);

    // 1. Submit to Stellar Testnet
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
    console.log(`[Stellar API] Success! TX Hash: ${txHash}`);

    // 2. Record in Prisma Database
    const txType = type || 'spend';
    let finalMerchantName = merchantName;
    let finalCategory = merchantCategory || 'General';

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
        type: txType,
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
    console.error('[Stellar API] Error:', error.response?.data || error.message);
    
    let errorDetails = error.message;
    if (error.response?.data?.extras?.result_codes) {
      errorDetails = JSON.stringify(error.response.data.extras.result_codes);
    }
    
    // Check if the destination account doesn't exist
    if (errorDetails.includes('op_no_destination')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Merchant wallet does not exist on the network.' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: `Blockchain error: ${errorDetails}` 
    }, { status: 400 }); // Use 400 so we don't trigger a 500 HTML crash page
  }
}
