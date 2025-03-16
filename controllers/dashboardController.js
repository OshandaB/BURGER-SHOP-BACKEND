
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';
import Counter from '../util/counter.js';
import 'dotenv/config';
import mongoose from 'mongoose';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const DashboardStats = async (req, res) => {
    try {
        // Get total number of orders
        const totalOrders = await Order.countDocuments();
    
        // Get total revenue (assuming 'total' is the field for the order amount)
        const totalRevenueData = await Order.aggregate([
          { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
        ]);
        const totalRevenue = totalRevenueData.length ? totalRevenueData[0].totalRevenue : 0;
    
        const activeProducts = await Product.countDocuments({ stock: "In Stock" });
        // const totalCustomers = await Order.distinct('customerEmail').countDocuments();

        const totalCustomers = await Order.aggregate([
            {
                $group: {
                    _id: {
                        customerName: '$customerName',
                        customerEmail: '$customerEmail',
                        customerPhone: '$customerPhone'
                    }
                }
            },
            {
                $count: 'uniqueCustomers'
            }
        ]);
        
        const uniqueCustomersCount = totalCustomers.length ? totalCustomers[0].uniqueCustomers : 0;

    
        // Return the stats data
        res.json({
          totalOrders,
          totalRevenue,
          activeProducts,
          uniqueCustomersCount,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
      }
};







