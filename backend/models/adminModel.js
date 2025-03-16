const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  editors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Editor",
    },
  ],
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  videos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
