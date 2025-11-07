import express from 'express';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';
import { createFounder, deleteFounder, getAllFounders, getFounderById, patchFounderById } from '../controllers/founders.controller.js';

const router = express.Router();

router.post('/founders', requireAuth, createFounder);
router.get('/founders', getAllFounders);
router.get('/founders/:id', getFounderById);
router.delete('/founders/:id', requireAuth, deleteFounder);
router.patch('/founders/:id', requireAuth, patchFounderById);

export default router;
