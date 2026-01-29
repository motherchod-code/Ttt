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

  const validKeys = process.env.CLIENT_API_KEYS
    ?.split(",")
    .map(k => k.trim());

  if (!validKeys || !validKeys.includes(apikey)) {
    return res.status(403).json({
      status: false,
      message: "Invalid API key"
    });
  }

  // Image URL check
  if (!url) {
    return res.status(400).json({
      status: false,
      message: "Image url is required"
    });
  }

  try {
    const apiUrl =
      `https://apis.davidcyril.name.ng/removebg?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        status: false,
        message: "Failed to fetch image"
      });
    }

    const buffer = await response.arrayBuffer();

    // image response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
}
