import axios from 'axios';

// Replace with your computer's local IP address (e.g., '192.168.1.5')
// Automatically using the IP address from Expo Metro
export const BASE_URL = 'https://4-ps-nexus.vercel.app/api'; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const BeneficiaryService = {
  getProfile: async (publicKey: string) => {
    try {
      const response = await api.get(`/beneficiary/profile?wallet=${publicKey}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // Null means not registered
      }
      console.error('Error fetching beneficiary profile:', error);
      throw error;
    }
  },

  registerProfile: async (wallet: string, fullName: string, address: string, dswdId?: string) => {
    try {
      const response = await api.post('/beneficiary/register', { wallet, fullName, address, dswdId });
      return response.data;
    } catch (error) {
      console.error('Error registering beneficiary:', error);
      throw error;
    }
  },

  getMerchants: async () => {
    try {
      const response = await api.get('/merchants');
      // Filter only whitelisted merchants
      return response.data.filter((m: any) => m.isWhitelisted);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      throw error;
    }
  },
  
  getMerchantProfile: async (wallet: string) => {
    try {
      const response = await api.get(`/merchants?wallet=${wallet}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error('Error fetching merchant profile:', error);
      return null;
    }
  },
  
  getTransactions: async (publicKey: string) => {
    try {
      const response = await api.get(`/beneficiary/transactions?wallet=${publicKey}`);
      // The Next.js API returns the array directly, so response.data IS the array.
      return Array.isArray(response.data) ? response.data : (response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  getCreditScore: async (wallet: string) => {
    try {
      const response = await api.get(`/beneficiary/credit-score?wallet=${wallet}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get credit score', error);
      throw error;
    }
  },

  requestLoan: async (wallet: string, amount: string) => {
    try {
      const response = await api.post('/beneficiary/loan', { wallet, amount });
      return response.data;
    } catch (error: any) {
      console.error('Failed to request loan', error);
      throw new Error(error.response?.data?.error || 'Failed to disburse loan');
    }
  },

  getNotifications: async (wallet: string) => {
    try {
      const response = await api.get(`/notifications?wallet=${wallet}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  markNotificationsRead: async (wallet: string) => {
    try {
      await api.patch(`/notifications?wallet=${wallet}`);
      return true;
    } catch (error) {
      console.error('Error marking notifications read:', error);
      return false;
    }
  },

  getComplianceStatus: async (wallet: string) => {
    try {
      const response = await api.get(`/beneficiary/compliance?wallet=${wallet}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching compliance status:', error);
      return null;
    }
  }
};
