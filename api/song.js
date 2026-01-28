import fetch from "node-fetch";

export default async function handler(req, res) {
  const apikey = req.query.apikey;   // URL থেকে key
  const query = req.query.query;     // গান নাম

  if (!apikey) return res.status(400).json({ status: false, message: "API key is required!" });

  // .env থেকে valid keys check
  const validKeys = process.env.CLIENT_API_KEYS.split(",").map(k => k.trim());
  if (!validKeys.includes(apikey)) {
    return res.status(403).json({ status: false, message: "Invalid API key!" });
  }

  if (!query) return res.status(400).json({ status: false, message: "Song name is required!" });

  try {
    const ORIGINAL_API_KEY = "YOUR_ORIGINAL_API_KEY";  // David Cyril API Key
    const CREATOR_NAME = "MR RABBIT";                 // তোমার নাম

    const originalApiUrl = `https://apis.davidcyril.name.ng/song?query=${encodeURIComponent(query)}&apikey=`;
    const response = await fetch(originalApiUrl);
    const data = await response.json();

    if (data.status) data.creator = CREATOR_NAME;

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Something went wrong!" });
  }
}
