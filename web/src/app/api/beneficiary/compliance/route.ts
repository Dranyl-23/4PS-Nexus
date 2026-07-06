import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // Fetch existing record
    let record = await prisma.complianceRecord.findUnique({
      where: {
        beneficiary_month: {
          beneficiary: wallet,
          month: currentMonth
        }
      }
    });

    // If no record exists for this month, create a realistic initial one
    if (!record) {
      // For demonstration purposes, we randomize some to be true/false to show dynamic UI
      // In production, these would default to false and be updated by DSWD
      const fdsAttended = Math.random() > 0.5;
      const healthCheck = Math.random() > 0.3;
      const schoolAttended = Math.random() > 0.2;
      
      const isCompliant = fdsAttended && healthCheck && schoolAttended;

      record = await prisma.complianceRecord.create({
        data: {
          beneficiary: wallet,
          month: currentMonth,
          fdsAttended,
          healthCheck,
          schoolAttended,
          isCompliant
        }
      });
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error: unknown) {
    console.error('Fetch Compliance Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
