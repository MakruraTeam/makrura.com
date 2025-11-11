// article.helper.js
import { pool } from '../../db.js';

/**
 * Fetch image by ID
 */
export async function getImageById(imageId, connection = pool) {
  if (!imageId) return null;
  const [rows] = await connection.query(`SELECT id, filename, content_type, createdAt FROM images WHERE id = ?`, [imageId]);
  return rows.length > 0 ? rows[0] : null;
}

export async function getArticleLinks(articleId, connection = pool) {
  const [rows] = await connection.query(
    `
    SELECT sp.name AS platform, asl.url, asl.text
    FROM article_social_links asl
    JOIN social_platforms sp ON sp.id = asl.platformId
    WHERE asl.articleId = ?;
    `,
    [articleId]
  );

  return rows.map((r) => ({
    link: r.url,
    platform: r.platform,
    description: r.text || null,
  }));
}

export async function getAllSocials(connection = pool) {
  const [rows] = await connection.query(`
    SELECT 
      asl.articleId, sp.name AS platform, asl.url, asl.text
    FROM article_social_links asl
    JOIN social_platforms sp ON sp.id = asl.platformId;
  `);
  return rows;
}

export function buildArticleCard(article, links = []) {
  return {
    id: article.id,
    image: article.imageId ? `/api/common/images/${article.imageId}` : null,
    title: article.title,
    slug: article.slug,
    shortDescription: article.shortDescription,
    content: article.content ?? undefined,
    typeId: article.typeId,
    links,
    createdAt: article.createdAt,
  };
}

export async function insertArticleLinks(articleId, links, connection) {
  if (!Array.isArray(links) || links.length === 0) return;
  const validLinks = links.filter((l) => l.id && l.url);
  if (validLinks.length === 0) return;
  const values = validLinks.map((l) => [articleId, l.id, l.url, l.text || null]);
  await connection.query(`INSERT INTO article_social_links (articleId, platformId, url, text) VALUES ?`, [values]);
}
