import express from "express";
import { getAllPayouts, getUserPayouts, runGlobalPayout, updatePayoutStatus } from "../controllers/payoutController.js";

const router = express.Router();

// Run payout for all users
router.post("/run", runGlobalPayout);  // Trigger global payout process

router.get("/all-payouts", getAllPayouts); // Fetch all payout records
router.put("/status/:userId/:payoutId/status", updatePayoutStatus);  // Update payout status for a specific payout entry
router.get("/:userId", getUserPayouts);  // Fetch payout records for a specific user

export default router;