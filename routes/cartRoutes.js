import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartQuantity, clearCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addToCart);
router.put('/update', authMiddleware, updateCartQuantity);
router.post('/clear', authMiddleware, clearCart);
router.get('/', authMiddleware, getCart);
router.post('/remove', authMiddleware, removeFromCart);

export default router;
