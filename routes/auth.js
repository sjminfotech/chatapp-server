const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const User = require("../models/User");

const otpStore = new Map();

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

  try {
    await sendMail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ✅ Check Username Availability (NEW ROUTE — ENABLED)
router.post("/check-username", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username is required" });

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(200).json({ exists: true, message: "Username already taken" });
  } else {
    return res.status(200).json({ exists: false, message: "Username available" });
  }
});

// ✅ Verify OTP & Register User
router.post("/verify-otp", async (req, res) => {
  const { username, password, phone, gender, email, otp } = req.body;

  const storedOtp = otpStore.get(email);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({ username, password, phone, gender, email });
    await user.save();
    otpStore.delete(email);
    res.status(200).json({ message: "Signup success" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
