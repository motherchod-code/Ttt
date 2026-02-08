import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { apikey, song } = req.query;

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
        apikey,
        message: "Invalid API key"
      });
    }

    /* ===== SONG CHECK ===== */

    if (!song) {
      return res.status(400).json({
        status: false,
        creator: "MR RABBIT",
        apikey,
        message: "Song name is required"
      });
    }

    /* ===== FETCH ORIGINAL LYRICS API ===== */

    const apiUrl =
      `https://apis.davidcyril.name.ng/lyrics3?song=${encodeURIComponent(song)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    /* ===== FINAL RESPONSE ===== */

    return res.status(200).json({
      creator: "MR RABBIT",
      apikey, // 🔥 User যে key ব্যবহার করবে সেটাই show করবে
      status: data.success || false,
      result: data.result || null
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      creator: "MR RABBIT",
      message: "Internal server error"
    });
  }
}
