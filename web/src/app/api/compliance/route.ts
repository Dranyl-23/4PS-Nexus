import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // In a real app, you would get the logged-in user's wallet address from the session.
    // For this demo, we'll hardcode or simulate a generic query.
    // Let's assume the beneficiary wallet is 'GABCD_CURRENT_USER'
    const beneficiaryWallet = 'GABCD_CURRENT_USER';

    // Fetch all claims for this beneficiary
    const claims = await prisma.claimDocument.findMany({
      where: { beneficiary: beneficiaryWallet },
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
      compliance: complianceStatus
    });

  } catch (error) {
    console.error('Compliance fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch compliance status' }, { status: 500 });
  }
}
