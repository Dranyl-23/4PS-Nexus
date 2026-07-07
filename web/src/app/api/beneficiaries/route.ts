import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const beneficiaries = await prisma.userProfile.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const withCompliance = await Promise.all(beneficiaries.map(async (b) => {
      const records = await prisma.complianceRecord.findMany({
        where: { beneficiary: b.wallet },
        orderBy: { month: 'desc' },
        take: 1
      });
      return { ...b, complianceRecords: records };
    }));
    
    return NextResponse.json({ success: true, beneficiaries: withCompliance });
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
