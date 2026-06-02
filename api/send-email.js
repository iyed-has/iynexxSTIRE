export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, phone, wilaya, address, product, qty, notes, ref, time } = req.body;

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id:  process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id:     process.env.EMAILJS_PUBLIC_KEY,
      template_params: { name, phone, wilaya, address, product, qty, notes, ref, time,
                         owner_email: 'hasnaouiiyed326@gmail.com' }
    })
  });

  if (response.ok) { res.status(200).json({ ok: true }); }
  else { res.status(500).json({ ok: false }); }
}