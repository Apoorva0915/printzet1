import express from "express";
import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  user.tokenExpiry = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "apoorvakesarwani0915@gmail.com",
      pass: process.env.emailPassword,
    },
  });

  const mailOptions = {
    from: "apoorvakesarwani0915@gmail.com",
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click <a href="http://localhost:5173/reset-password/${resetToken}">here</a> to reset your password.</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).json({ message: "Error sending email" });
    res.json({ message: "Password reset email sent" });
  });
});

router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });
  
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });
  
    user.password = newPassword;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();
  
    res.json({ message: "Password reset successful!" });
  });
  

export default router;
