import fetch from "node-fetch";

export default async function handler(req, res) {
try {
const { apikey, url } = req.query;

// API KEY CHECK
if (!apikey) {
  return res.status(400).json({
    status: false,
    creator: "MR RABBIT",
    message: "API key is required"
  });
}

const validKeys = (process.env.CLIENT_API_KEYS || "")
  .split(",")
  .map(v => v.trim())
  .filter(Boolean);

if (!validKeys.includes(apikey)) {
  return res.status(403).json({
    status: false,
    creator: "MR RABBIT",
    message: "Invalid API key"
  });
}

// URL CHECK
if (!url) {
  return res.status(400).json({
    status: false,
    creator: "MR RABBIT",
    message: "Instagram URL is required"
  });
}

// FETCH FROM ASWIN API
const api = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(url)}`;

const response = await fetch(api);
const data = await response.json();

// RESPONSE
return res.json({
  creator: "MR RABBIT",
  status: data.status || false,
  result: data.data || []
});

} catch (err) {
return res.status(500).json({
status: false,
creator: "MR RABBIT",
message: "Internal server error"
});
}
}
