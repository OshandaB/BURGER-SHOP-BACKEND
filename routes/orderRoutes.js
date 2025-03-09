// routes/orderRoutes.js
import express from 'express';
import { placeOrder, getOrders, getAllOrders } from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/', placeOrder);
router.get('/', authMiddleware, getOrders);
router.get('/admin', authMiddleware, getAllOrders);
export default router;