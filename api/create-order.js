function isValidOrder(body) {
  if (!body || typeof body !== "object") return false;
  const { customer, items, total } = body;
  if (!customer || !items || !Array.isArray(items) || items.length === 0) return false;
  if (typeof total !== "number") return false;
  const required = ["fullName","phone","address1","city","state","pincode","country"];
  return required.every(k => (customer[k] || "").toString().trim().length > 0);
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"Method Not Allowed" });

  try {
    const body = req.body;
    if (!isValidOrder(body)) return res.status(400).json({ ok:false, error:"Invalid order payload" });

    const orderId = "ORD-" + Date.now();  // simple id for now
    // TODO (later): save to DB or send email here

    return res.status(201).json({ ok:true, orderId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
