import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'asc' }
    });

    // 1. Daily Flow (Disbursed vs Spent)
    const flowMap = new Map<string, { disbursed: number; spent: number }>();
    
    // 2. Category Distribution (Only for 'spend')
    const categoryMap = new Map<string, number>();

    transactions.forEach(tx => {
      // Format date as "MMM DD"
      const dateKey = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!flowMap.has(dateKey)) {
        flowMap.set(dateKey, { disbursed: 0, spent: 0 });
      }
      
      const dayData = flowMap.get(dateKey)!;
      if (tx.type === 'receive' || tx.type === 'disbursement') {
        dayData.disbursed += tx.amount;
      } else if (tx.type === 'spend') {
        dayData.spent += tx.amount;
        
        // Track category distribution
        const cat = tx.category || 'Uncategorized';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + tx.amount);
      }
    });

    const dailyFlow = Array.from(flowMap.entries()).map(([date, data]) => ({
      date,
      disbursed: data.disbursed,
      spent: data.spent
    }));

    const categoryDistribution = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value
    }));

    // If database is completely empty, provide fallback mock data for the hackathon presentation
    if (dailyFlow.length === 0) {
      const mockFlow = [
        { date: 'Jun 25', disbursed: 5000, spent: 1200 },
        { date: 'Jun 26', disbursed: 0, spent: 2800 },
        { date: 'Jun 27', disbursed: 0, spent: 1500 },
        { date: 'Jun 28', disbursed: 2000, spent: 1900 },
        { date: 'Jun 29', disbursed: 0, spent: 1100 },
        { date: 'Jun 30', disbursed: 0, spent: 850 },
        { date: 'Jul 01', disbursed: 1500, spent: 400 },
      ];
      const mockCategories = [
        { name: 'Food & Groceries', value: 4500 },
        { name: 'Education', value: 3200 },
        { name: 'Health & Medicine', value: 2050 }
      ];
      return NextResponse.json({ success: true, dailyFlow: mockFlow, categoryDistribution: mockCategories, isMock: true });
    }

    return NextResponse.json({
      success: true,
      dailyFlow,
      categoryDistribution,
      isMock: false
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
