import express from 'express';
import { getWc3Races } from '../controllers/race.controller.js';

const router = express.Router();

router.get('/races', getWc3Races);

export default router;
