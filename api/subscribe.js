export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const { email } = req.body || {};
  if (!email || !email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ error: "Adresse email invalide" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("BREVO_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "Configuration serveur incomplète" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), listIds: [3], updateEnabled: true }),
    });

    if (response.ok) return res.status(200).json({ success: true });

    const data = await response.json().catch(() => ({}));
    if (data.code === "duplicate_parameter") return res.status(200).json({ success: true, already: true });

    console.error("Brevo API error:", response.status, JSON.stringify(data));
    return res.status(400).json({ error: data.message || "Erreur lors de l'inscription" });
  } catch (err) {
    console.error("Subscribe error:", err.message);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
