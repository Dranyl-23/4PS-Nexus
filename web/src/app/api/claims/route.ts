import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const claims = await prisma.claimDocument.findMany({
      orderBy: { submittedAt: 'desc' },
    });
    
    // To make the UI rich, we might need beneficiary names, but for now we'll just return what's in ClaimDocument
    // We can fetch the names by joining with UserProfile
    const claimsWithNames = await Promise.all(claims.map(async (claim) => {
      const user = await prisma.userProfile.findUnique({
        where: { wallet: claim.beneficiary }
      });
      return {
        ...claim,
        name: user?.fullName || 'Unknown Beneficiary',
      };
    }));

    return NextResponse.json(claimsWithNames);
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { beneficiary, category, fileUrl } = body;

    if (!beneficiary || !category || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newClaim = await prisma.claimDocument.create({
      data: {
        beneficiary,
        category,
        fileUrl,
        status: 'pending',
      },
    });

    return NextResponse.json(newClaim, { status: 201 });
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedClaim = await prisma.claimDocument.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedClaim);
  } catch (error) {
    console.error('Error updating claim:', error);
    return NextResponse.json({ error: 'Failed to update claim' }, { status: 500 });
  }
}
