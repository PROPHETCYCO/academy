import express from "express";
import { getUserPayouts, runGlobalPayout } from "../controllers/payoutController.js";

const router = express.Router();

// Run payout for all users
router.post("/run", runGlobalPayout);
router.get("/:userId", getUserPayouts);

export default router;