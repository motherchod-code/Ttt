import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { apikey, url } = req.query;

    /* ===== API KEY CHECK ===== */

    if (!apikey) {
      return res.status(400).json({
        status: false,
        creator: "MR RABBIT",
        message: "API key is required"
      });
    }

    const validKeys = (process.env.CLIENT_API_KEYS || "")
      .split(",")
      .map(k => k.trim());

    if (!validKeys.includes(apikey)) {
      return res.status(403).json({
        status: false,
        creator: "MR RABBIT",
        message: "Invalid API key"
      });
    }

    /* ===== URL CHECK ===== */

    if (!url) {
      return res.status(400).json({
        status: false,
        creator: "MR RABBIT",
        message: "Facebook URL is required"
      });
    }

    /* ===== FETCH FACEBOOK VIDEO ===== */

    const apiUrl =
      `https://apis.davidcyril.name.ng/facebook?url=${encodeURIComponent(url)}&apikey=${apikey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    /* ===== FINAL RESPONSE ===== */

    return res.json({
      creator: "MR RABBIT", // ✅ Always fixed
      status: data.success || false,
      result: data.result || null
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      creator: "MR RABBIT",
      message: "Internal server error"
    });
  }
}
