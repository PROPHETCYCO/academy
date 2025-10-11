import User from "../models/userModel.js";

function generateRandom5DigitNumber() {
    return Math.floor(10000 + Math.random() * 90000);
}

export async function generateUniqueUserId() {
    let unique = false;
    let newId;

    while (!unique) {
        const randomNum = generateRandom5DigitNumber();
        newId = `SA${randomNum}`;
        const existingUser = await User.findOne({ userId: newId });
        if (!existingUser) {
            unique = true;
        }
    }

    return newId;
}