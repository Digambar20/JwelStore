import express from "express";
import * as orderController from "../controllers/orderController.js";
import { authUser, authAdmin } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.post("/", authUser, orderController.createOrder);
router.get("/user", authUser, orderController.getUserOrders);
router.delete("/:id", authUser, orderController.cancelOrder);

// Admin routes
router.get("/admin/all", authAdmin, orderController.getAllOrders);
router.get("/admin/analytics", authAdmin, orderController.getSalesAnalytics);
router.delete("/admin/:id", authAdmin, orderController.cancelOrderByAdmin);
router.put("/:id/status", authAdmin, orderController.updateOrderStatus);

export default router;
