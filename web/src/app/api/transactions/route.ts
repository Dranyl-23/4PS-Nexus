import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { beneficiary, amount, merchantName, merchantCategory, txHash } = body;

    const transaction = await prisma.transaction.create({
      data: {
        beneficiary: beneficiary || 'GABCD...BENEFICIARY',
        type: 'spend',
        merchant: merchantName || 'Unknown Merchant',
        category: merchantCategory || 'General',
        amount: parseFloat(amount),
        status: 'Completed',
        txHash: txHash || '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      }
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
