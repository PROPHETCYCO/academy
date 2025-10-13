import express from "express";
import { runGlobalPayout } from "../controllers/payoutController.js";

const router = express.Router();

// Run payout for all users
router.post("/run", runGlobalPayout);

export default router;