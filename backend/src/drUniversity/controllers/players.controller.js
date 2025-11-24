import { pool } from '../../db.js';
import { buildPlayerRaceMap, buildPlayerSocialMap, buildPlayerCard } from '../helpers/players.helper.js';

export async function getAllPlayers(req, res) {
  try {
    const [players] = await pool.query(`
      SELECT id, name, mmr, country
      FROM dru_players
      ORDER BY createdAt ASC;
    `);

    const [races] = await pool.query(`
      SELECT pr.playerId, r.name
      FROM dru_players_wc3_races pr
      JOIN wc3_races r ON r.id = pr.raceId;
    `);

    const [socials] = await pool.query(`
      SELECT psl.playerId, sp.name AS platform, psl.url
      FROM dru_players_social_links psl
      JOIN social_platforms sp ON sp.id = psl.platformId;
    `);

    const result = players.map((p) => {
      const raceMap = buildPlayerRaceMap(races.filter((r) => r.playerId === p.id));

      const socialList = buildPlayerSocialMap(socials.filter((s) => s.playerId === p.id));

      return buildPlayerCard(p, raceMap, socialList);
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getPlayerById(req, res) {
  const { id } = req.params;

  try {
    const [playerRows] = await pool.query(
      `
      SELECT id, name, mmr, country
      FROM dru_players
      WHERE id = ?;
    `,
      [id]
    );

    if (playerRows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerRows[0];

    const [raceRows] = await pool.query(
      `
      SELECT r.name
      FROM dru_players_wc3_races pr
      JOIN wc3_races r ON r.id = pr.raceId
      WHERE pr.playerId = ?;
    `,
      [id]
    );

    const [socialRows] = await pool.query(
      `
      SELECT sp.name AS platform, psl.url
      FROM dru_players_social_links psl
      JOIN social_platforms sp ON sp.id = psl.platformId
      WHERE psl.playerId = ?;
    `,
      [id]
    );

    const raceMap = buildPlayerRaceMap(raceRows);
    const socials = buildPlayerSocialMap(socialRows);

    res.json(buildPlayerCard(player, raceMap, socials));
  } catch (err) {
    console.error('Error fetching player by ID:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function createPlayer(req, res) {
  const connection = await pool.getConnection();
  try {
    const { name, mmr, country, races, socialLinks } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing required fields: name' });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      `
      INSERT INTO dru_players (name, mmr, country)
      VALUES (?, ?, ?)
    `,
      [name, mmr || null, country || null]
    );

    const playerId = result.insertId;

    if (Array.isArray(races) && races.length > 0) {
      const raceValues = races.map((raceId) => [playerId, raceId]);
      await connection.query(
        `
        INSERT INTO dru_players_wc3_races (playerId, raceId)
        VALUES ?
      `,
        [raceValues]
      );
    }

    if (Array.isArray(socialLinks) && socialLinks.length > 0) {
      const validLinks = socialLinks.filter((s) => s.id && s.link);
      if (validLinks.length > 0) {
        const socialValues = validLinks.map((s) => [playerId, s.id, s.link]);
        await connection.query(
          `
          INSERT INTO dru_players_social_links (playerId, platformId, url)
          VALUES ?
        `,
          [socialValues]
        );
      }
    }

    await connection.commit();

    res.json({ message: 'Player created successfully', id: playerId });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating player:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}

export async function deletePlayer(req, res) {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Player ID required' });

  try {
    await pool.query(`DELETE FROM dru_players WHERE id = ?`, [id]);
    res.json({ message: 'Player deleted' });
  } catch (err) {
    console.error('Error deleting player:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function patchPlayerById(req, res) {
  const { id } = req.params;
  const { name, mmr, country, races, socialLinks } = req.body;

  if (!id) return res.status(400).json({ error: 'Player ID required' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE dru_players
      SET 
        name = COALESCE(?, name),
        mmr = COALESCE(?, mmr),
        country = COALESCE(?, country)
      WHERE id = ?;
    `,
      [name, mmr, country, id]
    );

    if (Array.isArray(races)) {
      await connection.query(`DELETE FROM dru_players_wc3_races WHERE playerId = ?`, [id]);

      if (races.length > 0) {
        const raceValues = races.map((raceId) => [id, raceId]);
        await connection.query(
          `
          INSERT INTO dru_players_wc3_races (playerId, raceId)
          VALUES ?
        `,
          [raceValues]
        );
      }
    }

    if (Array.isArray(socialLinks)) {
      await connection.query(`DELETE FROM dru_players_social_links WHERE playerId = ?`, [id]);

      const validLinks = socialLinks.filter((s) => s.id && s.link);
      if (validLinks.length > 0) {
        const socialValues = validLinks.map((s) => [id, s.id, s.link]);
        await connection.query(
          `
          INSERT INTO dru_players_social_links (playerId, platformId, url)
          VALUES ?
        `,
          [socialValues]
        );
      }
    }

    await connection.commit();

    res.json({ message: 'Player updated' });
  } catch (err) {
    await connection.rollback();
    console.error('Error updating player:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}
