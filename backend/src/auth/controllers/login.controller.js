import { pool } from '../../db.js';
import { comparePassword } from '../utils/hashPassword.js';
import jwt from 'jsonwebtoken';

export async function loginUser(req, res) {
  try {
    const { login, password } = req.body;

    const [rows] = await pool.query(
      `
      SELECT id, login, hashedPassword FROM users
      WHERE login = ? 
      AND blocked IS FALSE
      `,
      [login]
    );

    if (rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const isValid = await comparePassword(password, user.hashedPassword);

    if (!isValid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET);

    res.json({ message: 'Logged in', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
