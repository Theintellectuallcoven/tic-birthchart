export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const apiKey = process.env.FREE_ASTRO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing FREE_ASTRO_API_KEY. Add it in Vercel > Settings > Environment Variables." });
  }

  try {
    const upstream = await fetch("https://api.freeastroapi.com/api/v1/synastry/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Could not reach FreeAstroAPI", detail: String(err) });
  }
}
