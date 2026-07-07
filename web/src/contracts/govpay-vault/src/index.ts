import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCDNSPFHTYJFVGUTCYXOCYNOKQUM5ROOWJCV7VWAN7UCSXTMTCRT6SFA",
  }
} as const

/**
 * The `Error` enum defines the possible failure modes for the GovPay Vault contract.
 * These errors ensure strict compliance with government auditing standards.
 */
export const Errors = {
  /**
   * The vault has already been initialized with an admin and token.
   */
  1: {message:"AlreadyInitialized"},
  /**
   * The vault has not been initialized yet.
   */
  2: {message:"NotInitialized"},
  /**
   * The caller does not have the required authorization for this action.
   */
  3: {message:"NotAuthorized"},
  /**
   * The target merchant is not whitelisted by the DSWD for the required category.
   */
  4: {message:"NotWhitelisted"},
  /**
   * The beneficiary does not have enough allocated funds for this transaction.
   */
  5: {message:"InsufficientAllocation"},
  /**
   * The beneficiary's account has been frozen by the administrator.
   */
  6: {message:"AccountFrozen"},
  /**
   * The spending category does not match the merchant's authorized category.
   */
  7: {message:"CategoryMismatch"},
  /**
   * The allocated funds have expired and can no longer be spent.
   */
  8: {message:"AllocationExpired"}
}

/**
 * The `DataKey` enum defines the storage keys used in the Soroban environment.
 */
export type DataKey = {tag: "Admin", values: void} | {tag: "Token", values: void} | {tag: "Merchant", values: readonly [string]} | {tag: "Allocation", values: readonly [string, Category]} | {tag: "Frozen", values: readonly [string]};

/**
 * The `Category` enum defines the specific disbursement categories aligned with
 * the national 4Ps (Pantawid Pamilyang Pilipino Program) standards.
 */
