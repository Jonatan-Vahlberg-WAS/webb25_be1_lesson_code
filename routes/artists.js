import { Router } from 'express';
import { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } from '../db/artists.js';
const router = Router();

router.get('/', async (req, res) => {
    const artists = await getAllArtists();
    res.json(artists);
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const artist = await getArtistById(id);
    if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
});

router.post('/', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }

    const newArtist = await createArtist(name);

    res.status(201).json(newArtist);
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }
    const artist = await getArtistById(id);
    if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
    }
    const updatedArtist = await updateArtist(id, name);
    res.json(updatedArtist);
});

router.delete('/:id', async (req, res) => {
    const deletedArtist = await deleteArtist(Number(req.params.id));
    if (!deletedArtist) {
        return res.status(404).json({ message: 'Artist not found' });
    }
    res.json({ message: 'Artist deleted' });
});

export default router;