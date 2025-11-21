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

export async function getClassicRaces(req, res) {
  try {
    const [rows] = await pool.query(`SELECT * FROM wc3_races WHERE name IN ('Human', 'Orc', 'Undead', 'Night Elf')`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching classic Warcraft 3 races:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
