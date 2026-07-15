import { Keypair, TransactionBuilder, Networks, rpc as StellarRpc, Contract, nativeToScVal } from '@stellar/stellar-sdk';

async function fundVault() {
  console.log("Funding Vault Contract...");
  const adminSecret = "SDQWKFARNHFWR4KJ3Y3ANQF7LVBO66TDH3WF6FB6R5IK6I7K6ET376NS";
  const adminKeypair = Keypair.fromSecret(adminSecret);
  const server = new StellarRpc.Server('https://soroban-testnet.stellar.org');

  const vaultContractId = "CCDNSPFHTYJFVGUTCYXOCYNOKQUM5ROOWJCV7VWAN7UCSXTMTCRT6SFA";

  try {
    console.log("Funding Admin Alice via Friendbot...");
    await fetch(`https://friendbot.stellar.org/?addr=${adminKeypair.publicKey()}`);
    console.log("Friendbot successful!");

    const account = await server.getAccount(adminKeypair.publicKey());
    
    const nativeXlmId = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
    const nativeToken = new Contract(nativeXlmId);

    const tx = new TransactionBuilder(account, { fee: '10000', networkPassphrase: Networks.TESTNET })
      .addOperation(nativeToken.call('transfer',
        ...[
          nativeToScVal(adminKeypair.publicKey(), { type: 'address' }),
          nativeToScVal(vaultContractId, { type: 'address' }),
          nativeToScVal(BigInt("5000000000"), { type: 'i128' }) // 500 XLM (500 * 10^7)
        ]
      ))
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    preparedTx.sign(adminKeypair);
    
    const sendRes = await server.sendTransaction(preparedTx);
    console.log("Vault funded! Hash:", sendRes.hash);
  } catch (e) {
    console.log("Error:", e);
  }
}

fundVault();
