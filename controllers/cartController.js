import Cart from '../models/Cart.js';

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user ? req.user.userId : null; // Null for guests

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if product exists in cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity; // Update quantity
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  const userId = req.user ? req.user.userId : null; // Null for guests
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user ? req.user.userId : null;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};
