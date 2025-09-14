# Web3 Counter DApp

A decentralized counter application built with Solidity, Next.js, and Ethers.js. This project demonstrates a complete Web3 application with smart contract deployment, wallet integration, and automated CI/CD.

## 🏗️ Architecture

- **Smart Contracts**: Solidity contracts developed with Foundry
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Blockchain Interaction**: Ethers.js v6
- **Testing**: Vitest for frontend, Foundry for contracts
- **CI/CD**: GitHub Actions with Vercel deployment
- **Linting**: ESLint + Prettier

## 📋 Features

- ✅ Connect MetaMask wallet
- ✅ Display current counter value from smart contract
- ✅ Increment/decrement counter with transaction confirmations
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Responsive UI design
- ✅ Comprehensive test coverage
- ✅ Automated deployment pipeline

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
```bash
cd contracts
forge test -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Linting
```bash
cd frontend
npm run lint
npm run format  # Auto-fix formatting issues
```

## 📁 Project Structure

```
.
├── contracts/                 # Foundry smart contracts
│   ├── src/Counter.sol       # Main counter contract
│   ├── test/Counter.t.sol    # Contract tests
│   ├── script/Counter.s.sol  # Deployment script
│   └── deploy-local.sh       # Local deployment helper
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── contexts/        # React contexts (Web3)
│   │   └── lib/             # Utilities and contract ABIs
│   └── public/              # Static assets
├── .github/workflows/        # CI/CD pipelines
└── README.md
```

## 🔧 Smart Contract Details

### Counter Contract

**Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (Local deployment)

**Functions**:
- `count()`: Returns current counter value (view)
- `increment()`: Increases counter by 1
- `decrement()`: Decreases counter by 1 (prevents negative values)

**Events**:
- `CountChanged(uint256 newCount)`: Emitted when counter changes

## 🎨 Frontend Features

- **Wallet Connection**: MetaMask integration with connection status
- **Counter Display**: Real-time display of contract counter value
- **Transaction Handling**: Loading states during blockchain transactions
- **Error Handling**: User-friendly error messages and toast notifications
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Deployment

### Smart Contract Deployment

The contract is deployed locally using Foundry's Anvil. For production deployment to Monad testnet:

```bash
# Set your Monad testnet RPC and private key
export RPC_URL="https://testnet-rpc.monad.xyz"
export PRIVATE_KEY="your-private-key"

# Deploy to Monad testnet
forge script script/Counter.s.sol:CounterScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

### Frontend Deployment

The frontend can be deployed independently to Vercel by importing only the `frontend/` folder:

1. Connect your GitHub repository to Vercel
2. Import only the `frontend/` folder as the root directory
3. The frontend includes all necessary contract ABIs and deployment information
4. Configure build settings if needed (Next.js should auto-detect)

**Live Demo**: [Vercel URL will be added after deployment]

### Standalone Frontend Development

If you only have the `frontend/` folder, you can still develop and deploy it independently:

```bash
cd frontend
npm install
npm run dev
```

To update contract deployment information:

```bash
npm run update-deployment <network> <contractAddress>
```

## 🛠️ Tech Stack Justification

**Ethers.js over Web3.js**: Chosen for its modern API, better TypeScript support, smaller bundle size, and active maintenance compared to Web3.js.

## 📝 Development Notes

- Contract is deployed locally for development
- Frontend connects to localhost:8545 (Anvil)
- All transactions require MetaMask confirmation
- Tests cover both smart contract logic and frontend components
- CI/CD pipeline ensures code quality before deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED license - see the contract SPDX headers for details.
