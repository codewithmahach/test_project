const ledger = require("../ledger/TokenLedger");

// @desc    Get all properties with live token metrics
// @route   GET /api/ledger/properties
exports.getAllProperties = (req, res) => {
  try {
    const properties = ledger.getProperties();
    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single property details
// @route   GET /api/ledger/properties/:id
exports.getPropertyDetails = (req, res) => {
  try {
    const property = ledger.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with ID ${req.params.id} not found.`,
      });
    }
    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get wallet balance and token holdings
// @route   GET /api/ledger/balance/:address
exports.getBalance = (req, res) => {
  try {
    const address = req.params.address;
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required.",
      });
    }
    const balance = ledger.getBalance(address);
    res.status(200).json({
      success: true,
      balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Invest in property (simulates Escrow & Token purchase)
// @route   POST /api/ledger/invest
exports.investInProperty = (req, res) => {
  try {
    const { propertyId, investorAddress, tokenAmount } = req.body;
    if (!propertyId || !investorAddress || !tokenAmount) {
      return res.status(400).json({
        success: false,
        message: "propertyId, investorAddress, and tokenAmount are required.",
      });
    }

    const result = ledger.investInProperty(propertyId, investorAddress, tokenAmount);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Transfer tokens or ETH between accounts
// @route   POST /api/ledger/transfer
exports.transferTokens = (req, res) => {
  try {
    const { tokenSymbol, fromAddress, toAddress, amount } = req.body;
    if (!tokenSymbol || !fromAddress || !toAddress || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "tokenSymbol, fromAddress, toAddress, and amount are required.",
      });
    }

    const result = ledger.transfer(tokenSymbol, fromAddress, toAddress, amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mint new tokens (simulates Smart Contract mint)
// @route   POST /api/ledger/mint
exports.mintTokens = (req, res) => {
  try {
    const { toAddress, propertyId, tokenAmount } = req.body;
    if (!toAddress || !propertyId || !tokenAmount) {
      return res.status(400).json({
        success: false,
        message: "toAddress, propertyId, and tokenAmount are required.",
      });
    }

    const result = ledger.mint(toAddress, propertyId, tokenAmount);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get ledger transaction history
// @route   GET /api/ledger/transactions
exports.getTransactions = (req, res) => {
  try {
    const address = req.query.address;
    const transactions = ledger.getTransactions(address);
    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get simulated smart contracts information
// @route   GET /api/ledger/contracts
exports.getContracts = (req, res) => {
  try {
    const contracts = ledger.getContracts();
    res.status(200).json({
      success: true,
      contracts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
