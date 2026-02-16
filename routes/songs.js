import { Router } from 'express';
import { getAllSongs, getSongById, createSong, updateSong, deleteSong } from '../db/songs.js';
const router = Router();

router.get('/', async (req, res) => {
    const songs = await getAllSongs();
    res.json(songs);
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const song = await getSongById(id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
});

router.post('/', async (req, res) => {
        const { name, artist } = req.body;

    if (!name || !artist) {
        return res.status(400).json({ error: 'name and artist are required' });
    }

    const newSong = await createSong(name, artist);

    res.status(201).json(newSong);
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, artist } = req.body;

    if (!name || !artist) {
        return res.status(400).json({ error: 'name is required' });
    }
    const song = await getSongById(id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }
    const updatedSong = await updateSong(id, name, artist);
    res.json(updatedSong);
});

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const song = await getSongById(id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }
    const deletedSong = await deleteSong(id);
    res.json(deletedSong);
});

export default router;