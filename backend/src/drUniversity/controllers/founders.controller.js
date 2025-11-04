import { pool } from '../../db.js';

export async function createFounder(req, res) {
  const connection = await pool.getConnection();
  try {
    const { name, role, contribution, imageId, races, socialLinks } = req.body;

    if (!name || !role || !contribution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await connection.beginTransaction();

    const [founderResult] = await connection.query(
      `
      INSERT INTO founders (name, role, contribution, imageId)
      VALUES (?, ?, ?, ?)
      `,
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
      `
      SELECT r.name
      FROM founder_wc3_races fr
      JOIN wc3_races r ON r.id = fr.raceId
      WHERE fr.founderId = ?
      `,
      [founderId]
    );

    const [socialRows] = await connection.query(
      `
      SELECT sp.name, fsl.url
      FROM founder_social_links fsl
      JOIN social_platforms sp ON sp.id = fsl.platformId
      WHERE fsl.founderId = ?
      `,
      [founderId]
    );

    const raceMap = {
      nightelf: false,
      orc: false,
      human: false,
      undead: false,
    };

    raceRows.forEach(({ name }) => {
      const lower = name.toLowerCase();
      if (lower.includes('night')) raceMap.nightelf = true;
      else if (lower.includes('orc')) raceMap.orc = true;
      else if (lower.includes('human')) raceMap.human = true;
      else if (lower.includes('undead')) raceMap.undead = true;
    });

    const socials = {};
    socialRows.forEach(({ name, url }) => {
      socials[name.toLowerCase()] = url;
    });

    const founderCard = {
      imageId: imageId || null,
      imageUrl: imageId ? `/api/images/${imageId}` : null,
      name,
      role,
      race: raceMap,
      contribution,
      ...socials,
    };

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
