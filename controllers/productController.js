import Product from '../models/Product.js';
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, ingredients, calories, protein, carbs, fat } = req.body;
    const image = req.file ? req.file.filename : null; // Image filename from multer

    // Create a new product with the provided details
    const newProduct = new Product({
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
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Product updated successfully' });
};
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
};
