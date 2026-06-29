#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    NotAuthorized = 3,
    NotWhitelisted = 4,
    InsufficientAllocation = 5,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    Merchant(Address), // bool (true if whitelisted)
    Allocation(Address), // i128 (amount beneficiary can spend)
}

#[contract]
pub struct GovPayVaultContract;

#[contractimpl]
impl GovPayVaultContract {
    /// Initialize the vault with an admin and the underlying token (e.g. USDC).
    pub fn initialize(env: Env, admin: Address, token: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        Ok(())
    }

    /// Admin whitelists an accredited merchant.
    pub fn add_merchant(env: Env, merchant: Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Merchant(merchant), &true);
        Ok(())
    }

    /// Admin allocates funds to a beneficiary.
    pub fn allocate(env: Env, beneficiary: Address, amount: i128) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let current_allocation: i128 = env.storage().persistent().get(&DataKey::Allocation(beneficiary.clone())).unwrap_or(0);
        env.storage().persistent().set(&DataKey::Allocation(beneficiary), &(current_allocation + amount));
        Ok(())
    }

    /// Beneficiary spends their allocated funds at a whitelisted merchant.
    pub fn spend(env: Env, beneficiary: Address, merchant: Address, amount: i128) -> Result<(), Error> {
        beneficiary.require_auth();

        // Check if merchant is whitelisted
        let is_whitelisted: bool = env.storage().persistent().get(&DataKey::Merchant(merchant.clone())).unwrap_or(false);
        if !is_whitelisted {
            return Err(Error::NotWhitelisted);
        }

        // Check allocation
        let current_allocation: i128 = env.storage().persistent().get(&DataKey::Allocation(beneficiary.clone())).unwrap_or(0);
        if current_allocation < amount {
            return Err(Error::InsufficientAllocation);
        }

        // Deduct allocation
        env.storage().persistent().set(&DataKey::Allocation(beneficiary), &(current_allocation - amount));

        // Transfer tokens from this contract to the merchant
        let token: Address = env.storage().instance().get(&DataKey::Token).ok_or(Error::NotInitialized)?;
        let client = token::Client::new(&env, &token);
        
        // Note: The vault contract itself must have enough `token` balance to fulfill this.
        // DSWD must fund the contract address via normal Stellar transfer.
        client.transfer(&env.current_contract_address(), &merchant, &amount);

        Ok(())
    }

    // --- Read functions ---

    pub fn get_allocation(env: Env, beneficiary: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Allocation(beneficiary)).unwrap_or(0)
    }

    pub fn is_merchant_whitelisted(env: Env, merchant: Address) -> bool {
        env.storage().persistent().get(&DataKey::Merchant(merchant)).unwrap_or(false)
    }
}

mod test;
