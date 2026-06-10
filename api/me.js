const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.vesta_POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const result = await pool.query(
      `SELECT u.passport_id FROM users u
       JOIN sessions s ON u.id = s.user_id
       WHERE s.token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.status(200).json({
      user: { passport_id: result.rows[0].passport_id }
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
