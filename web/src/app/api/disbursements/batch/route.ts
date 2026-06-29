import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { executeAllocate } from '@/lib/soroban'; // In a real app with KMS, we'd sign server-side here.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountPerUser, adminSignature } = body;

    if (!adminSignature) {
      return NextResponse.json({ error: 'Multi-sig authorization required from KMS' }, { status: 401 });
    }

    // Fetch all verified beneficiaries from the database
    const beneficiaries = await prisma.userProfile.findMany({
      where: { kycStatus: 'verified' }
    });

    if (beneficiaries.length === 0) {
      return NextResponse.json({ error: 'No verified beneficiaries found' }, { status: 400 });
    }

    // In a production environment, we would use an AWS KMS secured backend wallet
    // to build a batch transaction with multiple `allocate` operations and submit to Soroban.
    // For this demo backend, we simulate the success of the batch process.
    
    // Log the simulated blockchain transaction IDs
    const transactions = beneficiaries.map((b: any) => ({
      beneficiary: b.wallet,
      amount: amountPerUser,
      status: 'success',
      txId: `tx_${Math.random().toString(36).substr(2, 9)}` // Mock Tx ID
    }));

    return NextResponse.json({ 
      success: true, 
      message: `Successfully disbursed ${amountPerUser} XLM to ${beneficiaries.length} beneficiaries`,
      data: transactions
    });

  } catch (error) {
    console.error('Batch Disbursement Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
