import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiMaximize2,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiGrid,
  FiCheckCircle,
  FiX,
} from 'react-icons/fi';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { FaFacebook, FaTwitter, FaLinkedin, FaEthereum, FaWallet, FaCube } from 'react-icons/fa';
import { useWallet, DEFAULT_WALLET } from '../context/WalletContext';
import ledgerApi from '../services/api';

const DEFAULT_PROPERTY = {
  id: 1,
  title: 'Modern Villa with Pool',
  price: {
    usd: 850000,
    eth: 425,
  },
  location: 'Beverly Hills, CA',
  type: 'villa',
  roi: '7.2%',
  metrics: {
    totalInvestors: 142,
    funded: '89%',
    minInvestment: '$10',
    monthlyIncome: '$520',
    appreciation: '4.5%',
    rentalYield: '5.8%',
    totalReturn: '10.3%',
  },
  status: 'Active Investment',
  description:
    'This stunning modern villa offers luxurious living spaces with high-end finishes throughout. The property has been tokenized for fractional ownership, allowing investors to participate in this premium real estate opportunity with as little as $10.',
  features: [
    'Swimming Pool',
    'Smart Home System',
    'Gourmet Kitchen',
    'Home Theater',
    'Wine Cellar',
    'Outdoor Kitchen',
    'Fire Pit',
    'Three-Car Garage',
  ],
  tokenDetails: {
    totalTokens: 85000,
    availableTokens: 9350,
    tokenPrice: '$10',
    tokenPriceEth: 0.005,
    tokenSymbol: 'VILLA425',
    contractAddress: '0x1234a56789abcdef1234567890abcdef12345678',
    blockchain: 'Ethereum (Simulated Ledger)',
  },
  financials: {
    grossRent: '$8,500/month',
    netRent: '$7,225/month',
    expenses: {
      management: '8%',
      maintenance: '5%',
      insurance: '2%',
      property_tax: '1.2%',
    },
    projectedAppreciation: '4.5% annually',
  },
  yearBuilt: 2020,
  parkingSpaces: 3,
  lotSize: '0.5 acres',
  images: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  ],
  agent: {
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john@realestate.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
};

