import { Router } from 'express';
import itemRouter from './itemRouter.js'

const router = Router();

router.use('/items', itemRouter);

export default router;