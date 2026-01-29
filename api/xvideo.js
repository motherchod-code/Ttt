import fetch from "node-fetch";

export default async function handler(req, res) {
  const { apikey, url } = req.query;

  // API key check
  if (!apikey) {
    return res.status(400).json({
      success: false,
      message: "API key is required"
    });
  }

  const validKeys = process.env.CLIENT_API_KEYS.split(",").map(k => k.trim());
  if (!validKeys.includes(apikey)) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key"
    });
  }

  // URL check
  if (!url) {
    return res.status(400).json({
      success: false,
      message: "Video URL is required"
    });
  }

  try {
    const ORIGINAL_API_KEY = "YOUR_DAVID_CYRIL_API_KEY";

    const apiUrl =
      `https://apis.davidcyril.name.ng/xvideo?url=${encodeURIComponent(url)}&apikey=`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // creator change only
    if (data.success) {
      data.creator = "MR R4BBIT";
    }

    return res.json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
