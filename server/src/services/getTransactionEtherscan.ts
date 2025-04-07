import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

export interface EtherscanResponse {
  status: string;
  message: string;
  result: EtherscanTransaction[];
}

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;

/**
 * Get transactions for an Ethereum address
 * @param address Ethereum address to query
 * @param startBlock Optional starting block number
 * @param endBlock Optional ending block number
 * @param page Optional page number
 * @param offset Optional number of results per page
 * @param sort Optional sorting preference ('asc' or 'desc')
 * @returns Promise with transaction data
 */
export const getAddressTransactions = async (
  address: string,
  startBlock: number = 0,
  endBlock: number = 99999999,
  page: number = 1,
  offset: number = 10,
  sort: 'asc' | 'desc' = 'desc'
): Promise<EtherscanResponse> => {
  try {
    const baseUrl = 'https://api.etherscan.io/api';
    const response = await axios.get<EtherscanResponse>(baseUrl, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: startBlock,
        endblock: endBlock,
        page,
        offset,
        sort,
        apikey: ETHERSCAN_API_KEY
      }
    });

    if (response.data.status !== '1') {
      throw new Error(`Etherscan API error: ${response.data.message}, ${response.data.result}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request failed: ${error.message}`);
    }
    throw error;
  }
}

