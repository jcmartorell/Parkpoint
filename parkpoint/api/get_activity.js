module.exports = async function handler(req, res) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(200).json({ configured: false, rows: [] });
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/activity_log?order=ts.desc&limit=500`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(200).json({ configured: true, rows: [], error: errText });
    }

    const rows = await response.json();
    return res.status(200).json({ configured: true, rows });
  } catch(e) {
    return res.status(200).json({ configured: true, rows: [], error: e.message });
  }
};
