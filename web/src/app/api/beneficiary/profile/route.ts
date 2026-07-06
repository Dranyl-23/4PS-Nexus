import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

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
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Fetch REAL Stellar Balance
    let realBalance = 0;
    const balances = { Food: 0, Education: 0, Health: 0 };
    try {
      const account = await server.loadAccount(wallet);
      const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native');
      if (nativeBalance) {
        realBalance = parseFloat(nativeBalance.balance);
      }
      
      const foodBalance = account.balances.find((b: any) => b.asset_code === 'FOOD');
      if (foodBalance) {
        balances.Food = parseFloat(foodBalance.balance);
      }
      
      const educBalance = account.balances.find((b: any) => b.asset_code === 'EDUC');
      if (educBalance) {
        balances.Education = parseFloat(educBalance.balance);
      }
    } catch (err) {
      console.warn('Could not fetch Stellar balance for wallet:', wallet);
      // Account might not be funded yet, balance stays 0
    }

    // Calculate spent amount from transactions
    const transactions = await prisma.transaction.findMany({
      where: { beneficiary: wallet }
    });

    let totalSpent = 0;
    
    transactions.forEach(tx => {
      if (tx.status === 'Completed' || tx.status === 'Simulated') {
        if (tx.type === 'spend') {
          totalSpent += Math.abs(tx.amount);
        }
      }
    });

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
      balance: realBalance,
      balances, // Not used strictly anymore since balance is total
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
