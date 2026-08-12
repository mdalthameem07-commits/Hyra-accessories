import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/addresses", protect, addAddress);
router.delete("/addresses/:index", protect, deleteAddress);

export default router;
