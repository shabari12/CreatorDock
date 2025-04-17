const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  uploadVideo,
  getVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
  uploadToYoutube,
} = require("../controllers/videoController");
const {
  editorMiddleware,
  adminMiddleware,
  editorOrAdminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);



router.post(
  "/upload",
  editorMiddleware,
  uploadFields,
  (req, res, next) => {
    console.log("Multer Middleware Processed Files:", req.files);
    console.log("Request Body After Multer:", req.body);
    next();
  },
  uploadVideo
);
router.post(
  "/update-video/:videoId", 
  editorOrAdminMiddleware,
  uploadFields,
  (req, res, next) => {
    console.log("Multer Middleware Processed Files:", req.files);
    console.log("Request Body After Multer:", req.body);
    next();
  },
  updateVideo
);
router.post("/delete-video/:videoId", editorOrAdminMiddleware, deleteVideo);

router.get("/get-video/:videoId", editorOrAdminMiddleware, getVideo);
router.get("/getall-videos/:spaceId", editorOrAdminMiddleware, getAllVideos);
router.post("/uploadtoyoutube/:videoId", adminMiddleware, uploadToYoutube);

module.exports = router;
