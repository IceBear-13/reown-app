import { Router, Request, Response } from "express";
import { ethers } from "ethers";
import { supabaseAdmin } from "../db/config";
import { EtherscanResponse, EtherscanTransaction, getAddressTransactions } from "../services/getTransactionEtherscan";

export const TransactionRouter = Router();

/**
 * @swagger
 * /transactions/{address}:
 *   get:
 *     summary: Get transactions for a specific Ethereum address
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Ethereum wallet address
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid address format or missing address
 *       500:
 *         description: Server error
 */

TransactionRouter.get('/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  
  if (!address || address === '') {
    res.status(400).json({ error: "Address must be provided" });
    return;
  }

  if (!ethers.isAddress(address)) {
    res.status(400).json({ error: "Invalid Ethereum address format" });
    return;
  }

  try {
    // User handling logic (keeping your existing code)
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

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Start the JSON array
    res.write('[\n');
    let isFirstTransaction = true;
    
    let hasTransactions = false;
    
    // Fetch transactions from multiple pages
    for (let i = 1; i <= 10; i++) {
      try {
        const transactions: EtherscanResponse = await getAddressTransactions(address, 0, 99999999, i);
        
        if (transactions.status !== "1") {
          console.log(`No more transactions or API error on page ${i}`);
          break;
        }
        
        if (transactions.result.length === 0) {
          console.log(`No transactions on page ${i}`);
          break;
        }
        
        for (const tx of transactions.result) {
          try {

            await supabaseAdmin
              .from('transactions')
              .upsert({
                wallet_address: address,
                transaction_id: tx.hash,
              }, { onConflict: 'wallet_address,transaction_id' });

            if (!isFirstTransaction) {
              res.write(',\n');
            } else {
              isFirstTransaction = false;
            }
            
            res.write(JSON.stringify(tx));
            hasTransactions = true;
            
          } catch (txError) {
            console.error(`Error processing transaction ${tx.hash}:`, txError);
          }
        }
      } catch (pageError) {
        console.error(`Error fetching page ${i} of transactions:`, pageError);
      }
    }
    
    res.write('\n]');
    res.end();
    
    console.log(`Successfully streamed transactions for address ${address}`);
    
  } catch (error) {
    console.error(`Error processing transactions for ${address}:`, error);
    
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
      return;
    } else {
      try {
        res.write('\n]');
        res.end();
      } catch (closeError) {
        console.error('Error while trying to close the response:', closeError);
      }
    }
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         blockNumber:
 *           type: string
 *         timeStamp:
 *           type: string
 *         hash:
 *           type: string
 *         from:
 *           type: string
 *         to:
 *           type: string
 *         value:
 *           type: string
 *         gas:
 *           type: string
 *         gasPrice:
 *           type: string
 *         isError:
 *           type: string
 *         txreceipt_status:
 *           type: string
 */