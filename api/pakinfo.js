import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  const { apikey, phone } = req.query;

  if (!apikey) {
    return res.status(400).json({
      success: false,
      message: "API key is required"
    });
  }

  const validKeys = process.env.PAK_LOOKUP_KEYS
    ? process.env.PAK_LOOKUP_KEYS.split(",").map(k => k.trim())
    : [];

  if (!validKeys.includes(apikey)) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key"
    });
  }

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required"
    });
  }

  try {
    const apiUrl = `https://howler-database-api.vercel.app/api/lookup?phone=${encodeURIComponent(phone)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch data"
      });
    }

    const data = await response.json();

    // Remove unwanted field
    delete data.Developer;

    return res.status(200).json({
      success: true,
      creator: "MR RABBIT",
      api_key_used: apikey,
      timestamp: new Date().toISOString(),
      query: phone,
      total_records: data.count || 0,
      results: data.result || []
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
