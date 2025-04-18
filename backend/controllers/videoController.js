const Video = require("../models/videoModel");
const { uploadToSupabase, deleteFromSupabase } = require("../utils/supabase");
const Space = require("../models/spaceModel");
const { youtubeUploader } = require("../utils/youtube");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const uploadVideo = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const {
      title,
      description,
      spaceId,
      status,

      keywords,
      privacystatus,
    } = req.body;
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
      status: status || "pending", // Default to "pending" if not provided
      keywords: keywords ? keywords.split(",").map((kw) => kw.trim()) : [], // Split keywords by comma
      privacystatus: privacystatus || "private", // Default to "public" if not provided
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
    const {
      title,
      description,

      status,

      keywords,
      privacystatus,
    } = req.body;
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
    if (status) {
      updateData.status = status;
    }
    if (keywords) {
      updateData.keywords = keywords.split(",").map((kw) => kw.trim());
    }
    if (privacystatus) {
      updateData.privacystatus = privacystatus;
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

const uploadToYoutube = async (req, res) => {
  const videoId = req.params.videoId;
  const adminid = req.admin.id;

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }

  try {
    const admin = await Admin.findById(adminid);
    if (!admin || !admin.youtubeCredentials.refreshToken) {
      return res.status(400).json({ error: "YouTube credentials not found" });
    }

    const videodata = await Video.findById(videoId);
    if (!videodata) {
      return res.status(404).json({ error: "Video not found" });
    }

    youtubeUploader(
      videodata.videoUrl,
      videodata.thumbnailUrl,
      videodata.title,
      videodata.description,
      videodata.category,
      videodata.keywords,
      videodata.privacystatus,
      admin.youtubeCredentials.clientId,
      admin.youtubeCredentials.clientSecret,
      admin.youtubeCredentials.refreshToken
    )
      .then(async (response) => {
        console.log("YouTube upload response:", response);
        const updatedVideodata = await Video.findByIdAndUpdate(
          videoId,
          { youtubeVideoId: response.id },
          { new: true, runValidators: true }
        );
        return res.status(200).json({
          message: "Video uploaded to YouTube successfully",
          youtubeVideoId: response.id,
        });
      })
      .catch((error) => {
        console.error("Error uploading to YouTube:", error);
        return res.status(500).json({ error: error.message });
      });
  } catch (Error) {
    console.error("Error uploading to YouTube:", Error);
    return res.status(500).json({ error: Error.message });
  }
};

module.exports = {
  uploadVideo,
  getVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
  uploadToYoutube,
};
