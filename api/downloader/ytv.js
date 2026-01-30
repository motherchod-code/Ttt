import fetch from "node-fetch";

export default async function handler(req, res) {
  const { apikey, url } = req.query;

  // API key check
  if (!apikey) {
    return res.status(400).json({
      status: false,
      creator: "MR RABBIT",
      data: { message: "API key is required" }
    });
  }

  const validKeys = process.env.CLIENT_API_KEYS?.split(",").map(k => k.trim());
  if (!validKeys || !validKeys.includes(apikey)) {
    return res.status(403).json({
      status: false,
      creator: "MR RABBIT",
      data: { message: "Invalid API key" }
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: "MR RABBIT",
      data: { message: "YouTube URL is required" }
    });
  }

  try {
    const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/ytv?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Regardless of original status, creator always "MR RABBIT"
    return res.json({
      status: data.status,       // true or false from original API
      creator: "MR RABBIT",
      data: data.data || { message: "No data found" }
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      creator: "MR RABBIT",
      data: { message: "Internal server error" }
    });
  }
}
