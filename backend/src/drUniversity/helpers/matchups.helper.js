import { pool } from '../../db.js';

export async function insertMatchupCells(tableId, cells, connection) {
  const createdCells = [];

  for (const cell of cells) {
    const { rowRaceId, colRaceId, links } = cell;

    const [cellResult] = await connection.query(
      `
      INSERT INTO matchup_cells (tableId, rowRaceId, colRaceId)
      VALUES (?, ?, ?)
      `,
      [tableId, rowRaceId, colRaceId]
    );

    const cellId = cellResult.insertId;

    if (Array.isArray(links) && links.length > 0) {
      await insertCellLinks(cellId, links, connection);
    }

    createdCells.push({ cellId, rowRaceId, colRaceId });
  }

  return createdCells;
}

export async function insertCellLinks(cellId, links, connection) {
  for (const link of links) {
    const { platformId, url, text } = link;
    await connection.query(
      `
      INSERT INTO matchup_cell_links (cellId, platformId, url, text)
      VALUES (?, ?, ?, ?)
      `,
      [cellId, platformId, url, text || null]
    );
  }
}

export async function getMatchupCells(tableId) {
  const [rows] = await pool.query(
    `
    SELECT 
      mc.id AS cellId,
      mc.rowRaceId,
      mc.colRaceId,
      rr.name AS rowRaceName,
      cr.name AS colRaceName,

      mcl.platformId,
      sp.name AS platform,
      mcl.url,
      mcl.text

    FROM matchup_cells mc

    JOIN wc3_races rr ON rr.id = mc.rowRaceId
    JOIN wc3_races cr ON cr.id = mc.colRaceId

    LEFT JOIN matchup_cell_links mcl ON mcl.cellId = mc.id
    LEFT JOIN social_platforms sp ON sp.id = mcl.platformId

    WHERE mc.tableId = ?

    ORDER BY mc.rowRaceId, mc.colRaceId;
    `,
    [tableId]
  );

  const cellsMap = new Map();

  for (const row of rows) {
    if (!cellsMap.has(row.cellId)) {
      cellsMap.set(row.cellId, {
        cellId: row.cellId,
        rowRaceId: row.rowRaceId,
        colRaceId: row.colRaceId,
        rowRaceName: row.rowRaceName,
        colRaceName: row.colRaceName,
        links: [],
      });
    }

    if (row.platformId) {
      cellsMap.get(row.cellId).links.push({
        platformId: row.platformId,
        platform: row.platform,
        url: row.url,
        text: row.text || null,
      });
    }
  }

  return Array.from(cellsMap.values());
}

export function groupCellsByRow(cells) {
  const rows = {};

  for (const cell of cells) {
    if (!rows[cell.rowRaceId]) {
      rows[cell.rowRaceId] = {
        rowRaceId: cell.rowRaceId,
        rowRaceName: cell.rowRaceName,
        cols: [],
      };
    }

    rows[cell.rowRaceId].cols.push({
      colRaceId: cell.colRaceId,
      colRaceName: cell.colRaceName,
      cellId: cell.cellId,
      links: cell.links,
    });
  }

  return Object.values(rows);
}
