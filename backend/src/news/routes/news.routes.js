import express from 'express';
import { createArticle, getArticleTypes } from '../controllers/article.controller.js';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';

const router = express.Router();

router.get('/article-types', getArticleTypes);
router.post('/articles', requireAuth, createArticle);

export default router;
