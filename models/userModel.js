import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    address: {
        type: String,
        required: true,
    },

    aadharNo: {
        type: String,
        required: true,
        unique: true,
    },

    aadharPhoto: {
        data: Buffer,
        contentType: String,
    },

    panNo: {
        type: String,
        required: true,
        unique: true,
    },
    panPhoto: {
        data: Buffer,
        contentType: String,
    },

    password: {
        type: String,
        required: true,
    },

    referralLink: { type: String, required: true },

    parentId: {
        type: String,
        default: null,
    },

    referredIds: [
        {
            type: String,
            ref: "User",
        },
    ],

    courseName: {
        type: String,
        default: "",
    },

    packageName: {
        type: String,
        default: "",
    },

    referredPoints: {
        type: Number,
        default: 0,
    },

    selfPoints: {
        type: Number,
        default: 0,
    },

    validityStart: { type: Date },

    validityEnd: { type: Date },

    status: {
        type: String,
        enum: ["pending", "active", "inactive"],
        default: "pending",
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);