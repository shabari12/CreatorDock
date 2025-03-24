const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");
const sendMail = require("../utils/nodemailer");
const crypto = require("crypto");
const hashOtp = (email, otp) => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return crypto
    .createHmac("sha256", secret)
    .update(email + otp)
    .digest("hex");
};

const otpStore = new Map();

const signupAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  try {
    const isAdminExists = await AdminModel.findOne({ email });
    if (isAdminExists) {
      return res.status(400).json({ msg: "Admin already exists" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpHash = hashOtp(email, otp);
    otpStore.set(email, otpHash);
    await sendMail(email, otp);
    console.log("OTP sent successfully");
    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in signupAdmin:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password, otp } = req.body;
  const storedOtpHash = otpStore.get(email);
  if (!storedOtpHash) {
    return res.status(400).json({ msg: "OTP expired" });
  }
  const expectedHash = hashOtp(email, otp);
  if (storedOtpHash !== expectedHash) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }
  otpStore.delete(email);
  const hashedPassword = await AdminModel.hashPassword(password);
  const newAdmin = new AdminModel({
    username,
    email,
    password: hashedPassword,
  });
  await newAdmin.save();
  const token = newAdmin.generateToken();
  return res.status(200).json({ newAdmin, token });
};

const loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const admin = await AdminModel.findOne({ email });
  if (!admin) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const isMatch = await admin.comparePasswords(password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const token = admin.generateToken();
  res.cookie(token);
  res.status(200).json({ admin, token });
};

module.exports = { signupAdmin, loginAdmin, verifyOtp };
