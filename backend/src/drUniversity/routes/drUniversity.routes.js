import express from 'express';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';
import { createFounder, getAllFounders } from '../controllers/founders.controller.js';

const router = express.Router();

router.post('/founders', requireAuth, createFounder);
router.get('/founders', getAllFounders);

export default router;
