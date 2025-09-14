# Web3 Counter DApp Frontend

A decentralized counter application built with Next.js, TypeScript, and Ethers.js.

## 🚀 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [MetaMask](https://metamask.io/) browser extension
- Local Ethereum network (Anvil) running on `http://localhost:8545`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Configure MetaMask

1. Install MetaMask browser extension
2. Add localhost network:
   - **Network Name:** Localhost 8545
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🛠️ Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## 📁 Project Structure

```
frontend/
├── lib/
│   └── contracts/          # Contract ABIs and deployment info
│       ├── Counter.json    # Contract ABI
│       └── deployment.json # Network-specific deployments
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── contexts/          # React contexts (Web3)
│   └── lib/               # Utilities and Web3 helpers
└── public/                # Static assets
```

## 🔧 Contract Deployment

The contract deployment information is stored in `lib/contracts/deployment.json`. For local development, the contract should be deployed to a local Anvil network.

### Updating Deployment Information

To update deployment information for a different network, use the provided script:

```bash
npm run update-deployment <network> <contractAddress>
```

**Examples:**
```bash
# Update localhost deployment
npm run update-deployment localhost 0x5FbDB2315678afecb367f032d93F642f64180aa3

# Update monad-testnet deployment
npm run update-deployment monad-testnet 0x1234567890123456789012345678901234567890
```

**Manual Update:**
You can also directly edit the `lib/contracts/deployment.json` file:

```json
{
  "localhost": {
    "contractAddress": "0x...",
    "chainId": 31337
  },
  "monad-testnet": {
    "contractAddress": "0x...",
    "chainId": 20143
  }
}
```

## 🌐 Network Support

The application automatically detects the connected network and uses the appropriate contract address. Supported networks:

- **Localhost (31337)**: For local development with Anvil
- **Monad Testnet (20143)**: For testnet deployments

## 🎨 Features

- ✅ MetaMask wallet integration
- ✅ Real-time counter display
- ✅ Increment/decrement operations
- ✅ Network-aware contract interaction
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Responsive design

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Import only the `frontend/` folder
3. Configure environment variables if needed
4. Deploy!

### Manual Deployment

```bash
npm run build
npm run start
```

## 📄 License

This project is part of a Web3 development assignment.
