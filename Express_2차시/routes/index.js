import express, {Router} from 'express';
import userRouter from './users.js';
import productRouter from './productRouter.js';

const router = Router();

router.use('/',userRouter)
router.use('/users',userRouter);
router.use('/products',productRouter);

export default router;