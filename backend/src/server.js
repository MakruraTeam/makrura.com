import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDatabase } from './db.js';
import { setupDatabase } from './setupDatabase.js';
import authRoutes from './auth/routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

await connectToDatabase();
await setupDatabase();

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
