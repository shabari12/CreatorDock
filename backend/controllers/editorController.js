const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/nodemailer");
const crypto = require("crypto");
const editorModel = require("../models/editorModel");
const hashOtp = (email, otp) => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return crypto
    .createHmac("sha256", secret)
    .update(email + otp)
    .digest("hex");
};

const otpStore = new Map();
const signupEditor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  try {
    const isEditorExists = await editorModel.findOne({ email });
    if (isEditorExists) {
      return res.status(400).json({ msg: "editor already exists" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpHash = hashOtp(email, otp);
    otpStore.set(email, otpHash);
    await sendMail(email, otp);
    console.log("OTP sent successfully");
    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in signupEditor:", error);
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
  const hashedPassword = await editorModel.hashPassword(password);
  const neweditor = new editorModel({
    username,
    email,
    password: hashedPassword,
  });
  await neweditor.save();
  const token = neweditor.generateToken();

  return res.status(200).json({ neweditor, token });
};
const loginEditor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const editor = await editorModel.findOne({ email });
  if (!editor) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const isMatch = await editor.comparePasswords(password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const token = editor.generateToken();
  res.cookie(token);
  res.status(200).json({ editor, token });
};

module.exports = { signupEditor, verifyOtp, loginEditor };
