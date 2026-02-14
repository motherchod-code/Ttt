import fetch from "node-fetch";

export default async function handler(req, res) {

  const { apikey, user } = req.query;

  if (!apikey) {
    return res.status(400).json({ status: false, message: "API key required" });
  }

  const validKeys = process.env.CLIENT_TELEGRAM_KEYS
    ? process.env.CLIENT_TELEGRAM_KEYS.split(",").map(k => k.trim())
    : [];

  if (!validKeys.includes(apikey)) {
    return res.status(403).json({ status: false, message: "Invalid API key" });
  }

  if (!user) {
    return res.status(400).json({ status: false, message: "User ID required" });
  }

  try {
    const response = await fetch(
      `https://api.b77bf911.workers.dev/telegram?user=${user}`
    );

    const externalData = await response.json();

    // Remove unwanted fields
    delete externalData.source;
    delete externalData.input;
    delete externalData.timestamp;

    // Extract only main data
    const cleanData = externalData?.data?.data || {};

    return res.status(200).json({
      status: true,
      creator: "MR RABBIT",
      apikey,
      data: cleanData
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error"
    });
  }
}
