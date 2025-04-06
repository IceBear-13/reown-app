import { Router } from "express";
import { TransactionRouter } from "./transaction";
import { tagsRouter } from "./tags";

const router = Router();

router.use('/transactions', TransactionRouter);
router.use('/tags', tagsRouter);

export default router;
