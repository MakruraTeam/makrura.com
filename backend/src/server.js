import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDatabase } from './db.js';
import { setupDatabase } from './setupDatabase.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, async () => {
  await connectToDatabase();
  await setupDatabase();
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
