import mongoose from "mongoose";
const CheckoutSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    phoneno: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    packagename: {
        type: String,
        required: true
    },
    coursename: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
export const Checkout = mongoose.model("Checkout", CheckoutSchema);