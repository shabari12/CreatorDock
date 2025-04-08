const Video = require("../models/videoModel");
const { uploadToSupabase } = require("../utils/supabase");
const Space = require("../models/spaceModel");

const uploadVideo = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log request body
    console.log("Request Files:", req.files); // Log uploaded files

    const { title, description, spaceId } = req.body;
    const files = req.files;
    const editorId = req.editor?.id;

    const errors = [];
    if (!title) errors.push({ msg: "Title is required", path: "title" });
    if (!spaceId) errors.push({ msg: "Space ID is required", path: "spaceId" });

    if (!files || !files.video || !files.video[0]) {
      errors.push({ msg: "Video file is required", path: "video" });
    }
    if (!files || !files.thumbnail || !files.thumbnail[0]) {
      errors.push({ msg: "Thumbnail file is required", path: "thumbnail" });
    }

    if (errors.length > 0) {
      console.error("Validation Errors:", errors); // Log validation errors
      return res.status(400).json({ errors });
    }

    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    const videoUrl = await uploadToSupabase(files.video[0], editorId, "videos");
    const thumbnailUrl = await uploadToSupabase(
      files.thumbnail[0],
      editorId,
      "thumbnails"
    );

    const newVideo = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      space: spaceId,
      uploadedBy: editorId,
    });

    await newVideo.save();

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (err) {
    console.error("Upload Error:", err); // Log unexpected errors
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadVideo };
