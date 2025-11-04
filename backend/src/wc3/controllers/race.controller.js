import { pool } from '../../db.js';

export async function getWc3Races(req, res) {
  try {
    const [rows] = await pool.query(`SELECT * FROM wc3_races`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Warcraft 3 races:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
