const youtubeUploader = async (
  videoUrl,
  thumbnailUrl,
  title,
  vdescription,
  category,
  keywords,
  privacystatus,
  clientId,
  clientSecret,
  refreshToken // Accept credentials as parameters
) => {
  const { google } = require("googleapis");
  const axios = require("axios");

  const RETRIABLE_STATUS_CODES = [500, 502, 503, 504];
  const MAX_RETRIES = 10;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.YOUTUBE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken, // Use the provided refresh token
  });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const uploadVideo = async (retry = 0) => {
    try {
      const videoStream = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
      });

      const response = await youtube.videos.insert({
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: title,
            description: vdescription,
            tags: keywords,
            categoryId: category,
          },
          status: {
            privacyStatus: privacystatus,
          },
        },
        media: {
          body: videoStream.data, // Stream the video directly
        },
      });

      return response.data;
    } catch (error) {
      if (
        error.response &&
        RETRIABLE_STATUS_CODES.includes(error.response.status) &&
        retry < MAX_RETRIES
      ) {
        console.warn(
          `Retriable error occurred (status: ${
            error.response.status
          }). Retrying... (${retry + 1}/${MAX_RETRIES})`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retry) * 1000)
        ); // Exponential backoff
        return uploadVideo(retry + 1);
      }

      console.error("Error uploading video to YouTube:", error);
      throw error;
    }
  };

  return uploadVideo();
};

module.exports = { youtubeUploader };
