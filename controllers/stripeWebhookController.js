import Stripe from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import Order from '../models/Order.js';

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  // Handle successful checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extract order details from the Stripe session
    const orderData = {
      userId: session.customer_email,
      items: JSON.parse(session.metadata.items), // Convert string to array
      total: session.amount_total / 100, // Convert cents to dollars
      customerName: session.customer_details.name,
      customerEmail: session.customer_email,
      customerPhone: session.customer_details.phone,
      address: session.customer_details.address.line1,
      status: 'paid',
    };

    try {
      // Save order to the database
      const newOrder = await Order.create(orderData);
      console.log('Order created successfully:', newOrder);
    } catch (error) {
      console.error('Error saving order:', error.message);
      return res.status(500).send('Error saving order');
    }
  }

  res.json({ received: true });
};
