import express from 'express';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';
import { createFounder, deleteFounder, getAllFounders, getFounderById, patchFounderById } from '../controllers/founders.controller.js';
import {
  createMatchupTable,
  deleteMatchupTable,
  getAllMatchupTables,
  getMatchupTableById,
  patchMatchupTableById,
} from '../controllers/matchups.controller.js';

const router = express.Router();

router.post('/founders', requireAuth, createFounder);
router.get('/founders', getAllFounders);
router.get('/founders/:id', getFounderById);
router.delete('/founders/:id', requireAuth, deleteFounder);
router.patch('/founders/:id', requireAuth, patchFounderById);

router.post('/matchups', requireAuth, createMatchupTable);
router.get('/matchups', getAllMatchupTables);
router.get('/matchups/id/:id', getMatchupTableById);
router.delete('/matchups/:id', requireAuth, deleteMatchupTable);
router.patch('/matchups/:id', requireAuth, patchMatchupTableById);

export default router;
