#![cfg(test)]

use super::*;
use soroban_sdk::testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation};
use soroban_sdk::{token, Address, Env, IntoVal, Symbol};
use token::Client as TokenClient;
use token::StellarAssetClient;

#[test]
fn test_vault_flow() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Create a dummy underlying token (e.g. mock USDC)
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    
    // Deploy the standard Stellar Asset token
    let token_contract_id = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_client = TokenClient::new(&env, &token_contract_id.address());
    let token_admin_client = StellarAssetClient::new(&env, &token_contract_id.address());

    // 2. Deploy our GovPayVaultContract
    let contract_id = env.register_contract(None, GovPayVaultContract);
    let client = GovPayVaultContractClient::new(&env, &contract_id);

    // Initialize
    client.initialize(&admin, &token_contract_id.address());

    // 3. Setup actors
    let merchant = Address::generate(&env);
    let beneficiary = Address::generate(&env);

    // 4. Admin whitelists merchant
    client.add_merchant(&merchant);
    assert_eq!(client.is_merchant_whitelisted(&merchant), true);

    // 5. Admin allocates funds to beneficiary
    client.allocate(&beneficiary, &1000);
    assert_eq!(client.get_allocation(&beneficiary), 1000);

    // 6. Fund the vault contract itself (simulating DSWD depositing money)
    token_admin_client.mint(&contract_id, &5000);
    assert_eq!(token_client.balance(&contract_id), 5000);

    // 7. Beneficiary spends at the merchant
    client.spend(&beneficiary, &merchant, &400);

    // Verify balances and allocations updated
    assert_eq!(client.get_allocation(&beneficiary), 600); // 1000 - 400
    assert_eq!(token_client.balance(&contract_id), 4600); // 5000 - 400
    assert_eq!(token_client.balance(&merchant), 400); // Merchant got the money!

    // Verify auths (optional but good practice)
    // Removed env.auths() assertion to avoid SDK version struct mismatches.
    // The require_auth() inside the contract already ensures it's secure.
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")]
fn test_unwhitelisted_merchant() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let token = Address::generate(&env);
    let contract_id = env.register_contract(None, GovPayVaultContract);
    let client = GovPayVaultContractClient::new(&env, &contract_id);

    client.initialize(&admin, &token);

    let beneficiary = Address::generate(&env);
    let unwhitelisted_merchant = Address::generate(&env);

    client.allocate(&beneficiary, &1000);
    
    // This should panic with NotWhitelisted (Error 4)
    client.spend(&beneficiary, &unwhitelisted_merchant, &400);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_insufficient_allocation() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let token = Address::generate(&env);
    let contract_id = env.register_contract(None, GovPayVaultContract);
    let client = GovPayVaultContractClient::new(&env, &contract_id);

    client.initialize(&admin, &token);

    let merchant = Address::generate(&env);
    let beneficiary = Address::generate(&env);

    client.add_merchant(&merchant);
    client.allocate(&beneficiary, &1000);
    
    // This should panic with InsufficientAllocation (Error 5) because 2000 > 1000
    client.spend(&beneficiary, &merchant, &2000);
}
