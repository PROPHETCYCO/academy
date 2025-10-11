import express from "express";
import { getAadharPhoto, loginUser, registerUser } from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/register", upload.single("aadharPhoto"), registerUser);
router.post("/login", loginUser);
router.get("/:id/aadharPhoto", getAadharPhoto);

export default router;