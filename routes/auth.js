const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const User = require("../models/User");
const bcrypt = require("bcrypt"); 
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



// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check username
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: "Invalid username" });
    }

    // If using hashed password
  if (password !== user.password) {
  return res.json({ success: false, message: "Invalid password" });
}


    // If plain text password (not recommended):
    // if (password !== user.password) {
    //   return res.json({ success: false, message: "Invalid password" });
    // }

    // Success
    res.json({ success: true, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/check-username", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(200).json({ available: false });
    } else {
      return res.status(200).json({ available: true });
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
