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

router.get(
  "/get-spaces",
  authMiddleware.adminMiddleware,
  spaceController.getSpaces
);

router.post(
  "/add-editor",
  authMiddleware.adminMiddleware,
  [body("editorEmail").isEmail(), body("spaceId").isMongoId()],
  spaceController.addEditor
);

router.post(
  "/remove-editor",
  authMiddleware.adminMiddleware,
  [body("editorEmail").isEmail(), body("spaceId").isMongoId()],
  spaceController.removeEditor
);

router.post(
  "/get-editors",
  authMiddleware.adminMiddleware,
  [body("spaceId").isMongoId()],
  spaceController.getEditors
);

module.exports = router;
