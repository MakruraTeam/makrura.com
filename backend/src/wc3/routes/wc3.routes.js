import express from 'express';
import { getClassicRaces, getWc3Races } from '../controllers/race.controller.js';

const router = express.Router();

router.get('/races', getWc3Races);
router.get('/classic-races', getClassicRaces);

export default router;
