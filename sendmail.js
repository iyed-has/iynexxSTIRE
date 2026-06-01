export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const EMAILJS_SERVICE  = process.env.EMAILJS_SERVICE;
  const EMAILJS_TEMPLATE = process.env.EMAILJS_TEMPLATE;
  const EMAILJS_KEY      = process.env.EMAILJS_KEY;
  const OWNER_EMAIL      = process.env.OWNER_EMAIL;

  if (!EMAILJS_SERVICE || !EMAILJS_TEMPLATE || !EMAILJS_KEY) {
    return res.status(500).json({ error: 'EmailJS config missing' });
  }

  try {
    const body = req.body || {};
    const data = { ...body, owner_email: OWNER_EMAIL };

    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:      EMAILJS_SERVICE,
        template_id:     EMAILJS_TEMPLATE,
        user_id:         EMAILJS_KEY,
        template_params: data
      })
    });

    const txt = await r.text();
    if (r.ok) return res.status(200).json({ ok: true });
    return res.status(500).json({ error: txt });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
