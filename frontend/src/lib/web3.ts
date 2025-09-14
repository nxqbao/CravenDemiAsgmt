import { ethers } from 'ethers';
import CounterABI from '../../lib/contracts/CounterABI.json';
import deployment from '../../lib/contracts/deployment.json';

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
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getCount: () => Promise<number>;
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
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
    // Request account access
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

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
