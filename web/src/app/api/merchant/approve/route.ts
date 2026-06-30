import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { submitAdminAddMerchantTx } from '@/lib/contract';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, wallet } = body;

    if (!id && !wallet) {
      return NextResponse.json({ error: 'Merchant ID or Wallet is required' }, { status: 400 });
    }

    // Fetch the merchant to ensure we have the wallet
    const existingMerchant = await prisma.merchant.findUnique({
      where: id ? { id } : { wallet }
    });

    if (!existingMerchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    const adminSecret = process.env.ADMIN_SECRET_KEY;
    if (!adminSecret) {
      throw new Error("Missing ADMIN_SECRET_KEY in environment");
    }

    // Call Soroban smart contract to whitelist the merchant
    await submitAdminAddMerchantTx(existingMerchant.wallet, adminSecret);

    // Update merchant status to whitelisted
    const merchant = await prisma.merchant.update({
      where: { id: existingMerchant.id },
      data: {
        isWhitelisted: true
      }
    });

    return NextResponse.json({ success: true, message: 'Merchant successfully whitelisted', merchant });
  } catch (error) {
    console.error('Approve merchant error:', error);
    return NextResponse.json({ error: 'Failed to approve merchant' }, { status: 500 });
  }
}
