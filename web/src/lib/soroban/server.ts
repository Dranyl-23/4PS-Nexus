import { Contract, Address, nativeToScVal, TransactionBuilder, Networks, rpc, Horizon, BASE_FEE, Keypair, scValToNative } from '@stellar/stellar-sdk';

const CONTRACT_ID = "CAVWEVUDRWMKRL5UIZTTFN5NXEUM7MKXIQ3JFKL62EUALXTLZS4QVQXK";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const rpcServer = new rpc.Server("https://soroban-testnet.stellar.org");
const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");

// Throws if ADMIN_SECRET_KEY is missing
const getAdminKeypair = () => {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    throw new Error("ADMIN_SECRET_KEY is not defined in environment variables");
  }
  return Keypair.fromSecret(secret);
};

export const executeBatchAllocate = async (beneficiaryPubKeys: string[], amountStr: string) => {
    const adminKeypair = getAdminKeypair();
    const account = await horizonServer.loadAccount(adminKeypair.publicKey());
    const contract = new Contract(CONTRACT_ID);
    
    // Construct the scval array of Addresses
    const beneficiariesScVal = beneficiaryPubKeys.map(pubKey => new Address(pubKey).toScVal());

    // We use a regular xdr array here
    // Wait, the SDK needs to serialize it as a Vec.
    // We can use nativeToScVal(beneficiariesScVal, { type: 'vec' })? 
    // Actually, nativeToScVal just takes an array and converts it to a Vec if we pass the raw strings.
    // Or we can manually build it:
    const vecScVal = import('@stellar/stellar-sdk').then(sdk => sdk.xdr.ScVal.scvVec(beneficiariesScVal));
    
    // Simpler approach:
    // Actually `nativeToScVal` for a Vec of Addresses:
    // The easiest way is to pass the array of Address strings or instances.
    // Wait, nativeToScVal might not know it's an Address unless we specify it.
    // Let's use xdr directly:
    const { xdr } = await import('@stellar/stellar-sdk');
    const vec = xdr.ScVal.scvVec(beneficiariesScVal);

    const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(contract.call("allocate_batch",
        vec,
        nativeToScVal(BigInt(amountStr), { type: 'i128' })
    ))
    .setTimeout(60)
    .build();

    const preparedTx = await rpcServer.prepareTransaction(tx);
    
    // Sign the transaction with the server's Keypair
    preparedTx.sign(adminKeypair);
    
    const sendResponse = await rpcServer.sendTransaction(preparedTx);
    
    return sendResponse;
};
