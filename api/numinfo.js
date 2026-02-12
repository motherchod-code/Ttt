import fetch from "node-fetch";

export default async function handler(req, res) {
  const { apikey, number } = req.query;

  // 🔑 API key check
  if (!apikey) {
    return res.status(400).json({
      status: false,
      creator: "MR RABBIT",
      message: "API key is required"
    });
  }

  const validKeys = process.env.CLIENT_NUM_API_KEYS
    ?.split(",")
    .map(k => k.trim());

  if (!validKeys || !validKeys.includes(apikey)) {
    return res.status(403).json({
      status: false,
      creator: "MR RABBIT",
      message: "Invalid API key"
    });
  }

  // 📞 Number check
  if (!number) {
    return res.status(400).json({
      status: false,
      creator: "MR RABBIT",
      message: "Number is required"
    });
  }

  try {
    const INTERNAL_KEY = process.env.NUMAPI_SECRET_KEY;

    const apiUrl =
      `https://api.paanel.shop/numapi.php?action=api&key=${INTERNAL_KEY}&number=${encodeURIComponent(number)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(500).json({
        status: false,
        creator: "MR RABBIT",
        message: "Failed to fetch number info"
      });
    }

    const data = await response.json();

    return res.json({
      status: true,
      creator: "MR RABBIT",
      data: data
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      creator: "MR RABBIT",
      message: "Internal server error"
    });
  }
}
