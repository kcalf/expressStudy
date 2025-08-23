import express, {Router} from 'express';
import userRouter from './userRouter.js';
import productRouter from './productRouter.js';
import orderRouter from './orderRouter.js';

const router = Router();

router.use('/users',userRouter);
router.use('/products',productRouter);
router.use('/orders',orderRouter);

export default router;