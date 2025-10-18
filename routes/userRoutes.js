import express from "express";
import { getAadharPhoto, getAllUsers, getuser_by_id, loginUser, registerUser, updateUserDetails, updateUserStatus } from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import { checkout, getorderdetails_by_userid, getUserCheckoutDetails, paymentverification_students } from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/register", upload.fields([{ name: "aadharPhoto", maxCount: 1 }, { name: "panPhoto", maxCount: 1 },]), registerUser); // for registering user
router.post("/login", loginUser);  // foir login user
router.get("/:id/aadharPhoto", getAadharPhoto);  //particularly fetch user

router.post("/checkout", checkout);
router.post("/paymentverification_students", paymentverification_students);
router.post("/getuserdetails", getuser_by_id);   //fetch user details by id
router.post("/getorderdetailsbyuser", getorderdetails_by_userid);  //fetch order details by user id
router.get("/all", getAllUsers);  //fetch all users
router.put("/update/:userId", updateUserDetails);  //update user details by id
router.put("/status/:userId", updateUserStatus);  //update user status by id
router.get("/:userId", getUserCheckoutDetails);  //fetch checkout details by user id

export default router;