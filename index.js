const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "AIzaSyBpEKRgZTMVF2FoojngWrwlpxo-WCANbTM"; // Add your Google API Key (YouTube Search v3)

// Function to handle converting the YouTube video to MP3 URL
async function OutputUrl(url) {
  try {
    const payload = {
      filenamePattern: "pretty",
      isAudioOnly: true,
      url: url,
    };

    const response = await axios.post("https://cnvmp3.com/fetch.php", payload);
    const jsonData = response.data;
    const downloadUrl = jsonData.url;

    return downloadUrl;
  } catch (error) {
    console.error("Error in OutputUrl:", error);
    throw error;
  }
}

// Function to search for a YouTube video
async function searchYouTubeVideo(query) {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        key: API_KEY,
        type: "video",
        maxResults: 1,
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      const videoTitle = video.snippet.title;
      const videoId = video.id.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      return { title: videoTitle, url: videoUrl };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching data from YouTube API:", error);
    return null;
  }
}

// Define the /music endpoint
app.get("/music", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).send({ error: "Please specify a music name with the query parameter." });
  }

  try {
    // Search for the YouTube video based on the query
    const searchResult = await searchYouTubeVideo(query);
    if (!searchResult) {
      return res.status(404).send({ error: "No music found for the specified query." });
    }

    const musicUrl = searchResult.url;

    // Convert the YouTube video to MP3 using the external service
    let downloadUrl;
    try {
      downloadUrl = await OutputUrl(musicUrl);
    } catch (error) {
      console.error(`Error processing ${musicUrl}:`, error);
      return res.status(500).send({ error: "An error occurred while processing the request." });
    }

    if (!downloadUrl) {
      return res.status(500).send({ error: "No working music links found." });
    }

    // Send the download URL back to the client
    res.send({ title: searchResult.title, downloadUrl: downloadUrl });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).send({ error: "An error occurred while processing the request." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
