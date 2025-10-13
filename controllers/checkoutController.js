import { Checkout } from "../models/checkout.js";
import { instance } from "../server.js";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();
export const checkout = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
            //   receipt: `receipt_${Date.now()}`, // unique receipt id
        };
        const order = await instance.orders.create(options);
        console.log(order);
        console.log(process.env.RAZORPAY_API_SECRET);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(400).send("Internal Server Error");
    }
};


export const paymentverification_students = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        fullname,
        userId,
        phoneno,
        email,
        address,
        packagename,
        coursename,
        amount,
    } = req.body;
    try {
        // :one: Verify signature
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");
        if (generated_signature === razorpay_signature) {
            // :two: Save payment details to DB
            const paymentDetails = new Checkout({
                fullname,
                userId,
                phoneno,
                address,
                email,
                packagename,
                coursename,
                amount,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            const pointsToAdd = getPointsForAmount(amount);
            const validityMonths = getValidityForAmount(amount);
            const user = await User.findOne({ userId: userId });
            if (user) {
                const now = new Date();
                const expiry = new Date(now);
                expiry.setMonth(expiry.getMonth() + validityMonths);
                user.selfPoints = (user.points || 0) + pointsToAdd;
                user.packageName = packagename;
                user.courseName = coursename;
                user.validityStart = now;
                user.validityEnd = expiry;
                await user.save();
                await paymentDetails.save();
                console.log("Payment details saved");
                console.log("user got  points and  month validity.");
            }
            // :three: Redirect frontend
            return res
                .status(200)
                .json({ success: true, message: "Payment successful" });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error(":x: Error verifying payment:", error);
        res.status(400).json({ success: false });
    }
};


// utils/getPoints.js
export const getPointsForAmount = (amount) => {
    const mapping = {
        944: 800,
        1770: 1500,
        3540: 3000,
        7080: 6000,
        11800: 10000,
        59000: 25000,
    };
    // Round off to handle small differences (e.g., decimals)
    const roundedAmount = Math.round(amount);
    // Return the corresponding points, or 0 if not matched
    return mapping[roundedAmount] || 0;
};


// utils/getValidity.js
export const getValidityForAmount = (amount) => {
    const mapping = {
        944: 1,     // 1 month
        1770: 1,    // 1 months
        3540: 3,    // 3 months
        7080: 6,   // 6 month
        11800: 12,  // 1 year
        59000: 12,  // 1 year
    };
    const roundedAmount = Math.round(amount);
    return mapping[roundedAmount] || 0;
};