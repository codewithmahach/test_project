import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ledgerApi from '../services/api';

const WalletContext = createContext(null);

export const DEFAULT_WALLET = '0x71C678D31151445784564E9B6D156474668b5561';

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(() => {
    return localStorage.getItem('rentverse_wallet') || DEFAULT_WALLET;
  });
  const [isConnected, setIsConnected] = useState(true);
  const [ethBalance, setEthBalance] = useState(25.5);
  const [ethValueUsd, setEthValueUsd] = useState(51000);
  const [tokens, setTokens] = useState({});
  const [propertyHoldings, setPropertyHoldings] = useState([]);
  const [totalPortfolioValueUsd, setTotalPortfolioValueUsd] = useState('$0');
  const [transactions, setTransactions] = useState([]);
  const [contracts, setContracts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWalletData = useCallback(async (targetAccount) => {
    if (!targetAccount) return;
    try {
      setLoading(true);
      const [balanceData, txData, contractData] = await Promise.all([
        ledgerApi.getBalance(targetAccount),
        ledgerApi.getTransactions(targetAccount),
        ledgerApi.getContracts(),
      ]);

      if (balanceData.success && balanceData.balance) {
        setEthBalance(balanceData.balance.ethBalance);
        setEthValueUsd(balanceData.balance.ethValueUsd);
        setTokens(balanceData.balance.tokens || {});
        setPropertyHoldings(balanceData.balance.propertyHoldings || []);
        setTotalPortfolioValueUsd(balanceData.balance.totalPortfolioValueUsd || '$0');
      }

      if (txData.success && txData.transactions) {
        setTransactions(txData.transactions);
      }

      if (contractData.success && contractData.contracts) {
        setContracts(contractData.contracts);
      }
      setError(null);
    } catch (err) {
      console.warn('Backend ledger not reachable or error loading wallet data:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected && account) {
      fetchWalletData(account);
    }
  }, [isConnected, account, fetchWalletData]);

  const connectWallet = async (walletAddress = DEFAULT_WALLET) => {
    setAccount(walletAddress);
    setIsConnected(true);
    localStorage.setItem('rentverse_wallet', walletAddress);
    await fetchWalletData(walletAddress);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    localStorage.removeItem('rentverse_wallet');
    setTokens({});
    setPropertyHoldings([]);
    setTransactions([]);
  };

  const investInProperty = async (propertyId, tokenAmount) => {
    if (!isConnected || !account) {
      throw new Error('Please connect your wallet first.');
    }
    const result = await ledgerApi.investInProperty({
      propertyId,
      investorAddress: account,
      tokenAmount,
    });
    await fetchWalletData(account);
    return result;
  };

  const transferTokens = async (tokenSymbol, toAddress, amount) => {
    if (!isConnected || !account) {
      throw new Error('Please connect your wallet first.');
    }
    const result = await ledgerApi.transferTokens({
      tokenSymbol,
      fromAddress: account,
      toAddress,
      amount,
    });
    await fetchWalletData(account);
    return result;
  };

  const mintTokens = async (propertyId, tokenAmount) => {
    if (!isConnected || !account) {
      throw new Error('Please connect your wallet first.');
    }
    const result = await ledgerApi.mintTokens({
      toAddress: account,
      propertyId,
      tokenAmount,
    });
    await fetchWalletData(account);
    return result;
  };

  const refreshData = () => {
    if (account) {
      fetchWalletData(account);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        ethBalance,
        ethValueUsd,
        tokens,
        propertyHoldings,
        totalPortfolioValueUsd,
        transactions,
        contracts,
        loading,
        error,
        connectWallet,
        disconnectWallet,
        investInProperty,
        transferTokens,
        mintTokens,
        refreshData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
