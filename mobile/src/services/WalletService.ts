import * as SecureStore from 'expo-secure-store';
import { Keypair } from '@stellar/stellar-sdk';
import { api } from './api';
import * as LocalAuthentication from 'expo-local-authentication';

const SECRET_KEY_STORAGE_KEY = 'nexus_user_secret_key';
const PUBLIC_KEY_STORAGE_KEY = 'nexus_user_public_key';

export const WalletService = {
  async getOrGenerateWallet(): Promise<string> {
    try {
      let publicKey = await SecureStore.getItemAsync(PUBLIC_KEY_STORAGE_KEY);
      
      if (!publicKey) {
        console.log('No wallet found. Generating new Stellar Keypair...');
        const keypair = Keypair.random();
        const secret = keypair.secret();
        publicKey = keypair.publicKey();

        // Save securely
        await SecureStore.setItemAsync(SECRET_KEY_STORAGE_KEY, secret);
        await SecureStore.setItemAsync(PUBLIC_KEY_STORAGE_KEY, publicKey);
        console.log('Wallet generated and saved securely.');

        // Fund with Friendbot so the account exists on the ledger and has XLM
        try {
          console.log('Funding wallet with Friendbot...');
          await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
          console.log('Successfully funded by Friendbot!');
          
          // Wait a moment for network to register the account
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Establish trustlines for FOOD and EDUC tokens
          console.log('Establishing Trustlines for Purpose-Bound Tokens...');
          const trustRes = await api.post('/transactions/trustline', {
            beneficiary: publicKey,
            secretKey: secret,
          });
          if (trustRes.data.success) {
            console.log('Trustlines established successfully!');
          } else {
            console.error('Failed to establish trustlines:', trustRes.data.error);
          }
        } catch (e) {
          console.error('Friendbot funding or Trustline creation failed:', e);
        }
      } else {
        console.log('Existing wallet found:', publicKey);
      }

      return publicKey;
    } catch (error) {
      console.error('Error generating/retrieving wallet:', error);
      throw error;
    }
  },

  async getPublicKey(): Promise<string | null> {
    return await SecureStore.getItemAsync(PUBLIC_KEY_STORAGE_KEY);
  },

  async getSecretKey(): Promise<string | null> {
    return await SecureStore.getItemAsync(SECRET_KEY_STORAGE_KEY);
  },

  async clearWallet(): Promise<void> {
    await SecureStore.deleteItemAsync(PUBLIC_KEY_STORAGE_KEY);
    await SecureStore.deleteItemAsync(SECRET_KEY_STORAGE_KEY);
    console.log('Wallet data cleared from SecureStore.');
  },

  /**
   * Biometric Authentication (Account Abstraction Passkey simulation)
   */
  async authenticateWithPasskey(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      console.warn('Biometrics not available. Proceeding without Passkey.');
      return true; // Fallback for simulators without FaceID
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Passkey to sign transaction',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });

    return result.success;
  },

  /**
   * Send payment via Next.js Backend which will handle the Stellar SDK
   */
  async sendPayment(merchantId: string, amount: string, assetCode?: string): Promise<void> {
    const publicKey = await this.getPublicKey();
    const secretKey = await this.getSecretKey();
    if (!publicKey || !secretKey) throw new Error('Wallet not found');

    const isAuthenticated = await this.authenticateWithPasskey();
    if (!isAuthenticated) {
      throw new Error('Passkey authentication failed. Transaction cancelled.');
    }

    try {
      // For the hackathon, we send the secret key securely over HTTPS to our Next.js backend.
      // The backend (Node.js) will handle the Stellar SDK transaction building and submitting
      // to avoid React Native polyfill errors with the stellar-sdk package.
      const response = await api.post('/transactions/stellar', {
        beneficiary: publicKey,
        secretKey: secretKey,
        amount: amount,
        merchantName: merchantId,
        merchantCategory: 'QR Payment',
        type: 'spend',
        assetCode: assetCode || 'native', // Defaults to native XLM if no assetCode is specified
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to process transaction');
      }

    } catch (error: any) {
      console.error('API Payment Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Blockchain transaction failed. Please check your balance.');
    }
  },

  /**
   * Generate an offline transaction payload (QR Code content)
   */
  async generateOfflineTransaction(merchantId: string, amount: string, assetCode?: string): Promise<string> {
    const publicKey = await this.getPublicKey();
    const secretKey = await this.getSecretKey();
    if (!publicKey || !secretKey) throw new Error('Wallet not found');

    const isAuthenticated = await this.authenticateWithPasskey();
    if (!isAuthenticated) {
      throw new Error('Passkey authentication failed. Transaction cancelled.');
    }

    const { Buffer } = require('buffer');

    // For Hackathon Demo: We encode the transaction intent AND the secret key into a Base64 string.
    // In a production environment, this would be a signed XDR without the secret key, using Fee Bump or a cached sequence number.
    const intent = {
      b: publicKey,
      s: secretKey,
      m: merchantId,
      a: amount,
      c: assetCode || 'native',
      t: Date.now()
    };
    
    return Buffer.from(JSON.stringify(intent)).toString('base64');
  }
};
