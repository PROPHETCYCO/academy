import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        totalPoints: {
            type: Number,
            default: 0,
        },
        payouts: [
            {
                date: {
                    type: Date,
                    default: Date.now, // ✅ Auto saves date & time of payout
                },
                amount: {
                    type: Number,
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["pending", "completed"],
                    default: "pending",
                },
            },
        ],
    },
    { timestamps: true } // createdAt, updatedAt for entire record
);

const Payout = mongoose.model("Payout", payoutSchema);
export default Payout;