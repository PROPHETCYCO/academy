import express from "express";
import { getRealtimeReferralPoints } from "../controllers/referralController.js";

const router = express.Router();

// Real-time points endpoint
router.get("/realtime/:userId", getRealtimeReferralPoints);

export default router;