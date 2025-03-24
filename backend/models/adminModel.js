const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Space = require("./spaceModel");

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
  
  spaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space",
  }],
 
});

adminSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "24hr",
    }
  );
  return token;
};

adminSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.statics.hashPassword = async function (password) {
  const saltRound = parseInt(process.env.SALT_ROUND);
  return await bcrypt.hash(password, saltRound);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
