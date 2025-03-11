import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    stock: { type: String, default: 'In Stock' },
    category: String,
    ingredients: String,
    calories: String,
    protein: String,
    carbs: String,
    fat:String,
  });
  export default mongoose.model('Product', ProductSchema);