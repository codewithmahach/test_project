import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet, DEFAULT_WALLET } from '../context/WalletContext';
import { FaWallet, FaEthereum, FaExchangeAlt, FaPlusCircle, FaHistory, FaCheckCircle, FaCube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Portfolio() {
  const {
    account,
    isConnected,
    ethBalance,
    ethValueUsd,
    propertyHoldings,
    totalPortfolioValueUsd,
    transactions,
    connectWallet,
    transferTokens,
    mintTokens,
    refreshData,
  } = useWallet();

  const [activeTab, setActiveTab] = useState('holdings');
  const [transferForm, setTransferForm] = useState({
    tokenSymbol: 'VILLA425',
    toAddress: '0x2B9c8f072c4486E39E092f6F5D0A1359D960E45F',
    amount: '',
  });
  const [mintForm, setMintForm] = useState({
    propertyId: '1',
    tokenAmount: '',
  });
  const [statusMsg, setStatusMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setStatusMsg(null);
      const res = await transferTokens(
        transferForm.tokenSymbol,
        transferForm.toAddress,
        transferForm.amount
      );
      setStatusMsg({
        type: 'success',
        text: `Transfer successful! Tx Hash: ${res.transaction.txHash}`,
      });
      setTransferForm((prev) => ({ ...prev, amount: '' }));
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setStatusMsg(null);
      const res = await mintTokens(mintForm.propertyId, mintForm.tokenAmount);
      setStatusMsg({
        type: 'success',
        text: `Successfully minted ${res.mintedAmount} ${res.tokenSymbol} tokens! Tx: ${res.transaction.txHash}`,
      });
      setMintForm((prev) => ({ ...prev, tokenAmount: '' }));
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-secondary-50 py-12">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          <FaWallet className="text-5xl text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-secondary-600 mb-6">
            Connect to view your token portfolio, property holdings, and smart contract ledger activity.
          </p>
          <button onClick={() => connectWallet(DEFAULT_WALLET)} className="btn w-full">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container space-y-8">
        {/* Header Portfolio Banner */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-800 text-primary-200 mb-3">
                <FaCube className="mr-1.5" /> Simulated Ledger Node Active
              </span>
              <h1 className="text-3xl font-bold">Investor Portfolio & Ledger</h1>
              <p className="text-primary-200 font-mono text-sm mt-1 truncate max-w-xl">
                Address: {account}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-right">
                <p className="text-xs text-primary-200">ETH Balance</p>
                <div className="flex items-center justify-end text-2xl font-bold">
                  <FaEthereum className="mr-1 text-primary-300" />
                  <span>{ethBalance} ETH</span>
                </div>
                <p className="text-xs text-primary-300 font-medium">≈ ${ethValueUsd?.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-right">
                <p className="text-xs text-primary-200">Tokenized Real Estate Value</p>
                <p className="text-2xl font-bold text-green-400">{totalPortfolioValueUsd}</p>
                <p className="text-xs text-primary-300">Across {propertyHoldings.length} Properties</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMsg && (
          <div
            className={`p-4 rounded-lg flex items-center ${
              statusMsg.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <FaCheckCircle className="mr-2 text-xl flex-shrink-0" />
            ) : null}
            <span className="text-sm font-medium">{statusMsg.text}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-secondary-200 space-x-4">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'holdings'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            Property Tokens ({propertyHoldings.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'transactions'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <FaHistory className="inline mr-1.5" /> Ledger Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'transfer'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <FaExchangeAlt className="inline mr-1.5" /> Transfer Tokens
          </button>
          <button
            onClick={() => setActiveTab('mint')}
            className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'mint'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <FaPlusCircle className="inline mr-1.5" /> Simulate Mint
          </button>
        </div>

        {/* TAB 1: Property Holdings */}
        {activeTab === 'holdings' && (
          <div className="space-y-6">
            {propertyHoldings.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <p className="text-secondary-500 mb-4">You have not invested in any property tokens yet.</p>
                <Link to="/properties" className="btn inline-flex items-center">
                  Browse Properties & Invest
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertyHoldings.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-secondary-100"
                  >
                    {item.image && (
                      <div className="h-40 overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.propertyTitle}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-primary-600">
                          {item.tokenSymbol}
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-1">{item.propertyTitle}</h3>
                      <p className="text-sm text-secondary-500 mb-4">Token Symbol: <span className="font-semibold text-primary-600">{item.tokenSymbol}</span></p>
                      
                      <div className="bg-secondary-50 rounded-lg p-3 space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-secondary-600">Tokens Owned</span>
                          <span className="font-bold text-primary-700">{item.amount.toLocaleString()} Tokens</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-secondary-600">Token Price</span>
                          <span className="font-medium">{item.tokenPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-secondary-200 pt-2">
                          <span className="text-secondary-700 font-medium">Total Holding Value</span>
                          <span className="font-bold text-green-600">{item.totalValueUsd}</span>
                        </div>
                      </div>

                      {item.propertyId && (
                        <Link
                          to={`/properties/${item.propertyId}`}
                          className="btn-secondary w-full text-center block text-sm font-semibold"
                        >
                          View Property Contract
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Transactions Ledger */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-secondary-100">
            <div className="p-6 border-b border-secondary-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Simulated Blockchain Ledger History</h2>
                <p className="text-sm text-secondary-500">Immutable transaction ledger stored in backend</p>
              </div>
              <button onClick={refreshData} className="btn-secondary text-xs px-3 py-1.5">
                Refresh Ledger
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-secondary-50 text-secondary-600 font-semibold border-b border-secondary-200">
                    <th className="p-4">Tx Hash</th>
                    <th className="p-4">Block</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">From / To</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {transactions.map((tx, index) => (
                    <tr key={index} className="hover:bg-secondary-50/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-primary-600 font-semibold">
                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                      </td>
                      <td className="p-4 font-mono text-xs text-secondary-600">#{tx.blockNumber}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            tx.type === 'INVEST_TOKEN'
                              ? 'bg-blue-100 text-blue-700'
                              : tx.type === 'TRANSFER'
                              ? 'bg-purple-100 text-purple-700'
                              : tx.type === 'MINT'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-secondary-600">
                        <div>From: {tx.from.slice(0, 8)}...</div>
                        <div>To: {tx.to.slice(0, 8)}...</div>
                      </td>
                      <td className="p-4 font-semibold text-secondary-800">
                        {tx.amount} {tx.tokenSymbol}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center text-xs text-green-600 font-semibold">
                          <FaCheckCircle className="mr-1" /> Confirmed
                        </span>
                      </td>
                      <td className="p-4 text-xs text-secondary-500">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Transfer Tokens */}
        {activeTab === 'transfer' && (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-xl mx-auto border border-secondary-100">
            <h2 className="text-xl font-bold mb-2">Transfer Tokens</h2>
            <p className="text-sm text-secondary-600 mb-6">
              Transfer fractional real estate tokens or ETH to another simulated address.
            </p>

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Select Asset / Token
                </label>
                <select
                  value={transferForm.tokenSymbol}
                  onChange={(e) => setTransferForm({ ...transferForm, tokenSymbol: e.target.value })}
                  className="input"
                >
                  <option value="VILLA425">VILLA425 (Modern Villa Token)</option>
                  <option value="PENT600">PENT600 (Luxury Penthouse Token)</option>
                  <option value="ESTATE1050">ESTATE1050 (Waterfront Estate Token)</option>
                  <option value="ETH">ETH (Native Ethereum)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  required
                  value={transferForm.toAddress}
                  onChange={(e) => setTransferForm({ ...transferForm, toAddress: e.target.value })}
                  className="input font-mono text-sm"
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Amount to Transfer
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.001"
                  required
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  className="input"
                  placeholder="e.g. 10"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn w-full mt-4 flex items-center justify-center"
              >
                {isSubmitting ? 'Processing On Ledger...' : 'Execute Transfer On Ledger'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Simulate Minting */}
        {activeTab === 'mint' && (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-xl mx-auto border border-secondary-100">
            <h2 className="text-xl font-bold mb-2">Simulate Smart Contract Mint</h2>
            <p className="text-sm text-secondary-600 mb-6">
              Simulate calling the ERC721/Fractional Mint contract function to create new property tokens.
            </p>

            <form onSubmit={handleMint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Select Property to Mint Tokens For
                </label>
                <select
                  value={mintForm.propertyId}
                  onChange={(e) => setMintForm({ ...mintForm, propertyId: e.target.value })}
                  className="input"
                >
                  <option value="1">#1 - Modern Villa with Pool (VILLA425)</option>
                  <option value="2">#2 - Luxury Penthouse (PENT600)</option>
                  <option value="3">#3 - Waterfront Estate (ESTATE1050)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Token Quantity to Mint
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={mintForm.tokenAmount}
                  onChange={(e) => setMintForm({ ...mintForm, tokenAmount: e.target.value })}
                  className="input"
                  placeholder="e.g. 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Mint Recipient (Your Connected Wallet)
                </label>
                <input
                  type="text"
                  disabled
                  value={account}
                  className="input bg-secondary-100 font-mono text-xs text-secondary-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn w-full mt-4 flex items-center justify-center"
              >
                {isSubmitting ? 'Minting on Ledger...' : 'Execute Mint Transaction'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
