import { ethers } from 'ethers';
import CounterABI from '../../lib/contracts/CounterABI.json';
import deployment from '../../lib/contracts/deployment.json';
import { getActiveNetworkName } from './config';

export interface NetworkDeployment {
  contractAddress: string;
  chainId: number;
}

export interface DeploymentConfig {
  [networkName: string]: NetworkDeployment;
}

export interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  account: string | null;
  networkName: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getCount: () => Promise<number>;
  getCountWithoutWallet: (networkName: string) => Promise<number>;
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
  switchToNetwork: (networkName: string) => Promise<boolean>;
}
export const connectToMetaMask = async (): Promise<{
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  account: string;
  networkName: string;
  chainId: number;
}> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    // First, try to request permissions to ensure MetaMask shows the connection dialog
    console.log('Requesting MetaMask permissions...');
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
    } catch (permError) {
      // If wallet_requestPermissions is not supported, fall back to eth_requestAccounts
      console.warn('wallet_requestPermissions not supported, using eth_requestAccounts:', permError);
    }

    // Request account access - this should now show the account selection dialog
    console.log('Requesting MetaMask account access...');
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    const networkName = getNetworkName(chainId);

    console.log('MetaMask connection details:', { account, chainId, networkName });

    return { provider, signer, account, networkName, chainId };
  } catch (error) {
    console.error('MetaMask connection error:', error);
    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        throw new Error('User rejected the request to connect to MetaMask.');
      } else if (error.message.includes('Already processing')) {
        throw new Error('MetaMask is already processing a request. Please wait.');
      }
    }
    throw new Error('Failed to connect to MetaMask. Please try again.');
  }
};

// Network name mapping
export const getNetworkName = (chainId: number): string => {
  const networkMap: { [key: number]: string } = {
    31337: 'localhost',
    20143: 'monad-testnet', // Monad testnet chain ID
    4801: 'worldcoin-sepolia', // Worldcoin Sepolia testnet chain ID
  };
  return networkMap[chainId] || 'unknown';
};

export const getDeploymentForNetwork = (networkName: string): NetworkDeployment | null => {
  const config = deployment as DeploymentConfig;
  return config[networkName] || null;
};

export const getContractForNetwork = (
  signer: ethers.Signer,
  networkName: string
): ethers.Contract | null => {
  const networkDeployment = getDeploymentForNetwork(networkName);
  if (!networkDeployment || !networkDeployment.contractAddress) {
    return null;
  }
  return new ethers.Contract(networkDeployment.contractAddress, CounterABI, signer);
};

export const isNetworkSupported = (networkName: string): boolean => {
  const networkDeployment = getDeploymentForNetwork(networkName);
  return !!(networkDeployment && networkDeployment.contractAddress && networkDeployment.contractAddress !== "");
};

export const getSupportedNetworks = (): string[] => {
  const config = deployment as DeploymentConfig;
  const activeNetwork = getActiveNetworkName();
  return Object.keys(config).filter(networkName => {
    const deployment = config[networkName];
    return networkName === activeNetwork && deployment.contractAddress && deployment.contractAddress !== "";
  });
};

export const getSupportedNetworkDetails = (): { name: string; chainId: number; contractAddress: string }[] => {
  const config = deployment as DeploymentConfig;
  const activeNetwork = getActiveNetworkName();
  return Object.entries(config)
    .filter(([name, deployment]) => name === activeNetwork && deployment.contractAddress && deployment.contractAddress !== "")
    .map(([name, deployment]) => ({
      name,
      chainId: deployment.chainId,
      contractAddress: deployment.contractAddress
    }));
};

export const getReadOnlyContract = (networkName: string): ethers.Contract | null => {
  const networkDeployment = getDeploymentForNetwork(networkName);
  if (!networkDeployment || !networkDeployment.contractAddress) {
    return null;
  }
  
  // Create a read-only provider for the specific network
  let rpcUrl: string;
  if (networkName === 'localhost') {
    rpcUrl = 'http://localhost:8545';
  } else if (networkName === 'monad-testnet') {
    rpcUrl = 'https://testnet1.monad.xyz'; // Replace with actual Monad testnet RPC
  } else if (networkName === 'worldcoin-sepolia') {
    rpcUrl = 'https://worldchain-sepolia.g.alchemy.com/public';
  } else {
    return null;
  }
  
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    return new ethers.Contract(networkDeployment.contractAddress, CounterABI, provider);
  } catch (error) {
    console.error(`Failed to create read-only contract for ${networkName}:`, error);
    return null;
  }
};

export const switchToNetwork = async (networkName: string): Promise<boolean> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const networkDeployment = getDeploymentForNetwork(networkName);
  if (!networkDeployment) {
    throw new Error(`Network ${networkName} not supported`);
  }

  const chainIdHex = `0x${networkDeployment.chainId.toString(16)}`;

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    return true;
  } catch (switchError: any) {
    // If the network is not added to MetaMask, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdHex,
              chainName: getNetworkDisplayName(networkName),
              nativeCurrency: getNativeCurrency(networkName),
              rpcUrls: [getRpcUrl(networkName)],
              blockExplorerUrls: getBlockExplorerUrls(networkName),
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add network:', addError);
        return false;
      }
    } else {
      console.error('Failed to switch network:', switchError);
      return false;
    }
  }
};

const getNetworkDisplayName = (networkName: string): string => {
  const displayNames: { [key: string]: string } = {
    'localhost': 'Localhost 8545',
    'monad-testnet': 'Monad Testnet',
    'worldcoin-sepolia': 'Worldcoin Sepolia Testnet',
  };
  return displayNames[networkName] || networkName;
};

const getNativeCurrency = (networkName: string) => {
  const currencies: { [key: string]: { name: string; symbol: string; decimals: number } } = {
    'localhost': { name: 'ETH', symbol: 'ETH', decimals: 18 },
    'monad-testnet': { name: 'MONAD', symbol: 'MON', decimals: 18 },
    'worldcoin-sepolia': { name: 'ETH', symbol: 'ETH', decimals: 18 },
  };
  return currencies[networkName] || { name: 'ETH', symbol: 'ETH', decimals: 18 };
};

const getRpcUrl = (networkName: string): string => {
  const rpcUrls: { [key: string]: string } = {
    'localhost': 'http://localhost:8545',
    'monad-testnet': 'https://testnet1.monad.xyz',
    'worldcoin-sepolia': 'https://worldchain-sepolia.g.alchemy.com/public',
  };
  return rpcUrls[networkName] || '';
};

const getBlockExplorerUrls = (networkName: string): string[] => {
  const explorerUrls: { [key: string]: string[] } = {
    'localhost': ['http://localhost:8545'],
    'monad-testnet': ['https://monad-testnet.socialscan.io/'], // Replace with actual explorer
    'worldcoin-sepolia': ['https://sepolia.worldscan.org/'],
  };
  return explorerUrls[networkName] || [];
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
