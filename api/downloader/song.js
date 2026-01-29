import fetch from "node-fetch";

export default async function handler(req, res) {
  const { apikey, search } = req.query;

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

  // Search URL check
  if (!search) {
    return res.status(400).json({
      status: false,
      message: "Search URL is required"
    });
  }

  try {
    const url =
      `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(search)}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.json({
      status: data.status,
      creator: "MR RABBIT",
      data: data.data
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
}
