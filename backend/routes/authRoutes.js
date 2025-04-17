const express = require("express");
const {
  getAuthUrl,
  handleOAuthCallback,
} = require("../controllers/authController");

const router = express.Router();

router.get("/auth-url", getAuthUrl); // Endpoint to get the OAuth consent URL
router.get("/oauth2callback", handleOAuthCallback); // Endpoint to handle the callback

module.exports = router;
