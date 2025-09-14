#!/usr/bin/env node

/**
 * Update deployment information for the Web3 Counter DApp
 * Usage: node update-deployment.js <network> <contractAddress>
 * Example: node update-deployment.js localhost 0x5FbDB2315678afecb367f032d93F642f64180aa3
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
/* eslint-enable @typescript-eslint/no-require-imports */

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('Usage: node update-deployment.js <network> <contractAddress>');
  console.error(
    'Example: node update-deployment.js localhost 0x5FbDB2315678afecb367f032d93F642f64180aa3'
  );
  process.exit(1);
}

const [network, contractAddress] = args;

// Validate contract address format
if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
  console.error(
    'Invalid contract address format. Must be a 42-character hex string starting with 0x'
  );
  process.exit(1);
}

const deploymentPath = path.join(__dirname, 'lib', 'contracts', 'deployment.json');

// Read current deployment file
let deployment;
try {
  const deploymentContent = fs.readFileSync(deploymentPath, 'utf8');
  deployment = JSON.parse(deploymentContent);
} catch (error) {
  console.error('Error reading deployment.json:', error.message);
  process.exit(1);
}

// Update the specified network
const networkKey = network.toLowerCase();
if (!deployment[networkKey]) {
  console.error(
    `Network "${network}" not found in deployment.json. Available networks:`,
    Object.keys(deployment)
  );
  process.exit(1);
}

deployment[networkKey].contractAddress = contractAddress;

// Write back to file
try {
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log(`✅ Updated ${network} contract address to: ${contractAddress}`);
  console.log(`📄 deployment.json has been updated successfully!`);
} catch (error) {
  console.error('Error writing deployment.json:', error.message);
  process.exit(1);
}
