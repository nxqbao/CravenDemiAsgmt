#!/bin/bash

# Deploy to Monad testnet network
# Make sure to create a .env file with your DEPLOYER_PRIVATE_KEY

echo "Deploying Counter contract to Monad testnet network..."

# Load environment variables
source .env

# Deploy using forge
forge script script/Counter.s.sol:CounterScript \
    --rpc-url monad_testnet \
    --broadcast \
    --verify \
    --chain-id 20143

echo "Deployment completed!"

# Extract the deployed contract address from the broadcast logs
LATEST_RUN=$(find broadcast/Counter.s.sol/20143/ -name "run-*.json" | sort -V | tail -1)

if [ -f "$LATEST_RUN" ]; then
    CONTRACT_ADDRESS=$(jq -r '.transactions[0].contractAddress' "$LATEST_RUN")
    if [ "$CONTRACT_ADDRESS" != "null" ] && [ "$CONTRACT_ADDRESS" != "" ]; then
        echo "Contract deployed at: $CONTRACT_ADDRESS"

        # Update the frontend deployment configuration
        node update-frontend-deployment.js "$CONTRACT_ADDRESS" "monad-testnet"

        echo "Frontend configuration updated with new contract address!"
    else
        echo "Could not extract contract address from broadcast logs."
        echo "Please manually update the frontend deployment configuration."
    fi
else
    echo "Broadcast logs not found. Please check the deployment manually."
fi

echo "Check the broadcast logs for detailed deployment information."
