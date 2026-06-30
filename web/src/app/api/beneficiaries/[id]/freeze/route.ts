import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { action } = await req.json(); // action should be 'freeze' or 'unfreeze'
    const newStatus = action === 'freeze' ? 'frozen' : 'active';

    const updatedUser = await prisma.userProfile.update({
      where: { id: params.id },
      data: { /* accountStatus does not exist in schema, need to add it later */ },
    });

    // In a real production scenario, we would also invoke the Soroban smart contract here
    // to call the `freeze(env, beneficiary)` or `unfreeze(env, beneficiary)` function.
    // e.g. await callGovPayVaultContract('freeze', updatedUser.wallet);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Failed to update account status:', error);
    return NextResponse.json(
      { error: 'Failed to update account status' },
      { status: 500 }
    );
  }
}
