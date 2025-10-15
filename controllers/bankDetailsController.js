import BankDetails from "../models/bankDetails.js";

export const saveBankDetails = async (req, res) => {
    try {
        const {
            userId,
            name,
            nameAsPerDocument,
            bankName,
            accountNo,
            branchName,
            ifscCode,
        } = req.body;

        if (!userId || !name || !nameAsPerDocument || !bankName || !accountNo || !branchName || !ifscCode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already submitted bank details
        const existing = await BankDetails.findOne({ userId });
        if (existing) {
            return res.status(400).json({ message: "Bank details already exist for this user" });
        }

        // Handle passbook photo upload
        let passbookPhoto = { data: null, contentType: null };
        if (req.file) {
            passbookPhoto = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const bankDetails = new BankDetails({
            userId,
            name,
            nameAsPerDocument,
            bankName,
            accountNo,
            branchName,
            ifscCode,
            passbookPhoto,
        });

        await bankDetails.save();

        res.status(201).json({
            success: true,
            message: "Bank details saved successfully",
            data: {
                userId,
                name,
                bankName,
                accountNo,
                branchName,
                ifscCode,
            },
        });
    } catch (error) {
        console.error("Error saving bank details:", error);
        res.status(500).json({ success: false, message: "Failed to save bank details", error: error.message });
    }
};


// ✅ Get all KYC details (including image)
export const getAllKycDetails = async (req, res) => {
    try {
        const allDetails = await BankDetails.find().sort({ createdAt: -1 });

        // Convert image binary to Base64 for each entry
        const formattedDetails = allDetails.map(detail => ({
            _id: detail._id,
            userId: detail.userId,
            name: detail.name,
            nameAsPerDocument: detail.nameAsPerDocument,
            bankName: detail.bankName,
            accountNo: detail.accountNo,
            branchName: detail.branchName,
            ifscCode: detail.ifscCode,
            status: detail.status,
            createdAt: detail.createdAt,
            updatedAt: detail.updatedAt,
            passbookPhoto: detail.passbookPhoto?.data
                ? `data:${detail.passbookPhoto.contentType};base64,${detail.passbookPhoto.data.toString("base64")}`
                : null,
        }));

        res.status(200).json({
            success: true,
            message: "Fetched all KYC details successfully",
            data: formattedDetails,
        });
    } catch (error) {
        console.error("Error fetching KYC details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch KYC details",
            error: error.message,
        });
    }
};


//update status
// ✅ Update KYC Status (Admin Action)
export const updateKycStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const validStatuses = ["inactive", "pending", "verified", "rejected"];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const bankDetail = await BankDetails.findOneAndUpdate(
            { userId },
            { status },
            { new: true }
        );

        if (!bankDetail) {
            return res.status(404).json({ message: "Bank details not found for this user" });
        }

        res.status(200).json({
            success: true,
            message: `KYC status updated to ${status}`,
            data: bankDetail,
        });
    } catch (error) {
        console.error("Error updating KYC status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update KYC status",
            error: error.message,
        });
    }
};


// ✅ Get KYC details for a specific user (including image)
export const getUserBankDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const bankDetails = await BankDetails.findOne({ userId });

        if (!bankDetails) {
            return res.status(404).json({ message: "No bank details found for this user" });
        }

        res.status(200).json({
            success: true,
            message: "Bank details fetched successfully",
            data: {
                userId: bankDetails.userId,
                nameAsPerDocument: bankDetails.nameAsPerDocument,
                bankName: bankDetails.bankName,
                accountNumber: bankDetails.accountNumber,
                branchName: bankDetails.branchName,
                ifscCode: bankDetails.ifscCode,
                status: bankDetails.status,
                passbookPhoto: bankDetails.passbookPhoto
                    ? `data:${bankDetails.passbookPhoto.contentType};base64,${bankDetails.passbookPhoto.data.toString("base64")}`
                    : null,
            },
        });
    } catch (error) {
        console.error("Error fetching bank details:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bank details" });
    }
};