import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet, fullName, address } = body;

    if (!wallet || !fullName || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert user profile (create if not exists, update if exists)
    const user = await prisma.userProfile.upsert({
      where: { wallet },
      update: {
        fullName,
        address,
        kycStatus: 'verified', // Automatically verified for demo purposes
      },
      create: {
        wallet,
        fullName,
        address,
        kycStatus: 'verified',
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('KYC Verify Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
