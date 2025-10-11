import User from "../models/userModel.js";

const LEVEL_PERCENTAGES = {
    2: 0.15,
    3: 0.10,
    4: 0.05,
    5: 0.03,
};

// Recursive calculation
export const calculateRealtimeReferralPoints = async (userId, currentLevel = 1) => {
    if (currentLevel > 5) return 0; // only count up to 5 levels

    const user = await User.findOne({ userId });
    if (!user || !user.referredIds?.length) return 0;

    let totalReferralPoints = 0;

    for (const childId of user.referredIds) {
        const child = await User.findOne({ userId: childId });
        if (!child) continue;

        // Step 1: Add points from this child’s self points
        if (LEVEL_PERCENTAGES[currentLevel + 1]) {
            totalReferralPoints += child.selfPoints * LEVEL_PERCENTAGES[currentLevel + 1];
        }

        // Step 2: Go deeper (child’s children)
        const downlinePoints = await calculateRealtimeReferralPoints(childId, currentLevel + 1);

        // Step 3: Add all deeper levels
        totalReferralPoints += downlinePoints;
    }

    return totalReferralPoints;
};