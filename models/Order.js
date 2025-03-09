import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }],
    total: Number,
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    address: String,
  });
  export default mongoose.model('Order', OrderSchema);