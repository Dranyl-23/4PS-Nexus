import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const beneficiaries = await prisma.userProfile.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, beneficiaries });
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
