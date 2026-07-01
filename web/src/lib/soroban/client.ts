import { Contract, Address, nativeToScVal, TransactionBuilder, Networks, rpc, Horizon, BASE_FEE } from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const CONTRACT_ID = "CAVWEVUDRWMKRL5UIZTTFN5NXEUM7MKXIQ3JFKL62EUALXTLZS4QVQXK";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const rpcServer = new rpc.Server("https://soroban-testnet.stellar.org");
const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");

function mapCategoryToU32(categoryStr: string): number {
    const cat = categoryStr?.toLowerCase() || '';
    if (cat.includes('food')) return 1;
    if (cat.includes('education') || cat.includes('school')) return 2;
    if (cat.includes('health') || cat.includes('pharmacy')) return 3;
    return 1; // Default fallback to Food
}

export const executeAllocate = async (adminPubKey: string, beneficiaryPubKey: string, category: string, amountStr: string) => {
    const account = await horizonServer.loadAccount(adminPubKey);
    const contract = new Contract(CONTRACT_ID);
    
    const catNum = mapCategoryToU32(category);

    const expiresAt = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year from now

    const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(contract.call("allocate",
        nativeToScVal(beneficiaryPubKey, { type: 'address' }),
        nativeToScVal(BigInt(amountStr), { type: 'i128' })
    ))
    .setTimeout(60)
    .build();

    const preparedTx = await rpcServer.prepareTransaction(tx);
    const signedXdr = await signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    
    const txToSubmit = TransactionBuilder.fromXDR(signedXdr.signedTxXdr, NETWORK_PASSPHRASE);
    const sendResponse = await rpcServer.sendTransaction(txToSubmit);
    
    return sendResponse;
};

export const executeAddMerchant = async (adminPubKey: string, merchantPubKey: string, category: string) => {
    const account = await horizonServer.loadAccount(adminPubKey);
    const contract = new Contract(CONTRACT_ID);
    
    const catNum = mapCategoryToU32(category);

    const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(contract.call("add_merchant",
        nativeToScVal(merchantPubKey, { type: 'address' }),
        nativeToScVal(catNum, { type: 'u32' })
    ))
    .setTimeout(60)
    .build();

    const preparedTx = await rpcServer.prepareTransaction(tx);
    const signedXdr = await signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    
    const txToSubmit = TransactionBuilder.fromXDR(signedXdr.signedTxXdr, NETWORK_PASSPHRASE);
    const sendResponse = await rpcServer.sendTransaction(txToSubmit);
    
    return sendResponse;
};
