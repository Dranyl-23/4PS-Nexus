import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { wallet }
    });

    if (!merchant) {
      return NextResponse.json({ success: true, exists: false });
    }

    return NextResponse.json({ success: true, exists: true, merchant });
  } catch (error) {
    console.error('Fetch merchant profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch merchant profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet, businessName, category, location } = body;

    if (!wallet || !businessName || !category || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const merchant = await prisma.merchant.create({
      data: {
        wallet,
        businessName,
        category,
        location,
        isWhitelisted: false, // Default to pending
      }
    });

    return NextResponse.json({ success: true, merchant });
  } catch (error) {
    console.error('Create merchant profile error:', error);
    return NextResponse.json({ error: 'Failed to create merchant profile' }, { status: 500 });
  }
}
