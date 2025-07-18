const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Bank data for generating realistic account information
const banks = [
  { name: 'Blnk Bank', prefix: 'BLNK' },
  { name: 'Digital First Bank', prefix: 'DFB' },
  { name: 'Tech Finance Bank', prefix: 'TFB' },
  { name: 'Innovation Bank', prefix: 'INB' },
  { name: 'Future Banking Corp', prefix: 'FBC' },
  { name: 'Smart Money Bank', prefix: 'SMB' },
  { name: 'Digital Trust Bank', prefix: 'DTB' },
  { name: 'Next Gen Banking', prefix: 'NGB' }
];

// Generate a random account number
function generateAccountNumber(prefix) {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}${random}`;
}

// Generate a random bank name
function generateBankName() {
  return banks[Math.floor(Math.random() * banks.length)];
}

// Main endpoint for account generation
app.get('/generate', (req, res) => {
  try {
    console.log('📝 Received account generation request');
    console.log('Headers:', req.headers);
    console.log('Query params:', req.query);
    
    // Select a random bank
    const bank = generateBankName();
    
    // Generate account number with bank prefix
    const accountNumber = generateAccountNumber(bank.prefix);
    
    const response = {
      account_number: accountNumber,
      bank_name: bank.name
    };
    
    console.log('✅ Generated account details:', response);
    
    // Add a small delay to simulate processing time
    setTimeout(() => {
      res.json(response);
    }, 100);
    
  } catch (error) {
    console.error('❌ Error generating account:', error);
    res.status(500).json({
      error: 'Failed to generate account details',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'account-generation-server',
    timestamp: new Date().toISOString(),
    endpoints: {
      generate: '/generate',
      health: '/health'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Account Generation Server for Blnk',
    version: '1.0.0',
    endpoints: {
      generate: 'GET /generate - Generate account number and bank name',
      health: 'GET /health - Health check'
    },
    usage: 'This server is designed to work with Blnk\'s external account generation feature'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: ['GET /generate', 'GET /health', 'GET /']
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Account Generation Server started');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log(`   GET http://localhost:${PORT}/generate - Generate account details`);
  console.log(`   GET http://localhost:${PORT}/health - Health check`);
  console.log(`   GET http://localhost:${PORT}/ - Server info`);
  console.log('');
  console.log('🔧 To use with Blnk:');
  console.log('   1. Add the configuration to your blnk.json file');
  console.log('   2. Restart your Blnk server');
  console.log('   3. Create accounts without providing bank_name and number');
  console.log('');
  console.log('📝 Example request:');
  console.log(`   curl http://localhost:${PORT}/generate`);
  console.log('');
  console.log('📝 Example response:');
  console.log('   {');
  console.log('     "account_number": "BLNK1234567890",');
  console.log('     "bank_name": "Blnk Bank"');
  console.log('   }');
});

module.exports = app; 