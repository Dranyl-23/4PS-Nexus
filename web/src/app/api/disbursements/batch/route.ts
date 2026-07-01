import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executeBatchAllocate } from '@/lib/soroban/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountPerUser, adminSignature, category } = body;

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
    let txHash = `fallback-${Date.now().toString(16)}`; // Default fallback hash
    let wasSimulated = false;

    console.log(`Submitting batch allocation to Soroban for ${beneficiaryWallets.length} wallets...`);
    try {
      const sendResponse = await executeBatchAllocate(beneficiaryWallets, amountPerUser.toString());
      txHash = sendResponse.hash;
    } catch (e) {
      console.warn("Soroban transaction failed, using simulated fallback for Hackathon demo.", e);
      wasSimulated = true;
    }

    // Log the blockchain transaction IDs for the frontend to show, AND persist to Database!
    const transactions = [];
    for (const b of beneficiaries) {
      // Create Transaction in MongoDB
      const newTx = await prisma.transaction.create({
        data: {
          beneficiary: b.wallet,
          type: 'receive',
          merchant: 'DSWD Disbursement',
          category: category || 'Cash Grant',
          amount: Number(amountPerUser),
          status: wasSimulated ? 'Simulated' : 'Completed',
          txHash: txHash
        }
      });
      transactions.push(newTx);

      // Create Notification in MongoDB
      await prisma.notification.create({
        data: {
          beneficiary: b.wallet,
          title: 'Budget Released',
          message: `Your ${category || 'budget'} for this month has been released to your account. Total: ${amountPerUser} XLM.`,
          type: 'system',
          isRead: false
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: wasSimulated 
        ? `Demo Mode: Successfully simulated batch disbursement of ${amountPerUser} XLM to ${beneficiaries.length} beneficiaries.`
        : `Successfully submitted batch disbursement of ${amountPerUser} XLM to ${beneficiaries.length} beneficiaries (Tx: ${txHash.substring(0, 8)}...)`,
      data: transactions
    });

  } catch (error: unknown) {
    console.error('Batch Disbursement Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

