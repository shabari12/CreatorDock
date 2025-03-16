const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String, required: true }, // Thumbnail URL
    videoUrl: { type: String, required: true }, // Video file URL
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Editor",
      required: true,
    }, // Editor who uploaded
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    }, // Approval status
    youtubeVideoId: { type: String }, 
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
