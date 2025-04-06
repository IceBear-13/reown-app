import { Router, Request, Response } from "express";
import { ethers } from "ethers";
import { supabaseAdmin } from "../db/config";
import { EtherscanTransaction, getAddressTransactions } from "../services/getTransactionEtherscan";

export const TransactionRouter = Router();

TransactionRouter.get('/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  
  // 1. Validate all inputs before sending any response
  if (!address || address === '') {
    res.status(400).json({ error: "Address must be provided" });
    return;
  }

  if (!ethers.isAddress(address)) {
    res.status(400).json({ error: "Invalid Ethereum address format" });
    return;
  }

  try {
    // 2. Ensure user exists in database before starting stream
    const { data: existingUser, error: userQueryError } = await supabaseAdmin
      .from('users')
      .select('wallet_address')
      .eq('wallet_address', address)
      .maybeSingle();

    if (userQueryError) {
      console.error('Error checking user:', userQueryError);
      res.status(500).json({ error: 'Database error when checking user' });
      return;
    }

    // If user doesn't exist, insert it
    if (!existingUser) {
      const { error: userInsertError } = await supabaseAdmin
        .from('users')
        .insert({ wallet_address: address });
      
      if (userInsertError) {
        console.error('Error inserting user:', userInsertError);
        res.status(500).json({ error: 'Failed to create user record' });
        return;
      }
    }

    // 3. Now set headers and start streaming
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    res.write('[');
    let isFirstTransaction = true;
    
    // 4. Process transactions without sending error responses after stream starts
    for (let i = 1; i <= 10; i++) {
      const transactions: EtherscanTransaction[] = await getAddressTransactions(address, 0, 99999999, i);
      
      for (const tx of transactions) {
        try {
          // Insert transaction record
          const { error: insertionError } = await supabaseAdmin
            .from('transactions')
            .insert({
              wallet_address: address,
              transaction_id: tx.hash,
            });
          
          if (insertionError) {
            // 5. Log errors but continue streaming instead of sending error response
            console.error(`Error inserting transaction ${tx.hash}:`, insertionError);
            // Optionally include error info in the stream
            // But don't try to send a new response with res.status().json()
          }
          
          // Write transaction to response stream
          if (!isFirstTransaction) {
            res.write(',\n');
          } else {
            isFirstTransaction = false;
          }
          res.write(JSON.stringify(tx));
          
        } catch (txError) {
          console.error(`Error processing transaction ${tx.hash}:`, txError);
          // Continue with next transaction instead of ending response
        }
      }
    }

    // 6. Complete the response
    res.write('\n]');
    res.end();
    
  } catch (error) {
    console.error(`Error processing transactions for ${address}:`, error);
    
    // 7. Handle errors differently based on whether streaming has started
    if (!res.headersSent) {
      // Headers not sent yet, can send normal error response
      res.status(500).json({ error: 'Failed to fetch transactions' });
      return;
    } else {
      // Already streaming, complete the JSON array with an error
      res.write(`\n{"error": "Failed to complete transaction stream"}\n]`);
      res.end();
    }
  }
});