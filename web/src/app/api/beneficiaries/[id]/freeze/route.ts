import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { submitAdminFreezeTx, submitAdminUnfreezeTx } from '@/lib/contract';

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { action } = await req.json(); // action should be 'freeze' or 'unfreeze'
    const newStatus = action === 'freeze' ? 'frozen' : 'active';

    const user = await prisma.userProfile.findUnique({
      where: { id: params.id }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const adminSecret = process.env.ADMIN_SECRET_KEY;
    if (!adminSecret) {
      throw new Error("Missing ADMIN_SECRET_KEY in environment");
    }

    // Invoke the Soroban smart contract first
    if (action === 'freeze') {
      await submitAdminFreezeTx(user.wallet, adminSecret);
    } else {
      await submitAdminUnfreezeTx(user.wallet, adminSecret);
    }

    const updatedUser = await prisma.userProfile.update({
      where: { id: params.id },
      data: { accountStatus: newStatus },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Failed to update account status:', error);
    return NextResponse.json(
      { error: 'Failed to update account status' },
      { status: 500 }
    );
  }
}
