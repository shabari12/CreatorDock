const express = require("express");
const middleware = require("../middleware/authMiddleware");
const videoController = require("../controllers/videoController");
const { body } = require("express-validator");
const multer = require("multer");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  middleware.editorMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("spaceId").notEmpty().withMessage("Space ID is required"), // Validate spaceId

  videoController.uploadVideo
);

module.exports = router;
