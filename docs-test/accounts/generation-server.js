/**
 * Account Generation Server
 * 
 * This server provides external account number and bank name generation for Blnk.
 * It runs on port 3001 and exposes endpoints for generating realistic account details.
 * Used with Blnk's external account generation feature.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Sample bank data for generating realistic account information
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

// Generate account number using timestamp and random number
function generateAccountNumber(prefix) {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}${random}`;
}

// Select a random bank from the available options
function generateBankName() {
  return banks[Math.floor(Math.random() * banks.length)];
}

// Main endpoint: Generate account number and bank name
app.get('/generate', (req, res) => {
  try {
    // Select random bank and generate account number
    const bank = generateBankName();
    const accountNumber = generateAccountNumber(bank.prefix);
    
    const response = {
      account_number: accountNumber,
      bank_name: bank.name
    };
    
    console.log('Generated:', response);
    
    // Add small delay to simulate processing time
    setTimeout(() => {
      res.json(response);
    }, 100);
    
  } catch (error) {
    console.error('Error generating account:', error);
    res.status(500).json({
      error: 'Failed to generate account details'
    });
  }
});

// Health check endpoint for monitoring
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

// Root endpoint with server information
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

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// 404 handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: ['GET /generate', 'GET /health', 'GET /']
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Account Generation Server running on http://localhost:${PORT}`);
  console.log('Endpoints: /generate, /health, /');
});

module.exports = app; 