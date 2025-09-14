// Network configuration for the frontend
export enum NetworkType {
  LOCALHOST = 'localhost',
  WORLDCHAIN_SEPOLIA = 'worldcoin-sepolia',
  MONAD_TESTNET = 'monad-testnet',
}

// Current active network - change this to switch networks
export const ACTIVE_NETWORK: NetworkType = NetworkType.WORLDCHAIN_SEPOLIA;

// Network configuration object
export const NETWORK_CONFIG = {
  [NetworkType.LOCALHOST]: {
    name: 'localhost',
    displayName: 'Localhost 8545',
    chainId: 31337,
    isTestnet: true,
  },
  [NetworkType.WORLDCHAIN_SEPOLIA]: {
    name: 'worldcoin-sepolia',
    displayName: 'Worldcoin Sepolia Testnet',
    chainId: 4801,
    isTestnet: true,
  },
  [NetworkType.MONAD_TESTNET]: {
    name: 'monad-testnet',
    displayName: 'Monad Testnet',
    chainId: 20143,
    isTestnet: true,
  },
};

// Get active network configuration
export const getActiveNetworkConfig = () => NETWORK_CONFIG[ACTIVE_NETWORK];

// Get active network name
export const getActiveNetworkName = () => ACTIVE_NETWORK;

// Check if a network is currently active
export const isNetworkActive = (networkName: string) => networkName === ACTIVE_NETWORK;
