// Blnk Auto Account Generation Test
// This file tests the complete auto account generation flow

const axios = require('axios');

// Configuration
const API_KEY = '425bb17c954657b03a002cbe71c44bd8f1d40bffbefe52accdf3a93099d4e2a1';
const BLNK_BASE_URL = 'http://localhost:5001';
const GENERATION_SERVER_URL = 'http://localhost:3001';

// Test data storage
let testData = {
  ledger_id: null,
  identity_id: null,
  balance_id: null,
  accounts: []
};

// Utility function for making HTTP requests to Blnk
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
      // Server responded with error status
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
      throw new Error(`HTTP ${error.response.status}: ${errorMessage}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response received from server');
    } else {
      // Something else happened
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

// Test the account generation server
async function testGenerationServer() {
  console.log('\n=== Testing Account Generation Server ===');
  
  try {
    // Test 1: Health check
    console.log('1. Testing generation server health...');
    const healthResponse = await axios.get(`${GENERATION_SERVER_URL}/health`);
    const healthData = healthResponse.data;
    
    if (healthData.status === 'healthy') {
      console.log('✅ Generation server is healthy');
    } else {
      throw new Error('Generation server health check failed');
    }
    
    // Test 2: Generate account details
    console.log('2. Testing account generation...');
    const genResponse = await axios.get(`${GENERATION_SERVER_URL}/generate`);
    const genData = genResponse.data;
    
    if (genData.account_number && genData.bank_name) {
      console.log('✅ Account generation working:');
      console.log(`   Account Number: ${genData.account_number}`);
      console.log(`   Bank Name: ${genData.bank_name}`);
    } else {
      throw new Error('Invalid response from generation server');
    }
    
    return genData;
    
  } catch (error) {
    console.error('❌ Generation server test failed:', error.message);
    throw error;
  }
}

// Setup function 1: Create Ledger
async function createTestLedger() {
  console.log('\n=== Creating Test Ledger ===');
  
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
    console.log('✅ Test ledger created:', ledger.ledger_id);
    return ledger;
    
  } catch (error) {
    console.error('❌ Failed to create test ledger:', error.message);
    throw error;
  }
}

// Setup function 2: Create Identity
async function createTestIdentity() {
  console.log('\n=== Creating Test Identity ===');
  
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
    console.log('✅ Test identity created:', identity.identity_id);
    return identity;
    
  } catch (error) {
    console.error('❌ Failed to create test identity:', error.message);
    throw error;
  }
}

// Setup function 3: Create Balance
async function createTestBalance() {
  console.log('\n=== Creating Test Balance ===');
  
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
    console.log('✅ Test balance created:', balance.balance_id);
    return balance;
    
  } catch (error) {
    console.error('❌ Failed to create test balance:', error.message);
    throw error;
  }
}

// Test function: Create Account with Auto Generation
async function testAutoAccountGeneration() {
  console.log('\n=== Testing Auto Account Generation ===');
  
  try {
    console.log('Creating account with auto-generated details...');
    
    // Create account WITHOUT providing bank_name and number
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
        // Note: bank_name and number will be auto-generated
      })
    });
    
    testData.accounts.push(account);
    console.log('✅ Auto-generated account created:');
    console.log(`   Account ID: ${account.account_id}`);
    console.log(`   Account Number: ${account.number}`);
    console.log(`   Bank Name: ${account.bank_name}`);
    console.log(`   Currency: ${account.currency}`);
    console.log(`   Balance ID: ${account.balance_id}`);
    console.log(`   Identity ID: ${account.identity_id}`);
    
    // Verify that account number and bank name were generated
    if (!account.number || !account.bank_name) {
      throw new Error('Account number or bank name was not auto-generated');
    }
    
    return account;
    
  } catch (error) {
    console.error('❌ Auto account generation failed:', error.message);
    throw error;
  }
}

// Test function: Create Multiple Auto-Generated Accounts
async function testMultipleAutoAccounts() {
  console.log('\n=== Testing Multiple Auto-Generated Accounts ===');
  
  try {
    const accounts = [];
    
    for (let i = 1; i <= 3; i++) {
      console.log(`Creating auto-generated account ${i}...`);
      
      const account = await makeBlnkRequest('/accounts', {
        method: 'POST',
        body: JSON.stringify({
          balance_id: testData.balance_id,
          identity_id: testData.identity_id,
          meta_data: {
            account_type: `auto_generated_${i}`,
            test: true,
            created_by: 'auto_generation_test',
            sequence: i
          }
        })
      });
      
      accounts.push(account);
      testData.accounts.push(account);
      
      console.log(`✅ Account ${i} created:`);
      console.log(`   Number: ${account.number}`);
      console.log(`   Bank: ${account.bank_name}`);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Verify uniqueness
    const accountNumbers = accounts.map(acc => acc.number);
    const uniqueNumbers = new Set(accountNumbers);
    
    if (accountNumbers.length === uniqueNumbers.size) {
      console.log('✅ All auto-generated account numbers are unique!');
    } else {
      console.log('❌ Duplicate account numbers found!');
    }
    
    // Verify bank variety
    const bankNames = accounts.map(acc => acc.bank_name);
    const uniqueBanks = new Set(bankNames);
    console.log(`✅ Generated ${uniqueBanks.size} different banks:`, Array.from(uniqueBanks));
    
    return accounts;
    
  } catch (error) {
    console.error('❌ Multiple auto account generation failed:', error.message);
    throw error;
  }
}

// Test function: Verify Auto-Generated Accounts
async function verifyAutoGeneratedAccounts() {
  console.log('\n=== Verifying Auto-Generated Accounts ===');
  
  try {
    for (let i = 0; i < testData.accounts.length; i++) {
      const account = testData.accounts[i];
      console.log(`Verifying account ${i + 1}: ${account.account_id}`);
      
      // Get the account details
      const retrievedAccount = await makeBlnkRequest(`/accounts/${account.account_id}`);
      
      console.log(`✅ Account ${i + 1} verified:`);
      console.log(`   Original Number: ${account.number}`);
      console.log(`   Retrieved Number: ${retrievedAccount.number}`);
      console.log(`   Original Bank: ${account.bank_name}`);
      console.log(`   Retrieved Bank: ${retrievedAccount.bank_name}`);
      
      // Verify the data matches
      if (account.number !== retrievedAccount.number || account.bank_name !== retrievedAccount.bank_name) {
        throw new Error(`Account ${i + 1} data mismatch`);
      }
    }
    
    console.log('✅ All auto-generated accounts verified successfully!');
    
  } catch (error) {
    console.error('❌ Account verification failed:', error.message);
    throw error;
  }
}

// Main test runner
async function runAutoGenerationTests() {
  console.log('🚀 Starting Blnk Auto Account Generation Tests');
  console.log('Make sure to:');
  console.log('1. The account generation server is running on http://localhost:3001');
  console.log('2. Blnk server is running on http://localhost:5001');
  console.log('3. Auto generation is configured in your blnk.json');
  console.log('');
  
  try {
    // Test 1: Verify generation server is working
    await testGenerationServer();
    
    // Test 2: Setup test data
    console.log('\n📋 Setting up test data...');
    await createTestLedger();
    await createTestIdentity();
    await createTestBalance();
    
    // Test 3: Create single auto-generated account
    await testAutoAccountGeneration();
    
    // Test 4: Create multiple auto-generated accounts
    await testMultipleAutoAccounts();
    
    // Test 5: Verify all accounts
    await verifyAutoGeneratedAccounts();
    
    console.log('\n🎉 All auto generation tests completed successfully!');
    console.log('');
    console.log('📊 Test Summary:');
    console.log(`   - Generation server: ✅`);
    console.log(`   - Test data setup: ✅`);
    console.log(`   - Single auto account: ✅`);
    console.log(`   - Multiple auto accounts: ✅`);
    console.log(`   - Account verification: ✅`);
    console.log(`   - Total accounts created: ${testData.accounts.length}`);
    console.log('');
    console.log('🔧 Auto account generation is working correctly!');
    
  } catch (error) {
    console.error('\n💥 Auto generation test suite failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure the generation server is running: npm start (in accounts-test folder)');
    console.log('   2. Check if auto generation is enabled in blnk.json');
    console.log('   3. Verify Blnk server is running and accessible');
    console.log('   4. Check the generation server logs for errors');
  }
}

// Individual test runners
async function runGenerationServerTest() {
  console.log('🚀 Running Generation Server Test');
  await testGenerationServer();
}

async function runSingleAutoAccountTest() {
  console.log('🚀 Running Single Auto Account Test');
  await createTestLedger();
  await createTestIdentity();
  await createTestBalance();
  await testAutoAccountGeneration();
}

async function runMultipleAutoAccountsTest() {
  console.log('🚀 Running Multiple Auto Accounts Test');
  await createTestLedger();
  await createTestIdentity();
  await createTestBalance();
  await testMultipleAutoAccounts();
}

// Export functions for individual testing
module.exports = {
  // Setup functions
  createTestLedger,
  createTestIdentity,
  createTestBalance,
  
  // Test functions
  testGenerationServer,
  testAutoAccountGeneration,
  testMultipleAutoAccounts,
  verifyAutoGeneratedAccounts,
  
  // Runner functions
  runAutoGenerationTests,
  runGenerationServerTest,
  runSingleAutoAccountTest,
  runMultipleAutoAccountsTest,
  
  // Test data access
  getTestData: () => testData
};

// If running directly (not imported), run all tests
if (require.main === module) {
  runAutoGenerationTests();
} 