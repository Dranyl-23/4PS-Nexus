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
    
    const balances = {
      Food: 0,
      Education: 0,
      Health: 0
    };
    
    transactions.forEach(tx => {
      if (tx.status === 'Completed' || tx.status === 'Simulated') {
        let cat = 'Food';
        const rawCat = (tx.category || '').toLowerCase();
        if (rawCat.includes('education') || rawCat.includes('school')) cat = 'Education';
        else if (rawCat.includes('health') || rawCat.includes('pharmacy')) cat = 'Health';

        if (tx.type === 'receive') {
          totalReceived += tx.amount;
          balances[cat as keyof typeof balances] += tx.amount;
        }
        if (tx.type === 'spend') {
          totalSpent += Math.abs(tx.amount);
          balances[cat as keyof typeof balances] -= Math.abs(tx.amount);
        }
      }
    });

    // Handle case where spend amount was saved as negative
    totalSpent = Math.abs(totalSpent);

    const balance = totalReceived - totalSpent;
    
    // Calculate dynamic next disbursement (1st of next month)
    const now = new Date();
    let nextMonth = now.getMonth() + 1;
    let nextYear = now.getFullYear();
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    const nextDisbursementDate = new Date(nextYear, nextMonth, 1);
    const nextRelease = nextDisbursementDate.getTime();
    
    const dswdId = `4PS-${new Date(profile.createdAt).getFullYear()}-${profile.id.substring(18)}`;

    return NextResponse.json({
      profile,
      balance,
      balances,
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
