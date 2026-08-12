import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";

const populateCart = (userDoc) =>
  userDoc.populate("cart.product", "name images price discountPrice countInStock slug");

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const user = await populateCart(User.findById(req.user._id));
  res.json({ success: true, cart: user.cart });
});

// @desc    Add item to cart (or increment quantity)
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant = "" } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.countInStock < quantity) {
    res.status(400);
    throw new Error("Not enough stock available");
  }

  const user = await User.findById(req.user._id);
  const existingItem = user.cart.find(
    (item) => item.product.toString() === productId && item.variant === variant
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    user.cart.push({ product: productId, quantity, variant });
  }

  await user.save();
  const populated = await populateCart(User.findById(req.user._id));
  res.status(201).json({ success: true, cart: populated.cart });
});

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity, variant = "" } = req.body;
  const user = await User.findById(req.user._id);

  const item = user.cart.find(
    (i) => i.product.toString() === req.params.productId && i.variant === variant
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    user.cart = user.cart.filter((i) => i !== item);
  } else {
    item.quantity = quantity;
  }

  await user.save();
  const populated = await populateCart(User.findById(req.user._id));
  res.json({ success: true, cart: populated.cart });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
  await user.save();
  const populated = await populateCart(User.findById(req.user._id));
  res.json({ success: true, cart: populated.cart });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ success: true, cart: [] });
});
