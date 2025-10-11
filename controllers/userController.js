import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateUniqueUserId } from "../utils/generateUserId.js";
import { generateToken } from "../utils/generateToken.js";

const BASE_REFERRAL_URL = "https://synthosphereacademy.com/register/";

export const registerUser = async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            address,
            aadharNo,
            password,
            parentId, // ✅ replacing referralId
        } = req.body;

        // Validation
        if (!name || !phone || !email || !address || !aadharNo || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for unique fields
        const existingUser = await User.findOne({
            $or: [
                { phone },
                { email },
                { aadharNo },
            ],
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with given phone, email, or Aadhaar already exists" });
        }

        // Generate unique userId
        const userId = await generateUniqueUserId();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle Aadhaar photo (binary)
        let aadharPhoto = { data: null, contentType: null };
        if (req.file) {
            aadharPhoto = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        // Create referral link
        const referralLink = `${BASE_REFERRAL_URL}${userId}`;

        // Create new user
        const newUser = new User({
            userId,
            name,
            phone,
            email,
            address,
            aadharNo,
            aadharPhoto,
            password: hashedPassword,
            parentId: parentId || null,
            referralLink,
        });

        await newUser.save();

        // If there’s a parent, update their referredIds
        if (parentId) {
            await User.updateOne({ userId: parentId }, { $push: { referredIds: userId } });
        }

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                userId,
                name,
                phone,
                email,
                referralLink,
                status: newUser.status,
            },
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Registration failed", error: error.message });
    }
};




//Login User
export const loginUser = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: "Email/Phone and Password are required." });
        }

        // Check if user exists (by email or phone)
        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Optional: check if user is active
        // if (user.status !== "active") {
        //     return res.status(403).json({ message: "Account not active. Please contact admin." });
        // }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                phone: user.phone,
                status: user.status,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed.",
            error: error.message,
        });
    }
};



// Aadhar Photo Api
export const getAadharPhoto = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user by ID (can be MongoDB _id or userId)
        const user = await User.findOne({
            $or: [{ userId: id }, { userId: id }],
        });

        if (!user || !user.aadharPhoto || !user.aadharPhoto.data) {
            return res.status(404).json({ message: "Aadhaar photo not found." });
        }

        // Set content type and send the image buffer
        res.set("Content-Type", user.aadharPhoto.contentType);
        return res.send(user.aadharPhoto.data);

    } catch (error) {
        console.error("Error retrieving Aadhaar photo:", error);
        res.status(500).json({
            message: "Failed to retrieve Aadhaar photo",
            error: error.message,
        });
    }
};