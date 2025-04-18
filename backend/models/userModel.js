const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // ...existing code...
  
});

module.exports = mongoose.model("User", userSchema);
