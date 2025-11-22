import { pool } from '../../db.js';
import { insertMatchupCells, getMatchupCells, groupCellsByRow } from '../helpers/matchups.helper.js';

export async function createMatchupTable(req, res) {
  const connection = await pool.getConnection();
  try {
    const { name, cells } = req.body;

    if (!name || !Array.isArray(cells)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await connection.beginTransaction();

    const [tableResult] = await connection.query(
      `
      INSERT INTO matchup_tables (name)
      VALUES (?)
      `,
      [name]
    );

    const tableId = tableResult.insertId;

    const cellIds = await insertMatchupCells(tableId, cells, connection);

    await connection.commit();

    res.json({
      message: 'Matchup table created successfully',
      matchupTable: {
        id: tableId,
        name,
        cells: cellIds,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating matchup table:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}

export async function getMatchupTableById(req, res) {
  const { id } = req.params;

  try {
    const [tables] = await pool.query(
      `
      SELECT id, name, createdAt
      FROM matchup_tables
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (tables.length === 0) {
      return res.status(404).json({ error: 'Matchup table not found' });
    }

    const table = tables[0];

    const cells = await getMatchupCells(table.id);
    const grouped = groupCellsByRow(cells);

    res.json({
      ...table,
      cells: grouped,
    });
  } catch (err) {
    console.error('Error fetching matchup table:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getAllMatchupTables(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT id, name, createdAt
      FROM matchup_tables
      ORDER BY createdAt ASC;
      `
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function deleteMatchupTable(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Matchup table ID is required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(`SELECT id FROM matchup_tables WHERE id = ?`, [id]);

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Matchup table not found' });
    }

    await connection.query(`DELETE FROM matchup_tables WHERE id = ?`, [id]);

    await connection.commit();

    res.json({ message: 'Matchup table and related data deleted permanently' });
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting matchup table:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}

export async function patchMatchupTableById(req, res) {
  const { id } = req.params;
  const { name, cells } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Matchup table ID is required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(`SELECT * FROM matchup_tables WHERE id = ?`, [id]);

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Matchup table not found' });
    }

    await connection.query(
      `
      UPDATE matchup_tables
      SET name = COALESCE(?, name)
      WHERE id = ?
      `,
      [name, id]
    );

    if (Array.isArray(cells)) {
      await connection.query(`DELETE FROM matchup_cells WHERE tableId = ?`, [id]);

      if (cells.length > 0) {
        await insertMatchupCells(id, cells, connection);
      }
    }

    await connection.commit();

    const updatedCells = await getMatchupCells(id);
    const grouped = groupCellsByRow(updatedCells);

    res.json({
      message: 'Matchup table updated successfully',
      table: {
        id: Number(id),
        name: name || rows[0].name,
        cells: grouped,
      },
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}
