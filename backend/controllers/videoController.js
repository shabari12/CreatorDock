const { validationResult } = require("express-validator");
const Video = require("../models/videoModel");
const { uploadToSupabase } = require("../utils/supabase");
const Space = require("../models/spaceModel");

const uploadVideo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const files = req.files;
    if (!files || !files.video || !files.thumbnail) {
      return res
        .status(400)
        
        .json({ error: "Video and thumbnail are required" });
    }
   
    const { title, description, spaceId } = req.body;
    const editorId = req.editor.id;
    console.log("Files:", files);
    console.log("Body:", req.body);
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
      videoUrl,
      thumbnailUrl,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadVideo };
