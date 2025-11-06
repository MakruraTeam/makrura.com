import { pool } from '../../db.js';
import { buildRaceMap, buildSocialMap, buildFounderCard } from '../helpers/founders.helper.js';

export async function getAllFounders(req, res) {
  try {
    const [founders] = await pool.query(`
      SELECT 
        f.id,
        f.name,
        f.role,
        f.contribution,
        f.imageId,
        i.filename AS image_filename
      FROM founders f
      LEFT JOIN images i ON f.imageId = i.id
      WHERE f.deletedAt IS NULL
      ORDER BY f.createdAt DESC;
    `);

    const [races] = await pool.query(`
      SELECT fr.founderId, r.name
      FROM founder_wc3_races fr
      JOIN wc3_races r ON r.id = fr.raceId;
    `);

    const [socials] = await pool.query(`
      SELECT fsl.founderId, sp.name AS platform, fsl.url
      FROM founder_social_links fsl
      JOIN social_platforms sp ON sp.id = fsl.platformId;
    `);

    const founderCards = founders.map((f) => {
      const raceMap = buildRaceMap(races.filter((r) => r.founderId === f.id));
      const socialObj = buildSocialMap(socials.filter((s) => s.founderId === f.id));
      return buildFounderCard(f, raceMap, socialObj);
    });

    res.json(founderCards);
  } catch (err) {
    console.error('Error fetching founders:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function createFounder(req, res) {
  const connection = await pool.getConnection();
  try {
    const { name, role, contribution, imageId, races, socialLinks } = req.body;
    if (!name || !role || !contribution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await connection.beginTransaction();

    const [founderResult] = await connection.query(
      `INSERT INTO founders (name, role, contribution, imageId)
       VALUES (?, ?, ?, ?)`,
      [name, role, contribution, imageId || null]
    );

    const founderId = founderResult.insertId;

    if (Array.isArray(races) && races.length > 0) {
      const raceValues = races.map((raceId) => [founderId, raceId]);
      await connection.query(`INSERT INTO founder_wc3_races (founderId, raceId) VALUES ?`, [raceValues]);
    }

    if (Array.isArray(socialLinks) && socialLinks.length > 0) {
      const validLinks = socialLinks.filter((s) => s.id && s.link);
      if (validLinks.length > 0) {
        const socialValues = validLinks.map((s) => [founderId, s.id, s.link]);
        await connection.query(`INSERT INTO founder_social_links (founderId, platformId, url) VALUES ?`, [socialValues]);
      }
    }

    await connection.commit();

    const [raceRows] = await connection.query(
      `SELECT r.name
       FROM founder_wc3_races fr
       JOIN wc3_races r ON r.id = fr.raceId
       WHERE fr.founderId = ?`,
      [founderId]
    );

    const [socialRows] = await connection.query(
      `SELECT sp.name, fsl.url
       FROM founder_social_links fsl
       JOIN social_platforms sp ON sp.id = fsl.platformId
       WHERE fsl.founderId = ?`,
      [founderId]
    );

    const raceMap = buildRaceMap(raceRows);
    const socials = buildSocialMap(socialRows);

    const founderCard = buildFounderCard({ name, role, contribution, imageId }, raceMap, socials);

    res.json({
      message: 'Founder created successfully',
      founder: founderCard,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating founder:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}
