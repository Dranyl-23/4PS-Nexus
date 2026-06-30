import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(merchants);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, wallet } = body;

    if (!name || !category || !wallet) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMerchant = await prisma.merchant.create({
      data: {
        businessName: name,
        location: category, // re-using location for category in this schema
        wallet,
        isWhitelisted: false, // Default to pending
      },
    });

    return NextResponse.json(newMerchant, { status: 201 });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json({ error: 'Failed to create merchant' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isWhitelisted } = body;

    if (!id || isWhitelisted === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedMerchant = await prisma.merchant.update({
      where: { id },
      data: { isWhitelisted },
    });

    return NextResponse.json(updatedMerchant);
  } catch (error) {
    console.error('Error updating merchant:', error);
    return NextResponse.json({ error: 'Failed to update merchant' }, { status: 500 });
  }
}
