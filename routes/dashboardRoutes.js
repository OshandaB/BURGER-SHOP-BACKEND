import express from 'express';
import { DashboardStats } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/stats', authMiddleware,DashboardStats);


export default router;