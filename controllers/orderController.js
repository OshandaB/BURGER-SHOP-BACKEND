import Order from '../models/Order.js';
import Stripe from 'stripe';
import Counter from '../util/counter.js';
import 'dotenv/config';
import mongoose from 'mongoose';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
  const { items, total, customerName, customerEmail, customerPhone, address } = req.body;
  const newOrder = new Order({ userId: req.userId, items, total, customerName, customerEmail, customerPhone, address });
  await newOrder.save();
  res.status(201).json({ message: 'Order placed successfully' });
};
export const getOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user.userId }).populate('items.productId');
    res.json(orders);
  };
  export const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('items.productId');
    res.json(orders);
  };
  // Verify payment and save order
export const verifyPaymentAndSaveOrder = async (req, res) => {
  const { session_id } = req.query;
    console.log(req.query);
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
     console.log(session.metadata)
    if (session.payment_status === 'paid') {
            if (!session.metadata || !session.metadata.items) {
              return res.status(400).json({ success: false, message: 'Missing order data.' });
            }
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'id' }, 
        { $inc: { seq: 1 } },
        { new: true, upsert: true } 
      );

      const newOrder = new Order({
        id: counter.seq,
        userId: session.metadata.userId,
        items: JSON.parse(session.metadata.items),
        total: session.metadata.total,
        customerName: session.metadata.customerName,
        customerEmail: session.metadata.customerEmail,
        customerPhone: session.metadata.customerPhone,
        address: session.metadata.address,
        status: 'pending',
      });

      await newOrder.save();
      return res.json({ success: true, message: 'Order saved successfully.' });
    }

    res.status(400).json({ success: false, message: 'Payment not completed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  const validStatuses = ['pending', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true } 
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
