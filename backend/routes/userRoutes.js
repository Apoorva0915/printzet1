import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// User Signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = new User({ fullName, email, mobile, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user: { fullName, email, mobile } });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    // Find user by email or mobile
    const user = await User.findOne({ $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { fullName: user.fullName, email: user.email, mobile: user.mobile ,  isAdmin: user.isAdmin,} });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

router.put("/update-address", async (req, res) => {
  try {
    const { email, address, city, state, pincode } = req.body;

    if (!email || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.address = { address, city, state, pincode };
    await user.save();

    res.status(200).json({ message: "Address updated successfully.", user });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
