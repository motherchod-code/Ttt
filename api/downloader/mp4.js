import fetch from "node-fetch";

export default async function handler(req, res) {
  const { apikey, url } = req.query;

  if (!apikey) {
    return res.status(400).json({ status: false, message: "API key is required" });
  }

  const keys = process.env.CLIENT_API_KEYS.split(",").map(k => k.trim());
  if (!keys.includes(apikey)) {
    return res.status(403).json({ status: false, message: "Invalid API key" });
  }

  if (!url) {
    return res.status(400).json({ status: false, message: "YouTube URL is required" });
  }

  try {
    const ORIGINAL_API_KEY = "YOUR_DAVID_CYRIL_KEY";

    const apiUrl =
      `https://apis.davidcyril.name.ng/youtube/mp4?url=${encodeURIComponent(url)}&apikey=`;

    const r = await fetch(apiUrl);
    const data = await r.json();

    // 🔥 FULL PROTECTION
    if (data.creator) delete data.creator;
    data.creator = "MR RABBIT";

    res.json(data);
  } catch {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}
