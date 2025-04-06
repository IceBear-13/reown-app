// components/TransactionList.tsx
import React from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  addressTags: Record<string, string>;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  addressTags 
}) => {
  if (transactions.length === 0) {
    return <div className="no-transactions">No transactions found</div>;
  }

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