import Product from '../models/Product.js';
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
export const createProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json({ message: 'Product added successfully' });
};
export const updateProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Product updated successfully' });
};
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
};
