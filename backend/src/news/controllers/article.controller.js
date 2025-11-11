import { pool } from '../../db.js';
import { getImageById, getArticleLinks, getAllSocials, buildArticleCard, insertArticleLinks } from '../helpers/article.helper.js';

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

    await insertArticleLinks(articleId, links, connection);
    await connection.commit();

    const image = await getImageById(imageId, connection);
    const formattedLinks = await getArticleLinks(articleId, connection);

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
    console.error('Error creating article:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}

export async function getAllArticles(req, res) {
  try {
    const [articles] = await pool.query(`
      SELECT id, title, slug, shortDescription, imageId, typeId, createdAt
      FROM articles
      ORDER BY createdAt DESC;
    `);

    const socials = await getAllSocials(pool);

    const formatted = articles.map((a) => {
      const links = socials
        .filter((s) => s.articleId === a.id)
        .map((s) => ({
          link: s.url,
          platform: s.platform,
          description: s.text || null,
        }));
      return buildArticleCard(a, links);
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getArticlesByType(req, res) {
  try {
    const { name } = req.params;

    const [typeRows] = await pool.query(`SELECT id FROM article_types WHERE name = ?`, [name]);
    if (typeRows.length === 0) {
      return res.status(404).json({ error: 'Article type not found' });
    }

    const typeId = typeRows[0].id;

    const [articles] = await pool.query(
      `
      SELECT id, title, slug, shortDescription, imageId, typeId, createdAt
      FROM articles
      WHERE typeId = ?
      ORDER BY createdAt DESC;
      `,
      [typeId]
    );

    const socials = await getAllSocials(pool);

    const formatted = articles.map((a) => {
      const links = socials
        .filter((s) => s.articleId === a.id)
        .map((s) => ({
          link: s.url,
          platform: s.platform,
          description: s.text || null,
        }));
      return buildArticleCard(a, links);
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching articles by type:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getArticleById(req, res) {
  try {
    const { id } = req.params;

    const [articles] = await pool.query(
      `
      SELECT 
        a.id, 
        a.title, 
        a.slug, 
        a.shortDescription, 
        a.content, 
        a.imageId, 
        a.typeId, 
        a.createdAt,
        i.filename AS image_filename
      FROM articles a
      LEFT JOIN images i ON a.imageId = i.id
      WHERE a.id = ?;
      `,
      [id]
    );

    if (articles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = articles[0];

    const [socialRows] = await pool.query(
      `
      SELECT sp.id AS platformId, sp.name AS platform, asl.url, asl.text
      FROM article_social_links asl
      JOIN social_platforms sp ON sp.id = asl.platformId
      WHERE asl.articleId = ?;
      `,
      [id]
    );

    const links = socialRows.map((r) => ({
      id: r.platformId,
      url: r.url,
      text: r.text || '',
    }));

    const image = article.imageId ? `/api/common/images/${article.imageId}` : null;

    res.json({
      id: article.id,
      title: article.title,
      slug: article.slug,
      shortDescription: article.shortDescription,
      content: article.content,
      imageId: article.imageId,
      image,
      typeId: article.typeId,
      links,
      createdAt: article.createdAt,
    });
  } catch (err) {
    console.error('Error fetching article by ID:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getArticleBySlug(req, res) {
  try {
    const { slug } = req.params;

    const [articles] = await pool.query(
      `
      SELECT id, title, slug, shortDescription, content, imageId, typeId, createdAt
      FROM articles
      WHERE slug = ?;
    `,
      [slug]
    );

    if (articles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = articles[0];
    const formattedLinks = await getArticleLinks(article.id, pool);
    const formattedArticle = buildArticleCard(article, formattedLinks);

    res.json(formattedArticle);
  } catch (err) {
    console.error('Error fetching article by slug:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function deleteArticle(req, res) {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Article ID is required' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [articles] = await connection.query(`SELECT imageId FROM articles WHERE id = ?`, [id]);
    if (articles.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Article not found' });
    }

    const imageId = articles[0].imageId;

    await connection.query(`DELETE FROM articles WHERE id = ?`, [id]);
    if (imageId) await connection.query(`DELETE FROM images WHERE id = ?`, [imageId]);

    await connection.commit();
    res.json({ message: 'Article and related data deleted successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting article:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}

export async function updateArticle(req, res) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { title, slug, shortDescription, content, imageId, typeId, links } = req.body;

    if (!id) return res.status(400).json({ error: 'Article ID is required' });
    if (!title || !slug || !shortDescription || !content || !imageId || !typeId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await connection.beginTransaction();

    const [articles] = await connection.query(`SELECT imageId FROM articles WHERE id = ?`, [id]);
    if (articles.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Article not found' });
    }

    const oldImageId = articles[0].imageId;

    await connection.query(
      `
      UPDATE articles
      SET title = ?, slug = ?, shortDescription = ?, content = ?, imageId = ?, typeId = ?
      WHERE id = ?
      `,
      [title, slug, shortDescription, content, imageId, typeId, id]
    );

    await connection.query(`DELETE FROM article_social_links WHERE articleId = ?`, [id]);

    if (Array.isArray(links) && links.length > 0) {
      const validLinks = links.filter((l) => l.id && l.url);
      if (validLinks.length > 0) {
        const values = validLinks.map((l) => [id, l.id, l.url, l.text || null]);
        await connection.query(`INSERT INTO article_social_links (articleId, platformId, url, text) VALUES ?`, [values]);
      }
    }

    await connection.commit();

    if (oldImageId && oldImageId !== imageId) {
      await pool.query(`DELETE FROM images WHERE id = ?`, [oldImageId]);
    }

    const [imageRows] = await pool.query(`SELECT id, filename, content_type, createdAt FROM images WHERE id = ?`, [imageId]);
    const image = imageRows.length > 0 ? imageRows[0] : null;

    const [socialRows] = await pool.query(
      `
      SELECT sp.name AS platform, asl.url, asl.text
      FROM article_social_links asl
      JOIN social_platforms sp ON sp.id = asl.platformId
      WHERE asl.articleId = ?;
      `,
      [id]
    );

    const formattedLinks = socialRows.map((row) => ({
      link: row.url,
      platform: row.platform,
      description: row.text || null,
    }));

    res.json({
      message: 'Article updated successfully',
      article: {
        id,
        title,
        slug,
        shortDescription,
        content,
        image,
        typeId,
        links: formattedLinks,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error updating article:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    connection.release();
  }
}
