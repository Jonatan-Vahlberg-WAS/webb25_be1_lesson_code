import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let artists = [
  { id: 1, name: 'Bad Bunny' },
  { id: 2, name: 'Zara Larsson' },
  { id: 3, name: 'Radiohead' },
];

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.get('/api/artists', (req, res) => {
  res.json(artists);
});

app.get('/api/artists/:id', (req, res) => {
  const id = Number(req.params.id);
  const artist = artists.find(artist => artist.id === id)
  if (!artist) {
    return res.status(404).json({ message: 'Artist not found' });
  }
  res.json(artist);
});

app.post('/api/artists', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const lastId = artists.length > 0 ? artists[artists.length - 1].id : 0;
  const newArtist = { id: lastId + 1, name };

  artists.push(newArtist);

  res.status(201).json(newArtist);
});

app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});