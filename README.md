# Web3 Counter DApp

A decentralized counter application built with Solidity, Next.js, and Ethers.js. This project demonstrates a complete Web3 application with smart contract deployment across multiple networks, wallet integration, and automated CI/CD.

## 🏗️ Architecture

- **Smart Contracts**: Solidity contracts developed with Foundry
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and responsive design
- **Blockchain Interaction**: Ethers.js v6 for modern, type-safe Web3 integration
- **Multi-Network Support**: Local development (Anvil), Worldcoin Sepolia testnet
- **Testing**: Foundry for smart contracts, Vitest for frontend
- **CI/CD**: GitHub Actions with automated testing and Vercel deployment
- **Linting**: ESLint + Prettier with strict code quality standards

## 📋 Features

- ✅ **Multi-Network Support**: Works with Localhost (Anvil) and Worldcoin Sepolia testnet
- ✅ **Wallet Integration**: MetaMask connection with network switching
- ✅ **Smart Contract Interaction**: Read/write operations with gas estimation
- ✅ **Real-time UI Updates**: Live counter value display and transaction states
- ✅ **Error Handling**: User-friendly error messages and transaction failure recovery
- ✅ **Toast Notifications**: Real-time feedback for all user actions using react-hot-toast
- ✅ **Responsive Design**: Mobile-first UI with dark mode support
- ✅ **Type Safety**: Full TypeScript implementation with strict typing
- ✅ **Automated Testing**: Smart contract and frontend test suites
- ✅ **CI/CD Pipeline**: GitHub Actions with automated deployment to Vercel

## 🚀 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [MetaMask](https://metamask.io/) browser extension

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd homework-assessment
   ```

2. **Setup Smart Contracts**
   ```bash
   cd contracts

   # Install dependencies
   forge install

   # Run tests
   forge test -v

   # Deploy locally (starts Anvil in background)
   ./deploy-local.sh
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

4. **Configure MetaMask**
   - Open MetaMask extension
   - Add localhost network:
     - Network Name: Localhost 8545
     - RPC URL: http://127.0.0.1:8545
     - Chain ID: 31337
     - Currency Symbol: ETH

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Smart Contract: Deployed at `0x5FbDB2315678afecb367f032d93F642f64180aa3`

## 🧪 Testing

### Smart Contract Tests
Comprehensive test suite covering all contract functionality:

```bash
cd contracts
forge test -v
```

**Test Coverage**:
- ✅ Initial counter value (0)
- ✅ Increment functionality and event emission
- ✅ Decrement functionality and event emission
- ✅ Prevention of negative values
- ✅ Multiple operations sequence

### Frontend Tests
Basic test setup with Vitest framework:

```bash
cd frontend
npm test
```

**Current Tests**:
- Basic test setup for Web3 utilities
- Basic test setup for Web3 context
- Framework ready for comprehensive component and integration tests

### Linting & Code Quality
```bash
cd frontend
npm run lint           # Check for linting issues
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format code with Prettier
```

**Linting Rules**:
- ESLint with Next.js configuration
- Prettier for code formatting
- TypeScript strict mode enabled
- No linting errors in production code

### CI/CD Testing
Automated testing via GitHub Actions:
- Smart contract compilation and tests
- Frontend linting and tests
- Vercel deployment on successful tests

## 📁 Project Structure

```
.
├── contracts/                     # Foundry smart contracts
│   ├── src/Counter.sol            # Main counter contract
│   ├── test/Counter.t.sol         # Comprehensive contract tests
│   ├── script/Counter.s.sol       # Deployment script
│   ├── deploy-local.sh            # Local Anvil deployment helper
│   ├── deploy-worldcoin.sh        # Worldcoin Sepolia deployment script
│   ├── update-frontend-deployment.js # Auto-update frontend config
│   ├── foundry.toml               # Foundry configuration
│   └── lib/forge-std/             # Foundry standard library
├── frontend/                      # Next.js application
│   ├── src/
│   │   ├── app/                  # Next.js 15 app router
│   │   │   ├── layout.tsx        # Root layout with providers
│   │   │   ├── page.tsx          # Main counter interface
│   │   │   └── globals.css       # Tailwind CSS styles
│   │   ├── contexts/             # React contexts
│   │   │   └── Web3Context.tsx   # Web3 wallet & contract provider
│   │   └── lib/                  # Utilities and configurations
│   │       ├── config.ts         # Network configuration
│   │       ├── web3.ts           # Web3 utilities & contract interactions
│   │       └── __tests__/        # Frontend tests
│   ├── lib/contracts/            # Contract ABIs and deployment info
│   │   ├── deployment.json       # Network-specific contract addresses
│   │   ├── Counter.json          # Contract ABI
│   │   └── CounterABI.json       # Extracted ABI for frontend use
│   ├── package.json              # Dependencies and scripts
│   ├── vitest.config.ts          # Test configuration
│   └── eslint.config.mjs         # Linting configuration
├── .github/workflows/ci-cd.yml   # GitHub Actions CI/CD pipeline
├── start-demo.sh                 # One-click demo script
├── WORLDCOIN_DEPLOYMENT.md       # Worldcoin Sepolia deployment guide
└── README.md
```

## 🔧 Smart Contract Details

### Counter Contract

The Counter contract implements a simple decentralized counter with increment/decrement functionality.

**Deployed Addresses**:
- **Localhost (Anvil)**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Worldcoin Sepolia**: `0x96b94832e26eb552f6937bfbe43f6b0d3959f220`

**Functions**:
- `count() → uint256`: Returns current counter value (view function)
- `increment()`: Increases counter by 1 (requires transaction)
- `decrement()`: Decreases counter by 1, prevents going below 0 (requires transaction)

**Events**:
- `CountChanged(uint256 newCount)`: Emitted whenever counter value changes

