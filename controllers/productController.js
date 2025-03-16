import Product from '../models/Product.js';
import Counter from '../util/counter.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};
export const getSingleProduct = async (req,res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, ingredients, calories, protein, carbs, fat } = req.body;
    const image = req.file ? req.file.filename : null; // Image filename from multer
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'id' }, // Unique identifier for product counter
      { $inc: { seq: 1 } }, // Increment counter by 1
      { new: true, upsert: true } // Create counter if not exists
    );
    // Create a new product with the provided details
    const newProduct = new Product({
      _id: counter.seq.toString(), // Assign _id as a string
      id: counter.seq, // Assign auto-incremented ID
      name,
      price,
      description,
      image, // Add image filename
     
      category,
      ingredients,
      calories,
      protein,
      carbs,
      fat,
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  console.log(req.params.id)
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Product updated successfully' });
};
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
};
