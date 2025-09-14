import { ethers } from 'ethers';
import CounterABI from '../lib/contracts/Counter.json';
import deployment from '../lib/contracts/deployment.json';

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

export const getContract = (signer: ethers.Signer): ethers.Contract => {
  return new ethers.Contract(deployment.contractAddress, CounterABI.abi, signer);
};

export const connectToMetaMask = async (): Promise<{
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  account: string;
  networkName: string;
  chainId: number;
}> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const account = await signer.getAddress();
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const networkName = getNetworkName(chainId);

  return { provider, signer, account, networkName, chainId };
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
  return new ethers.Contract(networkDeployment.contractAddress, CounterABI.abi, signer);
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
