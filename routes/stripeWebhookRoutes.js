import express from 'express';
const router = express.Router();
import { handleStripeWebhook } from '../controllers/stripeWebhookController.js';

// Stripe requires raw body parsing for webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
