import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool;

export async function connectToDatabase() {
  if (pool) return pool;

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();

    return pool;
  } catch (err) {
    console.error('Failed to connect to MySQL:', err.message);
    process.exit(1);
  }
}

export { pool };
