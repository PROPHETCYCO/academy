import express from "express";
import multer from "multer";
import { getUserBankDetails, saveBankDetails } from "../controllers/bankDetailsController.js";
import { getAllKycDetails } from "../controllers/bankDetailsController.js";
import { updateKycStatus } from "../controllers/bankDetailsController.js";

const router = express.Router();

// Multer config (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/save", upload.single("passbookPhoto"), saveBankDetails);  // Save bank details with optional passbook photo
router.get("/all", getAllKycDetails); // Fetch all KYC details
router.put("/status/:userId", updateKycStatus); // Update KYC status for a user
router.get("/:userId", getUserBankDetails);  // Fetch bank details for a specific user

export default router;