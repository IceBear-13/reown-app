import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { getTransactions } from './services/transactionService'
import './App.css'
import { TransactionList } from './components/TransactionHistory'
import { Transaction } from './types'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  // To force re-render of transaction list when new data arrives
  const [transactionListKey, setTransactionListKey] = useState(0)
  
  const addressTags: Record<string, string> = {
    "": ""
  }

  useEffect(() => {
    const fetchTransaction = async () => {
      if(account.status === 'connected' && account.addresses && account.addresses.length > 0) {
        setLoading(true);
        setFetchError(null);
        setTransactions([]);
        
        try {
          // Pass a callback function to handle each new transaction as it arrives
          await getTransactions(
            account.addresses[0].toLowerCase(),
            (newTransaction) => {
              setTransactions(prev => {
                // Check if this transaction is already in our array
                if (!prev.find(tx => tx.hash === newTransaction.hash)) {
                  // Force a re-render of the TransactionList component
                  setTransactionListKey(prevKey => prevKey + 1);
                  // Add new transaction to the array
                  return [...prev, newTransaction];
                }
                return prev;
              });
            }
          );
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setFetchError("Failed to load transactions. Please try again.");
          setTransactions([]);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset transactions when disconnected
        setTransactions([]);
      }
    };
    
    fetchTransaction();
  }, [account.status, account.addresses]);

  return (
    <div className="app-container">
      <header>
        <h1>Reown Transaction Explorer</h1>
        <div className="wallet-connection">
          {account.status === 'connected' && account.addresses && (
            <span className="address">
              {`${account.addresses[0].substring(0, 6)}...${account.addresses[0].substring(account.addresses[0].length - 4)}`}
            </span>
          )}
          
          {account.status === 'connected' ? (
            <button type="button" onClick={() => disconnect()}>
              Disconnect
            </button>
          ) : (
            connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
              >
                Connect {connector.name}
              </button>
            ))
          )}
        </div>
      </header>

      {account.status !== 'connected' ? (
        <div className="connect-prompt">
          <h2>Please connect your wallet to view transactions</h2>
        </div>
      ) : (
        <>
          {loading && transactions.length === 0 ? (
            <div className="loading">Loading transactions...</div>
          ) : fetchError ? (
            <div className="error">{fetchError}</div>
          ) : (
            <>
              {/* Using key to force re-render when new transactions arrive */}
              <TransactionList 
                key={transactionListKey}
                transactions={transactions} 
                addressTags={addressTags} 
              />
              {loading && (
                <div className="loading">Loading more transactions...</div>
              )}
            </>
          )}
        </>
      )}

      {status === 'pending' && <div className="loading">Connecting...</div>}
      {error && <div className="error">{error.message}</div>}
    </div>
  )
}

export default App