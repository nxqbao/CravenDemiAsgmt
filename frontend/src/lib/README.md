# Frontend Configuration

## Network Configuration

The frontend is configured to work with a single active network at a time. To change the network the frontend uses:

1. Open `src/lib/config.ts`
2. Change the `ACTIVE_NETWORK` constant to one of the available network types:

```typescript
// Available networks:
export enum NetworkType {
  LOCALHOST = 'localhost',
  WORLDCHAIN_SEPOLIA = 'worldcoin-sepolia',
  MONAD_TESTNET = 'monad-testnet'
}

// Change this line to switch networks:
export const ACTIVE_NETWORK: NetworkType = NetworkType.WORLDCHAIN_SEPOLIA; // or LOCALHOST or MONAD_TESTNET
```

3. Make sure the contract is deployed to the selected network and the deployment address is updated in `lib/contracts/deployment.json`

## Available Networks

- **LOCALHOST**: Local development network (Chain ID: 31337)
- **WORLDCHAIN_SEPOLIA**: Worldcoin Sepolia testnet (Chain ID: 4801)
- **MONAD_TESTNET**: Monad testnet (Chain ID: 20143)

## Adding New Networks

To add a new network:

1. Add the network to the `NetworkType` enum
2. Add the network configuration to the `NETWORK_CONFIG` object
3. Deploy the contract to the new network
4. Update `lib/contracts/deployment.json` with the deployment details
5. Set `ACTIVE_NETWORK` to the new network

The frontend will automatically adapt to show only the active network's contract information and restrict all operations to that network.
