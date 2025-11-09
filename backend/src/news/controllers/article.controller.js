import { pool } from '../../db.js';

export async function getArticleTypes(req, res) {
  try {
    const [rows] = await pool.query(`SELECT * FROM article_types`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching article types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createArticle(req, res) {
  const connection = await pool.getConnection();
  try {
    const { title, slug, shortDescription, content, imageId, typeId, links } = req.body;

    if (!title || !slug || !shortDescription || !content || !imageId || !typeId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await connection.beginTransaction();

    const [articleResult] = await connection.query(
      `
      INSERT INTO articles (title, slug, shortDescription, content, imageId, typeId)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [title, slug, shortDescription, content, imageId, typeId]
    );

    const articleId = articleResult.insertId;

    if (Array.isArray(links) && links.length > 0) {
      const validLinks = links.filter((l) => l.id && l.url);
      if (validLinks.length > 0) {
        const linkValues = validLinks.map((l) => [articleId, l.id, l.url, l.text || null]);
        await connection.query(`INSERT INTO article_social_links (articleId, platformId, url, text) VALUES ?`, [linkValues]);
      }
    }

    await connection.commit();

    const [imageRows] = await connection.query(`SELECT id, filename, content_type, createdAt FROM images WHERE id = ?`, [imageId]);

    const image = imageRows.length > 0 ? imageRows[0] : null;

    const [socialRows] = await connection.query(
      `
      SELECT sp.name AS platform, asl.url, asl.text
      FROM article_social_links asl
      JOIN social_platforms sp ON sp.id = asl.platformId
      WHERE asl.articleId = ?
      `,
      [articleId]
    );

    const formattedLinks = socialRows.map((row) => ({
      link: row.url,
      platform: row.platform,
      description: row.text || null,
    }));

    res.json({
      message: 'Article created successfully',
      article: {
        id: articleId,
        title,
        slug,
        shortDescription,
        content,
        image,
        typeId,
        links: formattedLinks,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}
