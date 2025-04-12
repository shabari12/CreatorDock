const Video = require("../models/videoModel");
const { uploadToSupabase, deleteFromSupabase } = require("../utils/supabase"); // Import delete function
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
      console.error("Validation Errors:", errors);
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

    space.videos.push(newVideo._id);
    await space.save();

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (err) {
    console.error("Upload Error:", err); // Log unexpected errors
    res.status(500).json({ error: err.message });
  }
};

const getVideo = async (req, res) => {
  const videoId = req.params.videoId;
  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }
  try {
    const response = await Video.findById(videoId);
    if (!response) {
      return res.status(404).json({ error: "Video not found" });
    }
    return res.status(200).json({ video: response });
  } catch (err) {
    console.error("Error fetching video:", err);
    return res.status(500).json({ error: err.message });
  }
};
const getAllVideos = async (req, res) => {
  const spaceId = req.params.spaceId;
  if (!spaceId) {
    return res.status(400).json({ error: "Space ID is required" });
  }
  try {
    const response = await Video.find({ space: spaceId });
    if (!response) {
      return res.status(404).json({ error: "No videos found for this space" });
    }
    return res.status(200).json({ videos: response });
  } catch (err) {
    console.error("Error fetching videos:", err);
    return res.status(500).json({ error: err.message });
  }
};
const updateVideo = async (req, res) => {
  const videoId = req.params.videoId;
  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }
  try {
    const { title, description } = req.body;
    const files = req.files;
    const editorId = req.editor?.id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const updateData = {};

    if (title) {
      updateData.title = title;
    }
    if (description) {
      updateData.description = description;
    }
    if (files && files.video && files.video[0]) {
      // Delete old video file from Supabase
      if (video.videoUrl) {
        await deleteFromSupabase(video.videoUrl);
      }
      // Upload new video file
      const videoUrl = await uploadToSupabase(
        files.video[0],
        editorId,
        "videos"
      );
      updateData.videoUrl = videoUrl;
    }
    if (files && files.thumbnail && files.thumbnail[0]) {
      // Delete old thumbnail file from Supabase
      if (video.thumbnailUrl) {
        await deleteFromSupabase(video.thumbnailUrl);
      }
      // Upload new thumbnail file
      const thumbnailUrl = await uploadToSupabase(
        files.thumbnail[0],
        editorId,
        "thumbnails"
      );
      updateData.thumbnailUrl = thumbnailUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (err) {
    console.error("Error updating video:", err);
    return res.status(500).json({ error: err.message });
  }
};
const deleteVideo = async (req, res) => {
  const videoId = req.params.videoId;
  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }
  try {
    const video = await Video.findByIdAndDelete(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
  } catch (err) {
    console.error("Error deleting video:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadVideo,
  getVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
};
