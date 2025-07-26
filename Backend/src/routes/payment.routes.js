import {createOrder,getPaymentStatus,verifyPayment} from '../controllers/payment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.route('/payments/create-order').post(verifyJWT, createOrder);
router.route('/payments/status/:id').get(verifyJWT, getPaymentStatus);
router.route('/payments/verify').post(verifyJWT, verifyPayment);

export default router;