import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all transactions that are DSWD Disbursements
    const disbursements = await prisma.transaction.findMany({
      where: {
        merchant: 'DSWD Disbursement',
        type: 'receive' // To beneficiaries it's a receive
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: disbursements });
  } catch (error: unknown) {
    console.error('Fetch Disbursements Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
