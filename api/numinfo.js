ajshadowsnsimport fetch from "node-fetch";

export default async function handler(req, res) {
  const { apikey, number } = req.query;

  // client api key check
  if (!apikey) {
    return res.status(400).json({
      status: false,
      message: "API key is required"
    });
  }

  const validKeys = process.env.CLIENT_NUM_API_KEYS
    ?.split(",")
    .map(k => k.trim());

  if (!validKeys || !validKeys.includes(apikey)) {
    return res.status(403).json({
      status: false,
      message: "Invalid API key"
    });
  }

  if (!number) {
    return res.status(400).json({
      status: false,
      message: "Number is required"
    });
  }

  try {
    // 🔐 internal DB api key from ENV
    const INTERNAL_KEY = process.env.NUMAPI_SECRET_KEY;

    const apiUrl =
      `https://api.paanel.shop/numapi.php?action=api&key=ajshadowsns&number=${encodeURIComponent(number)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return res.json({
      status: true,
      creator: "MR RABBIT",
      data: data
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
}
