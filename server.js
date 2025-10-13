import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import payoutRoutes from "./routes/payoutRoutes.js";

dotenv.config();

const app = express();

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});