import { NextResponse } from 'next/server';
import { Client, Category, networks } from 'govpay-vault';

export async function POST(req: Request) {
  try {
    const { beneficiary, amount, merchantName, merchantCategory, type } = await req.json();

    if (!beneficiary || !amount || !merchantName) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    if (type !== 'spend') {
        return NextResponse.json({ success: false, error: 'Invalid transaction type' }, { status: 400 });
    }

    console.log(`[Soroban API] Building spend transaction for ${beneficiary} to ${merchantName}`);

    const client = new Client({
        ...networks.testnet,
        rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org',
        publicKey: beneficiary, 
    });

    const cat = merchantCategory === 'Food' ? Category.Food : Category.Education;
    const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e7)); // Convert to stroops

    // Build the transaction
    const tx = await client.spend({
        beneficiary,
        merchant: merchantName,
        amount: amountBigInt,
        merchant_category: cat
    });

    const builtTx = tx.built;
    
    if (!builtTx) {
        throw new Error('Failed to build transaction. Please check your allocation balance.');
    }

    // Convert to XDR (base64 string)
    const xdr = builtTx.toXDR();

    return NextResponse.json({
        success: true,
        xdr,
        networkPassphrase: networks.testnet.networkPassphrase
    });

  } catch (error: any) {
    console.error('[Soroban API Build] Error:', error.response?.data || error.message || error);
    
    let errorDetails = error.message || String(error);
    if (error.response?.data?.extras?.result_codes) {
      errorDetails = JSON.stringify(error.response.data.extras.result_codes);
    }
    
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
    } else if (errorDetails.includes('InsufficientVaultLiquidity') || errorDetails.includes('Error(Contract, 9)')) {
        errorDetails = "The DSWD Vault does not have enough physical funds to process this transaction.";
    }

    return NextResponse.json({ 
      success: false, 
      error: errorDetails
    }, { status: 400 });
  }
}
