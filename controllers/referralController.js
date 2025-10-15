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


//Tree  Api
export const getUserWithReferrals = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find main user
        const mainUser = await User.findOne({ userId });
        if (!mainUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find referred users using referredIds array
        const referredUsers = await User.find({ userId: { $in: mainUser.referredIds } });

        res.status(200).json({
            success: true,
            message: "User and referred users fetched successfully",
            data: {
                mainUser: {
                    userId: mainUser.userId,
                    name: mainUser.name,
                    email: mainUser.email,
                    phone: mainUser.phone,
                    address: mainUser.address,
                    referralLink: mainUser.referralLink,
                    selfPoints: mainUser.selfPoints,
                    referredPoints: mainUser.referredPoints,
                    totalPoints: mainUser.totalPoints,
                    status: mainUser.status,
                },
                referredUsers: referredUsers.map(user => ({
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    selfPoints: user.selfPoints,
                    referredPoints: user.referredPoints,
                    totalPoints: user.totalPoints,
                    status: user.status,
                })),
            },
        });
    } catch (error) {
        console.error("Error fetching user and referrals:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch referral details",
            error: error.message,
        });
    }
};