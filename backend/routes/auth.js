import express from "express";
import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt for async hashing
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Configure email transporter once at server startup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

// 🔹 Forgot Password Route
// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.tokenExpiry = Date.now() + 3600000; // 1-hour expiry

    await user.save();
    
    console.log("✅ Stored Token in DB:", resetToken); // <--- LOG TOKEN SAVED IN DB
    console.log("⏳ Token Expiry:", new Date(user.tokenExpiry).toLocaleString());

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Error sending email:", err);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("📧 Reset email sent:", info.response);
      res.json({ message: "Password reset email sent" });
    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Reset Password Route
// Reset Password Route
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log("🔹 Received Token:", token);
    console.log("🔹 Received New Password:", newPassword);

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Debug: Fetch all users with resetToken
    const allUsers = await User.find({}, { email: 1, resetToken: 1, tokenExpiry: 1 });
    console.log("📌 All Users with Tokens:", allUsers);

    // Find user by token & check expiry
    const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

    console.log("🔹 Found User:", user ? user.email : "No user found");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.log("✅ Valid Token. Proceeding to reset password.");

    // Hash and update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    console.log("✅ Password reset successfully!");
    res.json({ message: "Password reset successful! You can now login." });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
