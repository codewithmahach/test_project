const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

class TokenLedger {
  constructor() {
    this.dataPath = path.resolve(__dirname, "../data/ledger_state.json");
    this.blockNumber = 18452900;
    this.accounts = {};
    this.properties = [];
    this.transactions = [];
    this.contracts = {
      realEstateContract: "0x3A2B1C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B",
      escrowContract: "0x8C7D6E5F4A3B2C1D0E9F8A7B6C5D4E3F2A1B0C9D",
      tokenLedgerContract: "0x1F4E2D3C4B5A69788796A5B4C3D2E1F0A9B8C7D6",
    };

    this.initLedger();
  }

  initLedger() {
    if (fs.existsSync(this.dataPath)) {
      try {
        const raw = fs.readFileSync(this.dataPath, "utf-8");
        const parsed = JSON.parse(raw);
        this.blockNumber = parsed.blockNumber || this.blockNumber;
        this.accounts = parsed.accounts || {};
        this.properties = parsed.properties || [];
        this.transactions = parsed.transactions || [];
        if (this.properties.length > 0) return;
      } catch (e) {
        console.warn("Could not read existing ledger state, resetting to initial state:", e.message);
      }
    }

    // Default Seed Data
    this.properties = [
      {
        id: 1,
        title: "Modern Villa with Pool",
        price: {
          usd: 850000,
          eth: 425,
        },
        location: "Beverly Hills, CA",
        type: "villa",
        roi: "7.2%",
        metrics: {
          totalInvestors: 142,
          funded: "89%",
          minInvestment: "$10",
          monthlyIncome: "$520",
          appreciation: "4.5%",
          rentalYield: "5.8%",
          totalReturn: "10.3%",
        },
        status: "Active Investment",
        description:
          "This stunning modern villa offers luxurious living spaces with high-end finishes throughout. The property has been tokenized for fractional ownership, allowing investors to participate in this premium real estate opportunity with as little as $10.",
        features: [
          "Swimming Pool",
          "Smart Home System",
          "Gourmet Kitchen",
          "Home Theater",
          "Wine Cellar",
          "Outdoor Kitchen",
          "Fire Pit",
          "Three-Car Garage",
        ],
        tokenDetails: {
          totalTokens: 85000,
          availableTokens: 9350,
          tokenPrice: "$10",
          tokenPriceEth: 0.005,
          tokenSymbol: "VILLA425",
          contractAddress: "0x1234a56789abcdef1234567890abcdef12345678",
          blockchain: "Ethereum (Simulated Ledger)",
        },
        financials: {
          grossRent: "$8,500/month",
          netRent: "$7,225/month",
          expenses: {
            management: "8%",
            maintenance: "5%",
            insurance: "2%",
            property_tax: "1.2%",
          },
          projectedAppreciation: "4.5% annually",
        },
        yearBuilt: 2020,
        parkingSpaces: 3,
        lotSize: "0.5 acres",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        ],
        agent: {
          name: "John Doe",
          phone: "+1 (555) 123-4567",
          email: "john@realestate.com",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
        },
      },
      {
        id: 2,
        title: "Luxury Penthouse",
        price: {
          usd: 1200000,
          eth: 600,
        },
        location: "Manhattan, NY",
        type: "apartment",
        roi: "6.8%",
        metrics: {
          totalInvestors: 203,
          funded: "95%",
          minInvestment: "$10",
          monthlyIncome: "$680",
          appreciation: "5.2%",
          rentalYield: "6.1%",
          totalReturn: "11.3%",
        },
        status: "Almost Funded",
        description:
          "Spectacular penthouse overlooking Manhattan skyline with panoramic glass walls, private terrace, and 24/7 concierge services.",
        features: [
          "Private Elevator",
          "Terrace with Skyline View",
          "Concierge & Doorman",
          "Fitness Center & Spa",
          "Valet Parking",
        ],
        tokenDetails: {
          totalTokens: 120000,
          availableTokens: 6000,
          tokenPrice: "$10",
          tokenPriceEth: 0.005,
          tokenSymbol: "PENT600",
          contractAddress: "0x2345b6789abcdef1234567890abcdef123456789",
          blockchain: "Ethereum (Simulated Ledger)",
        },
        financials: {
          grossRent: "$12,000/month",
          netRent: "$10,200/month",
          expenses: {
            management: "7%",
            maintenance: "4%",
            insurance: "2%",
            property_tax: "2.0%",
          },
          projectedAppreciation: "5.2% annually",
        },
        yearBuilt: 2022,
        parkingSpaces: 2,
        lotSize: "0.3 acres",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        ],
        agent: {
          name: "Sarah Jenkins",
          phone: "+1 (555) 987-6543",
          email: "sarah@realestate.com",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
        },
      },
      {
        id: 3,
        title: "Waterfront Estate",
        price: {
          usd: 2100000,
          eth: 1050,
        },
        location: "Miami Beach, FL",
        type: "house",
        roi: "7.5%",
        metrics: {
          totalInvestors: 89,
          funded: "45%",
          minInvestment: "$10",
          monthlyIncome: "$1200",
          appreciation: "6.1%",
          rentalYield: "6.5%",
          totalReturn: "12.6%",
        },
        status: "New Listing",
        description:
          "Exclusive Miami Beach waterfront property featuring private boat dock, resort-style infinity pool, and lush tropical landscaping.",
        features: [
          "Private Boat Dock",
          "Infinity Pool",
          "Private Beach Access",
          "Wine Cellar",
          "Guest House",
        ],
        tokenDetails: {
          totalTokens: 210000,
          availableTokens: 115500,
          tokenPrice: "$10",
          tokenPriceEth: 0.005,
          tokenSymbol: "ESTATE1050",
          contractAddress: "0x3456c789abcdef1234567890abcdef123456780",
          blockchain: "Ethereum (Simulated Ledger)",
        },
        financials: {
          grossRent: "$18,000/month",
          netRent: "$15,300/month",
          expenses: {
            management: "8%",
            maintenance: "5%",
            insurance: "3%",
            property_tax: "1.5%",
          },
          projectedAppreciation: "6.1% annually",
        },
        yearBuilt: 2021,
        parkingSpaces: 4,
        lotSize: "1.2 acres",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        ],
        agent: {
          name: "Michael Chang",
          phone: "+1 (555) 345-6789",
          email: "michael@realestate.com",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        },
      },
    ];

    // Seed default investor account
    const defaultUser = "0x71C678D31151445784564E9B6D156474668b5561";
    this.accounts[defaultUser.toLowerCase()] = {
      address: defaultUser,
      ethBalance: 25.5,
      tokens: {
        VILLA425: 50, // 50 fractional tokens owned ($500 value)
      },
    };

    // Seed Contract Escrow Account
    const escrowAddr = this.contracts.escrowContract.toLowerCase();
    this.accounts[escrowAddr] = {
      address: this.contracts.escrowContract,
      ethBalance: 375.0,
      tokens: {},
    };

    // Initial Genesis block transaction
    this.recordTransaction({
      type: "GENESIS",
      from: "0x0000000000000000000000000000000000000000",
      to: defaultUser,
      tokenSymbol: "ETH",
      amount: 25.5,
      note: "Genesis account balance initialized",
    });

    this.saveState();
  }

  saveState() {
    try {
      const dir = path.dirname(this.dataPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = {
        blockNumber: this.blockNumber,
        accounts: this.accounts,
        properties: this.properties,
        transactions: this.transactions,
        contracts: this.contracts,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save ledger state:", e.message);
    }
  }

  generateTxHash(data) {
    const raw = `${Date.now()}-${this.blockNumber}-${JSON.stringify(data)}-${Math.random()}`;
    return "0x" + crypto.createHash("sha256").update(raw).digest("hex");
  }

  recordTransaction({ type, from, to, tokenSymbol, amount, propertyId, note }) {
    this.blockNumber += 1;
    const tx = {
      txHash: this.generateTxHash({ type, from, to, tokenSymbol, amount }),
      blockNumber: this.blockNumber,
      timestamp: new Date().toISOString(),
      type,
      from: from || "0x0000000000000000000000000000000000000000",
      to: to || "0x0000000000000000000000000000000000000000",
      tokenSymbol: tokenSymbol || "ETH",
      amount: Number(amount),
      propertyId: propertyId || null,
      status: "CONFIRMED",
      note: note || "",
    };
    this.transactions.unshift(tx);
    if (this.transactions.length > 100) {
      this.transactions.pop();
    }
    return tx;
  }

  getOrCreateAccount(address) {
    const key = (address || "").toLowerCase();
    if (!this.accounts[key]) {
      this.accounts[key] = {
        address: address,
        ethBalance: 10.0, // Default test faucet of 10 ETH for any new wallet connected
        tokens: {},
      };
      this.recordTransaction({
        type: "FAUCET",
        from: "0x0000000000000000000000000000000000000000",
        to: address,
        tokenSymbol: "ETH",
        amount: 10.0,
        note: "Initial testnet faucet airdrop",
      });
      this.saveState();
    }
    return this.accounts[key];
  }

  getBalance(address) {
    const account = this.getOrCreateAccount(address);
    const propertyHoldings = [];

    let totalPortfolioValueUsd = 0;

    for (const [symbol, amount] of Object.entries(account.tokens || {})) {
      if (amount > 0) {
        const prop = this.properties.find((p) => p.tokenDetails.tokenSymbol === symbol);
        const tokenPriceUsd = prop ? 10 : 10;
        const valueUsd = amount * tokenPriceUsd;
        totalPortfolioValueUsd += valueUsd;

        propertyHoldings.push({
          tokenSymbol: symbol,
          amount: amount,
          propertyId: prop ? prop.id : null,
          propertyTitle: prop ? prop.title : symbol,
          tokenPrice: `$${tokenPriceUsd}`,
          totalValueUsd: `$${valueUsd.toLocaleString()}`,
          roi: prop ? prop.roi : "N/A",
          image: prop ? prop.image : "",
        });
      }
    }

    return {
      address: account.address,
      ethBalance: Number(account.ethBalance.toFixed(4)),
      ethValueUsd: Number((account.ethBalance * 2000).toFixed(2)),
      tokens: account.tokens || {},
      propertyHoldings,
      totalPortfolioValueUsd: `$${totalPortfolioValueUsd.toLocaleString()}`,
      blockNumber: this.blockNumber,
    };
  }

  getProperties() {
    return this.properties.map((p) => {
      const totalTokens = p.tokenDetails.totalTokens;
      const availableTokens = p.tokenDetails.availableTokens;
      const soldTokens = totalTokens - availableTokens;
      const fundedPercentage = Math.min(100, Math.round((soldTokens / totalTokens) * 100));

      return {
        ...p,
        metrics: {
          ...p.metrics,
          funded: `${fundedPercentage}%`,
        },
      };
    });
  }

  getPropertyById(id) {
    const property = this.properties.find((p) => p.id === parseInt(id));
    if (!property) return null;

    const totalTokens = property.tokenDetails.totalTokens;
    const availableTokens = property.tokenDetails.availableTokens;
    const soldTokens = totalTokens - availableTokens;
    const fundedPercentage = Math.min(100, Math.round((soldTokens / totalTokens) * 100));

    return {
      ...property,
      metrics: {
        ...property.metrics,
        funded: `${fundedPercentage}%`,
      },
    };
  }

  investInProperty(propertyId, investorAddress, tokenAmount) {
    const qty = parseInt(tokenAmount);
    if (!qty || qty <= 0) {
      throw new Error("Invalid token quantity to invest. Must be at least 1 token.");
    }

    const property = this.properties.find((p) => p.id === parseInt(propertyId));
    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found.`);
    }

    if (property.tokenDetails.availableTokens < qty) {
      throw new Error(
        `Insufficient available tokens. Requested: ${qty}, Available: ${property.tokenDetails.availableTokens}`
      );
    }

    const pricePerTokenEth = property.tokenDetails.tokenPriceEth || 0.005;
    const totalCostEth = qty * pricePerTokenEth;
    const investor = this.getOrCreateAccount(investorAddress);

    if (investor.ethBalance < totalCostEth) {
      throw new Error(
        `Insufficient ETH balance. Required: ${totalCostEth.toFixed(4)} ETH, Current: ${investor.ethBalance.toFixed(
          4
        )} ETH`
      );
    }

    // Deduct ETH & Add tokens
    investor.ethBalance -= totalCostEth;
    const symbol = property.tokenDetails.tokenSymbol;
    investor.tokens[symbol] = (investor.tokens[symbol] || 0) + qty;

    // Escrow receives ETH
    const escrow = this.getOrCreateAccount(this.contracts.escrowContract);
    escrow.ethBalance += totalCostEth;

    // Update Property Token Availability & Investors Count
    property.tokenDetails.availableTokens -= qty;
    const soldTokens = property.tokenDetails.totalTokens - property.tokenDetails.availableTokens;
    const newFunded = Math.min(100, Math.round((soldTokens / property.tokenDetails.totalTokens) * 100));
    property.metrics.funded = `${newFunded}%`;
    if (newFunded >= 95) {
      property.status = "Almost Funded";
    }
    if (newFunded >= 100) {
      property.status = "Fully Funded";
    }
    property.metrics.totalInvestors += 1;

    // Record Immutable Transaction
    const tx = this.recordTransaction({
      type: "INVEST_TOKEN",
      from: investor.address,
      to: this.contracts.escrowContract,
      tokenSymbol: symbol,
      amount: qty,
      propertyId: property.id,
      note: `Fractional purchase of ${qty} ${symbol} tokens for ${totalCostEth.toFixed(4)} ETH ($${qty * 10})`,
    });

    this.saveState();

    return {
      success: true,
      transaction: tx,
      purchasedTokens: qty,
      tokenSymbol: symbol,
      totalCostEth: Number(totalCostEth.toFixed(4)),
      remainingEthBalance: Number(investor.ethBalance.toFixed(4)),
      totalOwnedTokens: investor.tokens[symbol],
      property: this.getPropertyById(propertyId),
    };
  }

  transfer(tokenSymbol, fromAddress, toAddress, amount) {
    const qty = Number(amount);
    if (!qty || qty <= 0) {
      throw new Error("Invalid transfer amount. Must be greater than 0.");
    }
    if (!toAddress || toAddress.trim() === "") {
      throw new Error("Recipient address is required.");
    }

    const sender = this.getOrCreateAccount(fromAddress);
    const recipient = this.getOrCreateAccount(toAddress);

    if (tokenSymbol === "ETH") {
      if (sender.ethBalance < qty) {
        throw new Error(`Insufficient ETH balance. Sender has ${sender.ethBalance.toFixed(4)} ETH.`);
      }
      sender.ethBalance -= qty;
      recipient.ethBalance += qty;
    } else {
      const senderBalance = sender.tokens[tokenSymbol] || 0;
      if (senderBalance < qty) {
        throw new Error(`Insufficient ${tokenSymbol} balance. Sender has ${senderBalance} tokens.`);
      }
      sender.tokens[tokenSymbol] -= qty;
      recipient.tokens[tokenSymbol] = (recipient.tokens[tokenSymbol] || 0) + qty;
    }

    const tx = this.recordTransaction({
      type: "TRANSFER",
      from: sender.address,
      to: recipient.address,
      tokenSymbol,
      amount: qty,
      note: `Transferred ${qty} ${tokenSymbol} from ${sender.address.slice(0, 8)}... to ${recipient.address.slice(
        0,
        8
      )}...`,
    });

    this.saveState();

    return {
      success: true,
      transaction: tx,
      senderBalance: tokenSymbol === "ETH" ? sender.ethBalance : sender.tokens[tokenSymbol],
      recipientBalance: tokenSymbol === "ETH" ? recipient.ethBalance : recipient.tokens[tokenSymbol],
    };
  }

  mint(toAddress, propertyId, tokenAmount) {
    const qty = parseInt(tokenAmount);
    if (!qty || qty <= 0) {
      throw new Error("Invalid mint amount.");
    }

    const property = this.properties.find((p) => p.id === parseInt(propertyId));
    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found.`);
    }

    const recipient = this.getOrCreateAccount(toAddress);
    const symbol = property.tokenDetails.tokenSymbol;

    recipient.tokens[symbol] = (recipient.tokens[symbol] || 0) + qty;
    property.tokenDetails.totalTokens += qty;
    property.tokenDetails.availableTokens += qty;

    const tx = this.recordTransaction({
      type: "MINT",
      from: "0x0000000000000000000000000000000000000000",
      to: recipient.address,
      tokenSymbol: symbol,
      amount: qty,
      propertyId: property.id,
      note: `Minted ${qty} new ${symbol} tokens for property #${property.id}`,
    });

    this.saveState();

    return {
      success: true,
      transaction: tx,
      mintedAmount: qty,
      tokenSymbol: symbol,
      newTotalSupply: property.tokenDetails.totalTokens,
      recipientTokenBalance: recipient.tokens[symbol],
    };
  }

  getTransactions(address) {
    if (!address) {
      return this.transactions;
    }
    const target = address.toLowerCase();
    return this.transactions.filter(
      (tx) => tx.from.toLowerCase() === target || tx.to.toLowerCase() === target
    );
  }

  getContracts() {
    return {
      ...this.contracts,
      blockNumber: this.blockNumber,
      consensus: "Proof of Authority (Simulated)",
      network: "RentVerse Private Token Network",
    };
  }
}

// Singleton instance
const ledgerInstance = new TokenLedger();
module.exports = ledgerInstance;
