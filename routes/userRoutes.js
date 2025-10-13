import express from "express";
import { getAadharPhoto, loginUser, registerUser } from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import { checkout, paymentverification_students } from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/register", upload.single("aadharPhoto"), registerUser);
router.post("/login", loginUser);
router.get("/:id/aadharPhoto", getAadharPhoto);

router.post("/checkout", checkout);
router.post("/paymentverification_students", paymentverification_students);

export default router;