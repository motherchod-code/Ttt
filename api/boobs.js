export default async function handler(req, res) {
  try {
    const { apikey } = req.query;

    // ❌ API key না দিলে
    if (!apikey) {
      return res.status(400).json({
        status: false,
        message: "API key is required!"
      });
    }

    // 🔐 valid keys (.env)
    const validKeys = process.env.CLIENT_API_KEYS
      ? process.env.CLIENT_API_KEYS.split(",").map(k => k.trim())
      : [];

    if (!validKeys.includes(apikey)) {
      return res.status(403).json({
        status: false,
        message: "Invalid API key!"
      });
    }

    // 🎯 Original Image API
    const baseUrl = "https://api.dorratz.com/nsfw/tetas";

    const url = new URL(baseUrl);

    // optional query forward
    for (const key in req.query) {
      if (key !== "apikey") {
        url.searchParams.append(key, req.query[key]);
      }
    }

    // 🔄 fetch image
    const response = await fetch(url.toString());

    if (!response.ok) {
      return res.status(500).send("Failed to fetch image");
    }

    // 🧠 raw binary
    const buffer = Buffer.from(await response.arrayBuffer());

    // 📦 content type
    const contentType = response.headers.get("content-type");

    // 🖼️ return image (Catbox style)
    res.writeHead(200, {
      "Content-Type": contentType || "image/jpeg",
      "Content-Length": buffer.length,
      "Cache-Control": "public, max-age=86400"
    });

    res.end(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Something went wrong!"
    });
  }
}
