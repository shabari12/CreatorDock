const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // ...existing code...
  youtubeCredentials: {
    clientId: { type: String },
    clientSecret: { type: String },
    refreshToken: { type: String },
  },
});

module.exports = mongoose.model("User", userSchema);
