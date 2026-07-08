export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const query = req.query.query || "";
  if (!query || query.length < 2) {
    return res.status(200).json({ results: [] });
  }

  const apiKey = process.env.FREE_ASTRO_API_KEY;

  try {
    const upstream = await fetch(
      `https://api.freeastroapi.com/api/v2/geo/search?query=${encodeURIComponent(query)}`,
      { headers: apiKey ? { "x-api-key": apiKey } : {} }
    );
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(200).json({ results: [] });
  }
}
