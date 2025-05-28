import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('✅ GCP_BUCKET_NAME:', process.env.GCP_BUCKET_NAME);

import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
