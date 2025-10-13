import User from "../models/userModel.js";
import { calculateRealtimeReferralPoints } from "../utils/calculateReferralPoints.js";

// GET /api/referral/realtime/:userId
export const getRealtimeReferralPoints = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Recalculate referral points up to 10 levels
        const referredPoints = await calculateRealtimeReferralPoints(userId);
        const totalPoints = referredPoints;

        user.referredPoints = referredPoints;
        await user.save();

        res.status(200).json({
            success: true,
            userId: user.userId,
            name: user.name,
            selfPoints: user.selfPoints,
            referredPoints,
            totalPoints,
        });
    } catch (error) {
        console.error("Error in real-time referral calculation:", error);
        res.status(500).json({
            success: false,
            message: "Error calculating real-time referral points",
            error: error.message,
        });
    }
};