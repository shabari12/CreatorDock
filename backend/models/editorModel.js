const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Space = require("./spaceModel");

const editorSchema = new mongoose.Schema({
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
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space",
  },
});
editorSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "24hr",
    }
  );
  return token;
};

editorSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

editorSchema.statics.hashPassword = async function (password) {
  const saltRound = parseInt(process.env.SALT_ROUND);
  return await bcrypt.hash(password, saltRound);
};

const Editor = mongoose.model("Editor", editorSchema);

module.exports = Editor;
