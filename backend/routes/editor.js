const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const editorController = require ("../controllers/editorController");
const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}; 

router.post(
  "/signup",
  [
    body("username").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  handleValidationErrors,
  editorController.signupEditor
);
router.post(
  "/verify-otp",
  [

    body("otp").isLength({ min: 6 }),
  ],
  handleValidationErrors,
  editorController.verifyOtp
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  handleValidationErrors,
  editorController.loginEditor
);




module.exports = router;