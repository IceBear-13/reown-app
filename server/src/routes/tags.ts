import { Request, Response, Router } from "express";
import { supabaseAdmin } from "../db/config";

export const tagsRouter = Router();

tagsRouter.post("/", async (req: Request, res: Response) => {
  const { hash, message } = req.body;
  if (!hash || hash === "") {
    res.status(400).json({ error: "Hash ID has to be available" });
    return;
  }
  try {
    const { error: updateError } = await supabaseAdmin
      .from("transactions")
      .update("tag", message)
      .eq("hash", hash);

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