function PropertyDetail() {
  const { id } = useParams();
  const { account, isConnected, ethBalance, connectWallet, investInProperty } = useWallet();

  const [property, setProperty] = useState(DEFAULT_PROPERTY);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(null);
  const [txError, setTxError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await ledgerApi.getPropertyById(id);
        if (data.success && data.property) {
          setProperty(data.property);
        }
      } catch (err) {
        console.warn('Using default property details:', err.message);
      }
    };
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const pricePerTokenEth = property.tokenDetails?.tokenPriceEth || 0.005;
  const totalCostEth = Number((tokenAmount * pricePerTokenEth).toFixed(4));
  const totalCostUsd = tokenAmount * 10;

  const handleInvestSubmit = async (e) => {
    e.preventDefault();
    setTxError(null);
    setTxSuccess(null);

    if (!isConnected) {
      connectWallet(DEFAULT_WALLET);
      return;
    }

    try {
      setIsProcessing(true);
      const res = await investInProperty(property.id, tokenAmount);
      setTxSuccess(res);
      if (res.property) {
        setProperty(res.property);
      }
    } catch (err) {
      setTxError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation Breadcrumb */}
      <div className="bg-white shadow">
        <div className="container py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-secondary-600 hover:text-primary-600">
              Home
            </Link>
            <span className="text-secondary-400">/</span>
            <Link to="/properties" className="text-secondary-600 hover:text-primary-600">
              Properties
            </Link>
            <span className="text-secondary-400">/</span>
            <span className="text-primary-600 font-semibold">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="h-96 rounded-lg overflow-hidden shadow-md">
                <img
                  src={property.images?.[0] || property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(property.images || []).slice(1).map((image, index) => (
                  <div key={index} className="h-32 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={image}
                      alt={`${property.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <p className="text-secondary-600 mb-6">{property.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FiHome className="text-primary-600" />
                  <span>{property.parkingSpaces} Parking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMaximize2 className="text-primary-600" />
                  <span>{property.lotSize}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-primary-600" />
                  <span>Built {property.yearBuilt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-primary-600" />
                  <span>{property.metrics.totalInvestors} Investors</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {property.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FiHome className="text-primary-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Token Details */}
              <h3 className="text-xl font-semibold mb-4">Token & Smart Contract Information</h3>
              <div className="bg-secondary-50 rounded-lg p-6 mb-6 border border-secondary-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-secondary-600">Token Symbol</p>
                    <p className="font-semibold text-primary-700">{property.tokenDetails.tokenSymbol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600">Token Price</p>
                    <p className="font-semibold">{property.tokenDetails.tokenPrice} (0.005 ETH)</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600">Available Tokens</p>
                    <p className="font-semibold text-green-600">
                      {property.tokenDetails.availableTokens.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600">Total Supply</p>
                    <p className="font-semibold">{property.tokenDetails.totalTokens.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-secondary-600">Simulated Smart Contract Address</p>
                    <p className="font-mono text-xs bg-white p-2 rounded border border-secondary-200 mt-1">
                      {property.tokenDetails.contractAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Rental Income</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Gross Rent</span>
                      <span className="font-medium">{property.financials.grossRent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Net Rent</span>
                      <span className="font-medium">{property.financials.netRent}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Expenses</h4>
                  <div className="space-y-2">
                    {Object.entries(property.financials.expenses || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-secondary-600">
                          {key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Investment Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 border border-secondary-100">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-secondary-500">Investment Valuation</p>
                  <div className="flex items-center">
                    <FiDollarSign className="text-primary-600" />
                    <span className="text-2xl font-bold">${property.price.usd.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-primary-600 text-sm font-semibold">
                    <FaEthereum className="mr-1" />
                    <span>{property.price.eth} ETH</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary-500">Annual ROI</p>
                  <div className="flex items-center justify-end text-green-600">
                    <FiTrendingUp className="mr-1" />
                    <span className="text-2xl font-bold">{property.roi}</span>
                  </div>
                </div>
              </div>

              {/* Investment Metrics */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Rental Yield</span>
                  <span className="font-medium">{property.metrics.rentalYield || '5.8%'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Appreciation</span>
                  <span className="font-medium">{property.metrics.appreciation}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Total Return</span>
                  <span className="font-medium text-green-600">{property.metrics.totalReturn || '10.3%'}</span>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600">Funding Progress</span>
                  <span className="font-bold text-primary-700">{property.metrics.funded}</span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: property.metrics.funded }}
                  />
                </div>
                <p className="text-xs text-secondary-500 mt-2">
                  Available: {property.tokenDetails.availableTokens.toLocaleString()} /{' '}
                  {property.tokenDetails.totalTokens.toLocaleString()} tokens
                </p>
              </div>

              <Link to={`/property-3d`} className="btn-secondary w-full mb-3 flex items-center justify-center">
                <FiGrid className="mr-2" />
                View 3D Interactive Model
              </Link>

              {/* Primary Action Button */}
              {isConnected ? (
                <button
                  onClick={() => setShowInvestModal(true)}
                  className="btn w-full mb-4 flex items-center justify-center py-3 text-base shadow-lg shadow-primary-500/30"
                >
                  <FaCube className="mr-2" />
                  Invest in {property.tokenDetails.tokenSymbol} Tokens
                </button>
              ) : (
                <button
                  onClick={() => connectWallet(DEFAULT_WALLET)}
                  className="btn w-full mb-4 flex items-center justify-center py-3"
                >
                  <FaWallet className="mr-2" />
                  Connect Wallet to Invest
                </button>
              )}

              {/* Share buttons */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                <FacebookShareButton url={shareUrl}>
                  <FaFacebook className="text-2xl text-blue-600 hover:opacity-80 transition-opacity" />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl}>
                  <FaTwitter className="text-2xl text-sky-500 hover:opacity-80 transition-opacity" />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl}>
                  <FaLinkedin className="text-2xl text-blue-700 hover:opacity-80 transition-opacity" />
                </LinkedinShareButton>
              </div>
            </div>

            {/* Agent Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={property.agent.image}
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{property.agent.name}</h3>
                  <p className="text-sm text-secondary-600">Investment Advisor</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-secondary-600">Phone:</span> {property.agent.phone}
                </p>
                <p>
                  <span className="font-medium text-secondary-600">Email:</span> {property.agent.email}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SMART CONTRACT INVESTMENT MODAL */}
      <AnimatePresence>
        {showInvestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => {
                  setShowInvestModal(false);
                  setTxSuccess(null);
                  setTxError(null);
                }}
                className="absolute top-4 right-4 text-secondary-400 hover:text-secondary-600 p-2"
              >
                <FiX size={20} />
              </button>

              {!txSuccess ? (
                <div>
                  <div className="flex items-center space-x-2 text-primary-600 mb-2">
                    <FaCube />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Simulated Escrow & Token Ledger
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Invest in {property.title}</h3>
                  <p className="text-sm text-secondary-500 mb-6">
                    Fractional ownership via {property.tokenDetails.tokenSymbol} smart contract tokens.
                  </p>

                  {txError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                      {txError}
                    </div>
                  )}

                  <form onSubmit={handleInvestSubmit} className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-semibold text-secondary-700">
                          Number of Tokens to Purchase
                        </label>
                        <span className="text-xs text-secondary-500">
                          Available: {property.tokenDetails.availableTokens.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max={property.tokenDetails.availableTokens}
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="input text-lg font-bold"
                        required
                      />
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-secondary-50 rounded-xl p-4 space-y-2 border border-secondary-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Price Per Token:</span>
                        <span className="font-semibold">$10 (0.005 ETH)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Total USD Cost:</span>
                        <span className="font-bold text-secondary-900">${totalCostUsd.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-secondary-200 pt-2">
                        <span className="text-secondary-700 font-semibold">Total ETH to Deduct:</span>
                        <span className="font-bold text-primary-600 flex items-center">
                          <FaEthereum className="mr-0.5" /> {totalCostEth} ETH
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-secondary-500 pt-1">
                        <span>Your Current Balance:</span>
                        <span>{ethBalance} ETH</span>
                      </div>
                      <div className="flex justify-between text-xs text-secondary-500 font-mono">
                        <span>Signer Address:</span>
                        <span>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || totalCostEth > ethBalance}
                      className="btn w-full py-3 text-base flex items-center justify-center font-bold"
                    >
                      {isProcessing ? (
                        'Signing & Confirming on Ledger...'
                      ) : totalCostEth > ethBalance ? (
                        'Insufficient ETH Balance'
                      ) : (
                        `Confirm Investment (${totalCostEth} ETH)`
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Transaction Success State */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    <FiCheckCircle />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900 mb-1">Investment Confirmed!</h3>
                  <p className="text-sm text-secondary-600 mb-6">
                    You have successfully purchased {txSuccess.purchasedTokens} {txSuccess.tokenSymbol}{' '}
                    fractional property tokens on the simulated ledger.
                  </p>

                  <div className="bg-secondary-50 rounded-xl p-4 text-left space-y-2.5 font-mono text-xs border border-secondary-200 mb-6">
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Tx Hash:</span>
                      <span className="text-primary-700 font-semibold truncate max-w-[200px]">
                        {txSuccess.transaction.txHash}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Block Number:</span>
                      <span>#{txSuccess.transaction.blockNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Total Owned Tokens:</span>
                      <span className="font-bold text-green-600">
                        {txSuccess.totalOwnedTokens} {txSuccess.tokenSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Remaining ETH:</span>
                      <span className="font-bold">{txSuccess.remainingEthBalance} ETH</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to="/portfolio"
                      onClick={() => setShowInvestModal(false)}
                      className="btn flex-1 flex items-center justify-center text-sm"
                    >
                      View Portfolio & Ledger
                    </Link>
                    <button
                      onClick={() => {
                        setShowInvestModal(false);
                        setTxSuccess(null);
                      }}
                      className="btn-secondary flex-1 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PropertyDetail;