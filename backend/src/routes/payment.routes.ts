import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { paginationSchema } from '../validators/common.validator';

const router = Router();

router.get('/my', authenticate, validate(paginationSchema, 'query'), paymentController.findMine.bind(paymentController));
router.post('/initiate', authenticate, paymentController.initiate.bind(paymentController));
router.post('/webhook', paymentController.webhook.bind(paymentController)); // No auth — Razorpay calls this

export default router;
