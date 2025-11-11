import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import process from 'process';

import { connectToDatabase } from './db.js';
import { setupDatabase } from './setupDatabase.js';
import authRoutes from './auth/routes/auth.routes.js';
import wc3Routes from './wc3/routes/wc3.routes.js';
import commonRoutes from './common/routes/common.routes.js';
import drUniversityRoutes from './drUniversity/routes/drUniversity.routes.js';
import newsRoutes from './news/routes/news.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/wc3', wc3Routes);
app.use('/api/common', commonRoutes);
app.use('/api/dr-university', drUniversityRoutes);
app.use('/api/news', newsRoutes);

// build
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));
app.get(/.*\.(js|css)$/, (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=31536000');
  next();
});
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(publicPath, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectToDatabase();
  await setupDatabase();
  console.log(`Server running on http://localhost:${PORT}`);
});
