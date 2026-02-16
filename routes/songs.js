import { Router } from 'express';
const router = Router();

let songs = [
    { id: 1, title: 'La Playa', artist: 'Bad Bunny' },
    { id: 2, title: 'Crabs of Naszareth', artist: 'Zara Larsson' },
    { id: 3, title: 'Creep', artist: 'Radiohead' },
];

router.get('/', (req, res) => {
    res.json(songs);
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const song = songs.find(song => song.id === id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
});

router.post('/', (req, res) => {
        const { title, artist } = req.body;

    if (!title || !artist) {
        return res.status(400).json({ error: 'title and artist are required' });
    }

    const lastId = songs.length > 0 ? songs[songs.length - 1].id : 0;
    const newSong = { id: lastId + 1, title, artist };

    songs.push(newSong);

    res.status(201).json(newSong);
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, artist } = req.body;

    if (!title || !artist) {
        return res.status(400).json({ error: 'name is required' });
    }
    const song = songs.find(song => song.id === id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }
    song.title = title || song.title;
    song.artist = artist || song.artist;
    res.json(song);
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const song = songs.find(song => song.id === id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }
    songs = songs.filter(song => song.id !== id);
    res.json({ message: 'Song deleted' });
});

export default router;