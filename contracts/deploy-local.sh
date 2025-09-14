#!/bin/bash

# Start Anvil in the background
echo "Starting Anvil local network..."
anvil --host 0.0.0.0 --port 8545 > anvil.log 2>&1 &
ANVIL_PID=$!

# Wait for Anvil to start
sleep 3

# Deploy the contract
echo "Deploying Counter contract..."
forge script script/Counter.s.sol:CounterScript --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Extract contract address from the output
CONTRACT_ADDRESS=$(grep "Contract created:" anvil.log | tail -1 | awk '{print $3}')

# Build the project to generate ABI
echo "Building project to generate ABI..."
forge build

# Create deployment info file
echo "Creating deployment info..."
mkdir -p ../frontend/lib/contracts
cat > ../frontend/lib/contracts/deployment.json << EOF
{
  "localhost": {
    "contractAddress": "$CONTRACT_ADDRESS",
    "chainId": 31337
  },
  "monad-testnet": {
    "contractAddress": "",
    "chainId": 0
  }
}
EOF

# Copy ABI file
cp out/Counter.sol/Counter.json ../frontend/lib/contracts/

# Extract and copy ABI-only file
node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('out/Counter.sol/Counter.json', 'utf8')); fs.writeFileSync('../frontend/lib/contracts/CounterABI.json', JSON.stringify(data.abi, null, 2));"

echo "Deployment complete!"
echo "Contract Address: $CONTRACT_ADDRESS"
echo "ABI and deployment info exported to frontend/lib/contracts/"

# Kill Anvil
kill $ANVIL_PID
