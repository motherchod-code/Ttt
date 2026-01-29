import fetch from "node-fetch";

export default async function handler(req, res) {
  const { apikey, url } = req.query;

  if (!apikey) {
    return res.status(400).json({
      status: false,
      message: "API key is required",
      creator: "MR RABBIT"
    });
  }

  const validKeys = process.env.CLIENT_API_KEYS.split(",").map(k => k.trim());
  if (!validKeys.includes(apikey)) {
    return res.status(403).json({
      status: false,
      message: "Invalid API key",
      creator: "MR RABBIT"
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      message: "xnxx URL is required",
      creator: "MR RABBIT"
    });
  }

  try {
    const ORIGINAL_API_KEY = "YOUR_DAVID_CYRIL_API_KEY";

    const apiUrl =
      `https://apis.davidcyril.name.ng/download/xnxx?url=${encodeURIComponent(url)}&apikey=`;

    const r = await fetch(apiUrl);
    const data = await r.json();

    // 🔥 ALWAYS override creator
    data.creator = "MR RABBIT";

    return res.json(data);

  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      creator: "MR RABBIT"
    });
  }
}
