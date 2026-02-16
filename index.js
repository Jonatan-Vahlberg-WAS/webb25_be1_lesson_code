import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectToDb, disconnectFromDb } from './db/connection.js';


dotenv.config();

import artistsRouter from './routes/artists.js';
import songsRouter from './routes/songs.js';
import albumsRouter from './routes/albums.js';
import playlistsRouter from './routes/playlists.js';

import seedIfEmpty from './scripts/seed.js';

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/artists', artistsRouter);
app.use('/api/songs', songsRouter);
app.use('/api/albums', albumsRouter);
app.use('/api/playlists', playlistsRouter);

connectToDb().then(async () => {
  await seedIfEmpty();
  app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
  });
}).catch((err) => {
  disconnectFromDb();
  console.error('Failed to connect to MongoDB:', err);
  throw new Error('Failed to connect to MongoDB');
});