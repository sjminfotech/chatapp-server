const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtpAndSignup } = require("../controllers/otpController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndSignup);

module.exports = router;
