const sendMail = require("../utils/sendMail");

// Temporary in-memory OTP storage (not for production)
const otpMap = {};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpMap[email] = otp;

  try {
    await sendMail(email, otp);
    return res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP", error });
  }
};

exports.verifyOtpAndSignup = async (req, res) => {
  const { username, password, phone, gender, email, otp } = req.body;

  if (!otpMap[email])
    return res.status(400).json({ message: "No OTP was sent to this email" });

  if (otpMap[email] !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  delete otpMap[email]; // Clear OTP after success

  // Save to DB (optional)
  return res.status(200).json({ message: "User signed up successfully" });
};
