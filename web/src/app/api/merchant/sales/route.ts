import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ error: 'Merchant name required' }, { status: 400 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        merchant: name,
        type: 'spend'
      },
      orderBy: {
        date: 'desc'
      },
      take: 20
    });

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error('Fetch merchant sales error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
