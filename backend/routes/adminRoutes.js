import express from "express";
import { authAdmin } from "../middleware/auth.js";
import { getDashboard } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", authAdmin, getDashboard);

export default router;