# Worldcoin Sepolia Network Deployment

This guide explains how to deploy the Counter contract to the Worldcoin Sepolia network (Chain ID: 4801) and configure the frontend to interact with it.

## Prerequisites

1. **Node.js and npm/yarn** installed
2. **Foundry** installed (`curl -L https://foundry.paradigm.xyz | bash` then `foundryup`)
3. **MetaMask** or compatible wallet
4. **Worldcoin Sepolia testnet ETH** for gas fees

## Smart Contract Deployment

### 1. Set up Environment Variables

Create a `.env` file in the `contracts/` directory:

```bash
cd contracts
# Create .env file with your private key (without 0x prefix)
echo "PRIVATE_KEY=your_private_key_here" > .env
```

**⚠️ Security Note**: Never commit your `.env` file to version control. The private key should be for a testnet account only.

### 2. Deploy to Worldcoin Sepolia

Run the deployment script:

```bash
cd contracts
./deploy-worldcoin.sh
```

This script will:
- Deploy the Counter contract to Worldcoin Sepolia (Chain ID: 4801)
- Verify the contract on the block explorer
- Automatically update the frontend configuration with the deployed contract address

### 3. Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
cd contracts
source .env
forge script script/Counter.s.sol:CounterScript \
    --rpc-url worldcoin_sepolia \
    --broadcast \
    --verify \
    --chain-id 4801
```

Then manually update the frontend configuration:

```bash
node update-frontend-deployment.js <deployed_contract_address> worldcoin-sepolia
```

## Frontend Configuration

The frontend has been pre-configured to support Worldcoin Sepolia network with the following settings:

- **Network Name**: Worldcoin Sepolia Testnet
- **Chain ID**: 4801
- **RPC URL**: `https://worldchain-sepolia.g.alchemy.com/public`
- **Block Explorer**: `https://worldchain-sepolia.blockscout.com`
- **Native Currency**: ETH
- **Contract Address**: 0x7Abd2FA01F7C3002538B191a2D1F1d63b7d5CD8f (configurable)

## Using the Application

### 1. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 2. Connect to Worldcoin Sepolia

1. Open the application in your browser
2. Click "Connect Wallet"
3. If prompted, add the Worldcoin Sepolia network to MetaMask
4. Switch to the Worldcoin Sepolia network
5. The application will automatically load the deployed contract

### 3. Interact with the Contract

Once connected to the correct network, you can:
- View the current counter value
- Increment the counter
- Decrement the counter

## Network Configuration Details

The application supports multiple networks:

| Network | Chain ID | Status |
|---------|----------|--------|
| Localhost | 31337 | ✅ Configured |
| Monad Testnet | 20143 | ⚠️ Placeholder |
| Worldcoin Sepolia | 4801 | ✅ Configured |

## Troubleshooting

### Common Issues

1. **"Network not supported" error**
   - Ensure you're connected to Worldcoin Sepolia (Chain ID: 4801)
   - Try switching networks in MetaMask

2. **"Contract not found" error**
   - Verify the contract address in `frontend/lib/contracts/deployment.json`
   - Ensure the contract was deployed successfully

3. **Transaction failures**
   - Check you have sufficient ETH for gas fees
   - Verify you're on the correct network

### Getting Testnet ETH

To get testnet ETH for Worldcoin Sepolia:
1. Visit the Worldcoin faucet (if available)
2. Or bridge testnet ETH from other networks
3. Ensure you have enough for gas fees

## Files Modified

### Smart Contract Files
- `contracts/foundry.toml` - Added Worldcoin Sepolia RPC endpoint
- `contracts/script/Counter.s.sol` - Updated to load private key from environment
- `contracts/deploy-worldcoin.sh` - Deployment script for Worldcoin Sepolia
- `contracts/update-frontend-deployment.js` - Script to update frontend config

### Frontend Files
- `frontend/src/lib/web3.ts` - Added Worldcoin Sepolia network configuration
- `frontend/lib/contracts/deployment.json` - Added contract address for Worldcoin Sepolia

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Testnet Only**: This configuration is for testnet use only
3. **Environment Variables**: Use `.env` files for sensitive configuration
4. **Contract Verification**: Always verify contracts on block explorers

## Next Steps

After successful deployment:
1. Test all contract functions through the frontend
2. Verify the contract on the block explorer
3. Document any network-specific behaviors
4. Consider implementing additional error handling for network-specific issues
