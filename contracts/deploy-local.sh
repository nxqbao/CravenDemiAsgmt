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
CONTRACT_ADDRESS=$(grep "Counter deployed at:" anvil.log | tail -1 | awk '{print $4}')

# Build the project to generate ABI
echo "Building project to generate ABI..."
forge build

# Create deployment info file
echo "Creating deployment info..."
mkdir -p ../frontend/lib/contracts
cat > ../frontend/lib/contracts/deployment.json << EOF
{
  "contractAddress": "$CONTRACT_ADDRESS",
  "network": "localhost",
  "chainId": 31337
}
EOF

# Copy ABI file
cp out/Counter.sol/Counter.json ../frontend/lib/contracts/

echo "Deployment complete!"
echo "Contract Address: $CONTRACT_ADDRESS"
echo "ABI and deployment info exported to frontend/lib/contracts/"

# Kill Anvil
kill $ANVIL_PID
