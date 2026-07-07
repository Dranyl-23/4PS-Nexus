import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendSMS, smsTemplates } from '@/lib/sms';
import { Keypair } from '@stellar/stellar-sdk';
import { Client, Category, networks } from 'govpay-vault';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (wallet) {
      const merchant = await prisma.merchant.findUnique({
        where: { wallet },
      });
      if (!merchant) {
        return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
      }
      return NextResponse.json(merchant);
    }

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
      
      // ===== SOROBAN INTEGRATION: Add Merchant to Whitelist On-Chain =====
      try {
        const adminSecret = process.env.ADMIN_SECRET_KEY;
        if (!adminSecret) throw new Error('ADMIN_SECRET_KEY is missing');
        
        const adminKeypair = Keypair.fromSecret(adminSecret);
        
        // Map Prisma category to Soroban Enum
        const catUpper = updatedMerchant.category?.toUpperCase() || '';
        let sorobanCategory: Category = Category.Food;
        if (catUpper.includes('EDUCATION') || catUpper.includes('SCHOOL')) sorobanCategory = Category.Education;
        if (catUpper.includes('HEALTH') || catUpper.includes('MEDICAL') || catUpper.includes('PHARMACY')) sorobanCategory = Category.Health;

        const client = new Client({
          ...networks.testnet,
          rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org',
        });

        const tx = await client.add_merchant({
          merchant: updatedMerchant.wallet,
          category: sorobanCategory
        });

        await tx.signAndSend({ signTransaction: async (xdr) => {
           const transaction = require('@stellar/stellar-sdk').TransactionBuilder.fromXDR(xdr, networks.testnet.networkPassphrase);
           transaction.sign(adminKeypair);
           return { signedTxXdr: transaction.toXDR() };
        }});
        
        console.log(`[Soroban] Successfully whitelisted merchant ${updatedMerchant.wallet} for category ${sorobanCategory}`);
      } catch (sorobanErr) {
        console.error('[Soroban] Failed to whitelist merchant on-chain:', sorobanErr);
        // Even if on-chain fails, we keep the DB state updated, but ideally they should be in sync.
      }
      // ===================================================================

      void (async () => {
        try {
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
