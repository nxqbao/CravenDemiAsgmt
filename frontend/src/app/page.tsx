'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getSupportedNetworkDetails } from '../lib/web3';
import { getActiveNetworkConfig, getActiveNetworkName } from '../lib/config';
import toast from 'react-hot-toast';

export default function Home() {
  const {
    account,
    networkName,
    isConnecting,
    isCorrectNetwork,
    contractVerified,
    contractVerificationError,
    connectWallet,
    disconnectWallet,
    getCount,
    getCountWithoutWallet,
    increment,
    decrement,
    switchToNetwork,
    verifyContract,
  } = useWeb3();

  const [count, setCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);

  // Load initial count - try to load from any supported network
  useEffect(() => {
    const loadCount = async () => {
      try {
        setIsLoadingCount(true);

        if (account && isCorrectNetwork) {
          // If wallet is connected to correct network, use wallet connection
          const currentCount = await getCount();
          setCount(currentCount);
        } else {
          // Try to load from any supported network without wallet
          const supportedNets = getSupportedNetworkDetails();
          for (const network of supportedNets) {
            try {
              const currentCount = await getCountWithoutWallet(network.name);
              setCount(currentCount);
              break; // Use the first successful read
            } catch (error) {
              console.warn(`Failed to read from ${network.name}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load count:', error);
      } finally {
        setIsLoadingCount(false);
      }
    };

    loadCount();
  }, [account, isCorrectNetwork, getCount, getCountWithoutWallet]);

  // Verify contract deployment on startup
  useEffect(() => {
    const verifyContractOnStartup = async () => {
      const activeNetworkName = getActiveNetworkName();
      try {
        await verifyContract(activeNetworkName);
      } catch (error) {
        console.error('Failed to verify contract on startup:', error);
      }
    };

    verifyContractOnStartup();
  }, [verifyContract]);

  const handleIncrement = async () => {
    try {
      setIsIncrementing(true);
      await increment();
      // Update count after successful transaction
      const newCount = await getCount();
      setCount(newCount);
    } catch (error) {
      console.error('Increment failed:', error);
      // Show error toast if not already shown by the increment function
      if (
        !error ||
        !(error instanceof Error) ||
        !error.message.includes('Transaction cancelled by user')
      ) {
        toast.error('Failed to increment counter');
      }
    } finally {
      setIsIncrementing(false);
    }
  };

  const handleDecrement = async () => {
    try {
      setIsDecrementing(true);
      await decrement();
      // Update count after successful transaction
      const newCount = await getCount();
      setCount(newCount);
    } catch (error) {
      console.error('Decrement failed:', error);
      // Show error toast if not already shown by the decrement function
      if (
        !error ||
        !(error instanceof Error) ||
        !error.message.includes('Transaction cancelled by user')
      ) {
        toast.error('Failed to decrement counter');
      }
    } finally {
      setIsDecrementing(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const supportedNetworks = getSupportedNetworkDetails();
  const activeNetworkConfig = getActiveNetworkConfig();
  const activeNetworkName = getActiveNetworkName();
  const activeNetworkDeployment = supportedNetworks.find(
    (network) => network.name === activeNetworkName
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W3</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Counter DApp</h1>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center gap-4">
              {!account ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h8a1 1 0 100-2H5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Connect Wallet
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Network Status Indicator */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      isCorrectNetwork
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`}
                    ></div>
                    <span className="font-medium">{networkName || 'Unknown'}</span>
                  </div>

                  {/* Wallet Address */}
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                      {formatAddress(account)}
                    </span>
                  </div>

                  {/* Disconnect Button */}
                  <button
                    onClick={disconnectWallet}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                    title="Disconnect Wallet"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Web3 Counter</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A decentralized counter powered by Ethereum smart contracts
          </p>
        </div>

        {/* Network Status Alert */}
        {!account && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Connect your wallet to get started
                  </h3>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <p>• Install MetaMask browser extension</p>
                    <p>• Connect to the configured network:</p>
                    <div className="ml-4 space-y-1">
                      <p className="font-mono text-xs">
                        • {activeNetworkConfig.displayName} (Chain ID: {activeNetworkConfig.chainId}
                        )
                      </p>
                    </div>
                    <p>• Make sure you have test ETH in your wallet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {account && !isCorrectNetwork && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3">
                    Unsupported Network: {networkName}
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                    This DApp only works on the configured network. Please switch to:
                  </p>
                  <div className="text-sm text-red-800 dark:text-red-200 space-y-1">
                    <p className="font-mono text-xs">
                      • {activeNetworkConfig.displayName} (Chain ID: {activeNetworkConfig.chainId})
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => switchToNetwork(activeNetworkName)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors duration-200"
                    >
                      Switch to {activeNetworkConfig.displayName}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Counter Interface - Always Visible */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Contract Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Contract Information ({activeNetworkConfig.displayName})
            </h3>
            <div className="text-sm">
              {activeNetworkDeployment ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {activeNetworkConfig.displayName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      Chain ID: {activeNetworkConfig.chainId}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                      Address:
                    </span>
                    <div className="font-mono text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border text-gray-800 dark:text-gray-200 break-all flex-1">
                      {activeNetworkDeployment.contractAddress}
                    </div>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(activeNetworkDeployment.contractAddress)
                      }
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Copy address"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                  <p className="text-red-700 dark:text-red-300">
                    No contract deployed for {activeNetworkConfig.displayName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Counter Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
              Counter Interface
            </h3>

            {/* Counter Display */}
            <div className="text-center mb-8">
              {isLoadingCount ? (
                <div className="text-6xl font-bold text-gray-400 dark:text-gray-500">...</div>
              ) : (
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">{count}</div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Current Counter Value
                {!account && (
                  <span className="block text-xs text-gray-400 mt-1">
                    (Read-only - Connect wallet to interact)
                  </span>
                )}
              </p>
            </div>

            {/* Counter Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={handleDecrement}
                disabled={!account || isDecrementing || isLoadingCount}
                className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                  !account
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white'
                }`}
              >
                {isDecrementing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Decrementing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                    {!account
                      ? 'Decrement'
                      : !isCorrectNetwork
                        ? 'Switch & Decrement'
                        : 'Decrement'}
                  </>
                )}
              </button>

              <button
                onClick={handleIncrement}
                disabled={!account || isIncrementing || isLoadingCount}
                className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                  !account
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                    : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white'
                }`}
              >
                {isIncrementing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Incrementing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    {!account
                      ? 'Increment'
                      : !isCorrectNetwork
                        ? 'Switch & Increment'
                        : 'Increment'}
                  </>
                )}
              </button>
            </div>

            {/* Status Message */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {!account ? (
                <div>
                  <p className="mb-2">Connect your wallet to interact with the counter</p>
                  <p className="text-xs">Configured network: {activeNetworkConfig.displayName}</p>
                </div>
              ) : !isCorrectNetwork ? (
                <div>
                  <p className="text-orange-500 dark:text-orange-400 font-medium mb-2">
                    Network &quot;{networkName}&quot; detected - Auto-switching available
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-300 mb-3">
                    Click increment/decrement buttons to auto-switch to the configured network, or
                    switch manually:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => switchToNetwork(activeNetworkName)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200"
                    >
                      Switch to {activeNetworkConfig.displayName}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-green-600 dark:text-green-400 font-medium mb-1">
                    Connected to {networkName} - Ready for transactions!
                  </p>
                  <p className="text-xs">
                    Each transaction costs gas and requires MetaMask confirmation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
