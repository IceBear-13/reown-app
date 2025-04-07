import { Request, Response, Router } from "express";
import { supabaseAdmin } from "../db/config";

export const tagsRouter = Router();

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Add or update a tag for a transaction
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hash
 *               - message
 *             properties:
 *               hash:
 *                 type: string
 *                 description: Transaction hash
 *               message:
 *                 type: string
 *                 description: Tag message
 *     responses:
 *       200:
 *         description: Tag added successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
tagsRouter.post("/", async (req: Request, res: Response) => {
  const { hash, message } = req.body;
  if (!hash || hash === "") {
    res.status(400).json({ error: "Hash ID has to be available" });
    return;
  }
  try {
    const { error: updateError } = await supabaseAdmin
      .from("transactions")
      .update({ tag: message })
      .eq("transaction_id", hash);

    if (updateError) {
      res.status(500).json({ error: updateError });
      return;
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
});

/**
 * @swagger
 * /tags/{hash}:
 *   get:
 *     summary: Get tag for a specific transaction
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction hash
 *     responses:
 *       200:
 *         description: Tag fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Tag not found or empty
 *       500:
 *         description: Server error
 */
tagsRouter.get('/:hash', async (req: Request, res: Response) => {
  const { hash } = req.params;
  try{
    const { data: tagsData, error: fetchError } = await supabaseAdmin
      .from('transactions')
      .select('tag')
      .eq('transaction_id', hash);
    if(fetchError){
      res.status(500).json({error: fetchError.message});
      return;
    }
   
    const tag = tagsData[0].tag;
    if(!tag || tag === ""){
      res.status(404).json({error: "Message is empty"});
      return;
    }
    res.status(200).json({message: tag});
    return;

  } catch(error){
    res.status(500).json({error: error});
    return;
  }
})



