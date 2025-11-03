import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { loginUser } from '../controllers/login.controller.js';
import { registerUser } from '../controllers/register.controller.js';

const router = express.Router();

router.post('/register', requireAuth, registerUser);
router.post('/login', loginUser);

export default router;
