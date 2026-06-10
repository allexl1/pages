const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.vesta_POSTGRES_URL,   // ← changed from DATABASE_URL
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passport_id, phone } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE passport_id = $1 AND phone = $2',
      [passport_id, phone]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
