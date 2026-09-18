const ledger = require("./ledger/TokenLedger");

console.log("=== 1. TEST GET PROPERTIES ===");
const properties = ledger.getProperties();
console.log(`Found ${properties.length} properties.`);
console.log(`Property 1: ${properties[0].title}, Available tokens: ${properties[0].tokenDetails.availableTokens}`);

console.log("\n=== 2. TEST GET BALANCE ===");
const defaultUser = "0x71C678D31151445784564E9B6D156474668b5561";
const balanceBefore = ledger.getBalance(defaultUser);
console.log(`User ETH Balance: ${balanceBefore.ethBalance} ETH`);
console.log(`User Tokens:`, balanceBefore.tokens);

console.log("\n=== 3. TEST FRACTIONAL INVESTMENT (ESCROW & TOKEN PURCHASE) ===");
const investRes = ledger.investInProperty(1, defaultUser, 10);
console.log("Investment Result:", {
  txHash: investRes.transaction.txHash,
  blockNumber: investRes.transaction.blockNumber,
  purchasedTokens: investRes.purchasedTokens,
  totalCostEth: investRes.totalCostEth,
  remainingEthBalance: investRes.remainingEthBalance,
  totalOwnedTokens: investRes.totalOwnedTokens,
});

console.log("\n=== 4. TEST TOKEN TRANSFER ===");
const recipient = "0x2B9c8f072c4486E39E092f6F5D0A1359D960E45F";
const transferRes = ledger.transfer("VILLA425", defaultUser, recipient, 5);
console.log("Transfer Result:", {
  txHash: transferRes.transaction.txHash,
  senderBalance: transferRes.senderBalance,
  recipientBalance: transferRes.recipientBalance,
});

console.log("\n=== 5. TEST TOKEN MINTING ===");
const mintRes = ledger.mint(defaultUser, 1, 50);
console.log("Mint Result:", {
  txHash: mintRes.transaction.txHash,
  mintedAmount: mintRes.mintedAmount,
  newTotalSupply: mintRes.newTotalSupply,
});

console.log("\n=== 6. TEST TRANSACTIONS LOG ===");
const txs = ledger.getTransactions();
console.log(`Total transactions in ledger: ${txs.length}`);
console.log("Latest transaction:", txs[0]);

console.log("\nAll Ledger tests passed successfully! ✅");
