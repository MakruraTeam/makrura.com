import { pool } from '../../db.js';
import { hashPassword } from '../utils/hashPassword.js';

export async function registerUser(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: 'You need to be logged in to register a new user' });
    }

    const { login, email, password, repeatPassword } = req.body;

    if (!login || !email || !password || !repeatPassword) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const [existingUsers] = await pool.query(`SELECT login, email FROM users WHERE login = ? OR email = ?`, [login, email]);

    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      if (user.login === login) {
        return res.status(400).json({ error: 'Login is already taken' });
      }
      if (user.email === email) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
    }

    const hashed = await hashPassword(password);

    await pool.query(
      `
      INSERT INTO users (login, email, hashedPassword)
      VALUES (?, ?, ?)
      `,
      [login, email, hashed]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
