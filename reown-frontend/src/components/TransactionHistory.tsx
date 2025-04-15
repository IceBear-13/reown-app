import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { fetchTags, tagsRename } from '../services/tagsService';

interface TransactionListProps {
  transactions: Transaction[];
  addressTags: Record<string, string>;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, addressTags }) => {
  // Use a map to store tags for each transaction by hash
  const [transactionTags, setTransactionTags] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Fetch tags for all transactions
    const fetchTagsForTransactions = async () => {
      const newTags: Record<string, string> = {};
      
      // Create an array of promises for fetching tags
      const tagPromises = transactions.map(async (transaction) => {
        try {
          const tag = await fetchTags(transaction.hash);
          if (tag && tag !== "Error") {
            newTags[transaction.hash] = tag;
          }
        } catch (error) {
          console.error(`Error fetching tag for ${transaction.hash}:`, error);
        }
      });
      
      // Wait for all tag fetch operations to complete
      await Promise.all(tagPromises);
      
      // Update the tags state
      setTransactionTags(prevTags => ({
        ...prevTags,
        ...newTags
      }));
    };
    
    fetchTagsForTransactions();
  }, [transactions]); // Re-run when transactions change

  const handleChangeTag = async (hash: string, message: string) => {
    try {
      const response = await tagsRename(hash, message);
      
      if (response && response !== "Error") {
        // Update only the tag for this specific transaction
        setTransactionTags(prevTags => ({
          ...prevTags,
          [hash]: message
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating tag for ${hash}:`, error);
      return false;
    }
  };

  const formatAddress = (address: string) => {
    return addressTags[address] || `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatValue = (value: string) => {
    const ethValue = parseFloat(value) / 1e18;
    return `${ethValue.toFixed(4)} ETH`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (transactions.length === 0) {
    return <div className="no-transactions">No transactions found</div>;
  }

  return (
    <div className="transaction-list">
      {transactions.map((tx) => (
        <div key={tx.hash} className="transaction-card">
          <div className="tx-header">
            <span className="tx-hash">
              {tx.hash.substring(0, 6)}...{tx.hash.substring(tx.hash.length - 4)}
            </span>
            <span className="tx-timestamp">{formatTimestamp(tx.timestamp)}</span>
          </div>
          
          <div className="tx-addresses">
            <div className="tx-from">
              From: <span className={addressTags[tx.from] ? 'tagged-address' : ''}>
                {formatAddress(tx.from)}
              </span>
            </div>
            <div className="tx-to">
              To: <span className={addressTags[tx.to] ? 'tagged-address' : ''}>
                {formatAddress(tx.to)}
              </span>
            </div>
          </div>
          
          <div className="tx-value">{formatValue(tx.value)}</div>
          
          <div className="tx-tag-section">
            <h3>Transaction's tag: {transactionTags[tx.hash] || 'No tag'}</h3>
            <div className="tag-input-group">
              <label htmlFor={`tag-${tx.hash}`}>Change transaction's tag</label>
              <br />
              <input 
                type="text" 
                id={`tag-${tx.hash}`} 
                placeholder="Enter new tag"
              />
              <br />
              <button 
                className="change-tag-btn"
                onClick={() => {
                  const tagInput = document.getElementById(`tag-${tx.hash}`) as HTMLInputElement;
                  if (tagInput && tagInput.value.trim()) {
                    handleChangeTag(tx.hash, tagInput.value)
                      .then(success => {
                        if (success) {
                          tagInput.value = '';
                        }
                      })
                      .catch(error => console.error('Failed to update tag:', error));
                  }
                }}
              >
                Submit
              </button>
            </div>
          </div>
          
          <div className="tx-status">
            Status: <span className={tx.status ? 'success' : 'failed'}>
              {tx.status ? 'Success' : 'Failed'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};