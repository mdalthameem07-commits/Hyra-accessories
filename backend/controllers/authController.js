import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    user: user.toSafeObject(),
    token: generateToken(user._id, user.role),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("This account has been deactivated");
  }

  res.json({
    success: true,
    user: user.toSafeObject(),
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @desc    Update logged-in user's profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email ? req.body.email.toLowerCase() : user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }
  if (req.body.avatar !== undefined) {
    user.avatar = req.body.avatar;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    user: updatedUser.toSafeObject(),
    token: generateToken(updatedUser._id, updatedUser.role),
  });
});

// @desc    Add or update a shipping address
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc    Delete a shipping address
// @route   DELETE /api/auth/addresses/:index
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const index = parseInt(req.params.index, 10);

  if (index < 0 || index >= user.addresses.length) {
    res.status(400);
    throw new Error("Invalid address index");
  }

  user.addresses.splice(index, 1);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});
