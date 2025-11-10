import express from 'express';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  getArticlesByType,
  getArticleTypes,
  deleteArticle,
  updateArticle,
} from '../controllers/article.controller.js';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';

const router = express.Router();

router.get('/article-types', getArticleTypes);
router.get('/articles', getAllArticles);
router.get('/articles/type/:name', getArticlesByType);

router.get('/articles/:id', getArticleById);
router.get('/articles/slug/:slug', getArticleBySlug);

router.post('/articles', requireAuth, createArticle);
router.delete('/articles/:id', requireAuth, deleteArticle);
router.patch('/articles/:id', requireAuth, updateArticle);

export default router;
