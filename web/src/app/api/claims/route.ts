import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { submitAdminAllocateTx } from '@/lib/contract';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const claims = await prisma.claimDocument.findMany({
      orderBy: { submittedAt: 'desc' },
    });
    
    // To make the UI rich, we might need beneficiary names, but for now we'll just return what's in ClaimDocument
    // We can fetch the names by joining with UserProfile
    const claimsWithNames = [];
    for (const claim of claims) {
      const user = await prisma.userProfile.findUnique({
        where: { wallet: claim.beneficiary }
      });
      claimsWithNames.push({
        ...claim,
        name: user?.fullName || 'Unknown Beneficiary',
      });
    }

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

    if (status === 'approved') {
      const claim = await prisma.claimDocument.findUnique({ where: { id } });
      if (!claim) {
        return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
      }

      // Skip on-chain allocation if already approved to prevent double-spending
      if (claim.status !== 'approved') {
        const adminSecret = process.env.ADMIN_SECRET_KEY;
        if (!adminSecret) {
          return NextResponse.json({ error: 'Admin secret not configured' }, { status: 500 });
        }

        try {
          // Allocate 500 tokens (500 * 10^7 stroops)
          await submitAdminAllocateTx(claim.beneficiary, 5000000000, adminSecret);
        } catch (scError) {
          console.error('Smart contract allocation failed:', scError);
          return NextResponse.json({ error: 'Smart contract allocation failed' }, { status: 500 });
        }
      }
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

