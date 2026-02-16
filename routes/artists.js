import { Router } from 'express';
const router = Router();

let artists = [
    { id: 1, name: 'Bad Bunny' },
    { id: 2, name: 'Zara Larsson' },
    { id: 3, name: 'Radiohead' },
];

router.get('/', (req, res) => {
    res.json(artists);
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const artist = artists.find(artist => artist.id === id);
    if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
});

router.post('/', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }

    const lastId = artists.length > 0 ? artists[artists.length - 1].id : 0;
    const newArtist = { id: lastId + 1, name };

    artists.push(newArtist);

    res.status(201).json(newArtist);
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }
    const artist = artists.find(artist => artist.id === id);
    if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
    }
    artist.name = name;
    res.json(artist);
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const artist = artists.find(artist => artist.id === id);
    if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
    }
    artists = artists.filter(artist => artist.id !== id);
    res.json({ message: 'Artist deleted' });
});

export default router;