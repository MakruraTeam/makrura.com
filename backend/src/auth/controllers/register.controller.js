import { pool } from '../../db.js';
import { hashPassword } from '../utils/hashPassword.js';

export async function registerUser(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: 'Unauthorized — no creator user found' });
    }

    const { login, email, password } = req.body;
    const createdBy = req.user.id;

    if (!login || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const hashed = await hashPassword(password);

    await pool.query(
      `
      INSERT INTO tbl_users (login, email, hashedPassword, createdBy)
      VALUES (?, ?, ?, ?)
    `,
      [login, email, hashed, createdBy]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid input' });
  }
}
