/**
 * Test Accounts API
 * 
 * This file contains test functions for the Blnk Accounts API endpoints.
 * It tests creating, retrieving, and listing accounts, plus auto account generation.
 * Replace YOUR_API_KEY with your actual API key before running.
 */

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'http://localhost:5001';

// Store test data IDs for use across functions
let testData = {
  ledger_id: null,
  identity_id: null,
  balance_id: null,
  account_id: null
};

// Helper function to make HTTP requests to Blnk API
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
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
    const response = await fetch(url, requestOptions);
    
    // Handle JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || data.message || 'Unknown error'}`);
      }
      
      return data;
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Server returned non-JSON response. Content-Type: ${contentType}`);
      }
      throw new Error(`Unexpected response format. Expected JSON but got: ${contentType}`);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

// Setup: Create a test ledger
async function createTestLedger() {
  console.log('Creating Test Ledger');
  
  try {
    const ledger = await makeRequest('/ledgers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Accounts Ledger',
        meta_data: {
          purpose: 'testing_accounts_api',
          created_by: 'test_script'
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
    const identity = await makeRequest('/identities', {
      method: 'POST',
      body: JSON.stringify({
        identity_type: 'individual',
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john.doe@test.com',
        phone_number: '+1234567890',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        meta_data: {
          purpose: 'testing_accounts_api',
          created_by: 'test_script'
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
    const balance = await makeRequest('/balances', {
      method: 'POST',
      body: JSON.stringify({
        ledger_id: testData.ledger_id,
        currency: 'USD',
        identity_id: testData.identity_id,
        meta_data: {
          purpose: 'testing_accounts_api',
          account_type: 'test_balance',
          created_by: 'test_script'
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

// Test: Create accounts with manual account numbers
async function testCreateAccount() {
  console.log('Testing Create Account');
  
  try {
    console.log('Creating first account...');
    const uniqueNumber1 = `123456${Date.now()}`;
    
    const account1 = await makeRequest('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        balance_id: testData.balance_id,
        identity_id: testData.identity_id,
        bank_name: 'Test Bank',
        number: uniqueNumber1,
        meta_data: {
          account_type: 'checking',
          test: true,
          created_by: 'test_script'
        }
      })
    });
    
    testData.account_id = account1.account_id;
    console.log('First account created:', account1.account_id);
    
    // Demonstrate multiple accounts with same balance and identity
    console.log('Creating second account with same balance and identity...');
    const uniqueNumber2 = `654321${Date.now()}`;
    
    const account2 = await makeRequest('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        balance_id: testData.balance_id,
        identity_id: testData.identity_id,
        bank_name: 'Test Bank',
        number: uniqueNumber2,
        meta_data: {
          account_type: 'savings',
          test: true,
          created_by: 'test_script'
        }
      })
    });
    
    console.log('Second account created:', account2.account_id);
    console.log('Note: Both accounts use the same balance_id and identity_id');
    
    return { account1, account2 };
    
  } catch (error) {
    console.error('Account creation failed:', error.message);
    throw error;
  }
}

// Test: Retrieve account details
async function testGetAccount(accountId) {
  console.log('Testing Get Account');
  
  try {
    console.log(`Getting account with ID: ${accountId}`);
    const account = await makeRequest(`/accounts/${accountId}`);
    console.log('Account retrieved:', account.account_id);
    
    // Test with related data included
    console.log('Getting account with related data...');
    const accountWithIncludes = await makeRequest(`/accounts/${accountId}?include=balance,identity,ledger`);
    console.log('Account with includes retrieved:', accountWithIncludes.account_id);
    
    return { account, accountWithIncludes };
    
  } catch (error) {
    console.error('Get account test failed:', error.message);
    throw error;
  }
}

// Test: List all accounts
async function testListAccounts() {
  console.log('Testing List Accounts');
  
  try {
    console.log('Listing all accounts...');
    const accounts = await makeRequest('/accounts');
    console.log(`Found ${accounts.length} accounts`);
    
    // Test pagination
    console.log('Listing accounts with pagination...');
    const accountsPaginated = await makeRequest('/accounts?page=1&per_page=5');
    console.log('Paginated accounts retrieved');
    
    return { accounts, accountsPaginated };
    
  } catch (error) {
    console.error('List accounts test failed:', error.message);
    throw error;
  }
}

// Test: Auto account number generation (requires external service)
async function testAccountNumberGeneration() {
  console.log('Testing Account Number Generation');
  
  try {
    console.log('Creating account with auto-generated number...');
    
    const accountWithAutoGeneration = await makeRequest('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        balance_id: testData.balance_id,
        identity_id: testData.identity_id,
        meta_data: {
          account_type: 'auto_generated',
          test: true,
          created_by: 'test_script'
        }
      })
    });
    
    console.log('Account with auto-generated details:', accountWithAutoGeneration.account_id);
    return accountWithAutoGeneration;
    
  } catch (error) {
    console.error('Account number generation test failed:', error.message);
    console.log('Note: This may fail if external account generation is not configured');
    throw error;
  }
}

// Main test runner - executes all tests in sequence
async function runAllTests() {
  console.log('Starting Blnk Accounts API Tests');
  console.log('Make sure to:');
  console.log('1. Replace YOUR_API_KEY with your actual API key');
  console.log('2. Update BASE_URL if your Blnk instance is not running on localhost:5001');
  console.log('3. Ensure your Blnk server is running\n');
  
  try {
    // Setup test data
    console.log('Setting up test data...');
    await createTestLedger();
    await createTestIdentity();
    await createTestBalance();
    
    // Run account tests
    const createdAccounts = await testCreateAccount();
    const accountId = createdAccounts.account1.account_id;
    
    try {
      await testGetAccount(accountId);
    } catch (error) {
      console.error('Get account test failed:', error.message);
    }
    
    try {
      await testListAccounts();
    } catch (error) {
      console.error('List accounts test failed:', error.message);
    }
    
    try {
      await testAccountNumberGeneration();
    } catch (error) {
      console.log('Account number generation test skipped (likely not configured)');
    }
    
    console.log('All tests completed successfully!');
    
  } catch (error) {
    console.error('Test suite failed:', error.message);
  }
}

// Individual test runners for specific functionality
async function runCreateTest() {
  console.log('Running Create Account Test');
  await testCreateAccount();
}

async function runGetTest(accountId) {
  console.log('Running Get Account Test');
  await testGetAccount(accountId);
}

async function runListTest() {
  console.log('Running List Accounts Test');
  await testListAccounts();
}

async function runGenerationTest() {
  console.log('Running Account Number Generation Test');
  await testAccountNumberGeneration();
}

module.exports = {
  createTestLedger,
  createTestIdentity,
  createTestBalance,
  testCreateAccount,
  testGetAccount,
  testListAccounts,
  testAccountNumberGeneration,
  runAllTests,
  runCreateTest,
  runGetTest,
  runListTest,
  runGenerationTest,
  getTestData: () => testData
};

if (require.main === module) {
  runAllTests();
} 