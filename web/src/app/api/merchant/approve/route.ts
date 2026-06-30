import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, wallet } = body;

    if (!id && !wallet) {
      return NextResponse.json({ error: 'Merchant ID or Wallet is required' }, { status: 400 });
    }

    // Update merchant status to whitelisted
    const merchant = await prisma.merchant.update({
      where: id ? { id } : { wallet },
      data: {
        isWhitelisted: true
      }
    });

    return NextResponse.json({ success: true, message: 'Merchant successfully whitelisted', merchant });
  } catch (error) {
    console.error('Approve merchant error:', error);
    return NextResponse.json({ error: 'Failed to approve merchant' }, { status: 500 });
  }
}
