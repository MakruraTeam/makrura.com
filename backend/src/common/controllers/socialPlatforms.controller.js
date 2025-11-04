import { pool } from '../../db.js';

export async function getSocialPlatform(req, res) {
  try {
    const [rows] = await pool.query(`SELECT * FROM social_platforms`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching social platforms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
