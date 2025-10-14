import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameAsPerDocument: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNo: { type: String, required: true },
    branchName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    passbookPhoto: {
        data: Buffer,
        contentType: String,
    },
    status: { type: String, default: "inactive" },
}, { timestamps: true });

export default mongoose.model("BankDetails", bankDetailsSchema);