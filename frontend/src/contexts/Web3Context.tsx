'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Web3ContextType,
  connectToMetaMask,
  getContractForNetwork,
  getNetworkName,
  isNetworkSupported,
  getSupportedNetworks,
  getReadOnlyContract,
} from '../lib/web3';
import toast from 'react-hot-toast';

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      const {
        provider: newProvider,
        signer: newSigner,
        account: newAccount,
        networkName: newNetworkName,
        chainId: newChainId,
      } = await connectToMetaMask();

      console.log('MetaMask connection successful:', { account: newAccount, networkName: newNetworkName });

      const newContract = getContractForNetwork(newSigner, newNetworkName);
      const networkSupported = isNetworkSupported(newNetworkName);

      if (!newContract) {
        console.warn(`No contract deployed on ${newNetworkName} network`);
        toast.error(`No contract deployed on ${newNetworkName} network`);
      }

      setProvider(newProvider);
      setSigner(newSigner);
      setContract(newContract);
      setAccount(newAccount);
      setNetworkName(newNetworkName);
      setChainId(newChainId);
      setIsCorrectNetwork(networkSupported);

      toast.success(`Wallet connected to ${newNetworkName}!`);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      // Clear all state
      setProvider(null);
      setSigner(null);
      setContract(null);
      setAccount(null);
      setNetworkName(null);
      setChainId(null);
      setIsCorrectNetwork(false);
      
      // Clear any cached permissions in MetaMask (if supported)
      if (window.ethereum && window.ethereum.request) {
        try {
          // This will revoke the connection permission and force MetaMask to show the dialog next time
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [{ eth_accounts: {} }]
          });
        } catch (error) {
          // wallet_revokePermissions might not be supported in all MetaMask versions
          console.warn('wallet_revokePermissions not supported:', error);
        }
      }
      
      toast.success('Wallet disconnected - MetaMask will prompt for reconnection');
    } catch (error) {
      console.error('Error during disconnect:', error);
      toast.success('Wallet disconnected');
    }
  }, []);

  const getCount = useCallback(async (): Promise<number> => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    const count = await contract.count();
    return Number(count);
  }, [contract]);

  const getCountWithoutWallet = useCallback(async (networkName: string): Promise<number> => {
    const readOnlyContract = getReadOnlyContract(networkName);
    if (!readOnlyContract) {
      throw new Error(`No contract available for network: ${networkName}`);
    }
    const count = await readOnlyContract.count();
    return Number(count);
  }, []);

  const increment = useCallback(async () => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await contract.increment();
      toast.loading('Incrementing counter...', { id: 'increment' });

      await tx.wait();
      toast.success('Counter incremented successfully!', { id: 'increment' });
    } catch (error) {
      console.error('Failed to increment:', error);
      toast.error('Failed to increment counter', { id: 'increment' });
      throw error;
    }
  }, [contract]);

  const decrement = useCallback(async () => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await contract.decrement();
      toast.loading('Decrementing counter...', { id: 'decrement' });

      await tx.wait();
      toast.success('Counter decremented successfully!', { id: 'decrement' });
    } catch (error) {
      console.error('Failed to decrement:', error);
      toast.error('Failed to decrement counter', { id: 'decrement' });
      throw error;
    }
  }, [contract]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          // User disconnected from MetaMask, clear our state
          disconnectWallet();
        } else if (account && accounts[0] !== account) {
          // Account changed in MetaMask, disconnect to force manual reconnection
          toast('Account changed in MetaMask. Please reconnect to continue.', {
            icon: 'ℹ️',
            duration: 4000,
          });
          disconnectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [account, disconnectWallet]);

  // Listen for network changes
  useEffect(() => {
    if (window.ethereum && signer) {
      const handleChainChanged = async (...args: unknown[]) => {
        const newChainId = args[0] as string;
        const numericChainId = parseInt(newChainId, 16);
        const newNetworkName = getNetworkName(numericChainId);

        setChainId(numericChainId);
        setNetworkName(newNetworkName);

        // Update contract for new network
        const newContract = getContractForNetwork(signer, newNetworkName);
        const networkSupported = isNetworkSupported(newNetworkName);
        setContract(newContract);
        setIsCorrectNetwork(networkSupported);

        if (!newContract) {
          toast.error(`Switched to ${newNetworkName} network - No contract deployed here`);
        } else {
          toast.success(`Switched to ${newNetworkName} network - Contract available!`);
        }
      };

      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [signer]);

  const value: Web3ContextType = {
    provider,
    signer,
    contract,
    account,
    networkName,
    chainId,
    isConnecting,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    getCount,
    getCountWithoutWallet,
    increment,
    decrement,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
