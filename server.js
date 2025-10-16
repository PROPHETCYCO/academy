import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import Razorpay from "razorpay";

import userRoutes from "./routes/userRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import payoutRoutes from "./routes/payoutRoutes.js";
import bankDetailsRoutes from "./routes/bankDetailsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
})

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Default route
app.get("/", (req, res) => {
    res.send("API is running...");
});

//Routes
app.use("/api/users", userRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/payout", payoutRoutes);
app.use("/api/bankdetails", bankDetailsRoutes);
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});