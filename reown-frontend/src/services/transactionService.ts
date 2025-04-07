import axios from "axios";
import { Transaction } from "../types";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const getTransactions = async (
  address: string, 
  onDataChunk: (chunk: Transaction) => void
): Promise<Transaction[]> => {
  try {
    const allTransactions: Transaction[] = [];
    
    const response = await axios.get(`${BASE_URL}/transactions/${address}`, {
      responseType: 'text',
      headers: {
        Accept: 'application/json',
      },
      onDownloadProgress: (progressEvent) => {
        const text = progressEvent.event.target.responseText;
        if (!text) return;
        
        const jsonObjects = text.split(',\n');
        
        for (const jsonStr of jsonObjects) {
          if (jsonStr.trim() && !jsonStr.includes('"error":')) {
            try {
              let cleanJsonStr = jsonStr.trim();
              if (cleanJsonStr.startsWith('[')) {
                cleanJsonStr = cleanJsonStr.substring(1);
              }
              if (cleanJsonStr.endsWith(']')) {
                cleanJsonStr = cleanJsonStr.substring(0, cleanJsonStr.length - 1);
              }
              
              if (cleanJsonStr) {
                const txData = JSON.parse(cleanJsonStr);
                
                const transaction: Transaction = {
                  hash: txData.hash || "",
                  from: txData.from || txData.fromAddress || "",
                  to: txData.to || txData.toAddress || "",
                  value: txData.value || "0",
                  timestamp: parseInt(txData.timeStamp || txData.blockTimestamp || "0", 10),
                  blockNumber: parseInt(txData.blockNumber || "0", 10),
                  status: txData.txreceipt_status === "1" || txData.receiptStatus === "1" || true,
                };
                
                // Check if this transaction is not already in the array
                if (!allTransactions.find(tx => tx.hash === transaction.hash)) {
                  allTransactions.push(transaction);
                  // Call the callback with the new transaction
                  onDataChunk(transaction);
                }
              }
            } catch (parseError) {
              console.error("Error parsing transaction:", parseError, jsonStr);
            }
          }
        }
      },
    });
    
    return allTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};