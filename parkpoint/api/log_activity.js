module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const body = req.body;
    const row = {
      ts:         body.ts || new Date().toISOString(),
      user_name:  body.user?.name  || body.user_name  || null,
      user_email: body.user?.email || body.user_email || null,
      user_phone: body.user?.phone || body.user_phone || null,
      type:       body.type    || null,
      to_name:    body.to?.name  || body.to_name  || null,
      to_email:   body.to?.email || body.to_email || null,
      to_phone:   body.to?.phone || body.to_phone || null,
      subject:    body.subject || null,
      message:    body.message || null,
      status:     body.status  || null,
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/activity_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ ok: true });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
