import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/myorders", getMyOrders);
router.get("/", admin, getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);
router.put("/:id/status", admin, updateOrderStatus);

export default router;
