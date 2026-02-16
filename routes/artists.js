import { Router } from 'express';
import { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } from '../db/artists.js';
const router = Router();

router.get('/', (req, res) => {
    const artists = getAllArtists();
    res.json(artists);
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const artist = getArtistById(id);
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

    const newArtist = createArtist(name);

    res.status(201).json(newArtist);
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }
    const artist = getArtistById(id);
    if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
    }
    const updatedArtist = updateArtist(id, name);
    res.json(artist);
});

router.delete('/:id', (req, res) => {
    const deletedArtist = deleteArtist(Number(req.params.id));
    if (!deletedArtist) {
        return res.status(404).json({ message: 'Artist not found' });
    }
    res.json({ message: 'Artist deleted' });
});

export default router;