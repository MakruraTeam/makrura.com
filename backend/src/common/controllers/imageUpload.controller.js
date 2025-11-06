import sharp from 'sharp';
import { pool } from '../../db.js';

export async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const { originalname, mimetype, buffer } = req.file;

    const optimizedBuffer = await sharp(buffer).resize(800).webp({ quality: 85 }).toBuffer();

    const [result] = await pool.query(`INSERT INTO images (filename, content_type, data) VALUES (?, ?, ?)`, [
      originalname,
      'image/webp',
      optimizedBuffer,
    ]);

    res.json({
      message: 'Image uploaded successfully',
      imageId: result.insertId,
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getImage(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM images WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Image not found' });

    const image = rows[0];
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Content-Type', image.content_type);
    res.send(image.data);
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
