import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

const LENDING_POOL_SECRET = 'SA5NDZ6Z6FAIVPC5I3M4H3YOKESHNWVVM6OKVJTQWBPJ45T36ZK23M33';

export async function POST(request: Request) {
  try {
    const { wallet, amount } = await request.json();

    if (!wallet || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Double check eligibility
    const transactions = await prisma.transaction.findMany({
      where: { beneficiary: wallet }
    });
    
    let baseScore = 500;
    transactions.forEach(tx => {
      if (tx.status === 'Completed' || tx.status === 'Simulated') {
        if (tx.type === 'spend') baseScore += 15;
      } else if (tx.status === 'Failed' || tx.status === 'Rejected') {
        baseScore -= 50;
      }
    });

    if (baseScore < 700) {
      return NextResponse.json({ error: 'Trust Score is too low for a loan.' }, { status: 403 });
    }

    // Ensure they haven't already taken a loan recently
    const existingLoans = await prisma.transaction.findMany({
      where: {
        beneficiary: wallet,
        type: 'loan'
      }
    });

    if (existingLoans.length > 0) {
      // For hackathon, maybe allow multiple loans or restrict it
      // Let's restrict to 1 for demo purposes
      return NextResponse.json({ error: 'You already have an active Micro-Loan.' }, { status: 400 });
    }

    console.log(`[DeFi Lending] Disbursing ${amount} XLM loan to ${wallet}`);

    // Disburse funds via Stellar
    const sourceAccount = await server.loadAccount(StellarSdk.Keypair.fromSecret(LENDING_POOL_SECRET).publicKey());
    const fee = await server.fetchBaseFee();
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: fee.toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: wallet,
      asset: StellarSdk.Asset.native(),
      amount: amount.toString(),
    }))
    .setTimeout(30)
    .build();

    const keypair = StellarSdk.Keypair.fromSecret(LENDING_POOL_SECRET);
    transaction.sign(keypair);

    const response = await server.submitTransaction(transaction);
    console.log(`[DeFi Lending] Loan Disbursed! TX Hash: ${response.hash}`);

    // Record the loan in the DB
    const savedTx = await prisma.transaction.create({
      data: {
        beneficiary: wallet,
        type: 'loan',
        merchant: 'DeFi Lending Pool',
        category: 'Financial Services',
        amount: parseFloat(amount),
        status: 'Completed',
        txHash: response.hash,
      }
    });

    return NextResponse.json({ success: true, transaction: savedTx, txHash: response.hash });

  } catch (error: any) {
    console.error('[DeFi Lending] Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to disburse loan' }, { status: 500 });
  }
}
