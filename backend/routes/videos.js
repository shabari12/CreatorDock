const express = require("express");
const multer = require("multer");
const path = require("path");

const { uploadVideo } = require("../controllers/videoController");
const { editorMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

router.use((req, res, next) => {
  console.log("Headers:", req.headers); // Log all headers for debugging
  console.log("Content-Type:", req.headers["content-type"]); // Log Content-Type
  if (!req.headers["content-type"]) {
    console.error("Missing Content-Type header"); // Log missing Content-Type
    return res.status(400).json({
      error:
        "Content-Type header is missing. Ensure you are sending multipart/form-data.",
    });
  }
  if (!req.is("multipart/form-data")) {
    console.error("Invalid Content-Type:", req.headers["content-type"]); // Log invalid Content-Type
    return res.status(400).json({
      error: "Invalid Content-Type. Content-Type must be multipart/form-data.",
    });
  }
  next();
});

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

module.exports = router;
