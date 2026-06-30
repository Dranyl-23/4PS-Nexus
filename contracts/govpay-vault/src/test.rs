#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, Vec};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient;

fn setup_test() -> (Env, Address, Address, Address, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    // Setup Admin and Users
    let admin = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let merchant = Address::generate(&env);
    let bad_merchant = Address::generate(&env);

    // Setup Token (e.g. USDC)
    let token_admin = Address::generate(&env);
    let token_addr = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    let token_admin_client = StellarAssetClient::new(&env, &token_addr);

    // Setup Vault Contract
    let contract_id = env.register(GovPayVaultContract, ());
    let vault = GovPayVaultContractClient::new(&env, &contract_id);

    // Initialize Vault
    vault.initialize(&admin, &token_addr);

    // Mint tokens to the vault so it has funds to distribute
    token_admin_client.mint(&contract_id, &10_000);

    (env, contract_id, admin, beneficiary, merchant, bad_merchant, token_addr)
}

#[test]
fn test_successful_spend() {
    let (env, contract_id, _admin, beneficiary, merchant, _bad_merchant, token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);
    let token = TokenClient::new(&env, &token_addr);

    // 1. Admin whitelists merchant
    vault.add_merchant(&merchant);
    assert_eq!(vault.is_merchant_whitelisted(&merchant), true);

    // 2. Admin allocates 1,500 to beneficiary
    vault.allocate(&beneficiary, &1_500);
    assert_eq!(vault.get_allocation(&beneficiary), 1_500);

    // 3. Beneficiary spends 450 at the merchant
    vault.spend(&beneficiary, &merchant, &450);

    // Verify allocation decreased
    assert_eq!(vault.get_allocation(&beneficiary), 1_050);

    // Verify merchant received the actual tokens
    assert_eq!(token.balance(&merchant), 450);
}

#[test]
fn test_allocate_batch() {
    let (env, contract_id, _admin, beneficiary, _merchant, _bad_merchant, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);
    
    let beneficiary2 = Address::generate(&env);
    
    let mut beneficiaries = Vec::new(&env);
    beneficiaries.push_back(beneficiary.clone());
    beneficiaries.push_back(beneficiary2.clone());
    
    vault.allocate_batch(&beneficiaries, &2_000);
    
    assert_eq!(vault.get_allocation(&beneficiary), 2_000);
    assert_eq!(vault.get_allocation(&beneficiary2), 2_000);
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")] // NotWhitelisted
fn test_spend_not_whitelisted() {
    let (env, contract_id, _admin, beneficiary, _merchant, bad_merchant, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);

    // Admin allocates funds
    vault.allocate(&beneficiary, &1_500);

    // Beneficiary tries to spend at a non-whitelisted merchant -> SHOULD FAIL
    vault.spend(&beneficiary, &bad_merchant, &450);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")] // InsufficientAllocation
fn test_spend_insufficient_allocation() {
    let (env, contract_id, _admin, beneficiary, merchant, _bad_merchant, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);

    // Admin whitelists merchant
    vault.add_merchant(&merchant);

    // Admin allocates only 500
    vault.allocate(&beneficiary, &500);

    // Beneficiary tries to spend 600 -> SHOULD FAIL
    vault.spend(&beneficiary, &merchant, &600);
}
