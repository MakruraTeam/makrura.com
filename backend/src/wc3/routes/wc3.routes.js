import express from 'express';
import { getClassicRaces, getWc3Races } from '../controllers/race.controller.js';
import { getWc3Maps } from '../controllers/maps.controller.js';

const router = express.Router();

router.get('/races', getWc3Races);
router.get('/classic-races', getClassicRaces);
router.get('/maps', getWc3Maps);

export default router;
