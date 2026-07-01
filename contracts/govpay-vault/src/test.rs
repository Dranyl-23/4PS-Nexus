#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger}, Address, Env, Vec};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient;

fn setup_test() -> (Env, Address, Address, Address, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    // Setup Admin and Users
    let admin = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let merchant_food = Address::generate(&env);
    let merchant_edu = Address::generate(&env);

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

    (env, contract_id, admin, beneficiary, merchant_food, merchant_edu, token_addr)
}

#[test]
fn test_successful_spend() {
    let (env, contract_id, _admin, beneficiary, merchant_food, _merchant_edu, token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);
    let token = TokenClient::new(&env, &token_addr);

    // 1. Admin whitelists merchant as Food
    vault.add_merchant(&merchant_food, &Category::Food);
    assert_eq!(vault.get_merchant_category(&merchant_food), Some(Category::Food));

    // 2. Admin allocates 1,500 for Food to beneficiary
    vault.allocate(&beneficiary, &Category::Food, &1_500, &100_000);
    assert_eq!(vault.get_allocation(&beneficiary, &Category::Food), 1_500);

    // 3. Beneficiary spends 450 at the Food merchant
    vault.spend(&beneficiary, &merchant_food, &450);

    // Verify allocation decreased
    assert_eq!(vault.get_allocation(&beneficiary, &Category::Food), 1_050);

    // Verify merchant received the actual tokens
    assert_eq!(token.balance(&merchant_food), 450);
}

#[test]
fn test_allocate_batch() {
    let (env, contract_id, _admin, beneficiary, _merchant_food, _merchant_edu, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);
    
    let beneficiary2 = Address::generate(&env);
    
    let mut beneficiaries = Vec::new(&env);
    beneficiaries.push_back(beneficiary.clone());
    beneficiaries.push_back(beneficiary2.clone());
    
    vault.allocate_batch(&beneficiaries, &Category::Education, &2_000, &100_000);
    
    assert_eq!(vault.get_allocation(&beneficiary, &Category::Education), 2_000);
    assert_eq!(vault.get_allocation(&beneficiary2, &Category::Education), 2_000);
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")] // NotWhitelisted
fn test_spend_not_whitelisted() {
    let (env, contract_id, _admin, beneficiary, _merchant_food, _merchant_edu, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);

    let bad_merchant = Address::generate(&env);

    // Admin allocates funds
    vault.allocate(&beneficiary, &Category::Food, &1_500, &100_000);

    // Beneficiary tries to spend at a non-whitelisted merchant -> SHOULD FAIL
    vault.spend(&beneficiary, &bad_merchant, &450);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")] // InsufficientAllocation
fn test_spend_insufficient_allocation() {
    let (env, contract_id, _admin, beneficiary, merchant_food, _merchant_edu, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);

    // Admin whitelists merchant
    vault.add_merchant(&merchant_food, &Category::Food);

    // Admin allocates only 500
    vault.allocate(&beneficiary, &Category::Food, &500, &100_000);

    // Beneficiary tries to spend 600 -> SHOULD FAIL
    vault.spend(&beneficiary, &merchant_food, &600);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")] // InsufficientAllocation (Category Mismatch results in 0 allocation)
fn test_category_mismatch() {
    let (env, contract_id, _admin, beneficiary, _merchant_food, merchant_edu, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);

    // 1. Admin whitelists merchant as Education
    vault.add_merchant(&merchant_edu, &Category::Education);

    // 2. Admin allocates 1,500 for FOOD to beneficiary
    vault.allocate(&beneficiary, &Category::Food, &1_500, &100_000);

    // 3. Beneficiary tries to spend at the EDUCATION merchant
    // Since their Education allocation is 0, this should fail with InsufficientAllocation
    vault.spend(&beneficiary, &merchant_edu, &450);
}

#[test]
fn test_clawback() {
    let (env, contract_id, _admin, beneficiary, _merchant_food, _merchant_edu, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);

    vault.allocate(&beneficiary, &Category::Health, &2_000, &100_000);
    assert_eq!(vault.get_allocation(&beneficiary, &Category::Health), 2_000);

    // Admin claws back 500
    vault.clawback(&beneficiary, &Category::Health, &500);
    assert_eq!(vault.get_allocation(&beneficiary, &Category::Health), 1_500);

    // Admin tries to claw back more than the balance (e.g. 3000), should just reset to 0
    vault.clawback(&beneficiary, &Category::Health, &3_000);
    assert_eq!(vault.get_allocation(&beneficiary, &Category::Health), 0);
}

#[test]
#[should_panic(expected = "Error(Contract, #8)")] // AllocationExpired
fn test_spend_expired_allocation() {
    let (env, contract_id, _admin, beneficiary, merchant_food, _merchant_edu, _token_addr) = setup_test();
    let vault = GovPayVaultContractClient::new(&env, &contract_id);

    vault.add_merchant(&merchant_food, &Category::Food);

    // Allocate 1,500 that expires at timestamp 100
    vault.allocate(&beneficiary, &Category::Food, &1_500, &100);

    // Fast-forward time to 101
    env.ledger().with_mut(|li| {
        li.timestamp = 101;
    });

    // Beneficiary tries to spend -> SHOULD FAIL with AllocationExpired
    vault.spend(&beneficiary, &merchant_food, &450);
}
