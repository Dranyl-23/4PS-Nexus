#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, Env, Vec,
};

/// The `Error` enum defines the possible failure modes for the GovPay Vault contract.
/// These errors ensure strict compliance with government auditing standards.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    /// The vault has already been initialized with an admin and token.
    AlreadyInitialized = 1,
    /// The vault has not been initialized yet.
    NotInitialized = 2,
    /// The caller does not have the required authorization for this action.
    NotAuthorized = 3,
    /// The target merchant is not whitelisted by the DSWD for the required category.
    NotWhitelisted = 4,
    /// The beneficiary does not have enough allocated funds for this transaction.
    InsufficientAllocation = 5,
    /// The beneficiary's account has been frozen by the administrator.
    AccountFrozen = 6,
    /// The spending category does not match the merchant's authorized category.
    CategoryMismatch = 7,
    /// The allocated funds have expired and can no longer be spent.
    AllocationExpired = 8,
    /// The vault does not have enough physical tokens to back this allocation.
    InsufficientVaultLiquidity = 9,
}

/// The `Category` enum defines the specific disbursement categories aligned with 
/// the national 4Ps (Pantawid Pamilyang Pilipino Program) standards.
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Category {
    /// Groceries, rice, and nutritional subsidies.
    Food = 1,
    /// School supplies, uniforms, and educational grants.
    Education = 2,
    /// Medical supplies, medicines, and health checkup subsidies.
    Health = 3,
}

/// The `AllocationData` struct holds the state of a beneficiary's restricted funds.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AllocationData {
    /// The current available balance in stroops (1 XLM = 10^7 stroops).
    pub amount: i128,
    /// The ledger timestamp at which this allocation expires (prevents hoarding).
    pub expires_at: u64,
}

/// The `DataKey` enum defines the storage keys used in the Soroban environment.
#[contracttype]
pub enum DataKey {
    /// Stores the Admin Address (Instance Storage).
    Admin,
    /// Stores the underlying Token Address (Instance Storage).
    Token,
    /// Maps a Merchant Address to their authorized Category (Persistent Storage).
    Merchant(Address),
    /// Maps a Beneficiary Address and Category to their AllocationData (Persistent Storage).
    Allocation(Address, Category),
    /// Maps a Beneficiary Address to a boolean indicating if they are frozen (Persistent Storage).
    Frozen(Address),
    /// Tracks the total sum of all active allocations across all beneficiaries (Instance Storage).
    TotalAllocated,
}

/// The `GovPayVaultContract` acts as the secure national treasury proxy for 
/// the conditional cash transfer program (4Ps). It ensures that funds are only 
/// spent at accredited merchants, for specific categories, and within strict time limits.
#[contract]
pub struct GovPayVaultContract;

#[contractimpl]
impl GovPayVaultContract {
    /// Initializes the vault. This must be called exactly once during deployment.
    ///
    /// # Arguments
    /// * `env` - The Soroban environment.
    /// * `admin` - The address of the DSWD national treasury administrator.
    /// * `token` - The address of the underlying Stellar Asset Contract (e.g., USDC or XLM).
    pub fn initialize(env: Env, admin: Address, token: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        Ok(())
    }

