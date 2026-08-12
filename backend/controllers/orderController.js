import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// @desc    Create a new order from the user's cart selection
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }
  if (!shippingAddress) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  // Re-validate stock and prices server-side for integrity
  let itemsPrice = 0;
  const validatedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }
    if (product.countInStock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    itemsPrice += unitPrice * item.quantity;

    validatedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: unitPrice,
      quantity: item.quantity,
      variant: item.variant || "",
    });

    product.countInStock -= item.quantity;
    await product.save();
  }

  const shippingPrice = itemsPrice > 2000 ? 0 : 99;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    orderItems: validatedItems,
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: paymentMethod === "COD" ? false : true,
    paidAt: paymentMethod === "COD" ? undefined : new Date(),
    status: "Pending",
  });

  // Clear only the ordered items from the user's cart
  const user = await User.findById(req.user._id);
  const orderedProductIds = orderItems.map((i) => i.product.toString());
  user.cart = user.cart.filter((c) => !orderedProductIds.includes(c.product.toString()));
  await user.save();

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({ success: true, order });
});

// @desc    Cancel an order (customer, only if still Pending/Processing)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }
  if (!["Pending", "Processing"].includes(order.status)) {
    res.status(400);
    throw new Error("This order can no longer be cancelled");
  }

  order.status = "Cancelled";
  await order.save();

  // Restock items
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: item.quantity } });
  }

  res.json({ success: true, order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const orders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  if (status === "Delivered") {
    order.deliveredAt = new Date();
    order.isPaid = true;
    order.paidAt = order.paidAt || new Date();
  }

  await order.save();
  res.json({ success: true, order });
});
