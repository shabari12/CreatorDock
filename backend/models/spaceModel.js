const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
  spaceName: {
    type: String,
    required: true,
    unique: true,
  },
  spaceDescription: {
    type: String,
    required: true,
  },
  spaceAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  editors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Editor",
    },
  ],
});

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
