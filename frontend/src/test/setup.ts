// Only run setup in test environment
if (typeof vi !== 'undefined') {
  import('@testing-library/jest-dom');

  // Mock contract imports
  vi.mock('src/lib/contracts/Counter.json', () => ({
    default: {
      abi: [
        {
          type: 'function',
          name: 'count',
          inputs: [],
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'increment',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'decrement',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'event',
          name: 'CountChanged',
          inputs: [{ name: 'newCount', type: 'uint256', indexed: false }],
          anonymous: false,
        },
      ],
    },
  }));

  vi.mock('src/lib/contracts/deployment.json', () => ({
    default: {
      localhost: {
        contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        chainId: 31337,
      },
      'monad-testnet': {
        contractAddress: '',
        chainId: 0,
      },
    },
  }));
}

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: {
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  },
});

// Mock ethers
vi.mock('ethers', () => ({
  ethers: {
    BrowserProvider: vi.fn(),
    Contract: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
  Toaster: () => null,
}));
