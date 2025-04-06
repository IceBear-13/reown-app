# Reown Transaction Explorer

A real-time Ethereum transaction explorer that allows users to connect their wallets and view their transaction history with live updates.

## Project Overview

The Reown Transaction Explorer provides a user-friendly interface to:

- Connect cryptocurrency wallets using WalletConnect
- View and track transaction history in real-time
- Add custom tags to addresses for easy identification
- Display detailed transaction information like status, value, and timestamp

## Structure

The project consists of two main parts:

1. **Frontend**: A React application built with Vite and TypeScript
2. **Backend**: A Node.js Express server with TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Etherscan API key (for blockchain data)
- Alchemy API key (for enhanced transaction data)
- Supabase account (for database)

### Installation

#### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file with the following variables:
   ```
   FRONTEND_URL="http://localhost:5173"
   SUPABASE_URL="your_supabase_url"
   SUPABASE_CLIENT_KEY="your_supabase_client_key"
   SUPABASE_SECRET_KEY="your_supabase_secret_key"
   ETHERSCAN_API_KEY="your_etherscan_api_key"
   ALCHEMY_API_KEY="your_alchemy_api_key"
   ```
4.Start the development server:
      ```bash
      npm run dev
      ```
5. Run the server:
   ```bash
   npm run seq
   ```

#### Frontend Setup

## Real-time Transaction Streaming
The application uses a streaming approach to fetch and display transactions:
- The backend streams transaction data from Etherscan/Alchemy APIs
- Frontend processes the incoming chunks in real-time
- Transactions appear on the UI as they are received
- Each new transaction triggers a re-render of the transaction list

## Wallet Connection
- Integration with WalletConnect for secure wallet connectivity
- Support for multiple Ethereum wallets
- Automatic loading of transactions when wallet is connected

## Transaction Display
- Clean, responsive UI showing important transaction details
- Formatting of addresses and ETH values
- Status indicators for successful and failed transactions
- Timestamps in user-friendly format

## Technology Stack

# Frontend
- React with TypeScript
- Vite for build tooling
- Wagmi for wallet connection
- Axios for API communication
- React Query for data fetching

# Backend
- Express.js with TypeScript
- Etherscan & Alchemy APIs for blockchain data
- Supabase for database storage
- Socket.IO for real-time communication

## Future Improvements
- Add transaction filtering and sorting
- Implement pagination for large transaction histories
- Add support for other blockchain networks
- Enhance the tagging system with more features
- Improve error handling and retry mechanisms

## License
This README provides a comprehensive overview of the Reown Transaction Explorer project, including setup instructions, features, and the technology stack. It explains how the application works with real-time transaction streaming, wallet connections, and the display of transaction data. The document also includes possible future improvements to guide ongoing development.
