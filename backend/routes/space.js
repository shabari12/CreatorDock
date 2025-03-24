const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const spaceController = require("../controllers/spaceController");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/create-space",
  authMiddleware.adminMiddleware,
  [
    body("spaceName").isLength({ min: 3 }),
    body("spaceDescription").isLength({ min: 10 }),
    body("spaceEditorEmail").isEmail(),
  ],

  spaceController.createSpace
);

router.post(
  "/add-editor",
  authMiddleware.adminMiddleware,
  [body("editorEmail").isEmail(), body("spaceId").isMongoId()],
  spaceController.addEditor
);

module.exports = router;
