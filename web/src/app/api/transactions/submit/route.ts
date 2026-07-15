import { NextResponse } from 'next/server';
import { rpc, TransactionBuilder, networks, xdr } from '@stellar/stellar-sdk';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { signedXdr, merchantName, amount, beneficiary } = await req.json();

    if (!signedXdr) {
      return NextResponse.json({ success: false, error: 'Missing signed XDR' }, { status: 400 });
    }

    console.log(`[Soroban API] Submitting signed transaction...`);

    const server = new rpc.Server(process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org');
    
    // Parse the transaction from XDR just to verify
    const tx = TransactionBuilder.fromXDR(signedXdr, networks.testnet.networkPassphrase);
    
    // Submit the transaction
    const sendResponse = await server.sendTransaction(tx);
    
    if (sendResponse.status === 'ERROR') {
        throw new Error(`Transaction submission failed: ${JSON.stringify(sendResponse.errorResultXdr)}`);
    }

    console.log(`[Soroban API] Transaction sent successfully, Hash: ${sendResponse.hash}`);

    // Wait for the transaction to complete
    let statusResponse = await server.getTransaction(sendResponse.hash);
    let attempts = 0;
    while (statusResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND && attempts < 15) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        statusResponse = await server.getTransaction(sendResponse.hash);
        attempts++;
    }

    if (statusResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
        throw new Error(`Transaction execution failed: ${statusResponse.resultMetaXdr}`);
    }

    // Save to database for history
    if (statusResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        if (beneficiary && amount && merchantName) {
            try {
                await prisma.transaction.create({
                    data: {
                        beneficiaryId: beneficiary,
                        merchantName: merchantName,
                        amount: amount,
                        type: 'spend',
                        status: 'completed',
                        txHash: sendResponse.hash,
                    },
                });
                console.log(`[Soroban API] Transaction recorded in database.`);
            } catch (dbError) {
                console.error(`[Soroban API] Failed to record transaction in DB:`, dbError);
                // We don't fail the whole request just because DB insert failed, 
                // since the blockchain transaction succeeded.
            }
        }
    }

    return NextResponse.json({
        success: true,
        hash: sendResponse.hash,
        status: statusResponse.status
    });

  } catch (error: any) {
    console.error('[Soroban API Submit] Error:', error.message || error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to submit transaction.'
    }, { status: 400 });
  }
}
