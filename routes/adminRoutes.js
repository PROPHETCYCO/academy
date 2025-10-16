import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

// Dashboard overview API
router.get("/dashboard-stats", getDashboardStats);

export default router;