    /// Administrator whitelists an accredited merchant for a specific program category.
    /// This ensures that funds allocated for "Health" cannot be spent at a "Food" merchant.
    pub fn add_merchant(env: Env, merchant: Address, category: Category) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Merchant(merchant.clone()), &category);
        env.events().publish((symbol_short!("merchant"), symbol_short!("add")), merchant);
        Ok(())
    }

    /// Administrator allocates funds to a beneficiary for a specific category.
    /// The funds come with an expiry timestamp to encourage immediate economic stimulation.
    pub fn allocate(env: Env, beneficiary: Address, category: Category, amount: i128, expires_at: u64) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        // Check if vault has enough liquidity
        let token: Address = env.storage().instance().get(&DataKey::Token).ok_or(Error::NotInitialized)?;
        let token_client = token::Client::new(&env, &token);
        let vault_balance = token_client.balance(&env.current_contract_address());
        
        let total_allocated: i128 = env.storage().instance().get(&DataKey::TotalAllocated).unwrap_or(0);
        let new_total = total_allocated + amount;
        
        if new_total > vault_balance {
            return Err(Error::InsufficientVaultLiquidity);
        }

        let mut alloc: AllocationData = env.storage().persistent().get(&DataKey::Allocation(beneficiary.clone(), category.clone())).unwrap_or(AllocationData { amount: 0, expires_at });
        alloc.amount += amount;
        alloc.expires_at = expires_at;
        
        env.storage().persistent().set(&DataKey::Allocation(beneficiary.clone(), category), &alloc);
        env.storage().instance().set(&DataKey::TotalAllocated, &new_total);
        
        env.events().publish((symbol_short!("allocate"), beneficiary), amount);
        Ok(())
    }

    /// Administrator allocates funds to multiple beneficiaries in a single batched transaction.
    /// This drastically reduces transaction fees and processing time for national distributions.
    pub fn allocate_batch(env: Env, beneficiaries: Vec<Address>, category: Category, amount: i128, expires_at: u64) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let total_batch_amount = amount * beneficiaries.len() as i128;
        
        let token: Address = env.storage().instance().get(&DataKey::Token).ok_or(Error::NotInitialized)?;
        let token_client = token::Client::new(&env, &token);
        let vault_balance = token_client.balance(&env.current_contract_address());
        
        let total_allocated: i128 = env.storage().instance().get(&DataKey::TotalAllocated).unwrap_or(0);
        let new_total = total_allocated + total_batch_amount;
        
        if new_total > vault_balance {
            return Err(Error::InsufficientVaultLiquidity);
        }

        for beneficiary in beneficiaries.iter() {
            let mut alloc: AllocationData = env.storage().persistent().get(&DataKey::Allocation(beneficiary.clone(), category.clone())).unwrap_or(AllocationData { amount: 0, expires_at });
            alloc.amount += amount;
            alloc.expires_at = expires_at;
            env.storage().persistent().set(&DataKey::Allocation(beneficiary.clone(), category.clone()), &alloc);
        }
        
        env.storage().instance().set(&DataKey::TotalAllocated, &new_total);
        
        env.events().publish((symbol_short!("alloc_bat"), amount), beneficiaries.len());
        Ok(())
    }

    /// Administrator freezes a beneficiary's account (e.g., due to compliance failure or fraud).
    pub fn freeze(env: Env, beneficiary: Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Frozen(beneficiary.clone()), &true);
        env.events().publish((symbol_short!("freeze"), beneficiary), true);
        Ok(())
    }

    /// Administrator unfreezes a beneficiary's account.
    pub fn unfreeze(env: Env, beneficiary: Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Frozen(beneficiary.clone()), &false);
        env.events().publish((symbol_short!("unfreeze"), beneficiary), false);
        Ok(())
    }

    /// Beneficiary spends their allocated funds at a whitelisted merchant.
    /// The smart contract enforces merchant accreditation, category matching, and expiration dates.
    pub fn spend(env: Env, beneficiary: Address, merchant: Address, amount: i128) -> Result<(), Error> {
        beneficiary.require_auth();

        // 1. Check if the beneficiary account is frozen
        let is_frozen: bool = env.storage().persistent().get(&DataKey::Frozen(beneficiary.clone())).unwrap_or(false);
        if is_frozen {
            return Err(Error::AccountFrozen);
        }

        // 2. Verify merchant is whitelisted and retrieve their authorized category
        let merchant_category: Category = env.storage().persistent().get(&DataKey::Merchant(merchant.clone())).ok_or(Error::NotWhitelisted)?;

        // 3. Retrieve beneficiary's allocation for that specific category
        let mut alloc: AllocationData = env.storage().persistent().get(&DataKey::Allocation(beneficiary.clone(), merchant_category.clone())).unwrap_or(AllocationData { amount: 0, expires_at: 0 });
        
        // 4. Verify allocation has not expired
        if env.ledger().timestamp() > alloc.expires_at {
            return Err(Error::AllocationExpired);
        }

        // 5. Verify sufficient funds
        if alloc.amount < amount {
            return Err(Error::InsufficientAllocation);
        }

        // 6. Deduct the spent amount from the internal ledger
        alloc.amount -= amount;
        env.storage().persistent().set(&DataKey::Allocation(beneficiary.clone(), merchant_category), &alloc);

        // Deduct from TotalAllocated
        let total_allocated: i128 = env.storage().instance().get(&DataKey::TotalAllocated).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalAllocated, &(total_allocated - amount));

        // 7. Execute the actual token transfer from the Vault to the Merchant
        let token: Address = env.storage().instance().get(&DataKey::Token).ok_or(Error::NotInitialized)?;
        let client = token::Client::new(&env, &token);
        
        // The vault contract must be pre-funded by DSWD. It transfers its own balance to the merchant.
        client.transfer(&env.current_contract_address(), &merchant, &amount);

        // Emit spending event for the transparency indexer
        env.events().publish((symbol_short!("spend"), beneficiary, merchant), amount);
        Ok(())
    }

    /// Administrator claws back unspent or expired funds from a beneficiary.
    /// This allows the government to recover funds that were not utilized.
    pub fn clawback(env: Env, beneficiary: Address, category: Category, amount: i128) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let mut alloc: AllocationData = env.storage().persistent().get(&DataKey::Allocation(beneficiary.clone(), category.clone())).unwrap_or(AllocationData { amount: 0, expires_at: 0 });
        let deduction = if amount > alloc.amount { alloc.amount } else { amount };
        
        alloc.amount -= deduction;
        env.storage().persistent().set(&DataKey::Allocation(beneficiary.clone(), category.clone()), &alloc);
        
        // Deduct from TotalAllocated
        let total_allocated: i128 = env.storage().instance().get(&DataKey::TotalAllocated).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalAllocated, &(total_allocated - deduction));
        
        env.events().publish((symbol_short!("clawback"), beneficiary, category as u32), deduction);
        Ok(())
    }

    // ==========================================
    // READ-ONLY FUNCTIONS (Queries)
    // ==========================================

    /// Queries the current valid allocation balance for a beneficiary in a specific category.
    /// Returns 0 if the allocation has expired.
    pub fn get_allocation(env: Env, beneficiary: Address, category: Category) -> i128 {
        let alloc: AllocationData = env.storage().persistent().get(&DataKey::Allocation(beneficiary, category)).unwrap_or(AllocationData { amount: 0, expires_at: 0 });
        
        if env.ledger().timestamp() > alloc.expires_at {
            0
        } else {
            alloc.amount
        }
    }

    /// Queries the authorized category of a whitelisted merchant.
    /// Returns None if the merchant is not whitelisted.
    pub fn get_merchant_category(env: Env, merchant: Address) -> Option<Category> {
        env.storage().persistent().get(&DataKey::Merchant(merchant))
    }

    /// Queries whether a beneficiary's account is currently frozen.
    pub fn is_frozen(env: Env, beneficiary: Address) -> bool {
        env.storage().persistent().get(&DataKey::Frozen(beneficiary)).unwrap_or(false)
    }
}

mod test;
