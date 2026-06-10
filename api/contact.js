const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { surname, name, email, phone, topic, message } = req.body;

  try {
    await pool.query(
      'INSERT INTO contacts (surname, name, email, phone, topic, message) VALUES ($1, $2, $3, $4, $5, $6)',
      [surname, name, email, phone, topic, message]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
