import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendSMS, smsTemplates } from '@/lib/sms';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { beneficiary, amount, merchantName, merchantCategory, txHash, type } = body;

    const txType = type || 'spend';

    const transaction = await prisma.transaction.create({
      data: {
        beneficiary: beneficiary || 'GABCD...BENEFICIARY',
        type: txType,
        merchant: merchantName || 'Unknown Merchant',
        category: merchantCategory || 'General',
        amount: parseFloat(amount),
        status: 'Completed',
        txHash: txHash || '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      }
    });

    // ── Fire SMS notification (non-blocking) ──────────────────────────
    // Lookup the beneficiary's phone number and SMS preference from UserProfile
    void (async () => {
      try {
        const profile = await prisma.userProfile.findUnique({
          where: { wallet: beneficiary },
          select: { phoneNumber: true, smsAlerts: true },
        });

        if (profile?.phoneNumber && profile.smsAlerts) {
          const parsedAmount = parseFloat(amount);

          if (txType === 'receive' || txType === 'disbursement') {
            await sendSMS(profile.phoneNumber, smsTemplates.disbursementReceived(parsedAmount));
          } else if (txType === 'spend') {
            await sendSMS(
              profile.phoneNumber,
              smsTemplates.paymentMade(parsedAmount, merchantName || 'Unknown Merchant', merchantCategory || 'General')
            );
          }
        }
      } catch (smsErr) {
        // Never fail the transaction just because SMS failed
        console.error('[SMS] Failed to send notification:', smsErr);
      }
    })();
    // ─────────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
