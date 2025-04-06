import { provider } from "../app";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface TransactionData {
  blockNumber: string;
  blockTimestamp: string;
  blockHash: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  gas: string;
  gasPrice: string;
  network: string;
  logs: Array<any>;
  internalTransactions: Array<any>;
}

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY as string;


/**
 * Get transactions for an Ethereum address
 * @param address Ethereum address to query
 * @param limits Limit of transactions to fetch
 * @returns Wallet transaction data
 */
export const getTransactionHistoryAlchemy = async (address: string, limits: number) => {
  const options = {
    method: 'POST',
    url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}/alchemy/v1/transactions/history/by-address`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    data: {
      addresses: [
        {
          address: address,
          networks: ['eth-mainnet', 'base-mainnet']
        }
      ],
      limit: limits
    }
  }

  try {
    const response = await axios.request(options);
    return response.data.transactions;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw error;
  }
}