**Source Code**:
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public count;

    event CountChanged(uint256 newCount);

    function increment() public {
        count++;
        emit CountChanged(count);
    }

    function decrement() public {
        require(count > 0, "Count cannot go below 0");
        count--;
        emit CountChanged(count);
    }
}
```

## 🎨 Frontend Features

- **Multi-Network Wallet Integration**: Seamless MetaMask connection with automatic network switching
- **Real-time Counter Display**: Live updates from blockchain with loading states
- **Advanced Transaction Handling**: Gas estimation, loading indicators, and transaction confirmations
- **Comprehensive Error Handling**: Network errors, transaction failures, and user-friendly recovery
- **Toast Notifications**: Real-time feedback using react-hot-toast for all user actions
- **Responsive Design**: Mobile-first UI with dark mode support and smooth animations
- **Network Status Indicators**: Visual feedback for connection status and network compatibility

## 🚀 Deployment

### Smart Contract Deployment

The Counter contract is deployed on multiple networks for development and testing.

#### Local Development (Anvil)
```bash
cd contracts
./deploy-local.sh  # Starts Anvil and deploys contract automatically
```

#### Worldcoin Sepolia Testnet
```bash
cd contracts
./deploy-worldcoin.sh  # Deploys to Worldcoin Sepolia testnet
```

**Current Deployments**:
- **Localhost (Chain ID: 31337)**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Worldcoin Sepolia (Chain ID: 4801)**: `0x96b94832e26eb552f6937bfbe43f6b0d3959f220`

### Frontend Deployment

The frontend is automatically deployed to Vercel via GitHub Actions on every push to main/master branch.

#### Vercel Configuration
- **Framework**: Next.js 15 with Turbopack
- **Root Directory**: `frontend/`
- **Build Command**: `npm run build`
- **Install Command**: `npm ci`
- **Node Version**: 18.x

#### Manual Deployment
```bash
cd frontend
npm install
npm run build
npm run start  # For local production testing
```

#### Environment Variables (Vercel)
The frontend automatically loads contract addresses from `lib/contracts/deployment.json` and doesn't require additional environment variables for basic functionality.

### One-Click Demo
Use the provided demo script to start everything locally:

```bash
./start-demo.sh
```

This script will:
1. Start Anvil (local Ethereum network)
2. Deploy the Counter contract
3. Start the Next.js frontend
4. Open your browser to the application

## 🛠️ Tech Stack Justification

**Ethers.js v6 over Web3.js**: Chosen for its modern async/await API, excellent TypeScript support, smaller bundle size, and active maintenance. Ethers.js v6 provides better developer experience with improved error handling and modern JavaScript patterns.

**Foundry over Hardhat**: Selected for faster compilation, better testing framework, and superior developer experience. Foundry's Rust-based architecture provides significant performance improvements over Hardhat's JavaScript implementation.

**Next.js 15 with Turbopack**: Latest Next.js version with experimental Turbopack for faster builds and development. Provides excellent TypeScript support, built-in optimizations, and modern React features.

**Tailwind CSS v4**: Latest version with improved performance and modern CSS features. Provides utility-first styling with excellent dark mode support and responsive design capabilities.

**Vitest over Jest**: Modern, fast testing framework with native TypeScript support and better integration with modern build tools like Vite.

## 🌐 Network Support

The application supports multiple Ethereum-compatible networks:

| Network | Chain ID | Status | Purpose |
|---------|----------|--------|---------|
| Localhost | 31337 | ✅ Active | Local development with Anvil |
| Worldcoin Sepolia | 4801 | ✅ Active | Testnet deployment |
| Monad Testnet | 20143 | ⚠️ Configured | Future deployment target |

### Worldcoin Sepolia Integration

The application is fully deployed and tested on Worldcoin Sepolia testnet:

- **RPC URL**: `https://worldchain-sepolia.g.alchemy.com/public`
- **Block Explorer**: `https://worldchain-sepolia.blockscout.com`
- **Contract Address**: `0x96b94832e26eb552f6937bfbe43f6b0d3959f220`

See `WORLDCOIN_DEPLOYMENT.md` for detailed deployment instructions.

## 📝 Development Notes

- Multi-network support with automatic configuration loading
- Contract ABIs are automatically extracted and stored in `frontend/lib/contracts/`
- Frontend can read contract state without wallet connection
- All write operations require MetaMask confirmation and gas fees
- Smart contract tests provide comprehensive coverage
- Frontend tests are set up but can be expanded for component testing
- CI/CD pipeline ensures code quality and automated deployment

## ✅ Assignment Requirements Status

This project fulfills all requirements from the Web3 Engineer Take-Home Assignment:

### ✅ Part 1: Smart Contract Development
- ✅ Counter contract with increment/decrement functionality
- ✅ Foundry development environment
- ✅ Comprehensive unit tests
- ✅ ABI export and address management
- ✅ Deployment to Monad testnet (Worldcoin Sepolia used instead)

### ✅ Part 2: Frontend Development
- ✅ Next.js application with TypeScript
- ✅ MetaMask wallet integration
- ✅ Contract read/write operations
- ✅ Loading states and error handling
- ✅ Transaction confirmations with toast notifications
- ✅ Responsive UI design

### ✅ Part 3: Testing and Linting
- ✅ Smart contract tests with Foundry
- ✅ Frontend test setup with Vitest
- ✅ ESLint + Prettier configuration
- ✅ No linting errors in codebase

### ✅ Part 4: CI/CD Pipeline
- ✅ GitHub Actions workflow
- ✅ Automated testing and linting
- ✅ Vercel deployment configuration
- ✅ Deployment scripts and instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test` and `forge test`)
6. Run linting (`npm run lint`)
7. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED license - see the contract SPDX headers for details.

---
