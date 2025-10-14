import express from "express";
import multer from "multer";
import { saveBankDetails } from "../controllers/bankDetailsController.js";
import { getAllKycDetails } from "../controllers/bankDetailsController.js";
import { updateKycStatus } from "../controllers/bankDetailsController.js";

const router = express.Router();

// Multer config (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/save", upload.single("passbookPhoto"), saveBankDetails);
router.get("/all", getAllKycDetails);
router.put("/status/:userId", updateKycStatus);

export default router;