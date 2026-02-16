import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

import artistsRouter from './routes/artists.js';


const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/artists', artistsRouter);

app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});