// routes/orderRoutes.js
import express from 'express';
import { placeOrder, getOrders, getAllOrders, verifyPaymentAndSaveOrder,updateOrderStatus } from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/', placeOrder);
router.get('/', authMiddleware, getOrders);
router.get('/admin', authMiddleware, getAllOrders);
router.post('/verify-payment', verifyPaymentAndSaveOrder);
router.put('/status', updateOrderStatus);

export default router;