export enum Category {
  Food = 1,
  Education = 2,
  Health = 3,
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
  spend: ({beneficiary, merchant, amount}: {beneficiary: string, merchant: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a freeze transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Administrator freezes a beneficiary's account (e.g., due to compliance failure or fraud).
   */
  freeze: ({beneficiary}: {beneficiary: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a allocate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Administrator allocates funds to a beneficiary for a specific category.
   * The funds come with an expiry timestamp to encourage immediate economic stimulation.
   */
  allocate: ({beneficiary, category, amount, expires_at}: {beneficiary: string, category: Category, amount: i128, expires_at: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a clawback transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Administrator claws back unspent or expired funds from a beneficiary.
   * This allows the government to recover funds that were not utilized.
   */
  clawback: ({beneficiary, category, amount}: {beneficiary: string, category: Category, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a unfreeze transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Administrator unfreezes a beneficiary's account.
   */
  unfreeze: ({beneficiary}: {beneficiary: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a is_frozen transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Queries whether a beneficiary's account is currently frozen.
   */
  is_frozen: ({beneficiary}: {beneficiary: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initializes the vault. This must be called exactly once during deployment.
   * 
   * # Arguments
   * * `env` - The Soroban environment.
   * * `admin` - The address of the DSWD national treasury administrator.
   * * `token` - The address of the underlying Stellar Asset Contract (e.g., USDC or XLM).
   */
  initialize: ({admin, token}: {admin: string, token: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a add_merchant transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Administrator whitelists an accredited merchant for a specific program category.
   * This ensures that funds allocated for "Health" cannot be spent at a "Food" merchant.
   */
  add_merchant: ({merchant, category}: {merchant: string, category: Category}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a allocate_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Administrator allocates funds to multiple beneficiaries in a single batched transaction.
   * This drastically reduces transaction fees and processing time for national distributions.
   */
  allocate_batch: ({beneficiaries, category, amount, expires_at}: {beneficiaries: Array<string>, category: Category, amount: i128, expires_at: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_allocation transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Queries the current valid allocation balance for a beneficiary in a specific category.
   * Returns 0 if the allocation has expired.
   */
  get_allocation: ({beneficiary, category}: {beneficiary: string, category: Category}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_merchant_category transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Queries the authorized category of a whitelisted merchant.
   * Returns None if the merchant is not whitelisted.
   */
  get_merchant_category: ({merchant}: {merchant: string}, options?: MethodOptions) => Promise<AssembledTransaction<Option<Category>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAKBCZW5lZmljaWFyeSBzcGVuZHMgdGhlaXIgYWxsb2NhdGVkIGZ1bmRzIGF0IGEgd2hpdGVsaXN0ZWQgbWVyY2hhbnQuClRoZSBzbWFydCBjb250cmFjdCBlbmZvcmNlcyBtZXJjaGFudCBhY2NyZWRpdGF0aW9uLCBjYXRlZ29yeSBtYXRjaGluZywgYW5kIGV4cGlyYXRpb24gZGF0ZXMuAAAABXNwZW5kAAAAAAAAAwAAAAAAAAALYmVuZWZpY2lhcnkAAAAAEwAAAAAAAAAIbWVyY2hhbnQAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAFlBZG1pbmlzdHJhdG9yIGZyZWV6ZXMgYSBiZW5lZmljaWFyeSdzIGFjY291bnQgKGUuZy4sIGR1ZSB0byBjb21wbGlhbmNlIGZhaWx1cmUgb3IgZnJhdWQpLgAAAAAAAAZmcmVlemUAAAAAAAEAAAAAAAAAC2JlbmVmaWNpYXJ5AAAAABMAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAABAAAAJxUaGUgYEVycm9yYCBlbnVtIGRlZmluZXMgdGhlIHBvc3NpYmxlIGZhaWx1cmUgbW9kZXMgZm9yIHRoZSBHb3ZQYXkgVmF1bHQgY29udHJhY3QuClRoZXNlIGVycm9ycyBlbnN1cmUgc3RyaWN0IGNvbXBsaWFuY2Ugd2l0aCBnb3Zlcm5tZW50IGF1ZGl0aW5nIHN0YW5kYXJkcy4AAAAAAAAABUVycm9yAAAAAAAACAAAAD9UaGUgdmF1bHQgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZCB3aXRoIGFuIGFkbWluIGFuZCB0b2tlbi4AAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAACdUaGUgdmF1bHQgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldC4AAAAADk5vdEluaXRpYWxpemVkAAAAAAACAAAARFRoZSBjYWxsZXIgZG9lcyBub3QgaGF2ZSB0aGUgcmVxdWlyZWQgYXV0aG9yaXphdGlvbiBmb3IgdGhpcyBhY3Rpb24uAAAADU5vdEF1dGhvcml6ZWQAAAAAAAADAAAATVRoZSB0YXJnZXQgbWVyY2hhbnQgaXMgbm90IHdoaXRlbGlzdGVkIGJ5IHRoZSBEU1dEIGZvciB0aGUgcmVxdWlyZWQgY2F0ZWdvcnkuAAAAAAAADk5vdFdoaXRlbGlzdGVkAAAAAAAEAAAASlRoZSBiZW5lZmljaWFyeSBkb2VzIG5vdCBoYXZlIGVub3VnaCBhbGxvY2F0ZWQgZnVuZHMgZm9yIHRoaXMgdHJhbnNhY3Rpb24uAAAAAAAWSW5zdWZmaWNpZW50QWxsb2NhdGlvbgAAAAAABQAAAD9UaGUgYmVuZWZpY2lhcnkncyBhY2NvdW50IGhhcyBiZWVuIGZyb3plbiBieSB0aGUgYWRtaW5pc3RyYXRvci4AAAAADUFjY291bnRGcm96ZW4AAAAAAAAGAAAASFRoZSBzcGVuZGluZyBjYXRlZ29yeSBkb2VzIG5vdCBtYXRjaCB0aGUgbWVyY2hhbnQncyBhdXRob3JpemVkIGNhdGVnb3J5LgAAABBDYXRlZ29yeU1pc21hdGNoAAAABwAAADxUaGUgYWxsb2NhdGVkIGZ1bmRzIGhhdmUgZXhwaXJlZCBhbmQgY2FuIG5vIGxvbmdlciBiZSBzcGVudC4AAAARQWxsb2NhdGlvbkV4cGlyZWQAAAAAAAAI",
        "AAAAAAAAAJxBZG1pbmlzdHJhdG9yIGFsbG9jYXRlcyBmdW5kcyB0byBhIGJlbmVmaWNpYXJ5IGZvciBhIHNwZWNpZmljIGNhdGVnb3J5LgpUaGUgZnVuZHMgY29tZSB3aXRoIGFuIGV4cGlyeSB0aW1lc3RhbXAgdG8gZW5jb3VyYWdlIGltbWVkaWF0ZSBlY29ub21pYyBzdGltdWxhdGlvbi4AAAAIYWxsb2NhdGUAAAAEAAAAAAAAAAtiZW5lZmljaWFyeQAAAAATAAAAAAAAAAhjYXRlZ29yeQAAB9AAAAAIQ2F0ZWdvcnkAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAKZXhwaXJlc19hdAAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAIlBZG1pbmlzdHJhdG9yIGNsYXdzIGJhY2sgdW5zcGVudCBvciBleHBpcmVkIGZ1bmRzIGZyb20gYSBiZW5lZmljaWFyeS4KVGhpcyBhbGxvd3MgdGhlIGdvdmVybm1lbnQgdG8gcmVjb3ZlciBmdW5kcyB0aGF0IHdlcmUgbm90IHV0aWxpemVkLgAAAAAAAAhjbGF3YmFjawAAAAMAAAAAAAAAC2JlbmVmaWNpYXJ5AAAAABMAAAAAAAAACGNhdGVnb3J5AAAH0AAAAAhDYXRlZ29yeQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAADBBZG1pbmlzdHJhdG9yIHVuZnJlZXplcyBhIGJlbmVmaWNpYXJ5J3MgYWNjb3VudC4AAAAIdW5mcmVlemUAAAABAAAAAAAAAAtiZW5lZmljaWFyeQAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAADxRdWVyaWVzIHdoZXRoZXIgYSBiZW5lZmljaWFyeSdzIGFjY291bnQgaXMgY3VycmVudGx5IGZyb3plbi4AAAAJaXNfZnJvemVuAAAAAAAAAQAAAAAAAAALYmVuZWZpY2lhcnkAAAAAEwAAAAEAAAAB",
        "AAAAAgAAAExUaGUgYERhdGFLZXlgIGVudW0gZGVmaW5lcyB0aGUgc3RvcmFnZSBrZXlzIHVzZWQgaW4gdGhlIFNvcm9iYW4gZW52aXJvbm1lbnQuAAAAAAAAAAdEYXRhS2V5AAAAAAUAAAAAAAAALFN0b3JlcyB0aGUgQWRtaW4gQWRkcmVzcyAoSW5zdGFuY2UgU3RvcmFnZSkuAAAABUFkbWluAAAAAAAAAAAAADdTdG9yZXMgdGhlIHVuZGVybHlpbmcgVG9rZW4gQWRkcmVzcyAoSW5zdGFuY2UgU3RvcmFnZSkuAAAAAAVUb2tlbgAAAAAAAAEAAABKTWFwcyBhIE1lcmNoYW50IEFkZHJlc3MgdG8gdGhlaXIgYXV0aG9yaXplZCBDYXRlZ29yeSAoUGVyc2lzdGVudCBTdG9yYWdlKS4AAAAAAAhNZXJjaGFudAAAAAEAAAATAAAAAQAAAFVNYXBzIGEgQmVuZWZpY2lhcnkgQWRkcmVzcyBhbmQgQ2F0ZWdvcnkgdG8gdGhlaXIgQWxsb2NhdGlvbkRhdGEgKFBlcnNpc3RlbnQgU3RvcmFnZSkuAAAAAAAACkFsbG9jYXRpb24AAAAAAAIAAAATAAAH0AAAAAhDYXRlZ29yeQAAAAEAAABbTWFwcyBhIEJlbmVmaWNpYXJ5IEFkZHJlc3MgdG8gYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhleSBhcmUgZnJvemVuIChQZXJzaXN0ZW50IFN0b3JhZ2UpLgAAAAAGRnJvemVuAAAAAAABAAAAEw==",
        "AAAAAAAAARVJbml0aWFsaXplcyB0aGUgdmF1bHQuIFRoaXMgbXVzdCBiZSBjYWxsZWQgZXhhY3RseSBvbmNlIGR1cmluZyBkZXBsb3ltZW50LgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBTb3JvYmFuIGVudmlyb25tZW50LgoqIGBhZG1pbmAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgRFNXRCBuYXRpb25hbCB0cmVhc3VyeSBhZG1pbmlzdHJhdG9yLgoqIGB0b2tlbmAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgdW5kZXJseWluZyBTdGVsbGFyIEFzc2V0IENvbnRyYWN0IChlLmcuLCBVU0RDIG9yIFhMTSkuAAAAAAAACmluaXRpYWxpemUAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAwAAAI9UaGUgYENhdGVnb3J5YCBlbnVtIGRlZmluZXMgdGhlIHNwZWNpZmljIGRpc2J1cnNlbWVudCBjYXRlZ29yaWVzIGFsaWduZWQgd2l0aAp0aGUgbmF0aW9uYWwgNFBzIChQYW50YXdpZCBQYW1pbHlhbmcgUGlsaXBpbm8gUHJvZ3JhbSkgc3RhbmRhcmRzLgAAAAAAAAAACENhdGVnb3J5AAAAAwAAACtHcm9jZXJpZXMsIHJpY2UsIGFuZCBudXRyaXRpb25hbCBzdWJzaWRpZXMuAAAAAARGb29kAAAAAQAAADJTY2hvb2wgc3VwcGxpZXMsIHVuaWZvcm1zLCBhbmQgZWR1Y2F0aW9uYWwgZ3JhbnRzLgAAAAAACUVkdWNhdGlvbgAAAAAAAAIAAAA6TWVkaWNhbCBzdXBwbGllcywgbWVkaWNpbmVzLCBhbmQgaGVhbHRoIGNoZWNrdXAgc3Vic2lkaWVzLgAAAAAABkhlYWx0aAAAAAAAAw==",
        "AAAAAAAAAKVBZG1pbmlzdHJhdG9yIHdoaXRlbGlzdHMgYW4gYWNjcmVkaXRlZCBtZXJjaGFudCBmb3IgYSBzcGVjaWZpYyBwcm9ncmFtIGNhdGVnb3J5LgpUaGlzIGVuc3VyZXMgdGhhdCBmdW5kcyBhbGxvY2F0ZWQgZm9yICJIZWFsdGgiIGNhbm5vdCBiZSBzcGVudCBhdCBhICJGb29kIiBtZXJjaGFudC4AAAAAAAAMYWRkX21lcmNoYW50AAAAAgAAAAAAAAAIbWVyY2hhbnQAAAATAAAAAAAAAAhjYXRlZ29yeQAAB9AAAAAIQ2F0ZWdvcnkAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAALJBZG1pbmlzdHJhdG9yIGFsbG9jYXRlcyBmdW5kcyB0byBtdWx0aXBsZSBiZW5lZmljaWFyaWVzIGluIGEgc2luZ2xlIGJhdGNoZWQgdHJhbnNhY3Rpb24uClRoaXMgZHJhc3RpY2FsbHkgcmVkdWNlcyB0cmFuc2FjdGlvbiBmZWVzIGFuZCBwcm9jZXNzaW5nIHRpbWUgZm9yIG5hdGlvbmFsIGRpc3RyaWJ1dGlvbnMuAAAAAAAOYWxsb2NhdGVfYmF0Y2gAAAAAAAQAAAAAAAAADWJlbmVmaWNpYXJpZXMAAAAAAAPqAAAAEwAAAAAAAAAIY2F0ZWdvcnkAAAfQAAAACENhdGVnb3J5AAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACmV4cGlyZXNfYXQAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAH9RdWVyaWVzIHRoZSBjdXJyZW50IHZhbGlkIGFsbG9jYXRpb24gYmFsYW5jZSBmb3IgYSBiZW5lZmljaWFyeSBpbiBhIHNwZWNpZmljIGNhdGVnb3J5LgpSZXR1cm5zIDAgaWYgdGhlIGFsbG9jYXRpb24gaGFzIGV4cGlyZWQuAAAAAA5nZXRfYWxsb2NhdGlvbgAAAAAAAgAAAAAAAAALYmVuZWZpY2lhcnkAAAAAEwAAAAAAAAAIY2F0ZWdvcnkAAAfQAAAACENhdGVnb3J5AAAAAQAAAAs=",
        "AAAAAQAAAFBUaGUgYEFsbG9jYXRpb25EYXRhYCBzdHJ1Y3QgaG9sZHMgdGhlIHN0YXRlIG9mIGEgYmVuZWZpY2lhcnkncyByZXN0cmljdGVkIGZ1bmRzLgAAAAAAAAAOQWxsb2NhdGlvbkRhdGEAAAAAAAIAAABAVGhlIGN1cnJlbnQgYXZhaWxhYmxlIGJhbGFuY2UgaW4gc3Ryb29wcyAoMSBYTE0gPSAxMF43IHN0cm9vcHMpLgAAAAZhbW91bnQAAAAAAAsAAABKVGhlIGxlZGdlciB0aW1lc3RhbXAgYXQgd2hpY2ggdGhpcyBhbGxvY2F0aW9uIGV4cGlyZXMgKHByZXZlbnRzIGhvYXJkaW5nKS4AAAAAAApleHBpcmVzX2F0AAAAAAAG",
        "AAAAAAAAAGtRdWVyaWVzIHRoZSBhdXRob3JpemVkIGNhdGVnb3J5IG9mIGEgd2hpdGVsaXN0ZWQgbWVyY2hhbnQuClJldHVybnMgTm9uZSBpZiB0aGUgbWVyY2hhbnQgaXMgbm90IHdoaXRlbGlzdGVkLgAAAAAVZ2V0X21lcmNoYW50X2NhdGVnb3J5AAAAAAAAAQAAAAAAAAAIbWVyY2hhbnQAAAATAAAAAQAAA+gAAAfQAAAACENhdGVnb3J5" ]),
      options
    )
  }
  public readonly fromJSON = {
    spend: this.txFromJSON<Result<void>>,
        freeze: this.txFromJSON<Result<void>>,
        allocate: this.txFromJSON<Result<void>>,
        clawback: this.txFromJSON<Result<void>>,
        unfreeze: this.txFromJSON<Result<void>>,
        is_frozen: this.txFromJSON<boolean>,
        initialize: this.txFromJSON<Result<void>>,
        add_merchant: this.txFromJSON<Result<void>>,
        allocate_batch: this.txFromJSON<Result<void>>,
        get_allocation: this.txFromJSON<i128>,
        get_merchant_category: this.txFromJSON<Option<Category>>
  }
}