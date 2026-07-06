import { Asset } from '@stellar/stellar-sdk';

export const ISSUER_PUBLIC_KEY = 'GCL5RVXDZO5UJFV3EP7S2LFFZ75A3LLQGPUCOQJPZZ6E6HBFYZE334W4';

export const FOOD_TOKEN = new Asset('FOOD', ISSUER_PUBLIC_KEY);
export const EDUC_TOKEN = new Asset('EDUC', ISSUER_PUBLIC_KEY);

// Default trust limits for tokens
export const DEFAULT_TRUST_LIMIT = '1000000';
