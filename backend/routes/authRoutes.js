import express from "express";
import * as authController from "../controllers/authController.js";
import { authUser, authAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/user/signup", authController.userSignup);
router.post("/login", authController.login);
router.post("/user/login", authController.userLogin);
router.post("/admin/login", authController.adminLogin);

// Protected routes
router.get("/user/me", authUser, authController.getUserProfile);
router.get("/admin/me", authAdmin, authController.getAdminProfile);
router.put("/user/profile", authUser, authController.updateUserProfile);

export default router;
