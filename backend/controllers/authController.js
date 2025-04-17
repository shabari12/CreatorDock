const { google } = require("googleapis");
const User = require("../models/userModel"); // Import User model

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Generate the OAuth consent URL
const getAuthUrl = (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/youtube.upload"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  return res.status(200).json({ authUrl: url });
};

// Handle the OAuth callback
const handleOAuthCallback = async (req, res) => {
  const { code } = req.query;
  const userId = req.user.id; // Assume user is authenticated and their ID is available

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Save credentials to the user's record
    await User.findByIdAndUpdate(userId, {
      "youtubeCredentials.clientId": process.env.YOUTUBE_CLIENT_ID,
      "youtubeCredentials.clientSecret": process.env.YOUTUBE_CLIENT_SECRET,
      "youtubeCredentials.refreshToken": tokens.refresh_token,
    });

    return res.status(200).json({
      message: "OAuth successful, credentials saved",
    });
  } catch (error) {
    console.error("Error during OAuth callback:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getAuthUrl, handleOAuthCallback };
