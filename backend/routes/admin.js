const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const adminController = require("../controllers/adminController");

router.post(
  "/signup",
  [
    body("username").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  adminController.signupAdmin
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  adminController.loginAdmin
);

module.exports = router;
