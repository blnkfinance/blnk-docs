/**
 * Test Auto Account Generation
 * 
 * This file tests the complete auto account generation flow with Blnk.
 * It verifies the generation server works and tests creating accounts with auto-generated
 * account numbers and bank names. Requires both Blnk server and generation server to be running.
 */

const axios = require('axios');

const API_KEY = 'YOUR_API_KEY';
const BLNK_BASE_URL = 'http://localhost:5001';
const GENERATION_SERVER_URL = 'http://localhost:3001';

// Store test data for use across functions
let testData = {
  ledger_id: null,
  identity_id: null,
  balance_id: null,
  accounts: []
};

// Helper function to make HTTP requests to Blnk API
async function makeBlnkRequest(endpoint, options = {}) {
  const url = `${BLNK_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'X-blnk-key': API_KEY,
      'Content-Type': 'application/json',
    },
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await axios({
      method: options.method || 'GET',
      url: url,
      headers: requestOptions.headers,
      data: options.body ? JSON.parse(options.body) : undefined,
      timeout: 30000
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
      throw new Error(`HTTP ${error.response.status}: ${errorMessage}`);
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

// Test the account generation server is working
async function testGenerationServer() {
  console.log('Testing Account Generation Server');
  
  try {
    // Check server health
    console.log('Testing generation server health...');
    const healthResponse = await axios.get(`${GENERATION_SERVER_URL}/health`);
    const healthData = healthResponse.data;
    
    if (healthData.status === 'healthy') {
      console.log('Generation server is healthy');
    } else {
      throw new Error('Generation server health check failed');
    }
    
    // Test account generation
    console.log('Testing account generation...');
    const genResponse = await axios.get(`${GENERATION_SERVER_URL}/generate`);
    const genData = genResponse.data;
    
    if (genData.account_number && genData.bank_name) {
      console.log('Account generation working:');
      console.log(`Account Number: ${genData.account_number}`);
      console.log(`Bank Name: ${genData.bank_name}`);
    } else {
      throw new Error('Invalid response from generation server');
    }
    
    return genData;
    
  } catch (error) {
    console.error('Generation server test failed:', error.message);
    throw error;
  }
}

// Setup: Create a test ledger
async function createTestLedger() {
  console.log('Creating Test Ledger');
  
  try {
    const ledger = await makeBlnkRequest('/ledgers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Auto Generation Test Ledger',
        meta_data: {
          purpose: 'testing_auto_generation',
          created_by: 'auto_generation_test'
        }
      })
    });
    
    testData.ledger_id = ledger.ledger_id;
    console.log('Test ledger created:', ledger.ledger_id);
    return ledger;
    
  } catch (error) {
    console.error('Failed to create test ledger:', error.message);
    throw error;
  }
}

// Setup: Create a test identity
async function createTestIdentity() {
  console.log('Creating Test Identity');
  
  try {
    const identity = await makeBlnkRequest('/identities', {
      method: 'POST',
      body: JSON.stringify({
        identity_type: 'individual',
        first_name: 'Auto',
        last_name: 'Generator',
        email_address: 'auto.generator@test.com',
        phone_number: '+1234567890',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        meta_data: {
          purpose: 'testing_auto_generation',
          created_by: 'auto_generation_test'
        }
      })
    });
    
    testData.identity_id = identity.identity_id;
    console.log('Test identity created:', identity.identity_id);
    return identity;
    
  } catch (error) {
    console.error('Failed to create test identity:', error.message);
    throw error;
  }
}

// Setup: Create a test balance
async function createTestBalance() {
  console.log('Creating Test Balance');
  
  try {
    const balance = await makeBlnkRequest('/balances', {
      method: 'POST',
      body: JSON.stringify({
        ledger_id: testData.ledger_id,
        currency: 'USD',
        identity_id: testData.identity_id,
        meta_data: {
          purpose: 'testing_auto_generation',
          account_type: 'auto_generation_test_balance',
          created_by: 'auto_generation_test'
        }
      })
    });
    
    testData.balance_id = balance.balance_id;
    console.log('Test balance created:', balance.balance_id);
    return balance;
    
  } catch (error) {
    console.error('Failed to create test balance:', error.message);
    throw error;
  }
}

// Test: Create account with auto-generated details
async function testAutoAccountGeneration() {
  console.log('Testing Auto Account Generation');
  
  try {
    console.log('Creating account with auto-generated details...');
    
    // Create account without providing bank_name and number
    const account = await makeBlnkRequest('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        balance_id: testData.balance_id,
        identity_id: testData.identity_id,
        meta_data: {
          account_type: 'auto_generated',
          test: true,
          created_by: 'auto_generation_test'
        }
      })
    });
    
    console.log('Account with auto-generated details:', account.account_id);
    console.log('Bank Name:', account.bank_name);
    console.log('Account Number:', account.number);
    
    testData.accounts.push(account);
    return account;
    
  } catch (error) {
    console.error('Auto account generation test failed:', error.message);
    throw error;
  }
}

// Test: Create multiple accounts with auto-generation
async function testMultipleAutoAccounts() {
  console.log('Testing Multiple Auto Account Generation');
  
  try {
    const accounts = [];
    
    // Create 3 accounts with auto-generated details
    for (let i = 1; i <= 3; i++) {
      console.log(`Creating account ${i}...`);
      
      const account = await makeBlnkRequest('/accounts', {
        method: 'POST',
        body: JSON.stringify({
          balance_id: testData.balance_id,
          identity_id: testData.identity_id,
          meta_data: {
            account_type: 'auto_generated',
            test: true,
            created_by: 'auto_generation_test',
            batch: i
          }
        })
      });
      
      console.log(`Account ${i} created:`, account.account_id);
      console.log(`Bank: ${account.bank_name}, Number: ${account.number}`);
      
      accounts.push(account);
      testData.accounts.push(account);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`Successfully created ${accounts.length} accounts with auto-generation`);
    return accounts;
    
  } catch (error) {
    console.error('Multiple auto account generation test failed:', error.message);
    throw error;
  }
}

// Test: Verify all generated accounts
async function verifyAutoGeneratedAccounts() {
  console.log('Verifying Auto-Generated Accounts');
  
  try {
    if (testData.accounts.length === 0) {
      console.log('No accounts to verify');
      return;
    }
    
    console.log(`Verifying ${testData.accounts.length} accounts...`);
    
    // Display details for each account
    for (let i = 0; i < testData.accounts.length; i++) {
      const account = testData.accounts[i];
      console.log(`Account ${i + 1}:`);
      console.log(`  ID: ${account.account_id}`);
      console.log(`  Bank: ${account.bank_name}`);
      console.log(`  Number: ${account.number}`);
      console.log(`  Balance ID: ${account.balance_id}`);
      console.log(`  Identity ID: ${account.identity_id}`);
      console.log('');
    }
    
    // Check uniqueness and variety
    const uniqueBanks = new Set(testData.accounts.map(acc => acc.bank_name));
    const uniqueNumbers = new Set(testData.accounts.map(acc => acc.number));
    
    console.log('Verification Summary:');
    console.log(`- Total accounts: ${testData.accounts.length}`);
    console.log(`- Unique banks: ${uniqueBanks.size}`);
    console.log(`- Unique account numbers: ${uniqueNumbers.size}`);
    
    if (uniqueNumbers.size === testData.accounts.length) {
      console.log('All account numbers are unique!');
    } else {
      console.log('Warning: Duplicate account numbers found!');
    }
    
  } catch (error) {
    console.error('Account verification failed:', error.message);
    throw error;
  }
}

// Main test runner - executes complete auto generation test suite
async function runAutoGenerationTests() {
  console.log('Starting Auto Account Generation Tests');
  console.log('Make sure to:');
  console.log('1. Replace YOUR_API_KEY with your actual API key');
  console.log('2. Update BASE_URL if your Blnk instance is not running on localhost:5001');
  console.log('3. Ensure your Blnk server is running with auto-generation enabled');
  console.log('4. Start the generation server: npm start\n');
  
  try {
    // Test generation server first
    console.log('Testing generation server...');
    await testGenerationServer();
    
    // Setup test data
    console.log('Setting up test data...');
    await createTestLedger();
    await createTestIdentity();
    await createTestBalance();
    
    // Test single account generation
    console.log('Testing single auto account generation...');
    await testAutoAccountGeneration();
    
    // Test multiple account generation
    console.log('Testing multiple auto account generation...');
    await testMultipleAutoAccounts();
    
    // Verify all generated accounts
    console.log('Verifying generated accounts...');
    await verifyAutoGeneratedAccounts();
    
    console.log('All auto generation tests completed successfully!');
    
  } catch (error) {
    console.error('Auto generation test suite failed:', error.message);
  }
}

// Individual test runners for specific functionality
async function runGenerationServerTest() {
  console.log('Running Generation Server Test');
  await testGenerationServer();
}

async function runSingleAutoAccountTest() {
  console.log('Running Single Auto Account Test');
  await testAutoAccountGeneration();
}

async function runMultipleAutoAccountsTest() {
  console.log('Running Multiple Auto Accounts Test');
  await testMultipleAutoAccounts();
}

module.exports = {
  testGenerationServer,
  createTestLedger,
  createTestIdentity,
  createTestBalance,
  testAutoAccountGeneration,
  testMultipleAutoAccounts,
  verifyAutoGeneratedAccounts,
  runAutoGenerationTests,
  runGenerationServerTest,
  runSingleAutoAccountTest,
  runMultipleAutoAccountsTest,
  getTestData: () => testData
};

if (require.main === module) {
  runAutoGenerationTests();
} 