import express from 'express';
import {
  getAllGeoGuessers,
  getGeoGuesser,
  createGeoGuesser,
  updateGeoGuesser,
  deleteGeoGuesser,
  guessGeoGuesser,
  getGeoGuesserAdmin,
} from '../controllers/geoGuesser.controller.js';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';

const router = express.Router();

router.get('', getAllGeoGuessers);
router.get('/:id', getGeoGuesser);
router.get('/:id/admin', requireAuth, getGeoGuesserAdmin);

router.post('/:id/guess', guessGeoGuesser);

router.post('', requireAuth, createGeoGuesser);
router.patch('/:id', requireAuth, updateGeoGuesser);
router.delete('/:id', requireAuth, deleteGeoGuesser);

export default router;
