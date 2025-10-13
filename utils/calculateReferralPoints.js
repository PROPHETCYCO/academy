import User from "../models/userModel.js";

// Define dynamic percentages for each level
const LEVEL_PERCENTAGES = {
    2: 0.15, // 15%
    3: 0.05, // 5%
    4: 0.03, // 3%
    5: 0.02, // 2%
    6: 0.01, // 1%
    7: 0.008, // 0.8%
    8: 0.008, // 0.8%
    9: 0.008, // 0.8%
    10: 0.008 // 0.8%
};

export const calculateRealtimeReferralPoints = async (userId, currentLevel = 1) => {
    if (currentLevel > 10) return 0; // stop after level 10

    const user = await User.findOne({ userId });
    if (!user || !user.referredIds?.length) return 0;

    let totalReferralPoints = 0;

    for (const childId of user.referredIds) {
        const child = await User.findOne({ userId: childId });
        if (!child) continue;

        // Step 1: Apply correct percentage based on current level
        if (LEVEL_PERCENTAGES[currentLevel + 1]) {
            totalReferralPoints += child.selfPoints * LEVEL_PERCENTAGES[currentLevel + 1];
        }

        // Step 2: Recursively go deeper into next levels
        const downlinePoints = await calculateRealtimeReferralPoints(childId, currentLevel + 1);

        // Step 3: Accumulate downline points
        totalReferralPoints += downlinePoints;
    }

    return totalReferralPoints;
};