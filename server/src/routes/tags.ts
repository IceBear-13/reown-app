import { Request, Response, Router } from "express";
import { supabaseAdmin } from "../db/config";

export const tagsRouter = Router();

tagsRouter.post("/", async (req: Request, res: Response) => {
  const { hashes, message } = req.body;
  if (!hashes || hashes === "") {
    res.status(400).json({ error: "Hash ID has to be available" });
    return;
  }
  try {
    const { error: updateError } = await supabaseAdmin
      .from("transactions")
      .update("tag", message)
      .eq("hash", hashes);

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

tagsRouter.get('/:address', async (req: Request, res: Response) => {

})


