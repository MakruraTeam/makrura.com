import { pool } from '../../db.js';
import { comparePassword } from '../utils/hashPassword.js';
import jwt from 'jsonwebtoken';

export async function loginUser(req, res) {
  try {
    const { login, password } = req.body;

    const [rows] = await pool.query(
      `
      SELECT id, hashedPassword FROM tbl_users
      WHERE login = ? AND deletedAt IS NULL
    `,
      [login]
    );

    if (rows.length === 0) return res.status(400).json({ error: 'Invalid login' });

    const user = rows[0];
    const isValid = await comparePassword(password, user.hashedPassword);

    if (!isValid) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Logged in', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
