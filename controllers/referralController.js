import User from "../models/userModel.js";
import { calculateRealtimeReferralPoints } from "../utils/calculateReferralPoints.js";

// GET /api/referral/realtime/:userId
export const getRealtimeReferralPoints = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const referredPoints = await calculateRealtimeReferralPoints(userId);

        const totalPoints = user.selfPoints + referredPoints;

        res.status(200).json({
            success: true,
            userId: user.userId,
            name: user.name,
            selfPoints: user.selfPoints,
            referredPoints,
            totalPoints,
        });
    } catch (error) {
        console.error("Realtime calculation error:", error);
        res.status(500).json({
            success: false,
            message: "Error calculating real-time points",
            error: error.message,
        });
    }
};