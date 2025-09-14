'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

export default function Home() {
  const {
    account,
    networkName,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getCount,
    increment,
    decrement,
  } = useWeb3();

  const [count, setCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);

  // Load initial count
  useEffect(() => {
    const loadCount = async () => {
      if (account) {
        try {
          setIsLoadingCount(true);
          const currentCount = await getCount();
          setCount(currentCount);
        } catch (error) {
          console.error('Failed to load count:', error);
        } finally {
          setIsLoadingCount(false);
        }
      }
    };

    loadCount();
  }, [account, getCount]);

  const handleIncrement = async () => {
    try {
      setIsIncrementing(true);
      await increment();
      // Update count after successful transaction
      const newCount = await getCount();
      setCount(newCount);
    } catch (error) {
      console.error('Increment failed:', error);
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
    } finally {
      setIsDecrementing(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Web3 Counter DApp
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A decentralized counter powered by Ethereum
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-md mx-auto mb-8">
          {!account ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Connected to {networkName || 'Unknown Network'}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>
              <div className="space-y-2">
                <div className="font-mono text-sm text-gray-800 dark:text-gray-200">
                  {formatAddress(account)}
                </div>
                {networkName && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Network: {networkName}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Counter Display */}
        {account && (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Counter Value
              </h2>

              <div className="mb-8">
                {isLoadingCount ? (
                  <div className="text-6xl font-bold text-gray-400 dark:text-gray-500">...</div>
                ) : (
                  <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">{count}</div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleDecrement}
                  disabled={isDecrementing || isLoadingCount}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isDecrementing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Decrementing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                      Decrement
                    </>
                  )}
                </button>

                <button
                  onClick={handleIncrement}
                  disabled={isIncrementing || isLoadingCount}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isIncrementing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Incrementing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Increment
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>Each transaction costs gas and requires confirmation</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!account && (
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How to use this DApp
              </h3>
              <div className="text-left space-y-3 text-gray-600 dark:text-gray-300">
                <p>
                  <strong>1.</strong> Install MetaMask browser extension
                </p>
                <p>
                  <strong>2.</strong> Connect your wallet using the button above
                </p>
                <p>
                  <strong>3.</strong> Switch to localhost network (chain ID: 31337) in MetaMask
                </p>
                <p>
                  <strong>4.</strong> Use the increment/decrement buttons to interact with the smart
                  contract
                </p>
                <p>
                  <strong>5.</strong> Each action requires a transaction confirmation in MetaMask
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
