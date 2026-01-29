import fetch from "node-fetch";

export default async function handler(req, res) {
  const { apikey, url } = req.query;

  // API key check
  if (!apikey) {
    return res.status(400).json({
      status: false,
      message: "API key is required"
    });
  }

  const validKeys = process.env.CLIENT_API_KEYS.split(",").map(k => k.trim());
  if (!validKeys.includes(apikey)) {
    return res.status(403).json({
      status: false,
      message: "Invalid API key"
    });
  }

  // Instagram URL check
  if (!url) {
    return res.status(400).json({
      status: false,
      message: "xnxx URL is required"
    });
  }

  try {
    const ORIGINAL_API_KEY = "YOUR_DAVID_CYRIL_API_KEY";

    const apiUrl =
      `https://apis.davidcyril.name.ng/download/xnxx?url=${encodeURIComponent(url)}&apikey=`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Only change creator name
    if (data.status) data.creator = "MR RABBIT";

    return res.json(data);

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
}
