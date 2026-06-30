import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet is required' }, { status: 400 });
    }

    // Fetch user profile
    const profile = await prisma.userProfile.findUnique({
      where: { wallet }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    // Calculate balance from mock transactions (receive - spend)
    const transactions = await prisma.transaction.findMany({
      where: { beneficiary: wallet }
    });

    let totalReceived = 0;
    let totalSpent = 0;
    
    transactions.forEach(tx => {
      if (tx.status === 'Completed') {
        if (tx.type === 'receive') totalReceived += tx.amount;
        if (tx.type === 'spend') totalSpent += Math.abs(tx.amount); // amount might be negative in DB, but let's assume absolute or negative
      }
    });

    // Handle case where spend amount was saved as negative
    totalSpent = Math.abs(totalSpent);

    const balance = totalReceived - totalSpent;
    const nextRelease = 1500; // Mock static value for next release
    const dswdId = `4PS-${new Date(profile.createdAt).getFullYear()}-${profile.id.substring(18)}`;

    return NextResponse.json({
      profile,
      balance,
      totalSpent,
      nextRelease,
      dswdId
    });
  } catch (error) {
    console.error('Error fetching beneficiary profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { wallet, settings } = body;

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet is required' }, { status: 400 });
    }

    if (!settings) {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 });
    }

    // Update the profile with the provided settings
    const updatedProfile = await prisma.userProfile.update({
      where: { wallet },
      data: {
        smsAlerts: settings.smsAlerts !== undefined ? settings.smsAlerts : undefined,
        emailAlerts: settings.emailAlerts !== undefined ? settings.emailAlerts : undefined,
        networkAlerts: settings.networkAlerts !== undefined ? settings.networkAlerts : undefined,
        complianceReminders: settings.complianceReminders !== undefined ? settings.complianceReminders : undefined,
        language: settings.language !== undefined ? settings.language : undefined,
      }
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
