import { Router } from 'express';
import { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from '../db/albums.js';
const router = Router();

router.get('/', async (req, res) => {
    const albums = await getAllAlbums();
    res.json(albums);
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const album = await getAlbumById(id);
    if (!album) {
        return res.status(404).json({ message: 'Album not found' });
    }
    res.json(album);
});

router.post('/', async (req, res) => {
        const { title, artist, releaseDate } = req.body;

    if (!title || !artist || !releaseDate) {
        return res.status(400).json({ error: 'title, artist and releaseDate are required' });
    }

    const newAlbum = await createAlbum(title, artist, releaseDate);

    res.status(201).json(newAlbum);
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { title, artist, releaseDate } = req.body;

    if (!title || !artist || !releaseDate) {
        return res.status(400).json({ error: 'title, artist and releaseDate are required' });
    }
    const album = await getAlbumById(id);
    if (!album) {
        return res.status(404).json({ message: 'Album not found' });
    }
    const updatedAlbum = await updateAlbum(id, title, artist, releaseDate);
    res.json(updatedAlbum);
});

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const album = await getAlbumById(id);
    if (!album) {
        return res.status(404).json({ message: 'Album not found' });
    }
    const deletedAlbum = await deleteAlbum(id);
    res.json(deletedAlbum);
});

export default router;