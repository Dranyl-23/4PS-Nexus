import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendSMS, smsTemplates } from '@/lib/sms';

export const dynamic = 'force-dynamic';

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
    const { name, category, location, wallet } = body;

    if (!name || !category || !location || !wallet) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMerchant = await prisma.merchant.create({
      data: {
        businessName: name,
        category,
        location, 
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

    // ── Fire SMS if merchant was just approved ──────────────────────────
    if (isWhitelisted === true) {
      void (async () => {
        try {
          // Lookup the merchant's phone number via their wallet in UserProfile
          const profile = await prisma.userProfile.findUnique({
            where: { wallet: updatedMerchant.wallet },
            select: { phoneNumber: true, smsAlerts: true },
          });

          if (profile?.phoneNumber && profile.smsAlerts) {
            await sendSMS(
              profile.phoneNumber,
              smsTemplates.merchantApproved(updatedMerchant.businessName)
            );
          }
        } catch (smsErr) {
          console.error('[SMS] Failed to send merchant approval notification:', smsErr);
        }
      })();
    }
    // ────────────────────────────────────────────────────────────────────

    return NextResponse.json(updatedMerchant);
  } catch (error) {
    console.error('Error updating merchant:', error);
    return NextResponse.json({ error: 'Failed to update merchant' }, { status: 500 });
  }
}
