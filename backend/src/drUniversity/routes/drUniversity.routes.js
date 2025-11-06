import express from 'express';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';
import { createFounder } from '../controllers/founders.controller.js';

const router = express.Router();

router.post('/founders', requireAuth, createFounder);

export default router;
