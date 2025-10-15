import User from "../models/userModel.js";
import Payout from "../models/payoutModel.js";
import { calculateRealtimeReferralPoints } from "../utils/calculateReferralPoints.js";

// ✅ Helper function to convert UTC → IST readable format
const formatIST = (utcDate) => {
    return new Date(utcDate).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

// ✅ POST /api/payout/run → runs payout for ALL users
export const runGlobalPayout = async (req, res) => {
    try {
        console.log("Running global payout process...");

        const users = await User.find({});
        if (!users.length) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        const allPayouts = [];

        for (const user of users) {
            const referredPoints = await calculateRealtimeReferralPoints(user.userId);
            const totalPoints = referredPoints;

            // New payout entry
            const payoutEntry = {
                amount: totalPoints,
                status: "pending",
                date: new Date(), // UTC stored, but we'll convert on response
            };

            // Create or update user's payout record
            let payoutRecord = await Payout.findOne({ userId: user.userId });

            if (!payoutRecord) {
                payoutRecord = new Payout({
                    userId: user.userId,
                    name: user.name,
                    totalPoints: totalPoints, // ✅ initialize totalPoints
                    payouts: [payoutEntry],
                });
            } else {
                payoutRecord.payouts.push(payoutEntry);
                payoutRecord.totalPoints += totalPoints; // ✅ keep adding total points after each payout
            }

            await payoutRecord.save();

            // Reset referredPoints after payout
            user.referredPoints = 0;
            user.selfPoints = 0;
            await user.save();

            // ✅ Add formatted IST date to response
            allPayouts.push({
                userId: user.userId,
                name: user.name,
                payoutAmount: totalPoints,
                date: formatIST(payoutEntry.date),
                status: payoutEntry.status,
            });
        }

        // ✅ Final response
        res.status(200).json({
            success: true,
            message: "Global payout generated successfully",
            totalUsers: allPayouts.length,
            payouts: allPayouts,
        });
    } catch (error) {
        console.error("Error during global payout:", error);
        res.status(500).json({
            success: false,
            message: "Error generating global payout",
            error: error.message,
        });
    }
};


//payout for single user
export const getUserPayouts = async (req, res) => {
    try {
        const { userId } = req.params;
        const payouts = await Payout.find({ userId });

        if (!payouts.length) {
            return res.status(404).json({ message: "No payout records found for this user" });
        }

        res.status(200).json({
            success: true,
            message: "Payout records fetched successfully",
            data: payouts,
        });
    } catch (error) {
        console.error("Error fetching payout data:", error);
        res.status(500).json({ success: false, message: "Failed to fetch payout details" });
    }
};