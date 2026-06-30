import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet is required' }, { status: 400 });
    }

    const user = await prisma.userProfile.findUnique({
      where: { wallet }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all claims for this beneficiary
    const claims = await prisma.claimDocument.findMany({
      where: { beneficiary: wallet },
      orderBy: { submittedAt: 'desc' }
    });

    // Helper function to get the latest status for a category
    const getStatusForCategory = (category: string) => {
      // Find the most recent claim for this category
      const latestClaim = claims.find(c => c.category === category);
      if (!latestClaim) return 'missing'; // 0%
      if (latestClaim.status === 'approved') return 'approved'; // 100%
      if (latestClaim.status === 'rejected') return 'missing'; // 0% (Needs resubmission)
      return 'pending'; // 50% or "Under Review"
    };

    // Evaluate compliance for the 3 main 4Ps categories
    const complianceStatus = {
      education: getStatusForCategory('Education'),
      health: getStatusForCategory('Health'),
      fds: getStatusForCategory('FDS')
    };

    return NextResponse.json({
      success: true,
      compliance: complianceStatus,
      accountStatus: user.accountStatus
    });

  } catch (error) {
    console.error('Compliance fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch compliance status' }, { status: 500 });
  }
}
