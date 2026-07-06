import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet, fullName, address, dswdId, phoneNumber } = body;

    if (!wallet || !fullName || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if wallet already exists
    const existing = await prisma.userProfile.findUnique({
      where: { wallet }
    });

    if (existing) {
      return NextResponse.json({ error: 'Wallet already registered' }, { status: 400 });
    }

    // Create the real profile
    const profile = await prisma.userProfile.create({
      data: {
        wallet,
        fullName,
        address,
        dswdId,
        phoneNumber,
        kycStatus: 'verified', // Auto-verified for hackathon purposes
        accountStatus: 'active',
      }
    });

    // We do NOT create a GENESIS_TX_ here because the Stellar Blockchain (Friendbot)
    // already gives them 10,000 XLM when the wallet is generated!

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error registering beneficiary:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
