import { pool } from '../../db.js';

export function buildGeoGuesserCard(row) {
  return {
    id: row.id,
    images: {
      small: `/api/common/images/${row.smallImageId}`,
      medium: `/api/common/images/${row.mediumImageId}`,
      large: `/api/common/images/${row.largeImageId}`,
    },
    createdAt: row.createdAt,
  };
}

export async function getGeoGuesserById(id, connection = pool) {
  const [rows] = await connection.query(
    `
    SELECT 
      id,
      mapId,
      smallImageId,
      mediumImageId,
      largeImageId,
      createdAt
    FROM geo_guesser
    WHERE id = ?
    `,
    [id]
  );

  return rows.length ? rows[0] : null;
}
