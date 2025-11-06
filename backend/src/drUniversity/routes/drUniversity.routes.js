import express from 'express';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';
import { createFounder, deleteFounder, getAllFounders } from '../controllers/founders.controller.js';

const router = express.Router();

router.post('/founders', requireAuth, createFounder);
router.get('/founders', getAllFounders);
router.delete('/founders/:id', requireAuth, deleteFounder);

export default router;
