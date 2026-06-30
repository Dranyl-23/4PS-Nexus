import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalEnrolled = await prisma.userProfile.count();
    const compliant = await prisma.userProfile.count({
      where: { kycStatus: 'verified' }
    });
    
    // For "Wallets Linked", since every enrolled user has a wallet in this system, it's the same as total.
    // If we had a separate condition, we would count that.
    const walletsLinked = await prisma.userProfile.count({
      where: {
        wallet: { not: "" }
      }
    });

    return NextResponse.json({
      totalEnrolled,
      compliant,
      walletsLinked
    });
  } catch (error) {
    console.error('Error fetching beneficiary stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
