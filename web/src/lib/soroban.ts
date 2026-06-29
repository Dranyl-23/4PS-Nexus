import { Contract, Address, nativeToScVal, TransactionBuilder, Networks, rpc, Horizon, BASE_FEE } from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const CONTRACT_ID = "CAVWEVUDRWMKRL5UIZTTFN5NXEUM7MKXIQ3JFKL62EUALXTLZS4QVQXK";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const rpcServer = new rpc.Server("https://soroban-testnet.stellar.org");
const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");

export const executeAllocate = async (adminPubKey: string, beneficiaryPubKey: string, amountStr: string) => {
    const account = await horizonServer.loadAccount(adminPubKey);
    const contract = new Contract(CONTRACT_ID);
    
    const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(contract.call("allocate",
        new Address(beneficiaryPubKey).toScVal(),
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

export const executeAddMerchant = async (adminPubKey: string, merchantPubKey: string) => {
    const account = await horizonServer.loadAccount(adminPubKey);
    const contract = new Contract(CONTRACT_ID);
    
    const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(contract.call("add_merchant",
        new Address(merchantPubKey).toScVal()
    ))
    .setTimeout(60)
    .build();

    const preparedTx = await rpcServer.prepareTransaction(tx);
    const signedXdr = await signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    
    const txToSubmit = TransactionBuilder.fromXDR(signedXdr.signedTxXdr, NETWORK_PASSPHRASE);
    const sendResponse = await rpcServer.sendTransaction(txToSubmit);
    
    return sendResponse;
};
