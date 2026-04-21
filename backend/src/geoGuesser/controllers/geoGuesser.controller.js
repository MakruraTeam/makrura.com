import { pool } from '../../db.js';
import { buildGeoGuesserCard, getGeoGuesserById } from '../helpers/geoGuesser.helper.js';

export async function getAllGeoGuessers(req, res) {
  const [rows] = await pool.query(`SELECT id FROM geo_guesser ORDER BY id ASC`);
  res.json(rows.map((r) => r.id));
}

export async function getGeoGuesser(req, res) {
  const { id } = req.params;

  const row = await getGeoGuesserById(id);
  if (!row) {
    return res.status(404).json({ message: 'GeoGuesser not found' });
  }

  res.json(buildGeoGuesserCard(row));
}

export async function createGeoGuesser(req, res) {
  const { mapId, smallImageId, mediumImageId, largeImageId } = req.body;

  if (!mapId || !smallImageId || !mediumImageId || !largeImageId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const [result] = await pool.query(
    `
    INSERT INTO geo_guesser (mapId, smallImageId, mediumImageId, largeImageId)
    VALUES (?, ?, ?, ?)
    `,
    [mapId, smallImageId, mediumImageId, largeImageId]
  );

  const created = await getGeoGuesserById(result.insertId);
  res.status(201).json(buildGeoGuesserCard(created));
}

export async function updateGeoGuesser(req, res) {
  const { id } = req.params;
  const { mapId, smallImageId, mediumImageId, largeImageId } = req.body;

  if (!id) return res.status(400).json({ error: 'GeoGuesser ID is required' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `
      SELECT mapId, smallImageId, mediumImageId, largeImageId
      FROM geo_guesser
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'GeoGuesser not found' });
    }

    const existing = rows[0];

    const imagesToDelete = [];

    if (smallImageId && smallImageId !== existing.smallImageId) {
      imagesToDelete.push(existing.smallImageId);
    }

    if (mediumImageId && mediumImageId !== existing.mediumImageId) {
      imagesToDelete.push(existing.mediumImageId);
    }

    if (largeImageId && largeImageId !== existing.largeImageId) {
      imagesToDelete.push(existing.largeImageId);
    }

    await connection.query(
      `
      UPDATE geo_guesser
      SET
        mapId = COALESCE(?, mapId),
        smallImageId = COALESCE(?, smallImageId),
        mediumImageId = COALESCE(?, mediumImageId),
        largeImageId = COALESCE(?, largeImageId)
      WHERE id = ?
      `,
      [mapId, smallImageId, mediumImageId, largeImageId, id]
    );

    if (imagesToDelete.length) {
      await connection.query(`DELETE FROM images WHERE id IN (?)`, [imagesToDelete]);
    }

    await connection.commit();

    const updated = await getGeoGuesserById(id);
    res.json(buildGeoGuesserCard(updated));
  } catch (err) {
    await connection.rollback();
    console.error('Error updating GeoGuesser:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}

export async function deleteGeoGuesser(req, res) {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'GeoGuesser ID is required' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Fetch image IDs
    const [rows] = await connection.query(
      `
      SELECT smallImageId, mediumImageId, largeImageId
      FROM geo_guesser
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'GeoGuesser not found' });
    }

    const { smallImageId, mediumImageId, largeImageId } = rows[0];

    await connection.query(`DELETE FROM geo_guesser WHERE id = ?`, [id]);

    const imageIds = [smallImageId, mediumImageId, largeImageId].filter(Boolean);

    if (imageIds.length) {
      await connection.query(`DELETE FROM images WHERE id IN (?)`, [imageIds]);
    }

    await connection.commit();
    res.json({ message: 'GeoGuesser and related images deleted successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting GeoGuesser:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}

export async function guessGeoGuesser(req, res) {
  const { id } = req.params;
  const { mapId } = req.body;

  if (!mapId) {
    return res.status(400).json({ message: 'mapId is required' });
  }

  const row = await getGeoGuesserById(id);
  if (!row) {
    return res.status(404).json({ message: 'GeoGuesser not found' });
  }

  const correct = Number(mapId) === Number(row.mapId);

  res.json({
    correct,
  });
}

export async function getGeoGuesserAdmin(req, res) {
  const { id } = req.params;

  const row = await getGeoGuesserById(id);
  if (!row) {
    return res.status(404).json({ message: 'GeoGuesser not found' });
  }

  res.json({
    id: row.id,
    mapId: row.mapId,
    images: {
      small: `/api/common/images/${row.smallImageId}`,
      medium: `/api/common/images/${row.mediumImageId}`,
      large: `/api/common/images/${row.largeImageId}`,
    },
    createdAt: row.createdAt,
  });
}
