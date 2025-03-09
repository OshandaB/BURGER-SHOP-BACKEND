import Order from '../models/Order.js';
export const placeOrder = async (req, res) => {
  const { items, total, customerName, customerEmail, customerPhone, address } = req.body;
  const newOrder = new Order({ userId: req.user.userId, items, total, customerName, customerEmail, customerPhone, address });
  await newOrder.save();
  res.json({ message: 'Order placed successfully' });
};
export const getOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user.userId }).populate('items.productId');
    res.json(orders);
  };
  export const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('items.productId');
    res.json(orders);
  };