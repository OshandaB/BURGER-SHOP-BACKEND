import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', addToCart); 
router.get('/', getCart);
router.post('/remove', removeFromCart);

export default router;
