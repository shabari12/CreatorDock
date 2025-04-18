const express = require("express");
const {
  getAuthUrl,
  handleOAuthCallback,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to check if the user is an admin

const router = express.Router();

router.get("/auth-url", authMiddleware.adminMiddleware, getAuthUrl); // Endpoint to get the OAuth consent URL
router.get(
  "/oauth2callback",
  authMiddleware.adminMiddleware,
  handleOAuthCallback
); 

module.exports = router;
