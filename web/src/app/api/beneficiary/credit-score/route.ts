import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet is required' }, { status: 400 });
    }

    // 1. Fetch beneficiary transactions from Prisma
    const transactions = await prisma.transaction.findMany({
      where: { beneficiary: wallet }
    });

    // 2. Real Credit Score Calculation Logic
    let baseScore = 500;
    
    // Evaluate transactions
    let goodTxCount = 0;
    let badTxCount = 0; // We can track failed or rejected txns if we want
    
    transactions.forEach(tx => {
      if (tx.status === 'Completed' || tx.status === 'Simulated') {
        if (tx.type === 'spend') {
          // Increase score for completed successful spends (shows active utilization)
          goodTxCount += 1;
          // +15 points per successful allowed transaction
          baseScore += 15;
        }
      } else if (tx.status === 'Failed' || tx.status === 'Rejected') {
        // -50 points for bad behavior / failed txns (like trying to buy liquor but failing)
        badTxCount += 1;
        baseScore -= 50;
      }
    });

    // Enforce limits (300 to 850)
    if (baseScore < 300) baseScore = 300;
    if (baseScore > 850) baseScore = 850;

    const isEligibleForLoan = baseScore >= 700;

    return NextResponse.json({
      score: baseScore,
      isEligible: isEligibleForLoan,
      factors: {
        goodTransactions: goodTxCount,
        badTransactions: badTxCount,
        message: isEligibleForLoan 
          ? "You have unlocked Emergency Micro-Loans!" 
          : "Keep spending on approved categories to raise your score."
      }
    });
  } catch (error) {
    console.error('Error fetching credit score:', error);
    return NextResponse.json({ error: 'Failed to fetch credit score' }, { status: 500 });
  }
}
