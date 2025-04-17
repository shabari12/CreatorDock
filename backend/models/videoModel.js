const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Editor",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    youtubeVideoId: { type: String },
    keywords: [{ type: String }],
    privacystatus: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    category: {
      type: Number,
      default: 22,
    },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
