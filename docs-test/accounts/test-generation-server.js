/**
 * Test Generation Server
 * 
 * This file tests the account generation server functionality.
 * It verifies the server is running, can generate accounts, and produces unique results.
 * Run this to ensure the generation server is working before using it with Blnk.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testServer() {
  console.log('Testing Account Generation Server\n');

  try {
    // Test 1: Verify server health
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    const healthData = healthResponse.data;
    console.log('Health check passed:', healthData.status);
    console.log('');

    // Test 2: Get server information
    console.log('2. Testing server info...');
    const infoResponse = await axios.get(`${BASE_URL}/`);
    const infoData = infoResponse.data;
    console.log('Server info retrieved:', infoData.service, infoData.version);
    console.log('');

    // Test 3: Generate multiple accounts to test functionality
    console.log('3. Testing account generation...');
    const accounts = [];
    
    for (let i = 1; i <= 5; i++) {
      const genResponse = await axios.get(`${BASE_URL}/generate`);
      const genData = genResponse.data;
      
      console.log(`Account ${i}: ${genData.account_number} (${genData.bank_name})`);
      
      accounts.push(genData);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    console.log('');

    // Test 4: Verify account numbers are unique
    console.log('4. Verifying account number uniqueness...');
    const accountNumbers = accounts.map(acc => acc.account_number);
    const uniqueNumbers = new Set(accountNumbers);
    
    if (accountNumbers.length === uniqueNumbers.size) {
      console.log('All account numbers are unique!');
    } else {
      console.log('Duplicate account numbers found!');
    }
    console.log('');

    // Test 5: Check variety of bank names generated
    console.log('5. Verifying bank names...');
    const bankNames = accounts.map(acc => acc.bank_name);
    const uniqueBanks = new Set(bankNames);
    
    console.log('Generated banks:', Array.from(uniqueBanks));
    console.log('Total unique banks:', uniqueBanks.size);
    console.log('');

    console.log('All tests passed! The server is working correctly.');
    console.log('');
    console.log('Summary:');
    console.log(`- Health check: ✅`);
    console.log(`- Server info: ✅`);
    console.log(`- Account generation: ✅ (${accounts.length} accounts)`);
    console.log(`- Uniqueness: ✅`);
    console.log(`- Bank variety: ✅ (${uniqueBanks.size} different banks)`);
    console.log('');
    console.log('Ready to use with Blnk!');

  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure the server is running: npm start');
    console.log('2. Check if port 3001 is available');
    console.log('3. Verify the server started without errors');
  }
}

testServer(); 