import express from "express";
import { getRealtimeReferralPoints, getUserWithReferrals } from "../controllers/referralController.js";

const router = express.Router();

// Real-time points endpoint
router.get("/realtime/:userId", getRealtimeReferralPoints);
router.get("/:userId", getUserWithReferrals);

export default router;