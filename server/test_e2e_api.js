const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const PORT = 3098;

server.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}...`);

  const request = (method, path, body = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port: PORT,
        path: `/api/ledger${path}`,
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', (err) => reject(err));

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  };

  try {
    console.log('\n--- 1. Testing GET /properties ---');
    const props = await request('GET', '/properties');
    console.log(`Status: ${props.status}, Found: ${props.body.properties.length} properties`);
    if (props.status !== 200 || props.body.properties.length === 0) throw new Error('Failed GET /properties');

    console.log('\n--- 2. Testing GET /properties/1 ---');
    const prop1 = await request('GET', '/properties/1');
    console.log(`Status: ${prop1.status}, Title: ${prop1.body.property.title}, Token: ${prop1.body.property.tokenDetails.tokenSymbol}`);
    if (prop1.status !== 200 || !prop1.body.property) throw new Error('Failed GET /properties/1');

    console.log('\n--- 3. Testing GET /balance/:address ---');
    const testUser = '0x71C678D31151445784564E9B6D156474668b5561';
    const balance = await request('GET', `/balance/${testUser}`);
    console.log(`Status: ${balance.status}, ETH: ${balance.body.balance.ethBalance} ETH, Holdings: ${balance.body.balance.propertyHoldings.length}`);
    if (balance.status !== 200 || balance.body.balance.ethBalance === undefined) throw new Error('Failed GET /balance');

    console.log('\n--- 4. Testing POST /invest ---');
    const investRes = await request('POST', '/invest', {
      propertyId: 1,
      investorAddress: testUser,
      tokenAmount: 5,
    });
    console.log(`Status: ${investRes.status}, Purchased: ${investRes.body.purchasedTokens} tokens, TxHash: ${investRes.body.transaction.txHash}`);
    if (investRes.status !== 200 || !investRes.body.transaction.txHash) throw new Error('Failed POST /invest');

    console.log('\n--- 5. Testing POST /transfer ---');
    const transferRes = await request('POST', '/transfer', {
      tokenSymbol: 'VILLA425',
      fromAddress: testUser,
      toAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      amount: 2,
    });
    console.log(`Status: ${transferRes.status}, TxHash: ${transferRes.body.transaction.txHash}`);
    if (transferRes.status !== 200) throw new Error('Failed POST /transfer');

    console.log('\n--- 6. Testing POST /mint ---');
    const mintRes = await request('POST', '/mint', {
      toAddress: testUser,
      propertyId: 2,
      tokenAmount: 25,
    });
    console.log(`Status: ${mintRes.status}, Minted: ${mintRes.body.mintedAmount} ${mintRes.body.tokenSymbol} tokens, TxHash: ${mintRes.body.transaction.txHash}`);
    if (mintRes.status !== 200) throw new Error('Failed POST /mint');

    console.log('\n--- 7. Testing GET /transactions ---');
    const txRes = await request('GET', '/transactions');
    console.log(`Status: ${txRes.status}, Total Ledger Transactions: ${txRes.body.count}`);
    if (txRes.status !== 200 || txRes.body.count === 0) throw new Error('Failed GET /transactions');

    console.log('\n--- 8. Testing GET /contracts ---');
    const contractRes = await request('GET', '/contracts');
    console.log(`Status: ${contractRes.status}, Escrow: ${contractRes.body.contracts.escrowContract}`);
    if (contractRes.status !== 200 || !contractRes.body.contracts) throw new Error('Failed GET /contracts');

    console.log('\n===========================================');
    console.log('✅ ALL API & LEDGER INTEGRATION TESTS PASSED!');
    console.log('===========================================');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  } finally {
    server.close();
    process.exit(0);
  }
});
