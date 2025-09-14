'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Web3ContextType,
  connectToMetaMask,
  getContractForNetwork,
  getNetworkName,
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

      const newContract = getContractForNetwork(newSigner, newNetworkName);

      if (!newContract) {
        toast.error(`No contract deployed on ${newNetworkName} network`);
      }

      setProvider(newProvider);
      setSigner(newSigner);
      setContract(newContract);
      setAccount(newAccount);
      setNetworkName(newNetworkName);
      setChainId(newChainId);

      toast.success(`Wallet connected to ${newNetworkName}!`);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Make sure MetaMask is installed.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setNetworkName(null);
    setChainId(null);
    toast.success('Wallet disconnected');
  }, []);

  const getCount = useCallback(async (): Promise<number> => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    const count = await contract.count();
    return Number(count);
  }, [contract]);

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
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          // Account changed, reconnect
          connectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [account, connectWallet, disconnectWallet]);

  // Listen for network changes
  useEffect(() => {
    if (window.ethereum && signer) {
      const handleChainChanged = async (newChainId: string) => {
        const numericChainId = parseInt(newChainId, 16);
        const newNetworkName = getNetworkName(numericChainId);

        setChainId(numericChainId);
        setNetworkName(newNetworkName);

        // Update contract for new network
        const newContract = getContractForNetwork(signer, newNetworkName);
        setContract(newContract);

        if (!newContract) {
          toast.error(`No contract deployed on ${newNetworkName} network`);
        } else {
          toast.success(`Switched to ${newNetworkName} network`);
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
    connectWallet,
    disconnectWallet,
    getCount,
    increment,
    decrement,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
