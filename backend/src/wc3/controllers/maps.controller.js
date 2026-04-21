import { pool } from '../../db.js';

export async function getWc3Maps(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id, name
      FROM wc3_maps
      ORDER BY name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Warcraft 3 maps:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
