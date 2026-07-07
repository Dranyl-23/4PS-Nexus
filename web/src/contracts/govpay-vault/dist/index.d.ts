import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions, Result } from "@stellar/stellar-sdk/contract";
import type { u64, i128, Option } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CCDNSPFHTYJFVGUTCYXOCYNOKQUM5ROOWJCV7VWAN7UCSXTMTCRT6SFA";
    };
};
/**
 * The `Error` enum defines the possible failure modes for the GovPay Vault contract.
 * These errors ensure strict compliance with government auditing standards.
 */
export declare const Errors: {
    /**
     * The vault has already been initialized with an admin and token.
     */
    1: {
        message: string;
    };
    /**
     * The vault has not been initialized yet.
     */
    2: {
        message: string;
    };
    /**
     * The caller does not have the required authorization for this action.
     */
    3: {
        message: string;
    };
    /**
     * The target merchant is not whitelisted by the DSWD for the required category.
     */
    4: {
        message: string;
    };
    /**
     * The beneficiary does not have enough allocated funds for this transaction.
     */
    5: {
        message: string;
    };
    /**
     * The beneficiary's account has been frozen by the administrator.
     */
    6: {
        message: string;
    };
    /**
     * The spending category does not match the merchant's authorized category.
     */
    7: {
        message: string;
    };
    /**
     * The allocated funds have expired and can no longer be spent.
     */
    8: {
        message: string;
    };
};
/**
 * The `DataKey` enum defines the storage keys used in the Soroban environment.
 */
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "Token";
    values: void;
} | {
    tag: "Merchant";
    values: readonly [string];
} | {
    tag: "Allocation";
    values: readonly [string, Category];
} | {
    tag: "Frozen";
    values: readonly [string];
};
/**
 * The `Category` enum defines the specific disbursement categories aligned with
 * the national 4Ps (Pantawid Pamilyang Pilipino Program) standards.
 */
export declare enum Category {
    Food = 1,
    Education = 2,
    Health = 3
}
/**
 * The `AllocationData` struct holds the state of a beneficiary's restricted funds.
 */
export interface AllocationData {
    /**
   * The current available balance in stroops (1 XLM = 10^7 stroops).
   */
    amount: i128;
    /**
   * The ledger timestamp at which this allocation expires (prevents hoarding).
   */
    expires_at: u64;
}
export interface Client {
    /**
     * Construct and simulate a spend transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Beneficiary spends their allocated funds at a whitelisted merchant.
     * The smart contract enforces merchant accreditation, category matching, and expiration dates.
     */
    spend: ({ beneficiary, merchant, amount }: {
        beneficiary: string;
        merchant: string;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a freeze transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Administrator freezes a beneficiary's account (e.g., due to compliance failure or fraud).
     */
    freeze: ({ beneficiary }: {
        beneficiary: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a allocate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Administrator allocates funds to a beneficiary for a specific category.
     * The funds come with an expiry timestamp to encourage immediate economic stimulation.
     */
    allocate: ({ beneficiary, category, amount, expires_at }: {
        beneficiary: string;
        category: Category;
        amount: i128;
        expires_at: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a clawback transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Administrator claws back unspent or expired funds from a beneficiary.
     * This allows the government to recover funds that were not utilized.
     */
    clawback: ({ beneficiary, category, amount }: {
        beneficiary: string;
        category: Category;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a unfreeze transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Administrator unfreezes a beneficiary's account.
     */
    unfreeze: ({ beneficiary }: {
        beneficiary: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a is_frozen transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Queries whether a beneficiary's account is currently frozen.
     */
    is_frozen: ({ beneficiary }: {
        beneficiary: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Initializes the vault. This must be called exactly once during deployment.
     *
     * # Arguments
     * * `env` - The Soroban environment.
     * * `admin` - The address of the DSWD national treasury administrator.
     * * `token` - The address of the underlying Stellar Asset Contract (e.g., USDC or XLM).
     */
    initialize: ({ admin, token }: {
        admin: string;
        token: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a add_merchant transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Administrator whitelists an accredited merchant for a specific program category.
     * This ensures that funds allocated for "Health" cannot be spent at a "Food" merchant.
     */
    add_merchant: ({ merchant, category }: {
        merchant: string;
        category: Category;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a allocate_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Administrator allocates funds to multiple beneficiaries in a single batched transaction.
     * This drastically reduces transaction fees and processing time for national distributions.
     */
    allocate_batch: ({ beneficiaries, category, amount, expires_at }: {
        beneficiaries: Array<string>;
        category: Category;
        amount: i128;
        expires_at: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a get_allocation transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Queries the current valid allocation balance for a beneficiary in a specific category.
     * Returns 0 if the allocation has expired.
     */
    get_allocation: ({ beneficiary, category }: {
        beneficiary: string;
        category: Category;
    }, options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a get_merchant_category transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Queries the authorized category of a whitelisted merchant.
     * Returns None if the merchant is not whitelisted.
     */
    get_merchant_category: ({ merchant }: {
        merchant: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Option<Category>>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        spend: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        freeze: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        allocate: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        clawback: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        unfreeze: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        is_frozen: (json: string) => AssembledTransaction<boolean>;
        initialize: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        add_merchant: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        allocate_batch: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        get_allocation: (json: string) => AssembledTransaction<bigint>;
        get_merchant_category: (json: string) => AssembledTransaction<Option<Category>>;
    };
}
