import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Keypair } from '@stellar/stellar-sdk';
import { Client, networks } from 'govpay-vault';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { beneficiary, secretKey, amount, merchantName, merchantCategory, type } = body;

    if (!beneficiary || !secretKey || !amount || !merchantName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[Soroban API] Processing spend from ${beneficiary} to ${merchantName} for ${amount}`);

    // ===== SOROBAN INTEGRATION: Spend Function =====
    const keypair = Keypair.fromSecret(secretKey);
    const client = new Client({
        ...networks.testnet,
        rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org',
        publicKey: keypair.publicKey(),
    });

    const parsedAmount = BigInt(Math.floor(Number(amount)));

    // Generate the spend transaction
    console.log(`[Soroban API] Simulating spend transaction...`);
    const tx = await client.spend({
        beneficiary,
        merchant: merchantName,
        amount: parsedAmount
    });

    console.log(`[Soroban API] Submitting spend transaction...`);
    await tx.signAndSend({ signTransaction: async (xdr) => {
        const transaction = require('@stellar/stellar-sdk').TransactionBuilder.fromXDR(xdr, networks.testnet.networkPassphrase);
        transaction.sign(keypair);
        return { signedTxXdr: transaction.toXDR() };
    }});

    const txHash = tx.built?.hash().toString('hex') || `soroban-spend-${Date.now()}`;
    console.log(`[Soroban API] Success! TX Hash: ${txHash}`);
    // ===============================================

    // 2. Record in Prisma Database
    const txType = type || 'spend';
    let finalMerchantName = merchantName;
    let finalCategory = merchantCategory || 'General';

    if (merchantName.startsWith('G') && merchantName.length === 56) {
      const merchantObj = await prisma.merchant.findFirst({
        where: { wallet: merchantName }
      });
      if (merchantObj) {
        finalMerchantName = merchantObj.businessName;
        finalCategory = merchantObj.category;
      }
    }

    const savedTx = await prisma.transaction.create({
      data: {
        beneficiary: beneficiary,
        type: txType,
        merchant: finalMerchantName,
        category: finalCategory,
        amount: parseFloat(amount),
        status: 'Completed',
        txHash: txHash,
      }
    });

    return NextResponse.json({ success: true, transaction: savedTx, txHash });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[Soroban API] Error:', error.response?.data || error.message || error);
    
    let errorDetails = error.message || String(error);
    if (error.response?.data?.extras?.result_codes) {
      errorDetails = JSON.stringify(error.response.data.extras.result_codes);
    }
    
    // We can map Soroban Contract errors (like NotWhitelisted, InsufficientAllocation) back to the mobile app
    if (errorDetails.includes('NotWhitelisted') || errorDetails.includes('Error(Contract, 4)')) {
        errorDetails = "The merchant is not whitelisted by DSWD.";
    } else if (errorDetails.includes('InsufficientAllocation') || errorDetails.includes('Error(Contract, 5)')) {
        errorDetails = "You do not have enough allocated funds for this transaction.";
    } else if (errorDetails.includes('AccountFrozen') || errorDetails.includes('Error(Contract, 6)')) {
        errorDetails = "Your account has been frozen by the administrator.";
    } else if (errorDetails.includes('CategoryMismatch') || errorDetails.includes('Error(Contract, 7)')) {
        errorDetails = "This merchant's category does not match your allowed subsidy category.";
    } else if (errorDetails.includes('AllocationExpired') || errorDetails.includes('Error(Contract, 8)')) {
        errorDetails = "Your allocated funds have expired.";
    }

    return NextResponse.json({ 
      success: false, 
      error: errorDetails
    }, { status: 400 }); // Use 400 so we don't trigger a 500 HTML crash page
  }
}
