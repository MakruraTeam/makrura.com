import express from 'express';
import { getSocialPlatform } from '../controllers/socialPlatforms.controller.js';
import { getImage, uploadImage } from '../controllers/imageUpload.controller.js';
import { imageUpload } from '../middleware/upload.middleware.js';
import { requireAuth } from '../../auth/middlewares/auth.middleware.js';

const router = express.Router();

router.get('/social-platforms', getSocialPlatform);

router.post('/images', requireAuth, imageUpload.single('image'), uploadImage);
router.get('/images/:id', getImage);

export default router;
