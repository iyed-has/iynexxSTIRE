export default async function handler(req, res) {
  // السماح فقط بـ POST
  if (req.method !== 'POST') return res.status(405).end();

  const { action, key, value } = req.body;

  // التحقق من وجود المفاتيح في البيئة
  const REDIS_URL   = process.env.REDIS_URL;
  const REDIS_TOKEN = process.env.REDIS_TOKEN;

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ error: 'Redis config missing' });
  }

  try {
    if (action === 'get') {
      const r = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
      });
      const d = await r.json();
      const result = d.result ? JSON.parse(d.result) : null;
      return res.status(200).json({ result });

    } else if (action === 'set') {
      await fetch(`${REDIS_URL}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSON.stringify(value))
      });
      return res.status(200).json({ result: 'ok' });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
