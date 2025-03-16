import Stripe from 'stripe';
import Order from '../models/Order.js';
import Counter from '../util/counter.js';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { items, total, orderData } = req.body;

  // Create a checkout session with Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price * 100, // Stripe expects the amount in cents
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout`,
    metadata: {
      userId: orderData.userId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      address: JSON.stringify(orderData.address),
      items: JSON.stringify(orderData.items),
      total: total.toString(),
    },
  });
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'id' }, // Unique identifier for product counter
    { $inc: { seq: 1 } }, // Increment counter by 1
    { new: true, upsert: true } // Create counter if not exists
  );
  const newOrder = new Order({
    id: counter.seq,
    userId: orderData.userId,
    items: orderData.items,
    total,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone,
    address: orderData.address,
    status: 'pending',
  });
  await newOrder.save();
  res.json({ sessionId: session.id });
};
