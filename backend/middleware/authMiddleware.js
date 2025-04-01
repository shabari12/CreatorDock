const editorModel = require("../models/editorModel");
const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.adminMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Unauthenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(decoded.id);
    req.admin = admin;
    next();
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
  } catch (error) {
    return res.status(500).json("Admin not foundddd");
  }
};

module.exports.editorMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Unauthenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const editor = await editorModel.findById(decoded.id);
    if (!editor) {
      return res.status(404).json({ msg: "Editor not found" });
    }
    req.editor = editor;
    next(); // Call next() only if the editor exists
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};