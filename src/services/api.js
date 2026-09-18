import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3099/api/ledger';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ledgerApi = {
  // Get all investment properties with live token metrics
  getProperties: async () => {
    const response = await api.get('/properties');
    return response.data;
  },

  // Get single property details
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Get wallet balance and token holdings
  getBalance: async (address) => {
    const response = await api.get(`/balance/${address}`);
    return response.data;
  },

  // Invest in property tokens (simulates Smart Contract escrow purchase)
  investInProperty: async ({ propertyId, investorAddress, tokenAmount }) => {
    const response = await api.post('/invest', {
      propertyId,
      investorAddress,
      tokenAmount,
    });
    return response.data;
  },

  // Transfer tokens or ETH between accounts
  transferTokens: async ({ tokenSymbol, fromAddress, toAddress, amount }) => {
    const response = await api.post('/transfer', {
      tokenSymbol,
      fromAddress,
      toAddress,
      amount,
    });
    return response.data;
  },

  // Mint new tokens
  mintTokens: async ({ toAddress, propertyId, tokenAmount }) => {
    const response = await api.post('/mint', {
      toAddress,
      propertyId,
      tokenAmount,
    });
    return response.data;
  },

  // Get transaction ledger history
  getTransactions: async (address) => {
    const params = address ? { address } : {};
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  // Get smart contracts details
  getContracts: async () => {
    const response = await api.get('/contracts');
    return response.data;
  },
};

export default ledgerApi;
