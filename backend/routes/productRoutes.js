import express from "express";
import * as productController from "../controllers/productController.js";
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Admin routes
router.post("/", authAdmin, productController.createProduct);
router.put("/:id", authAdmin, productController.updateProduct);
router.delete("/:id", authAdmin, productController.deleteProduct);

export default router;
