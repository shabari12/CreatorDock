const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const adminController = require("../controllers/adminController");
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
  adminController.signupAdmin
);
router.post(
  "/verify-otp",
  [

    body("otp").isLength({ min: 6 }),
  ],
  handleValidationErrors,
  adminController.verifyOtp
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  handleValidationErrors,
  adminController.loginAdmin
);

module.exports = router;
