# Blnk Accounts Testing Suite

This directory contains a comprehensive testing suite for Blnk's Accounts API, including an external account generation server and various test scripts.

## 📁 File Structure

```
accounts/
├── generation-server.js          # External account generation server
├── test-accounts-api.js          # Test general accounts API endpoints
├── test-auto-account-generation.js # Test auto account generation feature
├── test-generation-server.js     # Test the generation server
├── blnk-config.json             # Blnk configuration for auto generation
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Account Generation Server

```bash
npm start
```

The server will start on `http://localhost:3001` and provide auto-generated account numbers and bank names.

### 3. Configure Blnk

Install and deploy [Blnk Core](https://docs.blnkfinance.com/home/install)

Add the following configuration to your `blnk.json` file:

```json
{
  "project_name": "Blnk",
  "data_source": {
    "dns": "postgres://postgres:password@postgres:5432/blnk?sslmode=disable"
  },
  "redis": {
    "dns": "redis:6379"
  },
  "server": {
    "port": "5001",
    "secret_key": "YOUR_SECRET_KEY"
  },
  "account_number_generation": {
    "enable_auto_generation": true,
    "http_service": {
      "url": "http://host.docker.internal:3001/generate",
      "timeout": 30,
      "headers": {}
    }
  }
} 
```

**Useful tip:**

If the Blnk Docker is unable to reach `http://localhost:3001/generate` on your machine, update the url to `http://host.docker.internal:3001/generate`.

It is the same thing. It just points Docker to the localhost of your machine, instead of the localhost of the Docker itself.

### 4. Restart Your Blnk Server

After adding the configuration, restart your Blnk server for the changes to take effect.

## 🧪 Running Tests

### Test 1: Generation Server

Test that the account generation server is working correctly:

```bash
node test-generation-server.js
```

**What it tests:**
- ✅ Server health check
- ✅ Server information endpoint
- ✅ Account generation (5 accounts)
- ✅ Account number uniqueness
- ✅ Bank name variety

### Test 2: General Accounts API

Test the basic accounts API functionality:

```bash
node test-accounts-api.js
```

**What it tests:**
- ✅ Create ledger, identity, and balance
- ✅ Create accounts (with manual details)
- ✅ Get account by ID
- ✅ List all accounts
- ✅ Multiple accounts with same balance/identity

### Test 3: Auto Account Generation

Test the complete auto generation flow with Blnk:

```bash
node test-auto-account-generation.js
```

**What it tests:**
- ✅ Generation server connectivity
- ✅ Create test data (ledger, identity, balance)
- ✅ Create account with auto-generated details
- ✅ Create multiple auto-generated accounts
- ✅ Verify account data persistence

## 📋 Test Descriptions

### `generation-server.js`
**Purpose**: External HTTP server that generates account numbers and bank names
**Port**: 3001
**Endpoints**:
- `GET /generate` - Generate account number and bank name
- `GET /health` - Health check
- `GET /` - Server information

### `test-generation-server.js`
**Purpose**: Test the generation server in isolation
**Dependencies**: Generation server must be running
**Output**: Verifies server health and generates sample accounts

### `test-accounts-api.js`
**Purpose**: Test basic accounts API functionality
**Dependencies**: Blnk server must be running
**Output**: Creates test data and tests account CRUD operations

### `test-auto-account-generation.js`
**Purpose**: Test the complete auto generation integration
**Dependencies**: Both generation server and Blnk server must be running
**Output**: Tests the full flow from auto generation to account creation

## 🔧 Configuration

### Environment Variables

- `PORT` - Generation server port (default: 3001)
- `API_KEY` - Your Blnk API key (hardcoded in test files)

### Blnk Configuration

The `blnk-config.json` file contains the configuration needed for auto generation:

```json
{
  "account_number_generation": {
    "enable_auto_generation": true,
    "http_service": {
      "url": "http://localhost:3001/generate",
      "timeout": 30,
      "headers": {}
    }
  }
}
```

## 📊 Expected Results

### Generation Server Test
```
🧪 Testing Account Generation Server

1. Testing health check...
✅ Health check passed: healthy

2. Testing server info...
✅ Server info retrieved

3. Testing account generation...
✅ Account 1: Number: BLNK1234567890, Bank: Blnk Bank
✅ Account 2: Number: DFB7890123456, Bank: Digital First Bank
...

4. Verifying account number uniqueness...
✅ All account numbers are unique!

5. Verifying bank names...
✅ Generated 5 different banks

🎉 All tests passed!
```

### Auto Generation Test
```
🚀 Starting Blnk Auto Account Generation Tests

=== Testing Account Generation Server ===
✅ Generation server is healthy
✅ Account generation working

=== Creating Test Ledger ===
✅ Test ledger created: ldg_123456789

=== Creating Test Identity ===
✅ Test identity created: idt_123456789

=== Creating Test Balance ===
✅ Test balance created: bln_123456789

=== Testing Auto Account Generation ===
✅ Auto-generated account created:
   Account ID: acc_123456789
   Account Number: BLNK1234567890
   Bank Name: Blnk Bank

🎉 All auto generation tests completed successfully!
```

## 🛠️ Troubleshooting

### Generation Server Won't Start
- Check if port 3001 is available
- Ensure Node.js 14+ is installed
- Verify all dependencies are installed

### Blnk Can't Connect to Generation Server
- Ensure the generation server is running on port 3001
- Check firewall settings
- Verify the URL in blnk.json configuration
- Check CORS settings if needed

### Auto Generation Fails
- Check generation server logs for errors
- Verify the `/generate` endpoint is accessible
- Ensure the response format matches Blnk's expectations
- Check if auto generation is enabled in blnk.json

### Test Failures
- Ensure both servers are running
- Check API key is correct
- Verify network connectivity
- Check server logs for detailed error messages

## 🔄 Development

### Adding New Banks

Edit the `banks` array in `generation-server.js`:

```javascript
const banks = [
  { name: 'New Bank Name', prefix: 'NBN' },
  // ... existing banks
];
```

### Customizing Account Number Format

Modify the `generateAccountNumber` function in `generation-server.js` to change the format.

Learn more about [account number generation](https://docs.blnkfinance.com/accounts/overview)

### Running Individual Tests

You can import and run individual test functions:

```javascript
const { testGenerationServer, testAutoAccountGeneration } = require('./test-auto-account-generation.js');

// Run specific tests
await testGenerationServer();
await testAutoAccountGeneration();
```

## 📝 API Reference

### Generation Server Endpoints

#### GET /generate
Generates a new account number and bank name.

**Response:**
```json
{
  "account_number": "BLNK1234567890",
  "bank_name": "Blnk Bank"
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "account-generation-server",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Blnk Accounts API

#### POST /accounts
Create a new account (with or without auto generation).

**With Auto Generation:**
```json
{
  "balance_id": "bal_123456789",
  "identity_id": "id_123456789",
  "meta_data": {
    "account_type": "checking"
  }
}
```

**Manual Creation:**
```json
{
  "balance_id": "bal_123456789",
  "identity_id": "id_123456789",
  "bank_name": "Manual Bank",
  "number": "1234567890",
  "meta_data": {
    "account_type": "checking"
  }
}
```

## 📄 License

MIT License 