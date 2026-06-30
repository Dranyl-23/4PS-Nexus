import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executeBatchAllocate } from '@/lib/soroban/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountPerUser, adminSignature } = body;

    // In a real app with KMS, adminSignature could be an approval token.
    // For now we just check if they sent something to authorize.
    if (!adminSignature || !amountPerUser) {
      return NextResponse.json({ error: 'Multi-sig authorization and amount required' }, { status: 400 });
    }

    // Fetch all verified beneficiaries from the database
    const beneficiaries = await prisma.userProfile.findMany({
      where: { kycStatus: 'verified' }
    });

    if (beneficiaries.length === 0) {
      return NextResponse.json({ error: 'No verified beneficiaries found' }, { status: 400 });
    }

    // Extract all wallet addresses to send to the batch allocator
    const beneficiaryWallets = [];
    for (const b of beneficiaries) {
      beneficiaryWallets.push(b.wallet);
    }

    // Call Soroban contract via the backend Server wallet
    console.log(`Submitting batch allocation to Soroban for ${beneficiaryWallets.length} wallets...`);
    const sendResponse = await executeBatchAllocate(beneficiaryWallets, amountPerUser.toString());
    
    // We get back a hash which represents the batch tx
    const txHash = sendResponse.hash;

    // Log the simulated blockchain transaction IDs for the frontend to show
    const transactions = [];
    for (const b of beneficiaries) {
      transactions.push({
        beneficiary: b.wallet,
        amount: amountPerUser,
        status: 'success', // Note: Soroban txns are async, but for UX we assume submitted = success initially
        txId: txHash
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully submitted batch disbursement of ${amountPerUser} XLM to ${beneficiaries.length} beneficiaries (Tx: ${txHash.substring(0, 8)}...)`,
      data: transactions
    });

  } catch (error: unknown) {
    console.error('Batch Disbursement Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

